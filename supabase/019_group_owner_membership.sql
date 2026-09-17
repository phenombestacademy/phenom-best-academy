-- Group owners and Super Admin may add members; ordinary members cannot self-join another group.
drop policy if exists "conversation member controlled insert" on public.conversation_members;
create policy "conversation member controlled insert" on public.conversation_members for insert to authenticated
with check(exists(select 1 from public.conversations c where c.id=conversation_id and (c.created_by=auth.uid() or public.is_super_admin())));
