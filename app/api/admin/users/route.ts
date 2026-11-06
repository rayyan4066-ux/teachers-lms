import {actor,apiError} from '@/lib/permissions';
import {serviceClient} from '@/lib/supabase/admin';
import {uuid} from '@/lib/validations';
export async function GET(){try{
 const {db,profile}=await actor();if(profile.role!=='admin')throw new Error('FORBIDDEN');
 const {data,error}=await db.from('profiles').select('id,full_name,email,role').order('created_at',{ascending:false}).limit(100);
 if(error)throw error;return Response.json({users:data});
}catch(e){return apiError(e)}}
export async function PATCH(req:Request){try{
 const {user,profile}=await actor();if(profile.role!=='admin')throw new Error('FORBIDDEN');
 const input=await req.json();const target=uuid(input.userId),role=input.role;
 if(!['student','teacher','admin'].includes(role))throw new Error('Invalid role');
 if(target===user.id)throw new Error('Cannot change your own role');
 const svc=serviceClient();const {data:old,error:oldError}=await svc.from('profiles').select('role').eq('id',target).single();if(oldError||!old)throw new Error('NOT_FOUND');
 const {error}=await svc.from('profiles').update({role}).eq('id',target);if(error)throw error;
 await svc.from('audit_events').insert({actor_id:user.id,action:'role_changed',target_id:target,detail:{previous:old.role,next:role}});
 return Response.json({ok:true});
}catch(e){return apiError(e)}}
