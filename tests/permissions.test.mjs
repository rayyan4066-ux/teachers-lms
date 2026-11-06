import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
const sql=readFileSync('supabase/02_teacherbrain.sql','utf8');
test('course document reads require course access',()=>assert.match(sql,/public\.can_access_course\(course_id\)/));
test('teachers control course material uploads',()=>assert.match(sql,/public\.is_teacher\(course_id\)/));
test('new users default to students',()=>assert.match(readFileSync('supabase/schema.sql','utf8'),/default 'student'/));
test('AI chat routes and UI are removed',()=>{for(const file of ['app/api/ai/chat/route.ts','app/dashboard/ai/page.tsx','components/AIChat.tsx','lib/model.ts'])assert.equal(existsSync(file),false)});
