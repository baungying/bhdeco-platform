"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); return; }
      router.push("/dashboard");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width:"100%", padding:".85rem 1rem",
    background:"rgba(255,255,255,.04)",
    border:"1px solid rgba(255,255,255,.1)",
    borderRadius:"8px", color:"#EDE8DC", fontSize:".9rem",
    outline:"none", fontFamily:"inherit", transition:"border-color .2s",
    boxSizing:"border-box",
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center",padding:"7rem 1.5rem 4rem" }}>
        <div style={{ width:"100%",maxWidth:"420px" }}>
          {/* Logo */}
          <div style={{ textAlign:"center",marginBottom:"2.5rem" }}>
            <div style={{ width:"52px",height:"52px",background:"linear-gradient(135deg,#D4A73D,#8B6820)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"800",color:"#010408",margin:"0 auto 1.25rem" }}>BH</div>
            <h1 className="fd" style={{ fontSize:"2rem",fontWeight:"300",color:"#EDE8DC",marginBottom:".4rem" }}>
              Welcome <span style={{ fontStyle:"italic",color:"#D4A73D" }}>Back</span>
            </h1>
            <p style={{ fontSize:".82rem",color:"#7A8FA8" }}>Sign in to your BH DECO AI account</p>
          </div>

          {/* Card */}
          <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"16px",padding:"2rem" }}>
            <form onSubmit={handleLogin} style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
              <div>
                <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoFocus style={inp}
                  onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
              </div>
              <div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".45rem" }}>
                  <label style={{ fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",fontFamily:"monospace" }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize:".65rem",color:"#D4A73D",textDecoration:"none" }}>Forgot password?</Link>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required style={inp}
                  onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
              </div>

              {error && (
                <div style={{ padding:".7rem 1rem",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"8px",fontSize:".8rem",color:"#f87171" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading || !email || !password} className="btn-gold"
                style={{ width:"100%",justifyContent:"center",opacity:(loading||!email||!password)?.6:1,cursor:loading?"wait":"pointer",marginTop:".25rem" }}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <div style={{ marginTop:"1.5rem",textAlign:"center",fontSize:".78rem",color:"#2E4060" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color:"#D4A73D",textDecoration:"none",fontWeight:"500" }}>Create account</Link>
            </div>
          </div>

          <p style={{ textAlign:"center",fontSize:".7rem",color:"#2E4060",marginTop:"1.5rem",lineHeight:1.6 }}>
            One account works across BH DECO AI website, studio, and future mobile apps.
          </p>
        </div>
      </div>
    </>
  );
}
