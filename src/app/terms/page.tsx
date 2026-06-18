import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
export default function Page(){
  const titles: Record<string,string>={privacy:"Privacy Policy",terms:"Terms of Service",refund:"Refund Policy"};
  const title=titles["terms"];
  return(
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>
      <section style={{background:"linear-gradient(170deg,#010408 0%,#061828 50%,#010408 100%)",padding:"9rem 2rem 4rem",textAlign:"center"}}>
        <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:".4rem",color:"#7A8FA8",textDecoration:"none",fontSize:".8rem",marginBottom:"1.5rem"}}>← Back to Home</Link>
        <h1 className="fd" style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:"300",marginBottom:".75rem"}}>{title}</h1>
        <p style={{color:"#7A8FA8",fontSize:".875rem"}}>Last updated: June 2025</p>
      </section>
      <div style={{maxWidth:"760px",margin:"0 auto",padding:"4rem 2rem 7rem"}}>
        <p style={{color:"#7A8FA8",fontSize:".95rem",lineHeight:"1.9"}}>This is the BH DECO AI {title.toLowerCase()}. For questions contact <a href="mailto:support@bhdeco.ai" style={{color:"#D4A73D",textDecoration:"none"}}>support@bhdeco.ai</a>.</p>
      </div>
      <Footer/>
    </div>
  );
}
