import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function FurnitureConstruction(){
  return(
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"8rem 2rem",textAlign:"center",position:"relative",background:"linear-gradient(170deg,#010408 0%,#030e1c 50%,#010408 100%)"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"700px",height:"700px",background:"radial-gradient(ellipse,rgba(212,167,61,.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:"750px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(212,167,61,.07)",border:"1px solid rgba(212,167,61,.22)",borderRadius:"100px",padding:".32rem .9rem",marginBottom:"2rem"}}>
            <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#D4A73D",animation:"blink 2s infinite"}}/>
            <span style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".14em"}}>COMING SOON</span>
          </div>
          <h1 className="fd" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:"300",color:"#EDE8DC",letterSpacing:"-.025em",lineHeight:"1.07",marginBottom:"1.5rem"}}>
            AI Furniture<br/><span style={{fontStyle:"italic",color:"#D4A73D"}}>Construction Engine</span>
          </h1>
          <p style={{color:"#7A8FA8",fontSize:"1.05rem",lineHeight:"1.88",maxWidth:"560px",margin:"0 auto 3rem"}}>From AI interior design to real-world blueprints. Floor plans, cabinet drawings, elevation details — contractor-ready in minutes.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1rem",marginBottom:"3rem",textAlign:"left"}}>
            {[["◰","Floor Plan"],["⬡","Furniture Layout"],["◳","Ceiling Plan"],["⬛","Elevation"],["◫","Cabinet Drawing"]].map(([icon,name])=>(
              <div key={name as string} style={{padding:"1.1rem",background:"rgba(212,167,61,.04)",border:"1px solid rgba(212,167,61,.12)",borderRadius:"10px",opacity:.75}}>
                <div style={{fontSize:"1.2rem",color:"#D4A73D",marginBottom:".4rem"}}>{icon as string}</div>
                <div style={{fontSize:".82rem",fontWeight:"500"}}>{name as string}</div>
              </div>
            ))}
          </div>
          <a href="mailto:support@bhdeco.ai?subject=Early Access: Furniture Construction" className="btn-gold">Join Early Access →</a>
        </div>
      </div>
      <Footer/>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}
