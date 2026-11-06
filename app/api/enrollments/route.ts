import {requireStaff} from '@/lib/auth';
import {body,str,uuid,failure} from '@/lib/validations';
export async function POST(req:Request){
 try {
   const {db}=await requireStaff();
   const input=await body(req);
   const courseId=uuid(input.course_id);
   const email=str(input.email,3,255).toLowerCase();
   const {data,error}=await db.rpc('enroll_student_by_email',{target_course:courseId,target_email:email});
   if(error)throw error;
   return Response.json({ok:true,student_id:data},{status:201});
 } catch(e){return failure(e)}
}
