-- 048: enforce stable school naming and staff membership identifiers.

alter table public.school_classes
  add constraint school_classes_school_id_name_key unique (school_id, name);

alter table public.staff_records
  add constraint staff_records_school_id_staff_user_id_key unique (school_id, staff_user_id);
