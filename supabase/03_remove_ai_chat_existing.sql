-- OPTIONAL, DESTRUCTIVE migration ONLY for an EXISTING TeacherBrain AI database.
-- BACK UP FIRST. Removes chat transcripts and AI-specific indexed content.
drop function if exists public.search_course_chunks(uuid,text,int);
drop table if exists public.ai_messages cascade;
drop table if exists public.ai_threads cascade;
drop table if exists public.ai_usage cascade;
drop table if exists public.course_ai_settings cascade;
drop table if exists public.document_chunks cascade;
-- Existing course_documents might contain status/error_message columns; retaining them is safe.
