"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";

const roomTypes: [string, string, import("@/config/siteImages").SiteImageKey][] = [
  ["🛋️","Living Room","livingRoom"],
  ["🛏️","Bedroom","bedroom"],
  ["🍳","Kitchen","kitchen"],
  ["💼","Office","office"],
  ["🏪","Commercial","commercial"],
  ["🌿","Outdoor","outdoor"],
];

const features=[
  {icon:"📸",title:"Room Photo Upload",desc:"Upload any room photo — our AI reads the space, dimensions, lighting, and architectural features automatically."},
  {icon:"🖼️",title:"Reference Image",desc:"Add any inspiration image. AI extracts color palettes, material textures, furniture styles, and spatial mood."},
  {icon:"✍️",title:"AI Prompt",desc:"Describe exactly what you want — style, mood, colors, furniture. Natural language, no technical knowledge needed."},
  {icon:"⚡",title:"Instant Generation",desc:"Generate multiple interior concepts in seconds. High-resolution, photorealistic AI renders ready for client presentation."},
  {icon:"📚",title:"Design History",desc:"Every design you generate is saved to your history. Browse, download, compare, and revisit anytime."},
  {icon:"💎",title:"Credits System",desc:"Flexible pay-as-you-go. Buy credits once, use them whenever you need. No monthly fees, no subscriptions."},
];

export default function AIDesign() {
  return (
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>

      {/* Hero */}
      <SiteImage imageKey="aiDesignHero" asBackground style={{
        padding:"9rem 2rem 5rem",textAlign:"center",position:"relative",minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(1,4,8,.92) 0%,rgba(1,4,8,.82) 50%,rgba(1,4,8,.95) 100%)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(212,167,61,.07)",border:"1px solid rgba(212,167,61,.22)",borderRadius:"100px",padding:".3rem .9rem",marginBottom:"1.5rem"}}>
            <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e",animation:"bhBlink 2s infinite"}}/>
            <span style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".12em"}}>LIVE · AI DESIGN ENGINE</span>
          </div>
          <h1 className="fd" style={{fontSize:"clamp(2.5rem,6vw,5rem)",fontWeight:"300",marginBottom:"1.25rem"}}>
            AI Interior <span style={{fontStyle:"italic",color:"#D4A73D"}}>Design</span>
          </h1>
          <p style={{color:"#7A8FA8",maxWidth:"520px",margin:"0 auto 2.5rem",lineHeight:"1.9"}}>Upload a room photo, add reference images, write your prompt — and generate professional interior designs instantly.</p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <Link
  href="https://bh-deco-ai.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-gold"
  style={{ fontSize: ".86rem", padding: "1.05rem 2.5rem" }}
>
  Open Design Studio →
</Link>
          </div>
        </div>
      </SiteImage>

      {/* Features */}
      <section style={{padding:"6rem 2rem",background:"#010408"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem",textAlign:"center"}}>FEATURES</p>
          <h2 className="fd" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:"300",textAlign:"center",marginBottom:"3.5rem"}}>Everything You Need to <span style={{fontStyle:"italic",color:"#D4A73D"}}>Design</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.25rem"}}>
            {features.map(f=>(
              <div key={f.title} style={{padding:"2rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"14px",transition:"all .3s"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(212,167,61,.22)";el.style.background="rgba(212,167,61,.03)";el.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.07)";el.style.background="rgba(255,255,255,.02)";el.style.transform="none";}}>
                <div style={{fontSize:"1.8rem",marginBottom:"1rem"}}>{f.icon}</div>
                <h3 style={{fontSize:"1rem",fontWeight:"600",marginBottom:".6rem"}}>{f.title}</h3>
                <p style={{color:"#7A8FA8",fontSize:".85rem",lineHeight:"1.7"}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room types with images */}
      <section style={{padding:"5rem 2rem",background:"linear-gradient(180deg,#010408,#04101e,#010408)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem",textAlign:"center"}}>ROOM TYPES</p>
          <h2 className="fd" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:"300",textAlign:"center",marginBottom:"3rem"}}>Design Any <span style={{fontStyle:"italic",color:"#D4A73D"}}>Space</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem"}}>
            {roomTypes.map(([icon,name,imgKey])=>(
              <div key={name} style={{borderRadius:"12px",overflow:"hidden",border:"1px solid rgba(255,255,255,.07)",transition:"all .3s",cursor:"default"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(212,167,61,.25)";el.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.07)";el.style.transform="none";}}>
                <SiteImage imageKey={imgKey} asBackground style={{height:"140px",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"1rem"}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,4,8,.9),rgba(1,4,8,.3))"}}/>
                </SiteImage>
                <div style={{padding:".85rem 1rem",background:"rgba(255,255,255,.02)",display:"flex",alignItems:"center",gap:".5rem"}}>
                  <span style={{fontSize:"1.1rem"}}>{icon}</span>
                  <span style={{fontSize:".85rem",color:"#EDE8DC"}}>{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"5rem 2rem",textAlign:"center"}}>
        <h2 className="fd" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:"300",marginBottom:"1.25rem"}}>Ready to <span style={{fontStyle:"italic",color:"#D4A73D"}}>Transform</span> Your Space?</h2>
        <p style={{color:"#7A8FA8",marginBottom:"2.5rem"}}>Start with your first credit package and generate beautiful AI interiors today.</p>
        <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
          <Link
  href="https://bh-deco-ai.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-gold"
>
  Open Design Studio →
</Link>
          <Link href="/pricing" className="btn-ghost">View Pricing</Link>
        </div>
      </section>

      <Footer/>
      <style>{`@keyframes bhBlink{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
    </div>
  );
}
