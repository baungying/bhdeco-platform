"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const G = "#D4A73D";
const inp: React.CSSProperties = { width:"100%",padding:".75rem 1rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",color:"#EDE8DC",fontSize:".88rem",outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxSizing:"border-box" };

interface CompanySettings { name:string;phone:string;email:string;address:string;whatsapp:string;facebook:string;tiktok:string;youtube:string;instagram:string; }
const EMPTY: CompanySettings = { name:"",phone:"",email:"",address:"",whatsapp:"",facebook:"",tiktok:"",youtube:"",instagram:"" };
const FIELDS: {key:keyof CompanySettings;label:string;placeholder:string}[] = [
  {key:"name",      label:"Company Name",  placeholder:"Blessing Home Construction & Interior Design"},
  {key:"phone",     label:"Phone",         placeholder:"+95 9 000 000 000"},
  {key:"email",     label:"Email",         placeholder:"hello@bhdeco.ai"},
  {key:"address",   label:"Address",       placeholder:"Mandalay, Myanmar"},
  {key:"whatsapp",  label:"WhatsApp",      placeholder:"+95 9 000 000 000"},
  {key:"facebook",  label:"Facebook URL",  placeholder:"https://facebook.com/bhdecai"},
  {key:"tiktok",    label:"TikTok URL",    placeholder:"https://tiktok.com/@bhdecai"},
  {key:"youtube",   label:"YouTube URL",   placeholder:"https://youtube.com/@bhdecai"},
  {key:"instagram", label:"Instagram URL", placeholder:"https://instagram.com/bhdecai"},
];

export default function CompanyPage() {
  const [data,    setData]    = useState<CompanySettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ok:boolean;text:string}|null>(null);
  const [secret,  setSecret]  = useState("");
  useEffect(()=>{ setSecret(sessionStorage.getItem("bh_admin_secret")||""); },[]);

  useEffect(()=>{
    if(!secret) return;
    fetch("/api/admin/company",{headers:{"x-admin-secret":secret}})
      .then(r=>r.json()).then(j=>{ if(j.data) setData({...EMPTY,...j.data}); }).finally(()=>setLoading(false));
  },[secret]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/company",{method:"PUT",headers:{"Content-Type":"application/json","x-admin-secret":secret},body:JSON.stringify(data)});
    const j = await res.json();
    setMsg(res.ok?{ok:true,text:"Saved successfully."}:{ok:false,text:j.error||"Save failed."});
    setSaving(false);
  };

  const fi = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => (e.target.style.borderColor="rgba(212,167,61,.45)");
  const bl = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => (e.target.style.borderColor="rgba(255,255,255,.1)");

  return (
    <div style={{minHeight:"100vh",background:"#010408",color:"#EDE8DC",padding:"4rem 2rem"}}>
      <div style={{maxWidth:"700px",margin:"0 auto"}}>
        <Link href="/admin" style={{fontSize:".7rem",color:"#2E4060",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem",marginBottom:"1.5rem"}}
          onMouseEnter={e=>(e.currentTarget.style.color=G)} onMouseLeave={e=>(e.currentTarget.style.color="#2E4060")}>← Admin</Link>
        <p style={{fontFamily:"monospace",fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".5rem"}}>CMS · SETTINGS</p>
        <h1 style={{fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300",fontFamily:"'Cormorant Garant',serif",marginBottom:"2rem"}}>
          Company <span style={{fontStyle:"italic",color:G}}>Settings</span>
        </h1>
        {loading?<p style={{color:"#2E4060"}}>Loading…</p>:(
          <form onSubmit={save} style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              {FIELDS.map(f=>(
                <div key={f.key} style={{gridColumn:f.key==="address"||f.key==="name"?"1 / -1":"auto"}}>
                  <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".4rem"}}>{f.label}</label>
                  {f.key==="address"
                    ?<textarea value={data[f.key]} onChange={e=>setData(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} rows={2} style={{...inp,resize:"vertical"} as React.CSSProperties} onFocus={fi as never} onBlur={bl as never}/>
                    :<input type="text" value={data[f.key]} onChange={e=>setData(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inp} onFocus={fi} onBlur={bl}/>
                  }
                </div>
              ))}
            </div>
            {msg&&<div style={{padding:".7rem 1rem",background:msg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${msg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`,borderRadius:"8px",fontSize:".82rem",color:msg.ok?"#10B981":"#f87171"}}>{msg.text}</div>}
            <button type="submit" disabled={saving} style={{padding:".9rem",borderRadius:"8px",border:"none",background:`linear-gradient(135deg,${G},#9A7020)`,color:"#010408",fontWeight:"700",fontSize:".8rem",letterSpacing:".08em",textTransform:"uppercase",cursor:saving?"wait":"pointer",opacity:saving?.6:1}}>
              {saving?"Saving…":"Save Settings →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
