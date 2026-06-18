"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import en from "@/i18n/en.json";
import zh from "@/i18n/zh.json";
import my from "@/i18n/my.json";
import th from "@/i18n/th.json";
import { siteImages } from "@/config/siteImages";
import SiteImage from "@/components/SiteImage";

type Lang="en"|"zh"|"my"|"th";
type T=typeof en;
const LANGS:Record<Lang,T>={en,zh,my,th};
const ACCENT:Record<Lang,string>={en:"#D4A73D",zh:"#E03A3A",my:"#D4923D",th:"#9333EA"};
const ACCENT2:Record<Lang,string>={en:"#4A9EFF",zh:"#D4A73D",my:"#A07828",th:"#D4A73D"};

/* Scroll reveal */
function Reveal({children,delay=0,style={}}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties}){
  const ref=useRef<HTMLDivElement>(null);
  const [vis,setVis]=useState(true);  // start visible, animation is progressive enhancement
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0,rootMargin:"0px 0px -10px 0px"});
    obs.observe(el);return()=>obs.disconnect();
  },[]);
  return <div ref={ref} style={{opacity:1,transform:"none",...style}}>{children}</div>;
}

/* Floor section */
function Floor({id,num,name,accent,title,titleB,body,cta,ctaHref,badge,reverse,bg,children}:{
  id:string;num:string;name:string;accent:string;title:string;titleB:string;body:string;
  cta?:string;ctaHref?:string;badge?:string;reverse?:boolean;bg?:string;children?:React.ReactNode;
}){
  return(
    <section id={id} style={{background:bg||"transparent",minHeight:"80vh",display:"flex",alignItems:"center",padding:"7rem 2rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at ${reverse?"30%":"70%"} 50%,${accent}07 0%,transparent 65%)`,pointerEvents:"none"}}/>
      {/* animated scan line */}
      <div style={{position:"absolute",left:0,right:0,height:"1px",background:`linear-gradient(90deg,transparent,${accent}33,transparent)`,animation:"scanV 9s ease-in-out infinite",opacity:.6,pointerEvents:"none"}}/>
      <div style={{maxWidth:"1320px",margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"center",direction:reverse?"rtl":"ltr"}} className="bh-floor-grid">
        <Reveal style={{direction:"ltr"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:".7rem",marginBottom:"1.75rem"}}>
              <span className="mono" style={{fontSize:".56rem",color:accent,letterSpacing:".22em",background:`${accent}0f`,border:`1px solid ${accent}28`,borderRadius:"4px",padding:".28rem .75rem"}}>{num}</span>
              <div style={{flex:1,height:"1px",background:`linear-gradient(90deg,${accent}44,transparent)`}}/>
              <span className="mono" style={{fontSize:".52rem",color:"#2E4060",letterSpacing:".16em"}}>{name}</span>
            </div>
            {badge&&<div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:`${accent}0e`,border:`1px solid ${accent}28`,borderRadius:"100px",padding:".25rem .8rem",marginBottom:"1.25rem"}}><div style={{width:"5px",height:"5px",borderRadius:"50%",background:accent,animation:"bhBlink 2s infinite"}}/><span className="mono" style={{fontSize:".58rem",color:accent,letterSpacing:".1em",textTransform:"uppercase"}}>{badge}</span></div>}
            <h2 className="fd" style={{fontSize:"clamp(2.4rem,4.8vw,4.4rem)",fontWeight:"300",color:"#EDE8DC",letterSpacing:"-.025em",lineHeight:"1.07",marginBottom:"1.25rem"}}>
              {title}<br/><span style={{fontStyle:"italic",background:`linear-gradient(135deg,${accent},${accent}99)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{titleB}</span>
            </h2>
            <p style={{color:"#7A8FA8",fontSize:".97rem",lineHeight:"1.88",maxWidth:"440px",marginBottom:"2.25rem"}}>{body}</p>
            {cta&&ctaHref&&(
              ctaHref.startsWith("http")
                ?<a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{background:`linear-gradient(135deg,${accent},#9A7020)`}}>{cta} →</a>
                :ctaHref.startsWith("mailto:")
                  ?<a href={ctaHref} className="btn-gold" style={{background:`linear-gradient(135deg,${accent},#9A7020)`}}>{cta} →</a>
                  :<Link href={ctaHref} className="btn-gold" style={{background:`linear-gradient(135deg,${accent},#9A7020)`}}>{cta} →</Link>
            )}
          </div>
        </Reveal>
        <Reveal delay={.15} style={{direction:"ltr"}}>
          <div>{children}</div>
        </Reveal>
      </div>
      <style>{`.bh-floor-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}@media(max-width:900px){.bh-floor-grid{grid-template-columns:1fr!important;gap:2.5rem!important;direction:ltr!important}}`}</style>
    </section>
  );
}

/* ── Visual panels ── */
function PanelLiving({accent,imgSrc}:{accent:string;imgSrc?:string}){
  return(
    <div style={{borderRadius:"16px",overflow:"hidden",background:"linear-gradient(155deg,#0d1e34 0%,#162840 60%,#1a3050 100%)",border:`1px solid ${accent}22`,boxShadow:`0 30px 80px rgba(0,0,0,.5)`,minHeight:"340px",position:"relative"}}>
      {imgSrc&&<img src={imgSrc} alt="Living Room" onError={e=>(e.currentTarget.style.display="none")} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",borderRadius:"16px",opacity:.65}}/>}
      {/* Room elements */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"18%",background:"linear-gradient(180deg,#091422 0%,#0f1e2e 100%)"}}/>
      <div style={{position:"absolute",top:0,left:0,bottom:0,width:"36%",background:"linear-gradient(90deg,#0d1928 0%,#142435 100%)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(180deg,#1a3248 0%,#0c1a28 100%)"}}/>
      <div style={{position:"absolute",top:"22%",right:"8%",width:"22%",height:"44%",background:"linear-gradient(180deg,rgba(74,158,255,.18) 0%,rgba(74,158,255,.06) 100%)",border:"1px solid rgba(74,158,255,.2)",borderRadius:"2px"}}/>
      {/* sofa */}
      <div style={{position:"absolute",bottom:"29%",left:"22%",right:"12%",height:"25%"}}>
        <div style={{position:"absolute",top:"28%",left:0,right:0,bottom:0,background:"linear-gradient(180deg,#203d5a,#182e44)",borderRadius:"6px 6px 3px 3px",boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"30%",background:"#28496a",borderRadius:"6px 6px 0 0"}}/>
          {[["8%",accent],["37%","#4A9EFF"],["66%",accent]].map(([l,c],i)=><div key={i} style={{position:"absolute",top:"32%",left:l,width:"24%",bottom:"10%",background:`${c}cc`,borderRadius:"4px"}}/>)}
        </div>
        <div style={{position:"absolute",top:0,left:"-2%",right:"-2%",height:"30%",background:"#264460",borderRadius:"5px"}}/>
      </div>
      <div style={{position:"absolute",bottom:"17%",left:"28%",right:"18%",height:"11%",background:"linear-gradient(180deg,#1a2c3e,#0e1e2e)",borderRadius:"4px",boxShadow:"0 4px 16px rgba(0,0,0,.5)"}}/>
      <div style={{position:"absolute",bottom:"28%",left:"14%",width:"3px",height:"40%",background:"linear-gradient(180deg,#3a4e60,#1e2e3c)"}}>
        <div style={{position:"absolute",top:"-2px",left:"-12px",width:"26px",height:"13px",borderRadius:"50%",background:`radial-gradient(ellipse,${accent}ee 0%,${accent}44 60%,transparent 100%)`,boxShadow:`0 0 20px ${accent}88`}}/>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:`radial-gradient(ellipse at 25% 100%,${accent}14 0%,transparent 65%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"8px",right:"12px",fontFamily:"monospace",fontSize:"9px",color:`${accent}99`,letterSpacing:"2px"}}>LIVING ROOM</div>
    </div>
  );
}

function PanelMoodboard({accent,imgSrc}:{accent:string;imgSrc?:string}){
  return(
    <div style={{borderRadius:"16px",overflow:"hidden",background:"#06030d",border:"1px solid rgba(139,92,246,.2)",boxShadow:"0 30px 80px rgba(0,0,0,.5)",minHeight:"340px",padding:"1.25rem",position:"relative"}}>
      {imgSrc&&<img src={imgSrc} alt="Reference Lab" onError={e=>(e.currentTarget.style.display="none")} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.4,borderRadius:"16px"}}/>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:".65rem",height:"calc(100% - 3.5rem)"}}>
        {[
          {bg:"linear-gradient(135deg,#120828,#1a1030)",content:<div style={{position:"absolute",inset:"20%",borderRadius:"50%",border:"1px solid rgba(139,92,246,.3)",background:"rgba(139,92,246,.12)"}}/>},
          {bg:"linear-gradient(135deg,#100620,#180a28)",content:<div style={{position:"absolute",bottom:"20%",left:"10%",right:"10%",height:"3px",background:"linear-gradient(90deg,#8B5CF6,#4A9EFF)",borderRadius:"2px"}}/>},
          {bg:"linear-gradient(135deg,#0a0818,#12101e)",content:<div style={{position:"absolute",inset:"15%",border:"1px solid rgba(139,92,246,.25)",borderRadius:"4px"}}/>},
          {bg:"linear-gradient(135deg,#0d0520,#150828)",content:<><div style={{position:"absolute",bottom:"28%",left:"15%",right:"15%",height:"1px",background:`${accent}44`}}/><div style={{position:"absolute",bottom:"45%",left:"22%",right:"22%",height:"1px",background:"rgba(139,92,246,.3)"}}/></>},
        ].map((c,i)=><div key={i} style={{position:"relative",borderRadius:"10px",overflow:"hidden",background:c.bg,border:"1px solid rgba(255,255,255,.06)"}}>{c.content}</div>)}
      </div>
      <div style={{display:"flex",gap:".4rem",height:"8px",marginTop:".65rem"}}>
        {[accent,"#8B5CF6","#4A9EFF","#10B981","#F59E0B"].map((c,i)=><div key={i} style={{flex:1,background:c,borderRadius:"2px",opacity:.75}}/>)}
      </div>
      <div style={{position:"absolute",top:"1rem",left:"50%",transform:"translateX(-50%)",fontFamily:"monospace",fontSize:"9px",color:"rgba(139,92,246,.7)",letterSpacing:"2px",whiteSpace:"nowrap"}}>AI ANALYZING...</div>
    </div>
  );
}

function PanelBeforeAfter({accent}:{accent:string}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
      <div style={{borderRadius:"12px",overflow:"hidden",border:"1px solid rgba(74,158,255,.2)",background:"#06121e"}}>
        <div style={{padding:".55rem 1rem",borderBottom:"1px solid rgba(74,158,255,.1)",display:"flex",justifyContent:"space-between"}}>
          <span className="mono" style={{fontSize:".58rem",color:"#4A9EFF",letterSpacing:".15em"}}>BEFORE</span>
          <span style={{fontSize:".62rem",color:"#2E4060"}}>Empty Room</span>
        </div>
        <div style={{height:"110px",background:"linear-gradient(135deg,#0a1828,#102035)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:"55%",height:"50%",border:"1px solid rgba(255,255,255,.07)",borderRadius:"4px"}}/>
        </div>
      </div>
      <div style={{textAlign:"center",color:accent,fontSize:"1.4rem"}}>↓</div>
      <div style={{borderRadius:"12px",overflow:"hidden",border:`1px solid ${accent}35`,background:"#08121e",boxShadow:`0 0 30px ${accent}08`}}>
        <div style={{padding:".55rem 1rem",borderBottom:`1px solid ${accent}15`,display:"flex",justifyContent:"space-between"}}>
          <span className="mono" style={{fontSize:".58rem",color:accent,letterSpacing:".15em"}}>AI RESULT</span>
          <div style={{display:"flex",alignItems:"center",gap:".3rem"}}><div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/><span style={{fontSize:".6rem",color:"#22c55e"}}>Generated</span></div>
        </div>
        <PanelLiving accent={accent} imgSrc={siteImages.aiDesignPanel}/>
      </div>
    </div>
  );
}

function PanelFurniture({accent,imgSrc}:{accent:string;imgSrc?:string}){
  return(
    <div style={{borderRadius:"16px",overflow:"hidden",background:"#010610",border:`1px solid ${accent}22`,minHeight:"340px",position:"relative"}}>
      {imgSrc&&<img src={imgSrc} alt="Furniture" onError={e=>(e.currentTarget.style.display="none")} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.35,borderRadius:"16px"}}/>}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(30,109,213,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(30,109,213,.1) 1px,transparent 1px)`,backgroundSize:"22px 22px"}}/>
      {/* Cabinet */}
      <div style={{position:"absolute",top:"12%",left:"10%",right:"10%",bottom:"28%",border:`1px solid ${accent}66`,borderRadius:"2px",background:`${accent}06`}}>
        {["33%","66%"].map((t,i)=><div key={i} style={{position:"absolute",top:t,left:0,right:0,height:"1px",background:`${accent}44`,borderTop:`1px dashed ${accent}33`}}/>)}
        <div style={{position:"absolute",top:0,bottom:0,left:"50%",width:"1px",borderLeft:`1px dashed ${accent}28`}}/>
        {/* LED strip */}
        <div style={{position:"absolute",top:"2%",left:"2%",right:"2%",height:"3px",background:`linear-gradient(90deg,${accent}88,#4A9EFF88,${accent}88)`,boxShadow:`0 0 8px ${accent}55`}}/>
      </div>
      {/* Dim lines */}
      <div style={{position:"absolute",left:"5%",top:"12%",bottom:"28%",width:"1px",borderLeft:`1px solid ${accent}55`}}>
        <div style={{position:"absolute",top:"-4px",left:"-4px",width:"8px",height:"8px",borderTop:`2px solid ${accent}`,borderRight:`2px solid ${accent}`,transform:"rotate(-45deg)"}}/>
        <div style={{position:"absolute",bottom:"-4px",left:"-4px",width:"8px",height:"8px",borderBottom:`2px solid ${accent}`,borderLeft:`2px solid ${accent}`,transform:"rotate(-45deg)"}}/>
        <div style={{position:"absolute",top:"50%",left:"-24px",transform:"translateY(-50%) rotate(-90deg)",fontFamily:"monospace",fontSize:"7px",color:`${accent}99`,whiteSpace:"nowrap"}}>850mm</div>
      </div>
      <div style={{position:"absolute",bottom:"20%",left:"10%",right:"10%",height:"1px",borderBottom:`1px solid ${accent}55`}}>
        <div style={{position:"absolute",bottom:"4px",left:"50%",transform:"translateX(-50%)",fontFamily:"monospace",fontSize:"7px",color:`${accent}99`,whiteSpace:"nowrap"}}>← 1,200mm →</div>
      </div>
      {/* Types row */}
      <div style={{position:"absolute",bottom:"5%",left:"10%",right:"10%",display:"flex",gap:".5rem",flexWrap:"wrap"}}>
        {["Wardrobe","Kitchen","TV Unit","Vanity"].map(n=><span key={n} style={{fontFamily:"monospace",fontSize:"7px",color:`${accent}99`,background:`${accent}0a`,border:`1px solid ${accent}22`,borderRadius:"3px",padding:".15rem .45rem"}}>{n}</span>)}
      </div>
      <div style={{position:"absolute",bottom:"5%",right:"12%",fontFamily:"monospace",fontSize:"9px",color:`${accent}99`,letterSpacing:"2px"}}>FURNITURE AI</div>
    </div>
  );
}

function PanelBlueprint({accent,imgSrc}:{accent:string;imgSrc?:string}){
  return(
    <div style={{borderRadius:"16px",overflow:"hidden",background:"#00050d",border:"1px solid rgba(0,212,255,.18)",minHeight:"340px",position:"relative",padding:"1.25rem"}}>
      {imgSrc&&<img src={imgSrc} alt="Blueprint" onError={e=>(e.currentTarget.style.display="none")} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.25,borderRadius:"16px"}}/>}
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,212,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.09) 1px,transparent 1px)",backgroundSize:"18px 18px"}}/>
      {/* animated scan line */}
      <div style={{position:"absolute",left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,212,255,.6),transparent)",animation:"scanV 5s ease-in-out infinite",pointerEvents:"none"}}/>
      <svg viewBox="0 0 320 270" fill="none" style={{width:"100%",height:"auto",position:"relative",zIndex:1}}>
        <rect x="18" y="18" width="112" height="88" fill="rgba(0,212,255,.04)" stroke="rgba(0,212,255,.55)" strokeWidth="1.2"/>
        <rect x="130" y="18" width="172" height="156" fill={`${accent}06`} stroke={accent} strokeWidth="1.2"/>
        <rect x="18" y="106" width="112" height="68" fill="rgba(0,212,255,.03)" stroke="rgba(0,212,255,.42)" strokeWidth="1"/>
        <rect x="18" y="174" width="284" height="78" fill="rgba(0,212,255,.03)" stroke="rgba(0,212,255,.38)" strokeWidth="1.2"/>
        <line x1="130" y1="18" x2="130" y2="252" stroke="#1E6DD5" strokeWidth="1.5" opacity=".55"/>
        <line x1="18" y1="252" x2="302" y2="252" stroke={accent} strokeWidth="1.8" opacity=".7"/>
        <text x="74" y="66" fontSize="10" fill="rgba(0,212,255,.7)" fontFamily="monospace" textAnchor="middle">BEDROOM</text>
        <text x="216" y="100" fontSize="10" fill={accent} fontFamily="monospace" textAnchor="middle" opacity=".85">LIVING ROOM</text>
        <text x="74" y="144" fontSize="9" fill="rgba(0,212,255,.6)" fontFamily="monospace" textAnchor="middle">BATHROOM</text>
        <text x="160" y="218" fontSize="10" fill="rgba(0,212,255,.65)" fontFamily="monospace" textAnchor="middle">MASTER SUITE</text>
        <circle cx="292" cy="36" r="16" fill="none" stroke="rgba(0,212,255,.35)" strokeWidth=".8"/>
        <polygon points="292,22 289,38 292,34 295,38" fill={accent} opacity=".7"/>
        <text x="292" y="50" fontSize="7" fill="rgba(0,212,255,.55)" fontFamily="monospace" textAnchor="middle">N</text>
      </svg>
    </div>
  );
}

function PanelCore({accent,accent2}:{accent:string;accent2:string}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"300px"}}>
      <div style={{position:"relative",width:"280px",height:"280px"}}>
        <svg viewBox="0 0 280 280" fill="none" style={{width:"100%",height:"100%",position:"absolute",inset:0}}>
          <defs><radialGradient id="cg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={accent} stopOpacity=".22"/><stop offset="100%" stopColor={accent} stopOpacity="0"/></radialGradient></defs>
          <circle cx="140" cy="140" r="135" fill="url(#cg)"/>
          {[112,90,68,46,26].map((r,i)=>(
            <circle key={i} cx="140" cy="140" r={r} fill="none"
              stroke={i%2===0?`${accent}20`:`rgba(30,109,213,.16)`} strokeWidth={i===0?"1.5":".9"}
              strokeDasharray={i%2===0?"8 5":"5 7"}
              style={{animation:`${i%2===0?"bhSpin1":"bhSpin2"} ${14+i*9}s linear infinite`,transformOrigin:"140px 140px"}}/>
          ))}
          {([
            [186,140,252,140],[179.8372,163,236.9948,196],[163,179.8372,196,236.9948],
            [140,186,140,252],[117,179.8372,84,236.9948],[100.1628,163,43.0052,196],
            [94,140,28,140],[100.1628,117,43.0052,84],[117,100.1628,84,43.0052],
            [140,94,140,28],[163,100.1628,196,43.0052],[179.8372,117,236.9948,84],
          ] as [number,number,number,number][]).map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i%3===0?`${accent}26`:i%3===1?"rgba(30,109,213,.18)":"rgba(0,212,255,.13)"}
              strokeWidth=".7"/>
          ))}
          {([
            [252,140],[196,236.9948],[84,236.9948],[28,140],[84,43.0052],[196,43.0052],
          ] as [number,number][]).map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r={i%2===0?4:3}
              fill={i%2===0?accent:"#1E6DD5"} opacity=".85"
              style={{animation:`bhBlink ${1.5+i*.3}s ease-in-out infinite`,animationDelay:`${i*.2}s`}}/>
          ))}
          <circle cx="140" cy="140" r="38" fill="rgba(1,4,8,.95)" stroke={accent} strokeWidth="1.8"/>
          <circle cx="140" cy="140" r="28" fill="rgba(6,12,28,.95)" stroke="rgba(30,109,213,.4)" strokeWidth="1"/>
          <circle cx="140" cy="140" r="10" fill={accent} opacity=".9"/>
          <circle cx="140" cy="140" r="5" fill="white" opacity=".9"/>
          <text x="140" y="135" textAnchor="middle" fontSize="11" fontWeight="800" fill={accent} fontFamily="Inter">BH</text>
          <text x="140" y="150" textAnchor="middle" fontSize="7" fill={`${accent}88`} fontFamily="Inter" letterSpacing=".18em">DECO AI</text>
          <circle r="5" fill="#00D4FF" style={{animation:"bhOrbit 6s linear infinite",transformOrigin:"140px 140px",["--r" as string]:"68px"} as React.CSSProperties}/>
          <circle r="4" fill={accent} style={{animation:"bhOrbit 10s linear infinite reverse",transformOrigin:"140px 140px",["--r" as string]:"90px"} as React.CSSProperties}/>
          <circle r="3" fill={accent2} style={{animation:"bhOrbit 15s linear infinite",transformOrigin:"140px 140px",["--r" as string]:"112px"} as React.CSSProperties}/>
        </svg>
      </div>
    </div>
  );
}

/* ── Process steps ── */
function ProcessSteps({steps,accent}:{steps:string[];accent:string}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:".5rem",padding:"1.5rem",background:"rgba(255,255,255,.02)",border:`1px solid ${accent}15`,borderRadius:"12px"}}>
      {steps.map((s,i)=>(
        <div key={i}>
          <div style={{display:"flex",alignItems:"center",gap:".75rem",padding:".6rem"}}>
            <div style={{width:"24px",height:"24px",borderRadius:"6px",background:`${accent}14`,border:`1px solid ${accent}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span className="mono" style={{fontSize:".6rem",color:accent}}>{String(i+1).padStart(2,"0")}</span>
            </div>
            <span style={{color:"#EDE8DC",fontSize:".88rem"}}>{s}</span>
          </div>
          {i<steps.length-1&&<div style={{marginLeft:"12px",width:"1px",height:"12px",background:`linear-gradient(180deg,${accent}44,transparent)`,marginTop:".1rem"}}/>}
        </div>
      ))}
    </div>
  );
}

/* ── Main ── */
export default function Home(){
  const [scrollY,setScrollY]=useState(0);
  const [floor,setFloor]=useState(0);
  const [lang,setLang]=useState<Lang>("en");
  const t=LANGS[lang];
  const accent=ACCENT[lang];
  const accent2=ACCENT2[lang];

  useEffect(()=>{
    try{const s=localStorage.getItem("bh_lang") as Lang;if(s&&LANGS[s])setLang(s);}catch{}
    const fn=(e:Event)=>{const l=(e as CustomEvent).detail as Lang;setLang(l);};
    window.addEventListener("bh_lang",fn);
    return()=>window.removeEventListener("bh_lang",fn);
  },[]);

  useEffect(()=>{
    const fn=()=>{
      const y=window.scrollY;setScrollY(y);
      const vh=window.innerHeight;
      if(y<vh*.75)setFloor(0);
      else if(y<vh*1.9)setFloor(1);
      else if(y<vh*3.1)setFloor(2);
      else if(y<vh*4.3)setFloor(3);
      else if(y<vh*5.5)setFloor(4);
      else setFloor(5);
    };
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const floorDots=["GF","2F","3F","4F","5F","TOP"];
  const heroSubs=[t.hero_sub_1,t.hero_sub_2,t.hero_sub_3,t.hero_sub_4,t.hero_sub_5];

  return(
    <div style={{background:"#010408",color:"#EDE8DC",overflowX:"hidden"}}>
      <Navbar accent={accent}/>

      {/* Floor indicator */}
      <div style={{position:"fixed",right:"1.5rem",top:"50%",transform:"translateY(-50%)",zIndex:200,display:"flex",flexDirection:"column",gap:".5rem"}} className="bh-fdots">
        {floorDots.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:".4rem",justifyContent:"flex-end"}}>
            <span className="mono" style={{fontSize:".48rem",letterSpacing:".1em",color:floor===i?accent:"#2E4060",transition:"color .4s"}}>{f}</span>
            <div style={{height:"2px",borderRadius:"2px",transition:"all .45s cubic-bezier(.4,0,.2,1)",width:floor===i?"28px":"7px",background:floor===i?accent:"#2E4060",boxShadow:floor===i?`0 0 8px ${accent}`:"none"}}/>
          </div>
        ))}
      </div>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",padding:"8rem 2rem 5rem",
        backgroundImage:"url('/images/home/hero.jpg')",
        backgroundSize:"cover",backgroundPosition:"center right",backgroundRepeat:"no-repeat",
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(100deg,rgba(1,4,8,.98) 0%,rgba(1,4,8,.95) 24%,rgba(1,4,8,.78) 42%,rgba(1,4,8,.38) 60%,rgba(1,4,8,.1) 78%,transparent 100%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"200px",background:"linear-gradient(to top,#010408,transparent)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"100px",background:"linear-gradient(to bottom,rgba(1,4,8,.5),transparent)",pointerEvents:"none"}}/>
        {/* Particles */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
          {Array.from({length:16},(_,i)=>(
            <div key={i} style={{position:"absolute",left:`${6+i*5.8}%`,bottom:`${-5+(i%4)*12}%`,width:i%3===0?"3px":"2px",height:i%3===0?"3px":"2px",borderRadius:"50%",background:i%2===0?accent:"#4A9EFF",opacity:.35,animation:`bhRise ${8+i*1.4}s ease-in ${i*.65}s infinite`}}/>
          ))}
        </div>

        <div style={{maxWidth:"1380px",margin:"0 auto",width:"100%",position:"relative",zIndex:2}}>
          <div style={{maxWidth:"580px"}}>
            <div style={{display:"flex",alignItems:"center",gap:".65rem",marginBottom:"2rem",animation:"bhFadeUp .7s ease both"}}>
              <div style={{width:"28px",height:"1px",background:`linear-gradient(90deg,transparent,${accent})`}}/>
              <span className="mono" style={{fontSize:".56rem",color:accent,letterSpacing:".22em"}}>{t.hq_label}</span>
              <div style={{flex:1,height:"1px",background:`linear-gradient(90deg,${accent}44,transparent)`}}/>
            </div>
            <div style={{animation:"bhFadeUp .7s .12s ease both"}}>
              <div className="fd" style={{fontSize:"clamp(.9rem,1.8vw,1.2rem)",fontWeight:"200",color:accent,letterSpacing:".22em",textTransform:"uppercase",lineHeight:1,marginBottom:".5rem"}}>{t.hero_title_1}</div>
              <div className="fd" style={{fontSize:"clamp(3rem,8vw,7.2rem)",fontWeight:"200",color:"#EDE8DC",letterSpacing:"-.04em",lineHeight:.9,marginBottom:"-.08em"}}>{t.hero_title_2}</div>
              <div className="fd" style={{fontSize:"clamp(3rem,8vw,7.2rem)",fontWeight:"600",fontStyle:"italic",lineHeight:.92,marginBottom:"1.75rem",background:`linear-gradient(135deg,${accent} 0%,${accent2} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{t.hero_title_3}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:".38rem",marginBottom:"2.75rem",animation:"bhFadeUp .7s .25s ease both"}}>
              {heroSubs.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:".6rem"}}>
                  <div style={{width:"16px",height:"1px",background:accent,opacity:.5,flexShrink:0}}/>
                  <span style={{fontSize:".88rem",color:"#7A8FA8",fontWeight:"300"}}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:".85rem",flexWrap:"wrap",marginBottom:"3.5rem",animation:"bhFadeUp .7s .38s ease both"}}>
              <Link href="https://bh-deco-ai.vercel.app"  className="btn-gold" style={{background:`linear-gradient(135deg,${accent},#9A7020)`,fontSize:".8rem",padding:"1rem 2.4rem"}}>{t.cta_design} →</Link>
            </div>
            <div style={{display:"flex",gap:"2.5rem",flexWrap:"wrap",animation:"bhFadeUp .7s .5s ease both"}}>
              {[["50K+",t.stat_designs],["40+",t.stat_styles],["4.9★",t.stat_rating]].map(([v,l])=>(
                <div key={l as string}>
                  <div className="fd" style={{fontSize:"1.8rem",fontWeight:"600",lineHeight:1,background:`linear-gradient(135deg,${accent},${accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{v as string}</div>
                  <div className="mono" style={{fontSize:".56rem",color:"#2E4060",letterSpacing:".1em",textTransform:"uppercase",marginTop:".3rem"}}>{l as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:"2.5rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:".4rem",opacity:Math.max(0,1-scrollY/120),transition:"opacity .3s",zIndex:3}}>
          <span className="mono" style={{fontSize:".5rem",color:"#2E4060",letterSpacing:".22em"}}>SCROLL · ENTER HQ</span>
          <div style={{width:"1px",height:"40px",background:`linear-gradient(to bottom,${accent}66,transparent)`,animation:"bhFloat 2s ease-in-out infinite"}}/>
        </div>
      </section>


      {/* ═══ HOW BH DECO AI WORKS ═══ */}
      <section style={{background:"#010408",padding:"7rem 2rem 6rem",borderTop:"1px solid rgba(255,255,255,.04)"}}>
        <div style={{maxWidth:"1160px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"5rem"}}>
            <p className="mono" style={{fontSize:".6rem",color:accent,letterSpacing:".22em",marginBottom:".75rem"}}>THE PROCESS</p>
            <h2 className="fd" style={{fontSize:"clamp(2.2rem,4.5vw,3.8rem)",fontWeight:"300",color:"#EDE8DC",lineHeight:1.1}}>
              How BH DECO AI <span style={{fontStyle:"italic",color:accent}}>Works</span>
            </h2>
            <p style={{color:"#7A8FA8",maxWidth:"500px",margin:"1.25rem auto 0",fontSize:".95rem",lineHeight:1.85}}>
              From a single photo to a real built project — one connected AI workflow.
            </p>
          </div>

          {/* Steps row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"0",position:"relative"}} className="bh-how-grid">
            <div style={{position:"absolute",top:"51px",left:"calc(100%/12)",right:"calc(100%/12)",height:"1px",background:`linear-gradient(90deg,transparent,${accent}28,${accent}55,${accent}55,${accent}28,transparent)`,zIndex:0}} className="bh-how-line"/>
            {([
              {step:"01",icon:"📸",label:"Upload Photo",       desc:"Any room. Any angle."},
              {step:"02",icon:"🧠",label:"AI Understands",     desc:"Layout, light, dimensions."},
              {step:"03",icon:"🎨",label:"AI Interior Design", desc:"Photorealistic concepts."},
              {step:"04",icon:"🪑",label:"Furniture Engine",   desc:"Production blueprints."},
              {step:"05",icon:"📦",label:"3D Models",          desc:"SketchUp & export files."},
              {step:"06",icon:"🏡",label:"Real Project",       desc:"BH builds it for real."},
            ] as {step:string;icon:string;label:string;desc:string}[]).map(({step,icon,label,desc},i)=>(
              <div key={step} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"0 .5rem",position:"relative",zIndex:1}}>
                <div style={{
                  width:"102px",height:"102px",borderRadius:"50%",flexShrink:0,
                  background:i===0||i===5?`linear-gradient(135deg,${accent},#8B6820)`:"rgba(255,255,255,.03)",
                  border:i===0||i===5?"none":`1px solid ${accent}${i===2||i===3?"66":"2e"}`,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  marginBottom:"1.5rem",
                  boxShadow:i===0||i===5?`0 0 36px ${accent}33`:"none",
                  transition:"all .3s",
                }}>
                  <span style={{fontSize:"1.65rem",marginBottom:".15rem"}}>{icon}</span>
                  <span className="mono" style={{fontSize:".46rem",color:i===0||i===5?"#010408":"#2E4060",letterSpacing:".1em"}}>{step}</span>
                </div>
                <p style={{fontSize:".8rem",fontWeight:"600",color:"#EDE8DC",marginBottom:".35rem",lineHeight:1.3}}>{label}</p>
                <p style={{fontSize:".7rem",color:"#7A8FA8",lineHeight:1.6}}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{textAlign:"center",marginTop:"5rem"}}>
            <Link href="https://bh-deco-ai.vercel.app" target="_blank" rel="noopener noreferrer"
              className="btn-gold" style={{background:`linear-gradient(135deg,${accent},#9A7020)`,fontSize:".8rem",padding:"1rem 2.5rem"}}>
              Start Your Project →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scan divider ── */}
      {[accent,"#8B5CF6","#4A9EFF",accent,"#00D4FF",accent].map((c,i)=>(
        <div key={i} id={["","f2","f3","f4","f5","top"][i]||""} style={{height:"1px",background:`linear-gradient(90deg,transparent,${c}44,transparent)`,margin:0}}/>
      ))}

      {/* ═══ GF ═══ */}
      <section style={{background:"linear-gradient(180deg,#010408 0%,#06111e 40%,#06111e 60%,#010408 100%)"}}>
        <Floor id="gf" num="GF" name="GROUND FLOOR" accent={accent}
          title={t.gf_title} titleB={t.gf_accent} body={t.gf_body} cta={t.cta_design} ctaHref="https://bh-deco-ai.vercel.app" >
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div style={{width:"100%",height:"420px",borderRadius:"16px",overflow:"hidden",border:`1px solid ${accent}22`,backgroundImage:"url('/images/home/ai-result.jpg')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#0d1e34"}}/>
            <ProcessSteps steps={["Room Photo","Reference Image","Prompt","AI Interior Result"]} accent={accent}/>
          </div>
        </Floor>
      </section>

      <div style={{height:"1px",background:`linear-gradient(90deg,transparent,#8B5CF644,transparent)`}}/>

      {/* ═══ 2F ═══ */}
      <section style={{background:"linear-gradient(180deg,#010408 0%,#08031a 40%,#08031a 60%,#010408 100%)"}}>
        <Floor id="f2" num="2F" name="REFERENCE LAB" accent="#8B5CF6"
          title={t.f2_title} titleB={t.f2_accent} body={t.f2_body} cta={t.cta_design} ctaHref="https://bh-deco-ai.vercel.app" >
          <div style={{width:"100%",height:"420px",borderRadius:"16px",overflow:"hidden",backgroundImage:"url('/images/home/reference-lab.jpg')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#06030d"}}/>
        </Floor>
      </section>

      <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(74,158,255,.44),transparent)"}}/>

      {/* ═══ 3F ═══ */}
      <section style={{background:"linear-gradient(180deg,#010408 0%,#051020 40%,#051020 60%,#010408 100%)"}}>
        <Floor id="f3" num="3F" name="AI STUDIO" accent="#4A9EFF"
          title={t.f3_title} titleB={t.f3_accent} body={t.f3_body} cta={t.cta_design} ctaHref="https://bh-deco-ai.vercel.app"  >
          <div style={{width:"100%",height:"420px",borderRadius:"16px",overflow:"hidden",backgroundImage:"url('/images/home/ai-result.jpg')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#0a1828"}}/>
        </Floor>
      </section>

      <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${accent}44,transparent)`}}/>

      {/* ═══ 4F ═══ */}
      <section style={{background:"linear-gradient(180deg,#010408 0%,#040e08 40%,#040e08 60%,#010408 100%)"}}>
        <Floor id="f4" num="4F" name="FURNITURE FACTORY" accent={accent}
          title={t.f4_title} titleB={t.f4_accent} body={t.f4_body} reverse>
          <div style={{width:"100%",height:"420px",borderRadius:"16px",overflow:"hidden",backgroundImage:"url('/images/home/furniture-factory.jpg')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#010610"}}/>
        </Floor>
      </section>

      <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,212,255,.44),transparent)"}}/>

      {/* ═══ 5F ═══ */}
      <section style={{background:"linear-gradient(180deg,#010408 0%,#020910 40%,#020910 60%,#010408 100%)"}}>
        <Floor id="f5" num="5F" name="BLUEPRINT CENTER" accent="#00D4FF"
          title={t.f5_title} titleB={t.f5_accent} body={t.f5_body} cta="View Pricing" ctaHref="/pricing">
          <div style={{width:"100%",height:"420px",borderRadius:"16px",overflow:"hidden",backgroundImage:"url('/images/home/blueprint-center.jpg')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#00050d"}}/>
        </Floor>
      </section>

      <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${accent}44,transparent)`}}/>

      {/* ═══ TOP ═══ */}
      <section id="top" style={{background:"linear-gradient(180deg,#010408 0%,#020817 100%)",minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"8rem 2rem",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"600px",height:"600px",background:`radial-gradient(ellipse,${accent}08 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <Reveal>
          <div style={{maxWidth:"760px",margin:"0 auto",position:"relative",zIndex:1}}>
            <div className="mono" style={{fontSize:".56rem",color:accent,letterSpacing:".22em",marginBottom:"1.5rem"}}>{t.top_label}</div>
            <PanelCore accent={accent} accent2={accent2}/>
            <h2 className="fd" style={{fontSize:"clamp(2.5rem,6vw,5rem)",fontWeight:"300",color:"#EDE8DC",letterSpacing:"-.03em",lineHeight:"1.06",margin:"2rem 0 1.25rem"}}>
              {t.top_title}<br/><span style={{fontStyle:"italic",background:`linear-gradient(135deg,${accent},${accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{t.top_accent}</span>
            </h2>
            <p style={{color:"#7A8FA8",fontSize:"1rem",lineHeight:"1.88",maxWidth:"520px",margin:"0 auto 2.5rem"}}>{t.top_body}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",flexWrap:"wrap",marginBottom:"3rem"}}>
              {[t.journey_1,t.journey_2,t.journey_3,t.journey_4,t.journey_5,t.journey_6].map((s,i,arr)=>(
                <span key={i}>
                  <span style={{padding:".32rem .85rem",borderRadius:"100px",background:`${accent}0d`,border:`1px solid ${accent}28`,color:"#EDE8DC",fontSize:".78rem",fontWeight:"500",display:"inline-block"}}>{s}</span>
                  {i<arr.length-1&&<span style={{color:accent,fontSize:".85rem",opacity:.5,margin:"0 .2rem"}}>→</span>}
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
              <Link href="https://bh-deco-ai.vercel.app" 
               className="btn-gold" style={{background:`linear-gradient(135deg,${accent},#9A7020)`,fontSize:".86rem",padding:"1.05rem 2.6rem"}}>{t.cta_design} →</Link>
              <Link href="/pricing" className="btn-ghost" style={{fontSize:".86rem",padding:"1.05rem 2.6rem"}}>{t.nav_pricing}</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stats bar */}
      <div style={{background:"rgba(1,4,8,.98)",borderTop:`1px solid ${accent}12`,borderBottom:`1px solid ${accent}12`,padding:"2.5rem 2rem"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"2rem",textAlign:"center"}}>
          {[["50K+",t.stat_designs,accent],["40+",t.stat_styles,"#8B5CF6"],["6","AI-Powered Floors","#1E6DD5"],["4.9★",t.stat_rating,"#00D4FF"]].map(([v,l,c])=>(
            <div key={l as string}>
              <div className="fd" style={{fontSize:"2rem",fontWeight:"600",lineHeight:1,background:`linear-gradient(135deg,${c},${c}88)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{v as string}</div>
              <div className="mono" style={{fontSize:".56rem",color:"#2E4060",letterSpacing:".1em",textTransform:"uppercase",marginTop:".4rem"}}>{l as string}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer accent={accent}/>

      <style>{`
        .bh-fdots{display:flex}
        @media(max-width:768px){.bh-fdots{display:none!important}}
        @keyframes bhFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes bhFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes bhBlink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes bhSpin1{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bhSpin2{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes bhOrbit{from{transform:rotate(0deg) translateX(var(--r,72px)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r,72px)) rotate(-360deg)}}
        @keyframes bhRise{0%{transform:translateY(0);opacity:0}10%{opacity:.5}90%{opacity:.5}100%{transform:translateY(-100vh);opacity:0}}
        @keyframes langFade{from{opacity:0;transform:translateY(-8px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes scanV{0%,100%{transform:translateY(0);opacity:0}5%,95%{opacity:.6}100%{transform:translateY(100vh)}}
        @keyframes bhReveal{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
      `}</style>
    </div>
  );
}
