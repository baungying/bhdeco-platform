"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account?reset=true`,
      });
      if (err) { setError(err.message); return; }
      setSent(true);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center",padding:"7rem 1.5rem 4rem" }}>
        <div style={{ width:"100%",maxWidth:"420px" }}>
          <div style={{ textAlign:"center",marginBottom:"2.5rem" }}>
            <div style={{ width:"52px",height:"52px",background:"linear-gradient(135deg,#D4A73D,#8B6820)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"800",color:"#010408",margin:"0 auto 1.25rem" }}>BH</div>
            <h1 className="fd" style={{ fontSize:"2rem",fontWeight:"300",color:"#EDE8DC",marginBottom:".4rem" }}>
              Reset <span style={{ fontStyle:"italic",color:"#D4A73D" }}>Password</span>
            </h1>
            <p style={{ fontSize:".82rem",color:"#7A8FA8" }}>
              {sent ? "Check your inbox" : "We'll send a reset link to your email"}
            </p>
          </div>

          <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"16px",padding:"2rem" }}>
            {sent ? (
              <div style={{ textAlign:"center",padding:"1rem 0" }}>
                <div style={{ fontSize:"2.5rem",marginBottom:"1rem" }}>✉️</div>
                <p style={{ color:"#7A8FA8",fontSize:".85rem",lineHeight:1.7,marginBottom:"1.5rem" }}>
                  Reset link sent to <strong style={{ color:"#D4A73D" }}>{email}</strong>.<br />
                  Check your inbox and follow the instructions.
                </p>
                <Link href="/login" className="btn-gold" style={{ justifyContent:"center" }}>Back to Login →</Link>
              </div>
            ) : (
              <form onSubmit={handleReset} style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus
                    style={{ width:"100%",padding:".85rem 1rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",color:"#EDE8DC",fontSize:".9rem",outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxSizing:"border-box" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                </div>

                {error && (
                  <div style={{ padding:".7rem 1rem",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"8px",fontSize:".8rem",color:"#f87171" }}>{error}</div>
                )}

                <button type="submit" disabled={loading || !email} className="btn-gold"
                  style={{ width:"100%",justifyContent:"center",opacity:(loading||!email)?.6:1,cursor:loading?"wait":"pointer" }}>
                  {loading ? "Sending…" : "Send Reset Link →"}
                </button>
              </form>
            )}
            {!sent && (
              <div style={{ marginTop:"1.5rem",textAlign:"center",fontSize:".78rem",color:"#2E4060" }}>
                Remembered it?{" "}
                <Link href="/login" style={{ color:"#D4A73D",textDecoration:"none" }}>Back to login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
