import {actor,canUseCourse,apiError} from '@/lib/permissions';
import {serviceClient} from '@/lib/supabase/admin';
import {uuid} from '@/lib/validations';
export async function GET(req:Request){try{
 const {db}=await actor();const id=uuid(new URL(req.url).searchParams.get('id'));
 const {data:d}=await db.from('course_documents').select('id,course_id,storage_path').eq('id',id).single();if(!d)throw new Error('NOT_FOUND');
 await canUseCourse(db,d.course_id);
 const {data,error}=await serviceClient().storage.from('teacher-materials').createSignedUrl(d.storage_path,60);
 if(error||!data)throw new Error('NOT_FOUND');
 if (req.headers.get('sec-fetch-dest') === 'document' || req.headers.get('accept')?.includes('text/html')) {
  return Response.redirect(data.signedUrl, 302);
 }
 return Response.json({url:data.signedUrl});
}catch(e){return apiError(e)}}
