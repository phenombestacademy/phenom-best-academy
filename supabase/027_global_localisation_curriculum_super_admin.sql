-- V5.3 global localisation, curriculum catalogue and private designated Super Admin configuration
create table if not exists public.curriculum_catalogue (
  id text primary key,
  name text not null,
  description text not null,
  country_codes text[] not null default '{}',
  stages text[] not null default '{}',
  subjects text[] not null default '{}',
  official_source text not null,
  notes text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.curriculum_catalogue(id,name,description,country_codes,stages,subjects,official_source,notes) values
('nigeria-nerdc','Nigeria — NERDC Basic Education Curriculum','Nigeria’s official Basic Education Curriculum framework for primary and junior secondary education, with subject materials published by NERDC.',array['NG'],array['Primary 1–6','JSS 1–3'],array['English Studies','Mathematics','Basic Science and Technology','National Values','Cultural and Creative Arts','French','Hausa','Igbo','Yoruba','Arabic','Islamic Studies','Pre-Vocational Studies'],'https://nerdc.gov.ng/content_manager/curriculum.html','Use current NERDC publications as the authoritative reference and refresh when NERDC publishes revisions.'),
('england-national','England — National Curriculum','England’s National Curriculum framework organised into Key Stages 1–4.',array['GB','NG'],array['Key Stage 1','Key Stage 2','Key Stage 3','Key Stage 4'],array['English','Mathematics','Science','Computing','History','Geography','Art and Design','Music','Physical Education','Design and Technology','Languages','Citizenship','Religious Education'],'https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4','Schools remain responsible for local/statutory requirements and their wider curriculum.'),
('cambridge','Cambridge International Curriculum','Cambridge International programmes are flexible and can be offered alongside a national curriculum or as part of a bilingual programme.',array['*'],array['Cambridge Early Years','Cambridge Primary','Cambridge Lower Secondary','Cambridge Upper Secondary','Cambridge Advanced'],array['English','English as a Second Language','Mathematics','Science','Computing','Digital Literacy','Global Perspectives','Humanities','Modern Foreign Language','Art and Design','Music','Physical Education','Wellbeing'],'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/curriculum/','Use the official Cambridge programme specification for the selected stage and subject.'),
('us-common-core','United States — Common Core / State-Standards-Aligned','US-aligned academic content using Common Core where adopted, with explicit state-standards awareness.',array['US','NG'],array['Elementary','Middle School','High School'],array['English Language Arts / Literacy','Mathematics','Science','Social Studies','Computer Science','Physical Education','Arts','World Languages'],'https://corestandards.org/','The United States has no single federally mandated national school curriculum; record the state and apply applicable state standards.')
on conflict(id) do update set name=excluded.name,description=excluded.description,country_codes=excluded.country_codes,stages=excluded.stages,subjects=excluded.subjects,official_source=excluded.official_source,notes=excluded.notes,active=true,updated_at=now();

create table if not exists public.school_curricula (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  curriculum_id text not null references public.curriculum_catalogue(id),
  priority smallint not null default 1 check(priority between 1 and 3),
  state_or_region text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique(school_id,curriculum_id),
  unique(school_id,priority)
);
create index if not exists school_curricula_school_idx on public.school_curricula(school_id);
alter table public.school_curricula enable row level security;
drop policy if exists school_curricula_read on public.school_curricula;
drop policy if exists school_curricula_manage on public.school_curricula;
create policy school_curricula_read on public.school_curricula for select using (public.is_school_member(school_id) or public.is_super_admin());
create policy school_curricula_manage on public.school_curricula for all using (public.is_school_admin_for(school_id) or public.is_super_admin()) with check (public.is_school_admin_for(school_id) or public.is_super_admin());

create or replace function public.set_school_curricula(p_school_id uuid,p_curricula text[],p_state_or_region text default null)
returns void language plpgsql security definer set search_path=public as $$
declare i integer; cid text;
begin
  if not (public.is_super_admin() or public.is_school_admin_for(p_school_id)) then raise exception 'School administration access required'; end if;
  if coalesce(array_length(p_curricula,1),0)>3 then raise exception 'A school may select a maximum of 3 curricula'; end if;
  delete from public.school_curricula where school_id=p_school_id;
  if p_curricula is null then return; end if;
  for i in 1..array_length(p_curricula,1) loop
    cid:=p_curricula[i];
    if not exists(select 1 from public.curriculum_catalogue where id=cid and active) then raise exception 'Unsupported curriculum: %',cid; end if;
    insert into public.school_curricula(school_id,curriculum_id,priority,state_or_region) values(p_school_id,cid,i,p_state_or_region);
  end loop;
end; $$;
revoke all on function public.set_school_curricula(uuid,text[],text) from public;
grant execute on function public.set_school_curricula(uuid,text[],text) to authenticated;

create table if not exists public.academy_private_configuration (
  config_key text primary key,
  config_value text not null,
  secret boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.academy_private_configuration enable row level security;
drop policy if exists academy_private_configuration_none on public.academy_private_configuration;
create policy academy_private_configuration_none on public.academy_private_configuration for all using (false) with check (false);
-- The designated Super Admin email is written directly to this private table through protected administration; it is intentionally not committed to source control.
-- Do not place the address in this migration or any client-side file.

-- Never auto-promote a signup based only on email. The designated address is stored privately for explicit verification after authentication.

create or replace function public.create_school_for_current_user_v2(
  p_name text,p_logo_url text default null,p_primary_color text default null,p_country text default null,p_currency text default null,p_curricula text[] default '{}',p_state_or_region text default null
)
returns public.schools language plpgsql security definer set search_path=public as $$
declare school_row public.schools;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(coalesce(p_name,''))='' then raise exception 'School name is required'; end if;
  if not exists(select 1 from public.profiles where id=auth.uid() and account_category='school' and onboarding_role='school_admin') then raise exception 'Choose School → School Administrator on your account before creating a school'; end if;
  if coalesce(array_length(p_curricula,1),0)>3 then raise exception 'A school may select a maximum of 3 curricula'; end if;
  insert into public.schools(name,logo_url,primary_color,country,currency) values(trim(p_name),nullif(trim(p_logo_url),''),nullif(trim(p_primary_color),''),nullif(trim(p_country),''),nullif(trim(p_currency),'')) returning * into school_row;
  insert into public.school_members(school_id,user_id,role,status) values(school_row.id,auth.uid(),'school_admin','active') on conflict (school_id,user_id) do update set role='school_admin',status='active';
  perform public.set_school_curricula(school_row.id,p_curricula,p_state_or_region);
  update public.profiles set onboarding_role='school_admin',updated_at=now() where id=auth.uid();
  return school_row;
end; $$;
revoke all on function public.create_school_for_current_user_v2(text,text,text,text,text,text[],text) from public;
grant execute on function public.create_school_for_current_user_v2(text,text,text,text,text,text[],text) to authenticated;
