-- Run AFTER schema.sql on a fresh Supabase instance. Do not run as a destructive migration.
create table public.course_documents (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.courses(id) on delete cascade,
 uploaded_by uuid not null references public.profiles(id),
 file_name text not null, mime_type text not null, storage_path text unique not null,
 created_at timestamptz not null default now()
);
create index course_documents_by_course on public.course_documents(course_id);
create table public.audit_events (
 id bigint generated always as identity primary key,
 actor_id uuid references public.profiles(id), action text not null,
 target_id uuid, detail jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
alter table public.course_documents enable row level security;
alter table public.audit_events enable row level security;
create policy document_read on public.course_documents for select to authenticated
 using(public.can_access_course(course_id));
create policy document_add on public.course_documents for insert to authenticated
 with check(public.is_teacher(course_id) and uploaded_by=(select auth.uid()));
create policy document_delete on public.course_documents for delete to authenticated
 using(public.is_teacher(course_id));
create policy audit_admin_read on public.audit_events for select to authenticated
 using(public.is_admin());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('teacher-materials','teacher-materials',false,10485760,array['application/pdf','text/plain','text/markdown'])
 on conflict(id) do nothing;
create policy teacher_material_read on storage.objects for select to authenticated
 using(bucket_id='teacher-materials' and exists(select 1 from public.course_documents d
 where d.storage_path=name and public.can_access_course(d.course_id)));
-- Upload and signed download use a server route with course access checks.
