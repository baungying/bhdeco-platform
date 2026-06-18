import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound(){
  return(
    <>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#010408 0%,#061828 50%,#010408 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"7rem 2rem 4rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"600px",height:"600px",background:"radial-gradient(ellipse,rgba(212,167,61,.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{textAlign:"center",position:"relative",zIndex:1}}>
          <div className="fd gt" style={{fontSize:"clamp(7rem,20vw,11rem)",fontWeight:"300",lineHeight:.9,marginBottom:"1.5rem",opacity:.45}}>404</div>
          <h1 className="fd" style={{fontSize:"clamp(2rem,5vw,3rem)",fontWeight:"300",color:"#EDE8DC",marginBottom:".75rem"}}>Oops!</h1>
          <p style={{fontSize:"1.1rem",fontWeight:"300",color:"#EDE8DC",marginBottom:".5rem"}}>Page Not Found</p>
          <p style={{color:"#7A8FA8",fontSize:".95rem",lineHeight:"1.8",marginBottom:"2.75rem"}}>The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="btn-gold">Back Home →</Link>
        </div>
      </div>
    </>
  );
}
