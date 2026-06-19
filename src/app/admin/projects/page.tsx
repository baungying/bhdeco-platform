"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const G = "#D4A73D";
const inp: React.CSSProperties = { width:"100%",padding:".7rem .9rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",color:"#EDE8DC",fontSize:".85rem",outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxSizing:"border-box" };
const fi = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor="rgba(212,167,61,.45)");
const bl = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor="rgba(255,255,255,.1)");

const CATS = ["Villa","Kitchen","Wardrobe","TV Wall","Bedroom","Office","Commercial","Reception"];

interface Project { id?:number;title:string;category:string;description:string;location:string;before_image:string;after_image:string;active:boolean; }
const EMPTY: Project = { title:"",category:"Villa",description:"",location:"Mandalay",before_image:"",after_image:"",active:true };

export default function ProjectsPage() {
  const [rows,    setRows]    = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ok:boolean;text:string}|null>(null);
  const [secret,  setSecret]  = useState("");
  useEffect(()=>{ setSecret(sessionStorage.getItem("bh_admin_secret")||""); },[]);

  const load = async (s=secret) => {
    setLoading(true);
    const r = await fetch("/api/admin/projects",{headers:{"x-admin-secret":s}});
    const j = await r.json();
    setRows(j.data||[]);
    setLoading(false);
  };
  useEffect(()=>{ if(secret) load(); },[secret]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    if(!editing) return;
    const method = editing.id?"PUT":"POST";
    const url = editing.id?`/api/admin/projects/${editing.id}`:"/api/admin/projects";
    const res = await fetch(url,{method,headers:{"Content-Type":"application/json","x-admin-secret":secret},body:JSON.stringify(editing)});
    const j = await res.json();
    if(res.ok){ setMsg({ok:true,text:"Saved."}); setEditing(null); load(); }
    else setMsg({ok:false,text:j.error||"Failed."});
    setSaving(false);
  };

  const del = async (id:number) => {
    if(!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`,{method:"DELETE",headers:{"x-admin-secret":secret}});
    load();
  };

  return (
    <div style={{minHeight:"100vh",background:"#010408",color:"#EDE8DC",padding:"4rem 2rem"}}>
      <div style={{maxWidth:"1100px",margin:"0 auto"}}>
        <Link href="/admin" style={{fontSize:".7rem",color:"#2E4060",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem",marginBottom:"1.5rem"}}
          onMouseEnter={e=>(e.currentTarget.style.color=G)} onMouseLeave={e=>(e.currentTarget.style.color="#2E4060")}>← Admin</Link>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
          <div>
            <p style={{fontFamily:"monospace",fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".4rem"}}>CMS · PORTFOLIO</p>
            <h1 style={{fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300",fontFamily:"'Cormorant Garant',serif"}}>Project <span style={{fontStyle:"italic",color:G}}>Gallery</span></h1>
          </div>
          <button onClick={()=>setEditing({...EMPTY})} style={{padding:".65rem 1.4rem",borderRadius:"8px",border:`1px solid ${G}`,background:"transparent",color:G,fontSize:".75rem",letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer"}}>+ Add Project</button>
        </div>

        {editing&&(
          <div style={{background:"rgba(212,167,61,.04)",border:`1px solid rgba(212,167,61,.2)`,borderRadius:"12px",padding:"1.75rem",marginBottom:"2rem"}}>
            <h3 style={{fontFamily:"monospace",fontSize:".65rem",color:G,letterSpacing:".14em",marginBottom:"1.25rem"}}>{editing.id?"EDIT PROJECT":"NEW PROJECT"}</h3>
            <form onSubmit={save} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              {([
                {k:"title",       label:"Project Title",    col:"1/-1"},
                {k:"location",    label:"Location",         col:"auto"},
                {k:"category",    label:"Category",         col:"auto", opts:CATS},
                {k:"description", label:"Description",      col:"1/-1", ta:true},
                {k:"before_image",label:"Before Image URL", col:"auto"},
                {k:"after_image", label:"After Image URL",  col:"auto"},
              ] as {k:keyof Project;label:string;col?:string;opts?:string[];ta?:boolean}[]).map(f=>(
                <div key={f.k} style={{gridColumn:f.col||"auto"}}>
                  <label style={{display:"block",fontFamily:"monospace",fontSize:".55rem",color:"#7A8FA8",letterSpacing:".1em",textTransform:"uppercase",marginBottom:".35rem"}}>{f.label}</label>
                  {f.opts
                    ?<select value={String(editing[f.k])} onChange={e=>setEditing(p=>({...p!,[f.k]:e.target.value}))} style={inp} onFocus={fi as never} onBlur={bl as never}>
                        {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    :f.ta
                      ?<textarea value={String(editing[f.k]||"")} onChange={e=>setEditing(p=>({...p!,[f.k]:e.target.value}))} rows={3} style={{...inp,resize:"vertical"} as React.CSSProperties} onFocus={fi as never} onBlur={bl as never}/>
                      :<input type="text" value={String(editing[f.k]||"")} onChange={e=>setEditing(p=>({...p!,[f.k]:e.target.value}))} style={inp} onFocus={fi} onBlur={bl}/>
                  }
                </div>
              ))}
              <div style={{gridColumn:"1 / -1",display:"flex",alignItems:"center",gap:".75rem"}}>
                <input type="checkbox" id="proj_active" checked={editing.active} onChange={e=>setEditing(p=>({...p!,active:e.target.checked}))} style={{width:"16px",height:"16px",accentColor:G}}/>
                <label htmlFor="proj_active" style={{fontSize:".82rem",color:"#EDE8DC"}}>Active (visible on website)</label>
              </div>
              {msg&&<div style={{gridColumn:"1/-1",padding:".65rem 1rem",background:msg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${msg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`,borderRadius:"8px",fontSize:".8rem",color:msg.ok?"#10B981":"#f87171"}}>{msg.text}</div>}
              <div style={{gridColumn:"1/-1",display:"flex",gap:".75rem"}}>
                <button type="submit" disabled={saving} style={{padding:".7rem 1.6rem",borderRadius:"8px",border:"none",background:`linear-gradient(135deg,${G},#9A7020)`,color:"#010408",fontWeight:"700",fontSize:".75rem",letterSpacing:".08em",textTransform:"uppercase",cursor:saving?"wait":"pointer"}}>{saving?"Saving…":"Save Project"}</button>
                <button type="button" onClick={()=>setEditing(null)} style={{padding:".7rem 1.2rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#7A8FA8",fontSize:".75rem",cursor:"pointer"}}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading?<p style={{color:"#2E4060"}}>Loading…</p>:rows.length===0?<p style={{color:"#2E4060",fontFamily:"monospace",fontSize:".65rem",letterSpacing:".1em"}}>NO PROJECTS YET</p>:(
          <div style={{border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",overflow:"hidden"}}>
            {rows.map((r,i)=>(
              <div key={r.id} style={{display:"grid",gridTemplateColumns:"1fr 120px 80px 80px 100px",gap:"1rem",padding:".9rem 1.25rem",borderBottom:i<rows.length-1?"1px solid rgba(255,255,255,.04)":"none",alignItems:"center",transition:"background .15s"}}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,.02)")}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                <div>
                  <p style={{fontSize:".85rem",color:"#EDE8DC",fontWeight:"500"}}>{r.title}</p>
                  <p style={{fontSize:".7rem",color:"#7A8FA8"}}>{r.category} · {r.location}</p>
                </div>
                <span style={{fontFamily:"monospace",fontSize:".62rem",padding:".2rem .5rem",borderRadius:"100px",background:r.active?"rgba(16,185,129,.1)":"rgba(255,255,255,.05)",color:r.active?"#10B981":"#2E4060"}}>{r.active?"ACTIVE":"HIDDEN"}</span>
                <span/>
                <button onClick={()=>setEditing({...r})} style={{fontSize:".7rem",color:G,background:"none",border:`1px solid rgba(212,167,61,.25)`,borderRadius:"6px",padding:".35rem .8rem",cursor:"pointer"}}>Edit</button>
                <button onClick={()=>r.id&&del(r.id)} style={{fontSize:".7rem",color:"#f87171",background:"none",border:"1px solid rgba(239,68,68,.2)",borderRadius:"6px",padding:".35rem .8rem",cursor:"pointer"}}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
