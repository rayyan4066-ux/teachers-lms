import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export type Role = 'student'|'teacher'|'admin';
export async function currentUser(){
 const db=await createClient(); const {data:{user}}=await db.auth.getUser();
 if(!user)redirect('/login');
 const {data:profile,error}=await db.from('profiles').select('id,full_name,role').eq('id',user.id).single();
 if(error||!profile)throw new Error('Profile missing. Run SQL migration and retry sign-in.');
 return {db,user,profile:profile as {id:string;full_name:string;role:Role}};
}
export async function requireStaff(){const ctx=await currentUser();if(ctx.profile.role==='student')redirect('/dashboard');return ctx}
export async function requireAdmin(){const ctx=await currentUser();if(ctx.profile.role!=='admin')redirect('/dashboard');return ctx}
