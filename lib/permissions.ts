import {createClient} from '@/lib/supabase/server';
export async function actor(){
 const db=await createClient();
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user)throw new Error('UNAUTHORIZED');
 const {data:profile,error:pe}=await db.from('profiles').select('id,full_name,role').eq('id',user.id).single();
 if(pe||!profile)throw new Error('UNAUTHORIZED');
 return {db,user,profile};
}
export async function canUseCourse(db:Awaited<ReturnType<typeof createClient>>,id:string){
 const {data,error}=await db.rpc('can_access_course',{course:id});
 if(error||!data)throw new Error('FORBIDDEN');
}
export async function ownsCourse(db:Awaited<ReturnType<typeof createClient>>,id:string){
 const {data,error}=await db.rpc('is_teacher',{course:id});
 if(error||!data)throw new Error('FORBIDDEN');
}
export function apiError(e:unknown){
 const msg=e instanceof Error?e.message:'Unexpected error';
 const status=msg==='UNAUTHORIZED'?401:msg==='FORBIDDEN'?403:msg==='NOT_FOUND'?404:400;
 return Response.json({error:status===400?'Invalid request':msg},{status});
}
