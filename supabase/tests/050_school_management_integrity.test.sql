begin;

select plan(10);

select has_table('public','schools','schools table exists');
select has_table('public','school_members','school membership table exists');
select has_table('public','student_attendance','attendance table exists');
select has_table('public','student_result_entries','result entries table exists');
select has_table('public','student_term_summaries','term summary table exists');
select has_table('public','student_school_status_history','student lifecycle history exists');
select has_index('public','student_attendance','student_attendance_school_student_date_checkpoint_key','attendance is unique per school/student/date/checkpoint');
select has_index('public','school_cbt_attempts','school_cbt_attempts_exam_id_student_id_attempt_no_key','CBT attempt identity is unique');
select has_constraint('public','profiles','profiles_account_type_check','profile account type is constrained');
select has_constraint('public','profiles','profiles_role_check','profile platform roles are constrained');

select * from finish();
rollback;