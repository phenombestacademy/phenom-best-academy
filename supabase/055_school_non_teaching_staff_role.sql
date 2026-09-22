-- Phenom Best LMS: allow non-teaching staff as a school membership role
alter table public.school_members drop constraint if exists school_members_role_check;
alter table public.school_members add constraint school_members_role_check check (role = any(array['school_admin','teacher','non_teaching_staff','student','parent']));
