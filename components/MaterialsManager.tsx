'use client';
import {useState} from 'react';
type Course = {id:string;title:string};
type Document = {id:string;file_name:string;status:string};
export default function MaterialsManager({courses}:{courses:Course[]}) {
 const [course,setCourse]=useState(courses[0]?.id||'');
 const [file,setFile]=useState<File|null>(null);
 const [docs,setDocs]=useState<Document[]>([]);
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 async function load(id:string){if(!id)return;const r=await fetch('/api/documents?courseId='+encodeURIComponent(id));const d=await r.json();setDocs(d.documents||[])}
 async function upload(e:React.FormEvent){e.preventDefault();if(!file||!course)return;setBusy(true);setMessage('');
  try{const body=new FormData();body.append('courseId',course);body.append('file',file);const r=await fetch('/api/documents',{method:'POST',body});const d=await r.json();if(!r.ok)throw Error(d.error||'Upload failed');setMessage('Teaching material uploaded successfully.');await load(course);setFile(null)}
  catch(e){setMessage(e instanceof Error?e.message:'Upload failed')}finally{setBusy(false)}
 }
 return <section className="panel"><h2>Teaching materials</h2><p className="muted">Upload course notes and documents. Only enrolled students and authorized staff may access them.</p>
  <label className="field-label">Course<select className="control" value={course} onChange={e=>{setCourse(e.target.value);setDocs([]);void load(e.target.value)}}>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
  <form onSubmit={upload} className="form"><label>PDF, TXT or Markdown (max 10 MB)<input type="file" accept=".pdf,.txt,.md" onChange={e=>setFile(e.target.files?.[0]||null)} required/></label><button className="btn" disabled={!course||busy}>{busy?'Uploading…':'Upload material'}</button></form>
  <button className="btn secondary" onClick={()=>void load(course)} disabled={!course}>Refresh document list</button>
  <div className="stack">{docs.map(d=><div key={d.id} className="list-row"><span>{d.file_name}</span><a href={'/api/documents/download?id='+encodeURIComponent(d.id)}>Download</a></div>)}</div>
  {message&&<p className="notice" role="status">{message}</p>}
 </section>;
}
