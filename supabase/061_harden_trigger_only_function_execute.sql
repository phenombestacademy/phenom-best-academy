-- Phenom Best LMS: close trigger-only function RPC exposure
revoke execute on function public.trg_regrade_assignment_after_item_change() from public, anon, authenticated;
