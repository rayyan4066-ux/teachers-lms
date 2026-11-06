import {actor,ownsCourse,apiError} from '@/lib/permissions';
import {uuid} from '@/lib/validations';
export async function GET(req:Request){try{
 const {db}=await actor();const courseId=uuid(new URL(req.url).searchParams.get('courseId'));await ownsCourse(db,courseId);
 const {data:enrolled,error}=await db.from('enrollments').select('student_id,profiles!enrollments_student_id_fkey(id,full_name,email)').eq('course_id',courseId);
 if(error)throw error;
 const {data:lessons}=await db.from('lessons').select('id').eq('course_id',courseId);
 const {data:quizzes}=await db.from('quizzes').select('id').eq('course_id',courseId);
 const lIds=(lessons||[]).map((x:{id:string})=>x.id),qIds=(quizzes||[]).map((x:{id:string})=>x.id);
 const [progress,attempts]=await Promise.all([
  lIds.length?db.from('lesson_progress').select('student_id,lesson_id').in('lesson_id',lIds):Promise.resolve({data:[]}),
  qIds.length?db.from('quiz_attempts').select('student_id,correct').in('quiz_id',qIds):Promise.resolve({data:[]})
 ]);
 const students=(enrolled||[]).map((e:any)=>{
 const p=Array.isArray(e.profiles)?e.profiles[0]:e.profiles;
 const done=(progress.data||[]).filter((x:any)=>x.student_id===e.student_id).length;
 const tests=(attempts.data||[]).filter((x:any)=>x.student_id===e.student_id);
 return {id:e.student_id,name:p?.full_name||'Student',email:p?.email||'',completed:done,total:lIds.length,attempts:tests.length,accuracy:tests.length?Math.round(100*tests.filter((x:any)=>x.correct).length/tests.length):null};
 });return Response.json({students});
}catch(e){return apiError(e)}}
