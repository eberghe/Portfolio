-- Admins dürfen Anfragen löschen (functions/kundenbereich/admin-bearbeiten.md Verhalten 1).
-- Die Tabelle hat nur einzelne Rechte (20261008200000_dashboard.sql), deshalb braucht es Policy und Grant.
create policy admin_loescht on public.anfragen for delete to authenticated using (public.ist_admin());
grant delete on public.anfragen to authenticated;
