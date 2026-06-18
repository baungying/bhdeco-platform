"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";

const timeline=[
  {year:"2024",title:"Founded",desc:"BH DECO AI established in Mandalay. Blessing Home merges construction expertise with AI technology."},
  {year:"2025",title:"AI Interior Design",desc:"Launched AI-powered interior design generation platform for Myanmar and Southeast Asia."},
  {year:"2026",title:"Furniture Construction AI",desc:"Furniture blueprint generation — connecting AI design to real manufacturing."},
  {year:"2027",title:"AI Construction Platform",desc:"Full construction drawing automation — floor plans, elevations, sections, and structural documentation."},
  {year:"Future",title:"Transform Design Into Reality",desc:"Complete ecosystem from concept photo to finished construction project."},
];
const services=[
  {icon:"🏠",title:"Interior Design",desc:"AI-powered concepts for homes, offices, hotels, and commercial spaces."},
  {icon:"🪑",title:"Furniture & Wardrobe",desc:"Custom furniture design, wardrobe systems, kitchen cabinets, and TV units."},
  {icon:"🔨",title:"Construction",desc:"General construction, renovation, and light steel frame structures."},
  {icon:"📐",title:"Blueprint Drawing",desc:"Floor plans, elevation views, and construction documentation."},
  {icon:"🏗️",title:"Container House & Mobihome",desc:"Modern container homes and modular prefabricated structures."},
  {icon:"🤖",title:"AI Technology",desc:"BH DECO AI — interior generation, furniture design, and blueprint automation."},
];

export default function About() {
  return (
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>

      {/* Hero */}
      <SiteImage imageKey="aboutHero" asBackground style={{
        padding:"9rem 2rem 5rem",textAlign:"center",position:"relative",
        minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(1,4,8,.92) 0%,rgba(1,4,8,.82) 50%,rgba(1,4,8,.96) 100%)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem"}}>ABOUT US</p>
          <h1 className="fd" style={{fontSize:"clamp(2.5rem,6vw,5rem)",fontWeight:"300",marginBottom:"1.25rem"}}>
            Blessing Home<br/><span style={{fontStyle:"italic",color:"#D4A73D"}}>Meets AI Future</span>
          </h1>
          <p style={{color:"#7A8FA8",maxWidth:"560px",margin:"0 auto",lineHeight:"1.9"}}>BH DECO AI is the AI technology division of Blessing Home, a construction and interior design company based in Mandalay, Myanmar.</p>
        </div>
      </SiteImage>

      {/* Services */}
      <section style={{padding:"6rem 2rem",background:"#010408"}}>
        <div style={{maxWidth:"1280px",margin:"0 auto"}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem",textAlign:"center"}}>WHAT WE DO</p>
          <h2 className="fd" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:"300",textAlign:"center",marginBottom:"3.5rem"}}>Our <span style={{fontStyle:"italic",color:"#D4A73D"}}>Services</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.25rem"}}>
            {services.map(s=>(
              <div key={s.title} style={{padding:"2rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"12px",transition:"all .3s"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(212,167,61,.22)";el.style.background="rgba(212,167,61,.03)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.06)";el.style.background="rgba(255,255,255,.02)";}}>
                <div style={{fontSize:"1.8rem",marginBottom:"1rem"}}>{s.icon}</div>
                <h3 style={{fontSize:"1.05rem",fontWeight:"600",marginBottom:".6rem"}}>{s.title}</h3>
                <p style={{color:"#7A8FA8",fontSize:".875rem",lineHeight:"1.7"}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company photos */}
      <section style={{padding:"5rem 2rem",background:"linear-gradient(180deg,#010408,#04101e,#010408)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem",textAlign:"center"}}>OUR FACILITIES</p>
          <h2 className="fd" style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:"300",textAlign:"center",marginBottom:"2.5rem"}}>Mandalay <span style={{fontStyle:"italic",color:"#D4A73D"}}>Headquarters</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.25rem"}}>
            {([["companyFactory","Factory","🏭","Our manufacturing and production facility"],["companyShowroom","Showroom","🏪","Interior design display and product showcase"],["companyTeam","Team","👥","The BH DECO AI design and tech team"]] as const).map(([key,label,icon,desc])=>(
              <div key={label} style={{borderRadius:"14px",overflow:"hidden",border:"1px solid rgba(255,255,255,.07)"}}>
                <SiteImage imageKey={key} asBackground style={{height:"200px",position:"relative"}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,4,8,.9) 0%,transparent 60%)"}}/>
                  <div style={{position:"absolute",bottom:"1rem",left:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                    <span style={{fontSize:"1.2rem"}}>{icon}</span>
                    <span style={{fontSize:"1rem",fontWeight:"600"}}>{label}</span>
                  </div>
                </SiteImage>
                <div style={{padding:"1.1rem 1.25rem",background:"rgba(255,255,255,.02)"}}><p style={{color:"#7A8FA8",fontSize:".82rem"}}>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{padding:"6rem 2rem",background:"#010408"}}>
        <div style={{maxWidth:"800px",margin:"0 auto"}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem",textAlign:"center"}}>OUR JOURNEY</p>
          <h2 className="fd" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:"300",textAlign:"center",marginBottom:"4rem"}}>Company <span style={{fontStyle:"italic",color:"#D4A73D"}}>Timeline</span></h2>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:"80px",top:0,bottom:0,width:"1px",background:"linear-gradient(180deg,transparent,rgba(212,167,61,.3),transparent)"}}/>
            {timeline.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:"2rem",marginBottom:"3rem",position:"relative"}}>
                <div style={{width:"80px",flexShrink:0,textAlign:"right",paddingRight:"1.5rem",position:"relative"}}>
                  <div className="fd" style={{fontSize:"1.1rem",fontWeight:"600",color:"#D4A73D",lineHeight:1}}>{item.year}</div>
                  <div style={{position:"absolute",right:"-5px",top:"8px",width:"10px",height:"10px",borderRadius:"50%",background:"#D4A73D",boxShadow:"0 0 12px rgba(212,167,61,.5)"}}/>
                </div>
                <div style={{paddingTop:".2rem"}}>
                  <h3 style={{fontSize:"1.05rem",fontWeight:"600",marginBottom:".5rem"}}>{item.title}</h3>
                  <p style={{color:"#7A8FA8",fontSize:".875rem",lineHeight:"1.7"}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{textAlign:"center",padding:"3rem 2rem 5rem"}}>
        <Link href="/contact" className="btn-gold">Get in Touch →</Link>
      </div>
      <Footer/>
    </div>
  );
}
