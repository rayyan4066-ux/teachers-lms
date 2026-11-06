import {actor,ownsCourse,canUseCourse,apiError} from '@/lib/permissions';
import {serviceClient} from '@/lib/supabase/admin';
import {uuid} from '@/lib/validations';
const allowed:Record<string,string[]>={'.pdf':['application/pdf'],'.txt':['text/plain'],'.md':['text/markdown','text/plain','application/octet-stream']};
export async function GET(req:Request){try{
 const {db}=await actor();const courseId=uuid(new URL(req.url).searchParams.get('courseId'));await canUseCourse(db,courseId);
 const {data,error}=await db.from('course_documents').select('id,file_name,mime_type,created_at').eq('course_id',courseId).order('created_at',{ascending:false});
 if(error)throw error;return Response.json({documents:data});
}catch(e){return apiError(e)}}
export async function POST(req:Request){try{
 const {db,user}=await actor();const form=await req.formData();const courseId=uuid(form.get('courseId'));await ownsCourse(db,courseId);
 const file=form.get('file');if(!(file instanceof File))throw new Error('Missing file');
 const ext=file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
 if(file.size===0||file.size>10*1024*1024||!allowed[ext]?.includes(file.type))throw new Error('Invalid file type or size (max 10MB, PDF/TXT/MD)');
 const svc=serviceClient();const bytes=Buffer.from(await file.arrayBuffer());
 // Validate the PDF signature; add antivirus scanning and deeper file validation before a public launch.
 if(ext==='.pdf'&&bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw new Error('Invalid PDF content');
 const storagePath=`${courseId}/${crypto.randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
 const {error:storageError}=await svc.storage.from('teacher-materials').upload(storagePath,bytes,{contentType:file.type,upsert:false});
 if(storageError)throw new Error('Storage upload failed');
 const {data:doc,error:insertError}=await db.from('course_documents').insert({course_id:courseId,uploaded_by:user.id,file_name:file.name.slice(0,200),mime_type:file.type,storage_path:storagePath}).select('id').single();
 if(insertError||!doc){await svc.storage.from('teacher-materials').remove([storagePath]);throw new Error('Document record failed')}
 return Response.json({id:doc.id,message:'Material uploaded'},{status:201});
}catch(e){return apiError(e)}}
