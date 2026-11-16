
import { requireStaff } from '@/lib/auth';
import { body, str, failure } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const { db, profile } = await requireStaff();
    const data = await body(req);

    const title = str(data.title, 2, 120);
    const description = str(data.description || '', 0, 1000);

    const { data: course, error } = await db
      .from('courses')
      .insert({
        title,
        description,
        teacher_id: profile.id,
        status: 'published'
      })
      .select('id, title')
      .single();

    if (error) {
      console.error('COURSE_CREATE_ERROR', {
        code: error.code,
        message: error.message,
        details: error.details
      });

      return Response.json(
        { error: 'Course could not be saved. Check server logs.' },
        { status: 500 }
      );
    }

    return Response.json({ course }, { status: 201 });
  } catch (error) {
    console.error('COURSE_CREATE_EXCEPTION', error);
    return failure(error);
  }
}
