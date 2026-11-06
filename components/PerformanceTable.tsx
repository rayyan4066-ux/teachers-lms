'use client';import {useState} from 'react';
type Row={id:string;name:string;email:string;completed:number;total:number;attempts:number;accuracy:number|null};
export default function PerformanceTable({courses}:{courses:{id:string;title:string}[]}){
 const [course,setCourse]=useState(courses[0]?.id||''),[rows,setRows]=useState<Row[]>([]),[msg,setMsg]=useState('Choose a class, then load progress.');
 async function load(id=course){setMsg('Loading…');const r=await fetch('/api/teacher/performance?courseId='+id);const d=await r.json();if(!r.ok){setMsg(d.error||'Failed');return}setRows(d.students||[]);setMsg('')}
 return <section className="panel"><div className="toolbar"><select className="control" value={course} onChange={e=>{setCourse(e.target.value);setRows([])}}>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select><button className="btn" onClick={()=>load()} disabled={!course}>Load performance</button></div>{msg&&<p className="muted">{msg}</p>}<div className="table-scroll"><table className="data-table"><thead><tr><th>Student</th><th>Lessons</th><th>Quiz attempts</th><th>Accuracy</th></tr></thead><tbody>{rows.map(s=><tr key={s.id}><td><strong>{s.name}</strong><small>{s.email}</small></td><td>{s.completed} / {s.total}</td><td>{s.attempts}</td><td>{s.accuracy===null?'—':s.accuracy+'%'}</td></tr>)}</tbody></table></div></section>
}
