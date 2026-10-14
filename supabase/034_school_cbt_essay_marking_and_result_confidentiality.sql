-- CBT result confidentiality and manual essay marking.
-- Additive only. Review and test against a staging database before applying anywhere.
begin;

-- Install lifecycle guards in the same transaction as the protected RPCs and grants.
create or replace function public.school_cbt_guard_exam_status()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status is distinct from old.status
     and new.status in ('scheduled', 'active')
     and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'Use the authorised CBT publish workflow to schedule an exam';
  end if;
  return new;
end;
$;

drop trigger if exists school_cbt_guard_exam_status on public.school_cbt_exams;
create trigger school_cbt_guard_exam_status
before update of status on public.school_cbt_exams
for each row execute function public.school_cbt_guard_exam_status();

create or replace function public.school_cbt_guard_question_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  exam_uuid uuid;
  exam_status text;
begin
  exam_uuid := case when tg_op = 'DELETE' then old.exam_id else new.exam_id end;
  select status into exam_status from public.school_cbt_exams where id = exam_uuid;
  if exam_status is distinct from 'draft' then
    raise exception 'Questions are locked after an exam is scheduled';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$;

drop trigger if exists school_cbt_question_draft_only on public.school_cbt_exam_questions;
create trigger school_cbt_question_draft_only
before insert or update or delete on public.school_cbt_exam_questions
for each row execute function public.school_cbt_guard_question_changes();

create table if not exists public.school_cbt_essay_marks (
  attempt_id uuid not null references public.school_cbt_exam_attempts(id) on delete cascade,
  question_id uuid not null references public.school_cbt_exam_questions(id) on delete cascade,
  school_id uuid not null,
  marks_awarded numeric not null check (marks_awarded >= 0),
  feedback text,
  marked_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (attempt_id, question_id),
  constraint school_cbt_essay_marks_feedback_length check (feedback is null or char_length(feedback) <= 4000)
);

alter table public.school_cbt_essay_marks enable row level security;
revoke all on table public.school_cbt_essay_marks from public, anon, authenticated;

-- All access to attempts must go through the validated SECURITY DEFINER lifecycle RPCs.
-- The client must not be able to read scores early or directly alter answers/status/marks.
revoke all on table public.school_cbt_exam_attempts from public, anon, authenticated;

create table if not exists public.school_cbt_essay_mark_audit (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.school_cbt_exam_attempts(id) on delete cascade,
  question_id uuid not null references public.school_cbt_exam_questions(id) on delete cascade,
  school_id uuid not null,
  previous_marks numeric,
  previous_feedback text,
  new_marks numeric not null,
  new_feedback text,
  changed_by uuid not null,
  changed_at timestamptz not null default now()
);
alter table public.school_cbt_essay_mark_audit enable row level security;
revoke all on table public.school_cbt_essay_mark_audit from public, anon, authenticated;

create or replace function public.school_cbt_publish_exam(p_exam uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  e public.school_cbt_exams%rowtype;
  uid uuid := auth.uid();
  qcount integer;
  assigned integer;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  select * into e from public.school_cbt_exams where id = p_exam for update;
  if not found then raise exception 'Exam not found'; end if;
  if not (
    public.is_super_admin()
    or public.is_school_member(e.school_id, array['school_admin'])
    or (e.teacher_id = uid and public.is_assigned_teacher_for_subject_name(e.class_id, e.subject))
  ) then raise exception 'Not authorised'; end if;
  if not public.school_has_cbt_access(e.school_id) and not public.is_super_admin() then
    raise exception 'School CBT subscription is not active or does not include CBT';
  end if;
  if e.status not in ('draft', 'scheduled') then raise exception 'Only draft exams can be scheduled'; end if;
  if not exists (select 1 from public.school_classes class_row where class_row.id = e.class_id and class_row.school_id = e.school_id) then
    raise exception 'The selected class does not belong to this school';
  end if;
  if e.starts_at is null or e.ends_at is null or e.duration_minutes is null
     or e.duration_minutes < 1 or e.ends_at <= e.starts_at then
    raise exception 'Set valid opening/closing times and duration';
  end if;

  select count(*) into qcount
  from public.school_cbt_exam_questions
  where exam_id = p_exam;
  if qcount = 0 then raise exception 'Add at least one question first'; end if;

  if exists (
    select 1
    from public.school_cbt_exam_questions
    where exam_id = p_exam
      and (
        marks <= 0
        or btrim(question_text) = ''
        or (options is not null and (
          correct_answer is null
          or btrim(correct_answer) = ''
          or not (options ? correct_answer)
        ))
        or (options is not null and jsonb_typeof(options) <> 'object')
        or (options is null and correct_answer is not null)
      )
  ) then
    raise exception 'Check objective answer keys and ensure essay questions have no answer key';
  end if;

  insert into public.school_cbt_exam_assignments (exam_id, school_id, student_id, assigned_by)
  select p_exam, e.school_id, cm.user_id, uid
  from public.class_members cm
  where cm.class_id = e.class_id and lower(cm.role) = 'student'
  on conflict do nothing;
  get diagnostics assigned = row_count;

  update public.school_cbt_exams
  set status = 'scheduled', question_count = qcount, updated_at = now()
  where id = p_exam;

  return jsonb_build_object(
    'exam_id', p_exam, 'question_count', qcount,
    'new_assignments', assigned, 'status', 'scheduled'
  );
end;
$$;

create or replace function public.school_cbt_mark_essay(
  p_attempt uuid,
  p_question uuid,
  p_marks numeric,
  p_feedback text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.school_cbt_exam_attempts%rowtype;
  e public.school_cbt_exams%rowtype;
  q public.school_cbt_exam_questions%rowtype;
  uid uuid := auth.uid();
  v_objective_score numeric := 0;
  v_essay_score numeric := 0;
  v_total numeric := 0;
  v_correct integer := 0;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if p_marks is null or p_marks < 0 then raise exception 'Marks must be zero or greater'; end if;
  if p_feedback is not null and char_length(p_feedback) > 4000 then raise exception 'Feedback must not exceed 4000 characters'; end if;

  select * into t
  from public.school_cbt_exam_attempts
  where id = p_attempt
  for update;
  if not found then raise exception 'Attempt not found'; end if;

  select * into e from public.school_cbt_exams where id = t.exam_id;
  if not found then raise exception 'Exam not found'; end if;
  if not (
    public.is_super_admin()
    or public.is_school_member(e.school_id, array['school_admin'])
    or (e.teacher_id = uid and public.is_assigned_teacher_for_subject_name(e.class_id, e.subject))
  ) then raise exception 'Not authorised'; end if;
  if e.results_visible_to_students then raise exception 'Hide released results before changing marks'; end if;
  if t.school_id is distinct from e.school_id then raise exception 'Attempt school does not match exam'; end if;
  if t.status not in ('submitted', 'graded') or t.submitted_at is null then
    raise exception 'Only submitted attempts can be marked';
  end if;

  select * into q
  from public.school_cbt_exam_questions
  where id = p_question and exam_id = t.exam_id;
  if not found then raise exception 'Question does not belong to this attempt'; end if;
  if q.options is not null then raise exception 'Only essay questions can be manually marked'; end if;
  if p_marks > coalesce(q.marks, 0) then raise exception 'Awarded marks exceed the question maximum'; end if;

  insert into public.school_cbt_essay_mark_audit
    (attempt_id, question_id, school_id, previous_marks, previous_feedback, new_marks, new_feedback, changed_by)
  values (
    t.id, q.id, e.school_id,
    (select old_mark.marks_awarded from public.school_cbt_essay_marks old_mark where old_mark.attempt_id = t.id and old_mark.question_id = q.id),
    (select old_mark.feedback from public.school_cbt_essay_marks old_mark where old_mark.attempt_id = t.id and old_mark.question_id = q.id),
    p_marks, nullif(btrim(p_feedback), ''), uid
  );

  insert into public.school_cbt_essay_marks
    (attempt_id, question_id, school_id, marks_awarded, feedback, marked_by, updated_at)
  values
    (t.id, q.id, e.school_id, p_marks, nullif(btrim(p_feedback), ''), uid, now())
  on conflict (attempt_id, question_id) do update
    set school_id = excluded.school_id,
        marks_awarded = excluded.marks_awarded,
        feedback = excluded.feedback,
        marked_by = excluded.marked_by,
        updated_at = now();

  select coalesce(sum(question.marks), 0)
    into v_total
  from public.school_cbt_exam_questions question
  where question.exam_id = t.exam_id;

  select
    coalesce(sum(case
      when t.answers ->> question.id::text is not null
       and upper(btrim(t.answers ->> question.id::text)) = upper(btrim(question.correct_answer))
      then question.marks else 0 end), 0),
    count(*) filter (
      where t.answers ->> question.id::text is not null
       and upper(btrim(t.answers ->> question.id::text)) = upper(btrim(question.correct_answer))
    )
  into v_objective_score, v_correct
  from public.school_cbt_exam_questions question
  where question.exam_id = t.exam_id
    and question.options is not null;

  select coalesce(sum(mark.marks_awarded), 0)
    into v_essay_score
  from public.school_cbt_essay_marks mark
  join public.school_cbt_exam_questions question on question.id = mark.question_id
  where mark.attempt_id = t.id
    and question.exam_id = t.exam_id
    and question.options is null;

  update public.school_cbt_exam_attempts
  set score = v_objective_score + v_essay_score,
      total_marks = v_total,
      correct_count = v_correct
  where id = t.id;

  return jsonb_build_object(
    'ok', true,
    'attempt_id', t.id,
    'question_id', q.id,
    'marks_awarded', p_marks,
    'feedback_saved', p_feedback is not null
  );
end;
$$;

create or replace function public.school_cbt_save_answers(p_attempt uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.school_cbt_exam_attempts%rowtype;
  e public.school_cbt_exams%rowtype;
  uid uuid := auth.uid();
  deadline timestamptz;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(coalesce(p_answers, '{}'::jsonb)) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;
  p_answers := coalesce(p_answers, '{}'::jsonb);
  if pg_column_size(p_answers) > 262144 then raise exception 'Answer payload is too large'; end if;
  if exists(select 1 from jsonb_each_text(p_answers) item where char_length(item.value) > 20000) then
    raise exception 'An answer exceeds the 20000-character limit';
  end if;

  select * into t
  from public.school_cbt_exam_attempts
  where id = p_attempt and student_id = uid
  for update;
  if not found then raise exception 'Attempt not found'; end if;
  if t.status <> 'in_progress' or t.submitted_at is not null then raise exception 'Attempt is closed'; end if;

  select * into e from public.school_cbt_exams where id = t.exam_id;
  if not found then raise exception 'Exam not found'; end if;
  if e.status not in ('scheduled', 'active') then raise exception 'Exam is closed'; end if;
  deadline := least(t.started_at + make_interval(mins => e.duration_minutes), e.ends_at);
  if now() >= deadline then raise exception 'Time is up'; end if;

  if exists (
    select 1
    from jsonb_each_text(p_answers) item
    where not exists (
      select 1 from public.school_cbt_exam_questions_student question
      where question.exam_id = e.id and question.id::text = item.key
    )
  ) then raise exception 'Answer references a question outside this exam'; end if;

  if exists (
    select 1
    from jsonb_each_text(p_answers) item
    join public.school_cbt_exam_questions_student question
      on question.id::text = item.key and question.exam_id = e.id
    where question.options is not null and not (question.options ? item.value)
  ) then raise exception 'An objective answer is not one of the available options'; end if;

  update public.school_cbt_exam_attempts set answers = p_answers where id = p_attempt;
  return jsonb_build_object('saved', true, 'deadline', deadline);
end;
$$;

create or replace function public.school_cbt_submit_attempt(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.school_cbt_exam_attempts%rowtype;
  e public.school_cbt_exams%rowtype;
  q record;
  v_score numeric := 0;
  v_total numeric := 0;
  v_correct integer := 0;
  v_essay_score numeric := 0;
  uid uuid := auth.uid();
  deadline timestamptz;
begin
  if uid is null then raise exception 'Authentication required'; end if;

  select * into t
  from public.school_cbt_exam_attempts
  where id = p_attempt
  for update;
  if not found then raise exception 'Attempt not found'; end if;

  select * into e from public.school_cbt_exams where id = t.exam_id;
  if not found then raise exception 'Exam not found'; end if;
  deadline := least(t.started_at + make_interval(mins => e.duration_minutes), e.ends_at);

  if t.student_id is distinct from uid then
    if not (
      public.is_super_admin()
      or public.is_school_member(e.school_id, array['school_admin'])
      or (e.teacher_id = uid and public.is_assigned_teacher_for_subject_name(e.class_id, e.subject))
    ) then raise exception 'Not authorised'; end if;
    if t.status = 'in_progress' and now() < deadline then
      raise exception 'Staff can only finalise an attempt after its deadline';
    end if;
  end if;

  if t.status <> 'in_progress' then
    if e.results_visible_to_students then
      return jsonb_build_object(
        'attempt_id', t.id, 'score', t.score, 'total_marks', t.total_marks,
        'correct_count', t.correct_count, 'status', t.status, 'results_visible', true
      );
    end if;
    return jsonb_build_object(
      'attempt_id', t.id, 'status', t.status, 'results_visible', false,
      'message', 'Submission recorded. Results have not been released.'
    );
  end if;

  for q in
    select id, correct_answer, marks
    from public.school_cbt_exam_questions
    where exam_id = e.id and options is not null
  loop
    v_total := v_total + coalesce(q.marks, 0);
    if t.answers ->> q.id::text is not null
       and upper(btrim(t.answers ->> q.id::text)) = upper(btrim(q.correct_answer)) then
      v_score := v_score + coalesce(q.marks, 0);
      v_correct := v_correct + 1;
    end if;
  end loop;

  select coalesce(sum(marks), 0)
    into v_total
  from public.school_cbt_exam_questions
  where exam_id = e.id;

  select coalesce(sum(mark.marks_awarded), 0)
    into v_essay_score
  from public.school_cbt_essay_marks mark
  join public.school_cbt_exam_questions question on question.id = mark.question_id
  where mark.attempt_id = t.id and question.exam_id = e.id and question.options is null;

  v_score := v_score + v_essay_score;

  update public.school_cbt_exam_attempts
  set score = v_score,
      total_marks = v_total,
      correct_count = v_correct,
      submitted_at = coalesce(submitted_at, now()),
      status = 'submitted'
  where id = t.id;

  if e.results_visible_to_students then
    return jsonb_build_object(
      'attempt_id', p_attempt, 'score', v_score, 'total_marks', v_total,
      'correct_count', v_correct, 'status', 'submitted', 'results_visible', true
    );
  end if;

  return jsonb_build_object(
    'attempt_id', p_attempt, 'status', 'submitted', 'results_visible', false,
    'message', 'Submission recorded. Results have not been released.'
  );
end;
$$;

create or replace function public.school_cbt_start_attempt(p_exam uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  e public.school_cbt_exams%rowtype;
  a public.school_cbt_exam_assignments%rowtype;
  t public.school_cbt_exam_attempts%rowtype;
  n integer;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  select * into e from public.school_cbt_exams where id = p_exam;
  if not found then raise exception 'Exam not found'; end if;
  select * into a
  from public.school_cbt_exam_assignments
  where exam_id = p_exam and student_id = uid and school_id = e.school_id
  for update;
  if not found then raise exception 'You are not assigned to this exam'; end if;

  if not public.school_has_cbt_access(e.school_id) then raise exception 'School CBT subscription is not active'; end if;
  if e.results_visible_to_students then raise exception 'This exam is closed to new attempts because results have been released'; end if;
  if e.status not in ('scheduled', 'active') or e.starts_at > now() or e.ends_at <= now() then
    raise exception 'This exam is not currently open';
  end if;

  select * into t
  from public.school_cbt_exam_attempts
  where exam_id = p_exam and student_id = uid and assignment_id = a.id
  order by attempt_no desc limit 1;

  if found then
    if t.status = 'in_progress'
       and t.started_at + make_interval(mins => e.duration_minutes) > now()
       and e.ends_at > now() then
      return jsonb_build_object(
        'attempt_id', t.id, 'attempt_no', t.attempt_no, 'started_at', t.started_at,
        'deadline', least(t.started_at + make_interval(mins => e.duration_minutes), e.ends_at),
        'status', t.status
      );
    end if;

    if t.status = 'in_progress' then
      perform public.school_cbt_submit_attempt(t.id);
      if e.one_attempt or not e.allow_redo then
        select * into t from public.school_cbt_exam_attempts where id = t.id;
        if e.results_visible_to_students then
          return jsonb_build_object(
            'attempt_id', t.id, 'status', 'expired_submitted',
            'score', t.score, 'total_marks', t.total_marks, 'correct_count', t.correct_count,
            'results_visible', true
          );
        end if;
        return jsonb_build_object(
          'attempt_id', t.id, 'status', 'expired_submitted', 'results_visible', false,
          'message', 'Your expired attempt was submitted. Results have not been released.'
        );
      end if;
    elsif e.one_attempt or not e.allow_redo then
      raise exception 'Your permitted attempt has already been used';
    end if;
  end if;

  select coalesce(max(attempt_no), 0) + 1 into n
  from public.school_cbt_exam_attempts
  where exam_id = p_exam and student_id = uid;

  insert into public.school_cbt_exam_attempts
    (exam_id, assignment_id, school_id, student_id, attempt_no, answers, status)
  values
    (p_exam, a.id, e.school_id, uid, n, '{}'::jsonb, 'in_progress')
  returning * into t;

  return jsonb_build_object(
    'attempt_id', t.id, 'attempt_no', t.attempt_no, 'started_at', t.started_at,
    'deadline', least(t.started_at + make_interval(mins => e.duration_minutes), e.ends_at),
    'status', t.status
  );
end;
$$;

create or replace function public.school_cbt_close_exam(p_exam uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  e public.school_cbt_exams%rowtype;
  uid uuid := auth.uid();
  pending record;
  submitted_count integer := 0;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  select * into e from public.school_cbt_exams where id = p_exam for update;
  if not found then raise exception 'Exam not found'; end if;
  if not (
    public.is_super_admin()
    or public.is_school_member(e.school_id, array['school_admin'])
    or (e.teacher_id = uid and public.is_assigned_teacher_for_subject_name(e.class_id, e.subject))
  ) then raise exception 'Not authorised'; end if;
  if e.status = 'draft' then raise exception 'A draft exam cannot be closed'; end if;

  update public.school_cbt_exams
  set status = 'closed',
      ends_at = least(coalesce(ends_at, now()), now()),
      updated_at = now()
  where id = p_exam;

  for pending in
    select attempt.id
    from public.school_cbt_exam_attempts attempt
    where attempt.exam_id = p_exam and attempt.status = 'in_progress'
    for update
  loop
    perform public.school_cbt_submit_attempt(pending.id);
    submitted_count := submitted_count + 1;
  end loop;

  return jsonb_build_object(
    'exam_id', p_exam, 'status', 'closed', 'attempts_submitted', submitted_count
  );
end;
$$;

create or replace function public.school_cbt_set_results_visible(p_exam uuid, p_visible boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  e public.school_cbt_exams%rowtype;
  uid uuid := auth.uid();
  pending record;
begin
  select * into e from public.school_cbt_exams where id = p_exam for update;
  if not found then raise exception 'Exam not found'; end if;
  if not (
    public.is_super_admin()
    or public.is_school_member(e.school_id, array['school_admin'])
    or (e.teacher_id = uid and public.is_assigned_teacher_for_subject_name(e.class_id, e.subject))
  ) then raise exception 'Not authorised'; end if;
  if p_visible and not public.school_has_cbt_access(e.school_id) and not public.is_super_admin() then
    raise exception 'School CBT entitlement is inactive';
  end if;
  if p_visible and e.status <> 'closed' and (e.ends_at is null or e.ends_at > now()) then
    raise exception 'Close the exam or wait until its scheduled end before releasing results';
  end if;

  if p_visible then
    -- Finalise attempts whose authoritative server deadline has elapsed.
    for pending in
      select attempt.id
      from public.school_cbt_exam_attempts attempt
      where attempt.exam_id = p_exam
        and attempt.status = 'in_progress'
        and least(
          attempt.started_at + make_interval(mins => e.duration_minutes),
          e.ends_at
        ) <= now()
    loop
      perform public.school_cbt_submit_attempt(pending.id);
    end loop;

    if exists (
      select 1 from public.school_cbt_exam_attempts attempt
      where attempt.exam_id = p_exam and attempt.status = 'in_progress'
    ) then
      raise exception 'Wait until all in-progress attempts have reached their deadline before releasing results';
    end if;

    if exists (
      select 1
      from public.school_cbt_exam_attempts attempt
      join public.school_cbt_exam_questions question
        on question.exam_id = attempt.exam_id and question.options is null
      left join public.school_cbt_essay_marks mark
        on mark.attempt_id = attempt.id and mark.question_id = question.id
      where attempt.exam_id = p_exam
        and attempt.status in ('submitted', 'graded')
        and mark.attempt_id is null
    ) then
      raise exception 'Mark all submitted essay responses before releasing results';
    end if;
  end if;

  update public.school_cbt_exams
  set results_visible_to_students = p_visible, updated_at = now()
  where id = p_exam;
end;
$$;

create or replace function public.school_cbt_get_my_result(p_exam uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  e public.school_cbt_exams%rowtype;
  a public.school_cbt_exam_attempts%rowtype;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if not exists (
    select 1 from public.school_cbt_exam_assignments assignment
    where assignment.exam_id = p_exam and assignment.student_id = uid
  ) then raise exception 'Not authorised'; end if;
  select * into e from public.school_cbt_exams where id = p_exam;
  if not found then raise exception 'Exam not found'; end if;
  if not exists (
    select 1 from public.school_cbt_exam_assignments assignment
    where assignment.exam_id = p_exam
      and assignment.school_id = e.school_id
      and assignment.student_id = uid
  ) then raise exception 'Not authorised'; end if;
  if not e.results_visible_to_students then
    return jsonb_build_object('available', false, 'message', 'Results have not been released by your school.');
  end if;

  select * into a
  from public.school_cbt_exam_attempts
  where exam_id = p_exam and student_id = uid and status in ('submitted', 'graded')
  order by attempt_no desc
  limit 1;
  if not found then
    return jsonb_build_object('available', false, 'message', 'No submitted result is available yet.');
  end if;

  return jsonb_build_object(
    'available', true, 'attempt_id', a.id, 'status', a.status,
    'score', a.score, 'total_marks', a.total_marks,
    'correct_count', a.correct_count, 'submitted_at', a.submitted_at
  );
end;
$$;

create or replace function public.school_report_student_profile(p_school uuid, p_student uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  profile_data jsonb;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if not (public.is_super_admin() or public.is_school_member(p_school, array['school_admin'])) then
    raise exception 'Not authorised to view student profile for this report';
  end if;
  if not exists (
    select 1 from public.student_school_records record
    where record.school_id = p_school and record.student_id = p_student
  ) then raise exception 'Student does not belong to this school'; end if;

  select jsonb_build_object(
    'full_name', p.full_name,
    'first_name', p.first_name,
    'middle_name', p.middle_name,
    'surname', p.surname,
    'gender', p.gender,
    'date_of_birth', p.date_of_birth
  )
  into profile_data
  from public.profiles p
  where p.id = p_student;
  if profile_data is null then raise exception 'Student profile not found'; end if;
  return profile_data;
end;
$$;

create or replace function public.school_cbt_list_essay_responses(p_exam uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  e public.school_cbt_exams%rowtype;
  uid uuid := auth.uid();
  result jsonb;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  select * into e from public.school_cbt_exams where id = p_exam;
  if not found then raise exception 'Exam not found'; end if;
  if not (
    public.is_super_admin()
    or public.is_school_member(e.school_id, array['school_admin'])
    or (e.teacher_id = uid and public.is_assigned_teacher_for_subject_name(e.class_id, e.subject))
  ) then raise exception 'Not authorised'; end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'attempt_id', attempt.id,
        'student_id', attempt.student_id,
        'question_id', question.id,
        'question_text', question.question_text,
        'answer', attempt.answers ->> question.id::text,
        'max_marks', question.marks,
        'marks_awarded', mark.marks_awarded,
        'feedback', mark.feedback,
        'marked_by', mark.marked_by
      ) order by attempt.started_at, question.position
    ),
    '[]'::jsonb
  )
  into result
  from public.school_cbt_exam_attempts attempt
  join public.school_cbt_exam_questions question
    on question.exam_id = attempt.exam_id and question.options is null
  left join public.school_cbt_essay_marks mark
    on mark.attempt_id = attempt.id and mark.question_id = question.id
  where attempt.exam_id = p_exam
    and attempt.status in ('submitted', 'graded');

  return result;
end;
$$;

revoke all on function public.school_cbt_get_my_result(uuid) from public, anon;
grant execute on function public.school_cbt_get_my_result(uuid) to authenticated;
revoke all on function public.school_report_student_profile(uuid, uuid) from public, anon;
grant execute on function public.school_report_student_profile(uuid, uuid) to authenticated;
revoke all on function public.school_cbt_mark_essay(uuid, uuid, numeric, text) from public, anon;
grant execute on function public.school_cbt_mark_essay(uuid, uuid, numeric, text) to authenticated;
revoke all on function public.school_cbt_list_essay_responses(uuid) from public, anon;
grant execute on function public.school_cbt_list_essay_responses(uuid) to authenticated;
revoke all on function public.school_cbt_save_answers(uuid, jsonb) from public, anon;
grant execute on function public.school_cbt_save_answers(uuid, jsonb) to authenticated;
revoke all on function public.school_cbt_submit_attempt(uuid) from public, anon;
grant execute on function public.school_cbt_submit_attempt(uuid) to authenticated;
revoke all on function public.school_cbt_start_attempt(uuid) from public, anon;
grant execute on function public.school_cbt_start_attempt(uuid) to authenticated;
revoke all on function public.school_cbt_close_exam(uuid) from public, anon;
grant execute on function public.school_cbt_close_exam(uuid) to authenticated;
revoke all on function public.school_cbt_set_results_visible(uuid, boolean) from public, anon;
grant execute on function public.school_cbt_set_results_visible(uuid, boolean) to authenticated;

commit;
