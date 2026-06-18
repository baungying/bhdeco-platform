"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import en from "@/i18n/en.json";
import zh from "@/i18n/zh.json";
import my from "@/i18n/my.json";
import th from "@/i18n/th.json";
type Lang="en"|"zh"|"my"|"th";
const LANGS={en,zh,my,th};

export default function Footer({ accent="#D4A73D" }: { accent?: string }) {
  const [t,setT]=useState(en);
  useEffect(()=>{
    try{const s=localStorage.getItem("bh_lang") as Lang;if(s&&LANGS[s])setT(LANGS[s]);}catch{}
    const fn=(e:Event)=>{const l=(e as CustomEvent).detail as Lang;setT(LANGS[l]);};
    window.addEventListener("bh_lang",fn);
    return ()=>window.removeEventListener("bh_lang",fn);
  },[]);

  const cols = [
    { title:"Platform", links:[["/",t.nav_home],["/ai-design",t.nav_ai],["/furniture",t.nav_furniture],["/products",t.nav_products],["/courses",t.nav_courses]] },
    { title:"Company", links:[["/pricing",t.nav_pricing],["/recharge",t.nav_recharge],["/about",t.nav_about],["/contact",t.nav_contact]] },
    { title:"Legal", links:[["/privacy","Privacy Policy"],["/terms","Terms of Service"],["/refund","Refund Policy"]] },
  ];

  const socials = [
    { label:"TikTok", href:"https://tiktok.com/@bhdecouai", icon:"🎵" },
    { label:"Facebook", href:"https://facebook.com/bhdecouai", icon:"📘" },
    { label:"YouTube", href:"https://youtube.com/@bhdecouai", icon:"▶" },
    { label:"WhatsApp", href:"https://wa.me/95XXXXXXXXX", icon:"💬" },
    { label:"Google Maps", href:"https://maps.google.com", icon:"📍" },
  ];

  return (
    <footer style={{ background:"#06080f",borderTop:`1px solid ${accent}12`,padding:"4.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth:"1280px",margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"3rem",marginBottom:"3.5rem" }} className="bh-footer-grid">
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:".65rem",marginBottom:"1rem" }}>
              <div style={{ width:"32px",height:"32px",background:`linear-gradient(135deg,${accent},#8B6820)`,borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"800",color:"#010408" }}>BH</div>
              <div className="fd" style={{ fontSize:"1.1rem",fontWeight:"600",letterSpacing:".04em" }}>DECO<span className="gt"> AI</span></div>
            </div>
            <p style={{ color:"#2E4060",fontSize:".85rem",lineHeight:"1.75",maxWidth:"240px",marginBottom:"1.5rem" }}>Transform Photo Into Reality. The complete AI interior design and furniture construction platform.</p>
            <div style={{ display:"flex",gap:".5rem",flexWrap:"wrap" }}>
              {socials.map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{ width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"7px",fontSize:".9rem",textDecoration:"none",transition:"all .2s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${accent}44`;(e.currentTarget as HTMLElement).style.background=`${accent}10`;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.07)";(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.04)";}}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {cols.map(col=>(
            <div key={col.title}>
              <p style={{ fontSize:".62rem",fontWeight:"700",letterSpacing:".18em",textTransform:"uppercase",color:accent,marginBottom:"1.1rem" }}>{col.title}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:".6rem" }}>
                {col.links.map(([href,label])=>(
                  <Link key={href} href={href} style={{ color:"#2E4060",textDecoration:"none",fontSize:".82rem",transition:"color .2s" }}
                    onMouseEnter={e=>(e.currentTarget.style.color=accent)}
                    onMouseLeave={e=>(e.currentTarget.style.color="#2E4060")}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem" }}>
          <p style={{ color:"#2E4060",fontSize:".75rem" }}>© {new Date().getFullYear()} BH DECO AI. All Rights Reserved.</p>
          <p style={{ color:"#2E4060",fontSize:".75rem" }}>Powered by AI · Designed for the Future · Mandalay, Myanmar</p>
        </div>
      </div>
      <style>{`@media(max-width:900px){.bh-footer-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){.bh-footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}
