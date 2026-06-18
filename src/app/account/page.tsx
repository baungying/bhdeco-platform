"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, BHProfile } from "@/lib/supabase";

const G = "#D4A73D";

const inp: React.CSSProperties = {
  width:"100%", padding:".8rem 1rem",
  background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)",
  borderRadius:"8px", color:"#EDE8DC", fontSize:".88rem",
  outline:"none", fontFamily:"inherit", transition:"border-color .2s", boxSizing:"border-box",
};

export default function AccountPage() {
  const [profile,  setProfile]  = useState<BHProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ ok: boolean; text: string } | null>(null);
  // Password tab
  const [newPw,    setNewPw]    = useState("");
  const [confirmPw,setConfirmPw]= useState("");
  const [pwMsg,    setPwMsg]    = useState<{ ok: boolean; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);
  const router    = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const { data } = await supabase.from("profiles")
        .select("id,email,credits,is_paid,full_name,avatar_url")
        .eq("id", session.user.id).single();
      const p = data ? { ...data, email: data.email || session.user.email || "" } : {
        id: session.user.id, email: session.user.email || "", credits: 0, is_paid: false, full_name: undefined,
      };
      setProfile(p);
      setFullName(p.full_name || "");
    });
  }, [router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", profile.id);
    setSaving(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Profile updated." });
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) { setPwMsg({ ok:false, text:"Passwords do not match." }); return; }
    if (newPw.length < 8)   { setPwMsg({ ok:false, text:"Minimum 8 characters." }); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);
    if (error) { setPwMsg({ ok:false, text: error.message }); }
    else { setPwMsg({ ok:true, text:"Password updated." }); setNewPw(""); setConfirmPw(""); }
  };

  if (!profile) return (
    <div style={{ minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:"32px",height:"32px",border:`2px solid ${G}30`,borderTop:`2px solid ${G}`,borderRadius:"50%",animation:"spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh",background:"#010408",color:"#EDE8DC",padding:"7rem 1.5rem 5rem" }}>
        <div style={{ maxWidth:"620px",margin:"0 auto" }}>

          <div style={{ marginBottom:"2rem" }}>
            <Link href="/dashboard" style={{ fontSize:".7rem",color:"#2E4060",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem",marginBottom:"1.25rem" }}
              onMouseEnter={e => (e.currentTarget.style.color = G)}
              onMouseLeave={e => (e.currentTarget.style.color = "#2E4060")}>← Dashboard</Link>
            <p className="mono" style={{ fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".5rem" }}>ACCOUNT</p>
            <h1 className="fd" style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300" }}>
              Account <span style={{ fontStyle:"italic",color:G }}>Settings</span>
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",gap:".4rem",marginBottom:"2rem",borderBottom:"1px solid rgba(255,255,255,.07)",paddingBottom:".5rem" }}>
            {([["profile","Profile"],["password","Password"]] as const).map(([tab,label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding:".45rem 1rem",fontSize:".72rem",borderRadius:"6px",transition:"all .2s",cursor:"pointer",
                  fontFamily:"inherit",border:`1px solid ${activeTab===tab ? `${G}30` : "transparent"}`,
                  color: activeTab===tab ? G : "#7A8FA8",
                  background: activeTab===tab ? `${G}12` : "transparent",
                }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"16px",padding:"2rem" }}>
            {activeTab === "profile" ? (
              <>
                {/* Read-only info */}
                <div style={{ marginBottom:"1.5rem",padding:"1rem",background:"rgba(212,167,61,.04)",border:"1px solid rgba(212,167,61,.12)",borderRadius:"10px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem" }}>
                  <div>
                    <p className="mono" style={{ fontSize:".55rem",color:"#2E4060",letterSpacing:".12em",marginBottom:".25rem" }}>EMAIL</p>
                    <p style={{ fontSize:".88rem",color:"#EDE8DC" }}>{profile.email}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p className="mono" style={{ fontSize:".55rem",color:"#2E4060",letterSpacing:".12em",marginBottom:".25rem" }}>CREDITS</p>
                    <p style={{ fontSize:"1.2rem",color:G,fontWeight:"600" }}>⬡ {profile.credits.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={saveProfile} style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
                  <div>
                    <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Full Name</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name" style={inp}
                      onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                  </div>

                  {msg && (
                    <div style={{ padding:".65rem 1rem",background:msg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${msg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`,borderRadius:"8px",fontSize:".8rem",color:msg.ok?"#10B981":"#f87171" }}>
                      {msg.text}
                    </div>
                  )}

                  <button type="submit" disabled={saving} className="btn-gold"
                    style={{ width:"100%",justifyContent:"center",opacity:saving?.6:1 }}>
                    {saving ? "Saving…" : "Save Profile →"}
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={savePassword} style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>New Password</label>
                  <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                    placeholder="Min 8 characters" required style={inp}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                </div>
                <div>
                  <label style={{ display:"block",fontSize:".6rem",color:"#7A8FA8",letterSpacing:".12em",textTransform:"uppercase",marginBottom:".45rem",fontFamily:"monospace" }}>Confirm New Password</label>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Repeat password" required style={inp}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")} />
                </div>

                {pwMsg && (
                  <div style={{ padding:".65rem 1rem",background:pwMsg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${pwMsg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`,borderRadius:"8px",fontSize:".8rem",color:pwMsg.ok?"#10B981":"#f87171" }}>
                    {pwMsg.text}
                  </div>
                )}

                <button type="submit" disabled={pwSaving} className="btn-gold"
                  style={{ width:"100%",justifyContent:"center",opacity:pwSaving?.6:1 }}>
                  {pwSaving ? "Updating…" : "Update Password →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
