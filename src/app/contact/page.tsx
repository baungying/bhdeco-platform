"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteImage from "@/components/SiteImage";

const socials=[
  {icon:"📘",label:"Facebook",handle:"@bhdecouai",href:"https://facebook.com/bhdecouai",color:"#4A9EFF"},
  {icon:"🎵",label:"TikTok",handle:"@bhdecouai",href:"https://tiktok.com/@bhdecouai",color:"#EDE8DC"},
  {icon:"▶",label:"YouTube",handle:"@bhdecouai",href:"https://youtube.com/@bhdecouai",color:"#E03A3A"},
  {icon:"💬",label:"WhatsApp",handle:"+95 XXX XXX XXX",href:"https://wa.me/95XXXXXXXXX",color:"#10B981"},
  {icon:"✈",label:"Telegram",handle:"@bhdecouai",href:"https://t.me/bhdecouai",color:"#4A9EFF"},
  {icon:"📧",label:"Email",handle:"support@bhdeco.ai",href:"mailto:support@bhdeco.ai",color:"#D4A73D"},
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:"",email:"",message:""});

  return (
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>

      {/* Hero */}
      <SiteImage imageKey="contactHero" asBackground style={{
        padding:"9rem 2rem 5rem",textAlign:"center",position:"relative",
        minHeight:"55vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(1,4,8,.92) 0%,rgba(1,4,8,.82) 50%,rgba(1,4,8,.96) 100%)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem"}}>CONTACT US</p>
          <h1 className="fd" style={{fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:"300",marginBottom:"1.25rem"}}>Get in <span style={{fontStyle:"italic",color:"#D4A73D"}}>Touch</span></h1>
          <p style={{color:"#7A8FA8",maxWidth:"480px",margin:"0 auto",lineHeight:"1.9"}}>Design consultations, product inquiries, AI platform support — we respond within 24 hours.</p>
        </div>
      </SiteImage>

      {/* Main */}
      <section style={{padding:"5rem 2rem 7rem",background:"#010408"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem"}} className="bh-contact-grid">
          <div>
            <h2 className="fd" style={{fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:"300",marginBottom:"2rem"}}>Contact <span style={{fontStyle:"italic",color:"#D4A73D"}}>Information</span></h2>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginBottom:"2.5rem"}}>
              {[["📍","Address","Mandalay, Myanmar"],["🕐","Hours","Mon–Sat: 9:00 AM – 6:00 PM"],["📞","Phone","+95 XXX XXX XXX"]].map(([icon,label,val])=>(
                <div key={label as string} style={{display:"flex",gap:"1rem",alignItems:"flex-start",padding:"1rem 1.25rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"10px"}}>
                  <span style={{fontSize:"1.2rem",flexShrink:0}}>{icon as string}</span>
                  <div><div style={{fontFamily:"monospace",fontSize:".6rem",color:"#2E4060",letterSpacing:".1em",textTransform:"uppercase",marginBottom:".2rem"}}>{label as string}</div><div style={{fontSize:".9rem",color:"#EDE8DC"}}>{val as string}</div></div>
                </div>
              ))}
            </div>

            {/* Map image */}
            <SiteImage imageKey="officeMap" asBackground style={{height:"180px",position:"relative",borderRadius:"12px",marginBottom:"2rem",border:"1px solid rgba(255,255,255,.07)"}}>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:"2rem"}}>📍</span>
              </div>
            </SiteImage>

            <h3 style={{fontSize:"1rem",fontWeight:"600",marginBottom:"1.25rem"}}>Find Us Online</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
              {socials.map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:".75rem",padding:".85rem 1rem",background:"rgba(255,255,255,.02)",border:`1px solid ${s.color}22`,borderRadius:"10px",textDecoration:"none",transition:"all .2s"}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=`${s.color}44`;el.style.background=`${s.color}08`;}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=`${s.color}22`;el.style.background="rgba(255,255,255,.02)";}}>
                  <span style={{fontSize:"1.1rem"}}>{s.icon}</span>
                  <div><div style={{fontSize:".82rem",fontWeight:"500",color:"#EDE8DC"}}>{s.label}</div><div style={{fontSize:".72rem",color:s.color,opacity:.8}}>{s.handle}</div></div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="fd" style={{fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:"300",marginBottom:"2rem"}}>Send Us a <span style={{fontStyle:"italic",color:"#D4A73D"}}>Message</span></h2>
            {sent?(
              <div style={{padding:"3rem",background:"rgba(16,185,129,.05)",border:"1px solid rgba(16,185,129,.2)",borderRadius:"12px",textAlign:"center"}}>
                <div style={{fontSize:"2rem",marginBottom:"1rem"}}>✓</div>
                <h3 style={{fontSize:"1.2rem",fontWeight:"600",color:"#10B981",marginBottom:".5rem"}}>Message Sent!</h3>
                <p style={{color:"#7A8FA8",fontSize:".9rem"}}>We'll respond within 24 hours.</p>
                <button onClick={()=>setSent(false)} style={{marginTop:"1.5rem",background:"none",border:"1px solid rgba(255,255,255,.12)",color:"#7A8FA8",padding:".6rem 1.4rem",borderRadius:"6px",cursor:"pointer",fontSize:".8rem"}}>Send Another</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                {(["Name","Email"] as const).map(label=>(
                  <div key={label}>
                    <label style={{display:"block",fontFamily:"monospace",fontSize:".6rem",color:"#2E4060",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".5rem"}}>{label}</label>
                    <input type={label==="Email"?"email":"text"} placeholder={label==="Email"?"your@email.com":"Your name"} value={form[label.toLowerCase() as "name"|"email"]} onChange={e=>setForm(p=>({...p,[label.toLowerCase()]:e.target.value}))}
                      style={{width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"8px",padding:".85rem 1rem",color:"#EDE8DC",fontSize:".9rem",outline:"none",fontFamily:"inherit",transition:"border-color .2s"}}
                      onFocus={e=>(e.target.style.borderColor="#D4A73D44")} onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.08)")}/>
                  </div>
                ))}
                <div>
                  <label style={{display:"block",fontFamily:"monospace",fontSize:".6rem",color:"#2E4060",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".5rem"}}>Message</label>
                  <textarea placeholder="How can we help you?" rows={5} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                    style={{width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"8px",padding:".85rem 1rem",color:"#EDE8DC",fontSize:".9rem",outline:"none",resize:"vertical",fontFamily:"inherit",transition:"border-color .2s"}}
                    onFocus={e=>(e.target.style.borderColor="#D4A73D44")} onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.08)")}/>
                </div>
                <button onClick={()=>setSent(true)} className="btn-gold" style={{justifyContent:"center"}}>Send Message →</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating call */}
      <a href="tel:+95XXXXXXXXX" style={{position:"fixed",bottom:"2rem",right:"2rem",zIndex:200,display:"flex",alignItems:"center",gap:".5rem",background:"linear-gradient(135deg,#D4A73D,#9A7020)",color:"#010408",fontWeight:"700",fontSize:".72rem",letterSpacing:".08em",textTransform:"uppercase",padding:".7rem 1.2rem",borderRadius:"100px",textDecoration:"none",boxShadow:"0 8px 30px rgba(212,167,61,.4)",animation:"bhFloat 3s ease-in-out infinite"}}>
        📞 CALL NOW
      </a>

      <Footer/>
      <style>{`.bh-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem}@media(max-width:768px){.bh-contact-grid{grid-template-columns:1fr!important}}@keyframes bhFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
