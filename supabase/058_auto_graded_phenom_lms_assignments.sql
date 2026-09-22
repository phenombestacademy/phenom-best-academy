-- Phenom Best LMS: automatic school assessment assignment and grading
alter table public.schools
  add column if not exists legal_name text,
  add column if not exists address text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists website text,
  add column if not exists motto text,
  add column if not exists report_header text;

alter table public.school_assignment_tasks
  add column if not exists assignment_type text not null default 'auto_graded',
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists results_visible_immediately boolean not null default true,
  add column if not exists duration_minutes integer,
  add column if not exists randomise_questions boolean not null default false;

create table if not exists public.school_assignment_items (
 id uuid primary key default gen_random_uuid(),
 task_id uuid not null references public.school_assignment_tasks(id) on delete cascade,
 position integer not null,
 question_text text not null,
 options jsonb not null default '[]'::jsonb,
 correct_answer text not null,
 explanation text,
 image_url text,
 marks numeric(10,2) not null default 1 check (marks > 0),
 source_type text,
 source_id uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(task_id,position)
);

create table if not exists public.school_assignment_targets (
 id uuid primary key default gen_random_uuid(),
 task_id uuid not null references public.school_assignment_tasks(id) on delete cascade,
 class_id uuid references public.school_classes(id) on delete cascade,
 student_id uuid references auth.users(id) on delete cascade,
 target_mode text not null default 'include' check (target_mode in ('include','exclude')),
 created_at timestamptz not null default now(),
 check ((class_id is not null) <> (student_id is not null)),
 unique(task_id,class_id,student_id,target_mode)
);

create index if not exists idx_school_assignment_targets_task on public.school_assignment_targets(task_id);
create index if not exists idx_school_assignment_items_task on public.school_assignment_items(task_id,position);
alter table public.school_assignment_items enable row level security;
alter table public.school_assignment_targets enable row level security;
revoke select on table public.school_assignment_items from authenticated,anon;
grant insert,update,delete on table public.school_assignment_items to authenticated;

create or replace function public.list_school_lms_assessment_sources(p_school_id uuid,p_subject text default null,p_topic text default null,p_level integer default null)
returns table(id uuid,subject text,topic text,level integer,language text,question_count integer,duration_minutes integer,generation_source text)
language sql security definer set search_path=public as $$
 select q.id,q.subject,q.topic,q.level,q.language,q.question_count,q.duration_minutes,q.generation_source
 from public.learning_quizzes q
 where (q.school_id is null or q.school_id=p_school_id)
   and (p_subject is null or q.subject ilike '%'||p_subject||'%')
   and (p_topic is null or q.topic ilike '%'||p_topic||'%')
   and (p_level is null or q.level=p_level)
 order by q.subject,q.topic,q.created_at desc;
$$;

create or replace function public.create_school_assignment_from_lms_quiz(
 p_school_id uuid,p_class_id uuid,p_subject_id uuid,p_teacher_id uuid,p_quiz_id uuid,p_title text,p_instructions text,p_due_at timestamptz,p_question_count integer,p_randomise boolean default true,p_all_students boolean default true,p_include_students uuid[] default '{}',p_exclude_students uuid[] default '{}')
returns uuid language plpgsql security definer set search_path=public as $$
declare tid uuid; q record; pos integer:=0;
begin
 if not (public.is_super_admin() or public.is_school_admin_for(p_school_id) or p_teacher_id=auth.uid()) then raise exception 'Not authorised'; end if;
 if p_question_count<1 then raise exception 'Question count must be at least 1'; end if;
 if not exists(select 1 from public.school_classes where id=p_class_id and school_id=p_school_id) then raise exception 'Class does not belong to school'; end if;
 if not exists(select 1 from public.school_subjects where id=p_subject_id and school_id=p_school_id) then raise exception 'Subject does not belong to school'; end if;
 insert into public.school_assignment_tasks(school_id,teacher_id,class_id,subject_id,level_label,topic,title,instructions,due_at,status,assignment_type,source_type,source_id,results_visible_immediately,randomise_questions)
 select p_school_id,p_teacher_id,p_class_id,p_subject_id,coalesce(l.level::text,''),l.topic,p_title,p_instructions,p_due_at,'published','auto_graded','phenom_lms_quiz',p_quiz_id,true,p_randomise
 from public.learning_quizzes l where l.id=p_quiz_id returning id into tid;
 if tid is null then raise exception 'LMS assessment source not found'; end if;
 for q in execute format('select * from public.quiz_questions where quiz_id=$1 order by %s limit $2',case when p_randomise then 'random()' else 'position' end) using p_quiz_id,p_question_count loop
   pos:=pos+1;
   insert into public.school_assignment_items(task_id,position,question_text,options,correct_answer,explanation,image_url,marks,source_type,source_id)
   values(tid,pos,q.question_text,q.options,q.correct_answer,q.explanation,q.image_url,1,'phenom_lms_quiz_question',q.id);
 end loop;
 if pos=0 then raise exception 'Selected LMS assessment has no questions'; end if;
 if p_all_students then
   insert into public.school_assignment_targets(task_id,class_id,target_mode) values(tid,p_class_id,'include');
   if cardinality(p_exclude_students)>0 then insert into public.school_assignment_targets(task_id,student_id,target_mode) select tid,x,'exclude' from unnest(p_exclude_students) x; end if;
 else
   if cardinality(p_include_students)=0 then raise exception 'Select at least one student'; end if;
   insert into public.school_assignment_targets(task_id,student_id,target_mode) select tid,x,'include' from unnest(p_include_students) x;
 end if;
 return tid;
end; $$;

create or replace function public.get_teacher_assignment_items(p_task_id uuid)
returns table(id uuid,"position" integer,question_text text,options jsonb,correct_answer text,explanation text,image_url text,marks numeric,source_type text,source_id uuid)
language sql security definer set search_path=public as $$
 select i.id,i.position,i.question_text,i.options,i.correct_answer,i.explanation,i.image_url,i.marks,i.source_type,i.source_id
 from public.school_assignment_items i join public.school_assignment_tasks t on t.id=i.task_id
 where i.task_id=p_task_id and (public.is_super_admin() or t.teacher_id=auth.uid() or public.is_school_admin_for(t.school_id))
 order by i.position;
$$;

create or replace function public.get_student_assignment_items(p_task_id uuid)
returns table(id uuid,"position" integer,question_text text,options jsonb,image_url text,marks numeric,explanation text)
language sql security definer set search_path=public as $$
 select i.id,i.position,i.question_text,i.options,i.image_url,i.marks,case when s.submitted_at is not null then i.explanation else null end
 from public.school_assignment_items i join public.school_assignment_submissions s on s.task_id=i.task_id and s.student_id=auth.uid()
 where i.task_id=p_task_id and public.assignment_student_is_target(p_task_id,auth.uid());
$$;

create or replace function public.update_school_assignment_item(p_item_id uuid,p_question_text text,p_options jsonb,p_correct_answer text,p_explanation text,p_marks numeric)
returns void language plpgsql security definer set search_path=public as $$
declare t public.school_assignment_tasks;
begin
 select t.* into t from public.school_assignment_items i join public.school_assignment_tasks t on t.id=i.task_id where i.id=p_item_id;
 if t.id is null then raise exception 'Question not found'; end if;
 if not (public.is_super_admin() or t.teacher_id=auth.uid() or public.is_school_admin_for(t.school_id)) then raise exception 'Not authorised'; end if;
 update public.school_assignment_items set question_text=p_question_text,options=p_options,correct_answer=p_correct_answer,explanation=p_explanation,marks=p_marks,updated_at=now() where id=p_item_id;
end; $$;

create or replace function public.prevent_assignment_score_tampering()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.score is distinct from old.score or new.graded_at is distinct from old.graded_at then
   if current_setting('phenom.grading',true) <> 'true' and not public.is_super_admin() then
     raise exception 'Assignment score and grading timestamp are system-controlled. Edit the question instead.';
   end if;
 end if;
 return new;
end; $$;

drop trigger if exists trg_prevent_assignment_score_tampering on public.school_assignment_submissions;
create trigger trg_prevent_assignment_score_tampering before update on public.school_assignment_submissions for each row execute function public.prevent_assignment_score_tampering();

create or replace function public.grade_school_assignment_submission(p_submission_id uuid)
returns public.school_assignment_submissions
language plpgsql security definer set search_path=public as $$
declare s public.school_assignment_submissions; i record; answers jsonb; raw text; total numeric:=0; earned numeric:=0;
begin
 set local "phenom.grading"='true';
 select * into s from public.school_assignment_submissions where id=p_submission_id for update;
 if s.id is null then raise exception 'Submission not found'; end if;
 begin answers:=s.answer_text::jsonb; exception when others then answers:='{}'::jsonb; end;
 for i in select * from public.school_assignment_items where task_id=s.task_id order by position loop
   raw:=coalesce(answers->>i.id::text,''); total:=total+i.marks;
   if lower(trim(raw))=lower(trim(i.correct_answer)) then earned:=earned+i.marks; end if;
 end loop;
 update public.school_assignment_submissions set score=case when total>0 then round((earned/total)*100,2) else 0 end,graded_at=coalesce(graded_at,now()),submitted_at=coalesce(submitted_at,now()) where id=s.id returning * into s;
 return s;
end; $$;

create or replace function public.submit_school_assignment(p_task_id uuid,p_answers jsonb)
returns public.school_assignment_submissions language plpgsql security definer set search_path=public as $$
declare sid uuid:=auth.uid(); sub public.school_assignment_submissions;
begin
 if not public.assignment_student_is_target(p_task_id,sid) then raise exception 'You are not assigned this assessment'; end if;
 insert into public.school_assignment_submissions(task_id,student_id,answer_text,submitted_at) values(p_task_id,sid,p_answers::text,now())
 on conflict(task_id,student_id) do update set answer_text=excluded.answer_text,submitted_at=excluded.submitted_at returning * into sub;
 select public.grade_school_assignment_submission(sub.id) into sub;
 return sub;
end; $$;

create or replace function public.regrade_assignment_task(p_task_id uuid)
returns void language plpgsql security definer set search_path=public as $$ declare s uuid; begin for s in select id from public.school_assignment_submissions where task_id=p_task_id and submitted_at is not null loop perform public.grade_school_assignment_submission(s); end loop; end; $$;

create or replace function public.trg_regrade_assignment_after_item_change()
returns trigger language plpgsql security definer set search_path=public as $$ begin perform public.regrade_assignment_task(coalesce(new.task_id,old.task_id)); return coalesce(new,old); end; $$;

drop trigger if exists trg_regrade_assignment_after_item_change on public.school_assignment_items;
create trigger trg_regrade_assignment_after_item_change after insert or update of question_text,options,correct_answer,marks,explanation on public.school_assignment_items for each row execute function public.trg_regrade_assignment_after_item_change();

create or replace function public.notify_assignment_result()
returns trigger language plpgsql security definer set search_path=public as $$
declare t public.school_assignment_tasks; p uuid;
begin
 if new.score is null then return new; end if;
 if tg_op='UPDATE' and old.score is not distinct from new.score and old.submitted_at is not distinct from new.submitted_at then return new; end if;
 select * into t from public.school_assignment_tasks where id=new.task_id;
 insert into public.user_notifications(user_id,title,body,link_url) values(t.teacher_id,case when tg_op='UPDATE' then 'Assessment result updated' else 'Assessment submitted' end,'A student has '||case when tg_op='UPDATE' then 'a revised result for "' else 'completed "' end||t.title||'" and received '||new.score||'%.','/schools');
 for p in select pl.parent_id from public.parent_links pl where pl.child_id=new.student_id and pl.status='active' loop
   insert into public.parent_learning_notifications(student_id,parent_id,assignment_id,message,score) values(new.student_id,p,new.task_id,'Assessment "'||t.title||'" result: '||new.score||'%.',new.score);
   insert into public.user_notifications(user_id,title,body,link_url) values(p,'Student assessment result','A learner has '||case when tg_op='UPDATE' then 'a revised result for "' else 'completed "' end||t.title||'" with a score of '||new.score||'%.','/schools');
 end loop;
 return new;
end; $$;
drop trigger if exists trg_notify_assignment_result on public.school_assignment_submissions;
create trigger trg_notify_assignment_result after insert or update of score,submitted_at on public.school_assignment_submissions for each row execute function public.notify_assignment_result();

revoke execute on function public.list_school_lms_assessment_sources(uuid,text,text,integer),public.create_school_assignment_from_lms_quiz(uuid,uuid,uuid,uuid,uuid,text,text,timestamptz,integer,boolean,boolean,uuid[],uuid[]) from public,anon;
grant execute on function public.list_school_lms_assessment_sources(uuid,text,text,integer),public.create_school_assignment_from_lms_quiz(uuid,uuid,uuid,uuid,uuid,text,text,timestamptz,integer,boolean,boolean,uuid[],uuid[]) to authenticated;
revoke execute on function public.get_teacher_assignment_items(uuid),public.get_student_assignment_items(uuid),public.update_school_assignment_item(uuid,text,jsonb,text,text,numeric),public.grade_school_assignment_submission(uuid),public.submit_school_assignment(uuid,jsonb),public.regrade_assignment_task(uuid),public.prevent_assignment_score_tampering(),public.notify_assignment_result() from public,anon;
grant execute on function public.get_teacher_assignment_items(uuid),public.get_student_assignment_items(uuid),public.update_school_assignment_item(uuid,text,jsonb,text,text,numeric),public.submit_school_assignment(uuid,jsonb) to authenticated;