-- Community access hardening: recipients accept requests; group owners control membership.
drop policy if exists "friend request recipient update" on public.friend_requests;
create policy "friend request recipient update" on public.friend_requests for update to authenticated
using(recipient_id=auth.uid() or public.is_super_admin())
with check(recipient_id=auth.uid() or public.is_super_admin());

drop policy if exists "conversation member self insert" on public.conversation_members;
create policy "conversation member controlled insert" on public.conversation_members for insert to authenticated
with check(user_id=auth.uid() and (exists(select 1 from public.conversations c where c.id=conversation_id and c.created_by=auth.uid()) or public.is_super_admin()));
