-- Admins dürfen Anfragen löschen (functions/kundenbereich/admin-bearbeiten.md Verhalten 1)
create policy admin_loescht on public.anfragen for delete to authenticated using (public.ist_admin());
