export function str(value:unknown,min=1,max=200){if(typeof value!=='string')throw new Error('Invalid text');const s=value.trim();if(s.length<min||s.length>max)throw new Error(`Text length must be ${min}-${max}`);return s}
export function uuid(value:unknown){const s=str(value,36,36);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s))throw new Error('Invalid id');return s}
export async function body(req:Request){try{return await req.json()}catch{throw new Error('Invalid JSON')}}
export function failure(error:unknown,status=400){return Response.json({error:error instanceof Error?error.message:'Request failed'},{status})}
