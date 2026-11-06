'use client';
import {useState} from 'react';
type Doc={id:string;file_name:string;status:string;created_at:string};
export default function StudentMaterials({courses}:{courses:{id:string;title:string}[]}){
 const [course,setCourse]=useState(courses[0]?.id||'');const [docs,setDocs]=useState<Doc[]>([]);const [error,setError]=useState('');
 async function refresh(id=course){setError('');const res=await fetch('/api/documents?courseId='+id);const data=await res.json();if(!res.ok)setError(data.error||'Failed to load');else setDocs(data.documents||[])}
 async function download(id:string){setError('');const res=await fetch('/api/documents/download?id='+id);const data=await res.json();if(!res.ok){setError(data.error||'Unable to access file');return}window.open(data.url,'_blank','noopener,noreferrer')}
 return <section className="panel"><h2>Your teacher's documents</h2><p className="muted">Only documents published within your enrolled courses are visible. You can download the original files.</p><div className="toolbar"><select className="control" value={course} onChange={e=>{setCourse(e.target.value);setDocs([])}} aria-label="Choose class">{courses.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select><button className="btn" onClick={()=>refresh()} disabled={!course}>Load documents</button></div>{error&&<p className="notice" role="alert">{error}</p>}<div className="stack">{docs.map(d=><div className="list-row" key={d.id}><span>{d.file_name} <small className="muted">({d.status})</small></span><button className="btn secondary" onClick={()=>download(d.id)}>Open</button></div>)}</div></section>
}
