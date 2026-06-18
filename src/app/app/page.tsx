import Navbar from "@/components/Navbar";
export default function AppPage(){
  return(
    <>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center",padding:"7rem 2rem",textAlign:"center"}}>
        <div style={{maxWidth:"500px"}}>
          <div style={{width:"64px",height:"64px",background:"linear-gradient(135deg,#D4A73D,#8B6820)",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",margin:"0 auto 2rem",boxShadow:"0 8px 30px rgba(212,167,61,.3)"}}>🤖</div>
          <h1 className="fd" style={{fontSize:"2.5rem",fontWeight:"300",color:"#EDE8DC",marginBottom:"1rem"}}>AI Design <span style={{fontStyle:"italic",color:"#D4A73D"}}>Studio</span></h1>
          <p style={{color:"#7A8FA8",lineHeight:"1.8",marginBottom:"2rem"}}>AI Design App will connect here. This page routes to the existing BH DECO AI application and backend.</p>
          <div style={{padding:"1rem 1.5rem",background:"rgba(212,167,61,.06)",border:"1px solid rgba(212,167,61,.18)",borderRadius:"8px",fontFamily:"monospace",fontSize:".75rem",color:"#D4A73D"}}>Route: /app → Existing Application</div>
        </div>
      </div>
    </>
  );
}
