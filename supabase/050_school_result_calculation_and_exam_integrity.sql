-- 050: restore and harden Phenom Best LMS result calculation.

create or replace function public.calculate_student_subject_term(
  p_session uuid,p_term integer,p_class uuid,p_student uuid,p_subject uuid
)
returns table(ca_total numeric,test_total numeric,midterm_total numeric,exam_total numeric,term_total numeric,term_percentage numeric,first_term_brought_forward numeric,cumulative_percentage numeric)
language plpgsql stable security definer set search_path=public
as $$
declare weighted_total numeric:=0; weight_total numeric:=0; raw_total numeric:=0; raw_max numeric:=0; prior_avg numeric; current_pct numeric;
begin
  select
    coalesce(sum(case when lower(c.component_type) in ('ca','continuous_assessment','assessment') then e.score else 0 end),0),
    coalesce(sum(case when lower(c.component_type) in ('test','quiz') then e.score else 0 end),0),
    coalesce(sum(case when lower(c.component_type) in ('midterm','midterm_test') then e.score else 0 end),0),
    coalesce(sum(case when lower(c.component_type) in ('exam','final_exam','final') then e.score else 0 end),0),
    coalesce(sum(e.score),0),coalesce(sum(c.max_score),0),
    coalesce(sum(case when c.weight>0 then (e.score/nullif(c.max_score,0))*c.weight else 0 end),0),
    coalesce(sum(case when c.weight>0 then c.weight else 0 end),0)
  into ca_total,test_total,midterm_total,exam_total,raw_total,raw_max,weighted_total,weight_total
  from public.student_result_entries e join public.school_result_components c on c.id=e.component_id
  where e.session_id=p_session and e.term_no=p_term and e.class_id=p_class and e.student_id=p_student and e.subject_id=p_subject and c.active;

  if weight_total>0 then current_pct:=round((weighted_total/weight_total)*100,2);
  elsif raw_max>0 then current_pct:=round((raw_total/raw_max)*100,2);
  else current_pct:=0; end if;

  select avg(s.term_percentage) into prior_avg from public.student_term_summaries s
  where s.session_id=p_session and s.class_id=p_class and s.student_id=p_student and s.subject_id=p_subject and s.term_no<p_term and s.term_percentage is not null;

  return query select ca_total,test_total,midterm_total,exam_total,raw_total,current_pct,
    case when p_term>1 then (select s.term_percentage from public.student_term_summaries s where s.session_id=p_session and s.class_id=p_class and s.student_id=p_student and s.subject_id=p_subject and s.term_no=1 limit 1) else null end,
    case when p_term=1 then current_pct when prior_avg is null then current_pct else round(((prior_avg*(p_term-1))+current_pct)/p_term,2) end;
end;
$$;

drop trigger if exists trg_refresh_student_term_summary on public.student_result_entries;
create trigger trg_refresh_student_term_summary after insert or update on public.student_result_entries for each row execute function public.refresh_student_term_summary();

create or replace function public.refresh_student_term_summary()
returns trigger language plpgsql security definer set search_path=public
as $$
declare x record;
begin
  select * into x from public.calculate_student_subject_term(new.session_id,new.term_no,new.class_id,new.student_id,new.subject_id);
  insert into public.student_term_summaries(school_id,session_id,term_no,class_id,student_id,subject_id,ca_total,test_total,midterm_total,exam_total,term_total,term_percentage,first_term_brought_forward,cumulative_percentage,generated_at)
  values(new.school_id,new.session_id,new.term_no,new.class_id,new.student_id,new.subject_id,x.ca_total,x.test_total,x.midterm_total,x.exam_total,x.term_total,x.term_percentage,x.first_term_brought_forward,x.cumulative_percentage,now())
  on conflict(session_id,term_no,class_id,student_id,subject_id) do update set ca_total=excluded.ca_total,test_total=excluded.test_total,midterm_total=excluded.midterm_total,exam_total=excluded.exam_total,term_total=excluded.term_total,term_percentage=excluded.term_percentage,first_term_brought_forward=excluded.first_term_brought_forward,cumulative_percentage=excluded.cumulative_percentage,generated_at=now();

  update public.student_term_summaries s set class_average=q.avg_percentage
  from (select subject_id,avg(term_percentage) avg_percentage from public.student_term_summaries where session_id=new.session_id and term_no=new.term_no and class_id=new.class_id and subject_id=new.subject_id group by subject_id) q
  where s.session_id=new.session_id and s.term_no=new.term_no and s.class_id=new.class_id and s.subject_id=q.subject_id;
  return new;
end;
$$;

revoke all on function public.calculate_student_subject_term(uuid,integer,uuid,uuid,uuid) from public,anon,authenticated;
revoke all on function public.refresh_student_term_summary() from public,anon,authenticated;

-- One recorded attempt number per learner/exam.
create unique index if not exists school_cbt_attempts_exam_student_attempt_key
on public.school_cbt_attempts(exam_id,student_id,attempt_no);