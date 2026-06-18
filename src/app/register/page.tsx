"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [done,     setDone]     = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      // Website only calls signUp — it does NOT insert into profiles.
      // The App's onAuthStateChange handler owns profile creation (upsert).
      // Passing full_name in metadata so the App can read it on first login.
      // Never insert website_users or website_profiles. one profiles table only.
      const { error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (authError) { setError(authError.message); return; }
      setDone(true);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width:"100%", padding:".85rem 1rem",
    background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)",
    borderRadius:"8px", color:"#EDE8DC", fontSize:".9rem",
    outline:"none", fontFamily:"inherit", transition:"border-color .2s", boxSizing:"border-box",
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center",padding:"7rem 1.5rem 4rem" }}>
        <div style={{ width:"100%",maxWidth:"420px" }}>
          <div style={{ textAlign:"center",marginBottom:"2.5rem" }}>
            <div style={{ width:"52px",height:"52px",background:"linear-gradient(135deg,#D4A73D,#8B6820)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"800",color:"#010408",margin:"0 auto 1.25rem" }}>BH</div>
            <h1 className="fd" style={{ fontSize:"2rem",fontWeight:"300",color:"#EDE8DC",marginBottom:".4rem" }}>
              Create <span style={{ fontStyle:"italic",color:"#D4A73D" }}>Account</span>
            </h1>
            <p style={{ fontSize:".82rem",color:"#7A8FA8" }}>Join BH DECO AI — one account for everything</p>
          </div>

          <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"16px",padding:"2rem" }}>
            {done ? (
              <div style={{ textAlign:"center",padding:"1rem 0" }}>
                <div style={{ fontSize:"2.5rem",marginBottom:"1rem" }}>✉️</div>
                <h2 style={{ color:"#EDE8DC",marginBottom:".75rem",fontWeight:"500" }}>Check your email</h2>
                <p style={{ color:"#7A8FA8",fontSize:".85rem",lineHeight:1.7,marginBottom:"1.5rem" }}>
                  We&apos;ve sent a confirmation link to <strong style={{ color:"#D4A73D" }}>{email}</strong>.<br />
                  Click the link to activate your account.
                </p>
                <Link href="/login" className="btn-gold" style={{ justifyContent:"center" }}>Back to Login →</Link>
              </div>
            ) : (
              <form onSubmit={handleRegister} style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Your name" style={inp}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                </div>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus style={inp}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                </div>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 characters" required style={inp}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                </div>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password" required style={inp}
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
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
              </form>
            )}

            {!done && (
              <div style={{ marginTop:"1.5rem",textAlign:"center",fontSize:".78rem",color:"#2E4060" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color:"#D4A73D",textDecoration:"none",fontWeight:"500" }}>Sign in</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
