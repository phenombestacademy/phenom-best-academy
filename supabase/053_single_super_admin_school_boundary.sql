-- 053: keep the single Phenom Best LMS Super Admin outside school-member roles.

create or replace function public.create_school_for_current_user_v2(
  p_name text,p_logo_url text default null,p_primary_color text default null,p_country text default null,
  p_currency text default null,p_curricula text[] default '{}',p_state_or_region text default null
)
returns public.schools language plpgsql security definer set search_path=public
as $$
declare school_row public.schools; caller_is_super_admin boolean; caller_is_school_admin boolean;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if trim(coalesce(p_name,''))='' then raise exception 'School name is required'; end if;
  if coalesce(array_length(p_curricula,1),0)>3 then raise exception 'A school may select a maximum of 3 curricula'; end if;
  select public.is_super_admin() into caller_is_super_admin;
  select exists(select 1 from public.profiles where id=auth.uid() and account_category='school' and onboarding_role='school_admin') into caller_is_school_admin;
  if not caller_is_super_admin and not caller_is_school_admin then raise exception 'Choose School → School Administrator on your account before creating a school'; end if;

  insert into public.schools(name,logo_url,primary_color,country,currency)
  values(trim(p_name),nullif(trim(p_logo_url),''),nullif(trim(p_primary_color),''),nullif(trim(p_country),''),nullif(trim(p_currency),''))
  returning * into school_row;

  if not caller_is_super_admin then
    insert into public.school_members(school_id,user_id,role,status)
    values(school_row.id,auth.uid(),'school_admin','active')
    on conflict (school_id,user_id) do update set role='school_admin',status='active';
  end if;

  perform public.set_school_curricula(school_row.id,p_curricula,p_state_or_region);
  if caller_is_school_admin then update public.profiles set onboarding_role='school_admin',updated_at=now() where id=auth.uid(); end if;
  return school_row;
end;
$$;

revoke execute on function public.create_school_for_current_user_v2(text,text,text,text,text,text[],text) from anon;
grant execute on function public.create_school_for_current_user_v2(text,text,text,text,text,text[],text) to authenticated;