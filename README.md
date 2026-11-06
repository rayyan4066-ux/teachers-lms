# TeacherBrain — Learning Platform (AI Chat Removed)

Next.js 16 / React 19 / Supabase multi-teacher learning platform.

## Included
- Google OAuth and email/password login through Supabase Auth.
- Role-based student, teacher and admin dashboards.
- Teacher-owned courses, lessons, quizzes, assignments and enrollments.
- Teacher material uploads (PDF, TXT, Markdown) and authorized downloads.
- Student course library and teacher student-performance reporting.
- Admin role management and audit events.

## Explicitly removed
- AI tutor/chat screen and navigation link.
- Chat/threads/messages APIs, hosted model gateway and model credentials.
- Course AI instructions, vector/retrieval indexes, chat history and usage tables.

## Local setup
1. `npm install`
2. Create a **fresh** Supabase project; run `supabase/schema.sql` then `supabase/02_teacherbrain.sql`.
3. Enable Google OAuth in Supabase Auth and configure redirect URLs (`/auth/callback`).
4. Copy `.env.example` to `.env.local` and set credentials. Never expose service role key.
5. In trusted SQL Editor promote first admin, e.g. `update public.profiles set role='admin' where email='admin@example.com';`.
6. Run `npm run test`, `npm run typecheck`, `npm run build`, then `npm run dev`.

**Important:** Schema files target a fresh database. If you've deployed the earlier AI version, use `supabase/03_remove_ai_chat_existing.sql` only after backing up your data and accepting that chat records will be permanently deleted.

## Known limitations
No production build or live Supabase/OAuth tests verified here. Video streaming, payment integration, complete exam sessions, security hardening and malware scanning remain future work.
