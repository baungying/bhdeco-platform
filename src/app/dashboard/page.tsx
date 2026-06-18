"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, BHProfile } from "@/lib/supabase";

const G = "#D4A73D";
const APP = "https://bh-deco-ai.vercel.app";

// ─── Sidebar nav items ────────────────────────────────────────────────────────
// Extensible: add new sections here as platform grows
type DashSection =
  | "overview" | "credits" | "ai-interior"
  | "furniture" | "3d-models" | "transactions" | "account";

const NAV_ITEMS: { id: DashSection; icon: string; label: string }[] = [
  { id: "overview",      icon: "📊", label: "Overview" },
  { id: "credits",       icon: "⬡",  label: "Credits" },
  { id: "ai-interior",   icon: "🎨", label: "AI Interior" },
  { id: "furniture",     icon: "🪑", label: "Furniture Construction" },
  { id: "3d-models",     icon: "📦", label: "3D Models" },
  { id: "transactions",  icon: "📋", label: "Transactions" },
  { id: "account",       icon: "👤", label: "Account" },
];

// ─── Section: Overview ────────────────────────────────────────────────────────
function OverviewSection({ profile, txCount }: { profile: BHProfile; txCount: number }) {
  return (
    <div>
      <SectionHeader badge="OVERVIEW" title="My" accent="Dashboard" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"1rem",marginBottom:"2rem" }}>
        <StatCard icon="⬡"  label="Credits Balance"  value={profile.credits.toLocaleString()} sub="Universal BH Credits" />
        <StatCard icon="📋" label="Transactions"      value={txCount}                          sub="Total credit history" />
        <StatCard icon="🎨" label="AI Interior"       value="Studio →"                         sub="Generate AI renders"  href={APP} external />
        <StatCard icon="🪑" label="Furniture Studio"  value="Studio →"                         sub="Construction drawings" href={APP} external />
      </div>

      {/* Open Studio banner */}
      <div style={{ background:"rgba(212,167,61,.05)",border:"1px solid rgba(212,167,61,.15)",borderRadius:"12px",padding:"1.75rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",marginBottom:"2rem" }}>
        <div>
          <p className="mono" style={{ fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".4rem" }}>BH DECO AI STUDIO</p>
          <p style={{ fontSize:".95rem",color:"#EDE8DC",fontWeight:"500",marginBottom:".3rem" }}>AI Interior · Furniture Construction · Reference Images</p>
          <p style={{ fontSize:".8rem",color:"#7A8FA8" }}>Full studio experience — sign in with the same account</p>
        </div>
        <a href={APP} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize:".72rem",flexShrink:0 }}>
          Open Studio →
        </a>
      </div>

      <ComingSoonNote />
    </div>
  );
}

// ─── Section: Credits ─────────────────────────────────────────────────────────
function CreditsSection({ profile }: { profile: BHProfile }) {
  return (
    <div>
      <SectionHeader badge="UNIVERSAL CREDITS" title="BH" accent="Credits" />

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2rem" }}>
        {/* Balance */}
        <div style={{ background:"rgba(212,167,61,.05)",border:"1px solid rgba(212,167,61,.2)",borderRadius:"12px",padding:"2rem",textAlign:"center" }}>
          <p className="mono" style={{ fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".75rem" }}>CURRENT BALANCE</p>
          <p className="fd" style={{ fontSize:"3.5rem",fontWeight:"300",color:G,lineHeight:1 }}>{profile.credits.toLocaleString()}</p>
          <p style={{ fontSize:".78rem",color:"#7A8FA8",marginTop:".5rem" }}>BH Credits</p>
        </div>
        {/* Status */}
        <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"2rem" }}>
          <p className="mono" style={{ fontSize:".58rem",color:"#2E4060",letterSpacing:".18em",marginBottom:".75rem" }}>ACCOUNT STATUS</p>
          <p style={{ fontSize:"1.2rem",color:"#EDE8DC",fontWeight:"500",marginBottom:".5rem" }}>
            {profile.is_paid ? "✅ Pro Account" : "🔵 Standard"}
          </p>
          <p style={{ fontSize:".8rem",color:"#7A8FA8",lineHeight:1.65,marginBottom:"1.25rem" }}>
            {profile.is_paid
              ? "Paid account — priority generation queue and full feature access."
              : "Standard account. Upgrade to Pro for priority queue and exclusive features."}
          </p>
          <Link href="/pricing" className="btn-outline" style={{ fontSize:".7rem",padding:".6rem 1.2rem" }}>
            {profile.is_paid ? "View Plans →" : "Upgrade to Pro →"}
          </Link>
        </div>
      </div>

      {/* Credit costs (read from credit_settings — shown for user info only) */}
      <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"1.5rem",marginBottom:"2rem" }}>
        <p className="mono" style={{ fontSize:".58rem",color:"#2E4060",letterSpacing:".18em",marginBottom:"1rem" }}>CREDIT COSTS (APPROXIMATE)</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:".75rem" }}>
          {[
            ["🎨","AI Interior Render","~250"],
            ["🪑","Furniture Drawing","~300"],
            ["⬇","HD Download","~30"],
            ["📦","3D Model Basic","~80"],
            ["📦","3D Model Premium","~500"],
          ].map(([icon, label, cost]) => (
            <div key={label} style={{ padding:".75rem 1rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <span style={{ fontSize:".8rem",color:"#7A8FA8" }}>{icon} {label}</span>
              <span className="mono" style={{ fontSize:".72rem",color:G }}>{cost}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:".7rem",color:"#2E4060",marginTop:".75rem" }}>Exact costs are set by admin and may vary.</p>
      </div>

      <div style={{ textAlign:"center" }}>
        <Link href="/pricing" className="btn-gold" style={{ fontSize:".78rem" }}>
          Buy Credits →
        </Link>
        <p style={{ fontSize:".72rem",color:"#2E4060",marginTop:".75rem" }}>
          Recharge available via KBZ, AYA, Thai QR and bank transfer.
        </p>
      </div>
    </div>
  );
}

// ─── Section: AI Interior ─────────────────────────────────────────────────────
function AiInteriorSection({ credits }: { credits: number }) {
  return (
    <div>
      <SectionHeader badge="AI FEATURE" title="AI Interior" accent="Studio" />
      <StudioPromo
        icon="🎨"
        title="AI Interior Design"
        desc="Upload any room photo and generate stunning photorealistic interior concepts in seconds. 30+ styles, reference image support, HD download."
        cost="~250 credits per render"
        credits={credits}
        href={APP}
      />
    </div>
  );
}

// ─── Section: Furniture ───────────────────────────────────────────────────────
function FurnitureSection({ credits }: { credits: number }) {
  return (
    <div>
      <SectionHeader badge="AI FEATURE" title="Furniture" accent="Construction" />
      <StudioPromo
        icon="🪑"
        title="Furniture Construction Engine"
        desc="AI-powered furniture engineering. From a photo to full production blueprints — front elevation, section, material list, SVG export for CNC."
        cost="~300 credits per drawing"
        credits={credits}
        href={APP}
      />
    </div>
  );
}

// ─── Section: 3D Models ───────────────────────────────────────────────────────
function ModelsSection() {
  return (
    <div>
      <SectionHeader badge="DIGITAL ASSETS" title="3D Model" accent="Library" />
      <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"3rem",textAlign:"center" }}>
        <div style={{ fontSize:"3rem",marginBottom:"1.25rem" }}>📦</div>
        <p className="mono" style={{ fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".75rem" }}>COMING TO PLATFORM</p>
        <p className="fd" style={{ fontSize:"1.5rem",fontWeight:"300",color:"#EDE8DC",marginBottom:".75rem" }}>
          3D Model Downloads
        </p>
        <p style={{ fontSize:".85rem",color:"#7A8FA8",lineHeight:1.75,maxWidth:"460px",margin:"0 auto 1.5rem" }}>
          SketchUp, OBJ, FBX and 3DS models will be purchasable with BH Credits directly from this platform. Browse available models on the 3D Models page now.
        </p>
        <Link href="/courses" className="btn-outline" style={{ fontSize:".72rem" }}>
          Browse 3D Models →
        </Link>
      </div>
    </div>
  );
}

// ─── Section: Transactions ────────────────────────────────────────────────────
function TransactionsSection({ userId }: { userId: string }) {
  const [txs, setTxs] = useState<{
    id:number; feature_type:string; credits_used:number;
    before_balance:number; after_balance:number; created_at:string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("credit_transactions")
      .select("id,feature_type,credits_used,before_balance,after_balance,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => { setTxs(data ?? []); setLoading(false); });
  }, [userId]);

  const LABELS: Record<string,string> = {
    ai_render:"AI Interior Render", furniture_construction:"Furniture Construction",
    hd_download:"HD Download", model_download_basic:"3D Model", model_download_premium:"Premium 3D Model",
  };

  return (
    <div>
      <SectionHeader badge="CREDIT HISTORY" title="Recent" accent="Transactions" />
      {loading ? (
        <p style={{ color:"#2E4060",fontSize:".82rem" }}>Loading…</p>
      ) : txs.length === 0 ? (
        <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"3rem",textAlign:"center" }}>
          <p className="mono" style={{ fontSize:".62rem",color:"#2E4060",letterSpacing:".12em" }}>NO TRANSACTIONS YET</p>
          <p style={{ fontSize:".82rem",color:"#7A8FA8",marginTop:".75rem" }}>Generate your first AI design to see activity here.</p>
        </div>
      ) : (
        <>
          <div style={{ border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",overflow:"hidden",marginBottom:"1.25rem" }}>
            {txs.map((tx, i) => (
              <div key={tx.id} style={{ display:"grid",gridTemplateColumns:"1fr 90px 90px 130px",gap:"0",padding:".9rem 1.25rem",borderBottom:i<txs.length-1?"1px solid rgba(255,255,255,.04)":"none",transition:"background .15s" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,.02)")}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                <span style={{ fontSize:".82rem",color:"#EDE8DC",alignSelf:"center" }}>{LABELS[tx.feature_type]??tx.feature_type}</span>
                <span className="mono" style={{ fontSize:".78rem",color:"#ef4444",alignSelf:"center" }}>−{tx.credits_used}</span>
                <span className="mono" style={{ fontSize:".78rem",color:"#EDE8DC",alignSelf:"center" }}>{tx.after_balance.toLocaleString()}</span>
                <span style={{ fontSize:".7rem",color:"#2E4060",alignSelf:"center" }}>{new Date(tx.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/transactions" style={{ fontSize:".78rem",color:G,textDecoration:"none" }}>
            View all transactions →
          </Link>
        </>
      )}
    </div>
  );
}

// ─── Section: Account ─────────────────────────────────────────────────────────
function AccountSection({ profile }: { profile: BHProfile }) {
  return (
    <div>
      <SectionHeader badge="SETTINGS" title="Account" accent="Settings" />
      <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"1.75rem",marginBottom:"1rem" }}>
        {[
          ["Email",   profile.email,                             false],
          ["Name",    profile.full_name || "—",                  false],
          ["Status",  profile.is_paid ? "Pro Account" : "Standard", false],
          ["Credits", profile.credits.toLocaleString(),           false],
        ].map(([label, value]) => (
          <div key={String(label)} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:".75rem 0",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
            <span className="mono" style={{ fontSize:".6rem",color:"#2E4060",letterSpacing:".1em",textTransform:"uppercase" }}>{label}</span>
            <span style={{ fontSize:".85rem",color:"#EDE8DC" }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",gap:".75rem",flexWrap:"wrap" }}>
        <Link href="/account" className="btn-gold" style={{ fontSize:".72rem" }}>Edit Profile →</Link>
        <Link href="/account?tab=password" className="btn-ghost" style={{ fontSize:".72rem" }}>Change Password →</Link>
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionHeader({ badge, title, accent }: { badge: string; title: string; accent: string }) {
  return (
    <div style={{ marginBottom:"2rem" }}>
      <p className="mono" style={{ fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".5rem" }}>{badge}</p>
      <h2 className="fd" style={{ fontSize:"clamp(1.6rem,2.5vw,2rem)",fontWeight:"300" }}>
        {title} <span style={{ fontStyle:"italic",color:G }}>{accent}</span>
      </h2>
    </div>
  );
}

function StatCard({ icon, label, value, sub, href, external }: {
  icon:string; label:string; value:string|number; sub?:string; href?:string; external?:boolean;
}) {
  const inner = (
    <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"1.5rem",transition:"border-color .2s,transform .2s",height:"100%" }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,167,61,.25)";if(href)(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.07)";(e.currentTarget as HTMLElement).style.transform="none";}}>
      <div style={{ fontSize:"1.5rem",marginBottom:".75rem" }}>{icon}</div>
      <div className="mono" style={{ fontSize:".55rem",color:"#2E4060",letterSpacing:".14em",marginBottom:".35rem" }}>{label}</div>
      <div className="fd" style={{ fontSize:"1.8rem",fontWeight:"300",color:"#EDE8DC",lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:".7rem",color:"#2E4060",marginTop:".3rem" }}>{sub}</div>}
    </div>
  );
  if (!href) return inner;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none",display:"block" }}>{inner}</a>
    : <Link href={href} style={{ textDecoration:"none",display:"block" }}>{inner}</Link>;
}

function StudioPromo({ icon, title, desc, cost, credits, href }: {
  icon:string; title:string; desc:string; cost:string; credits:number; href:string;
}) {
  return (
    <div style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"2rem" }}>
      <div style={{ fontSize:"2.5rem",marginBottom:"1rem" }}>{icon}</div>
      <h3 style={{ fontSize:"1.15rem",color:"#EDE8DC",fontWeight:"500",marginBottom:".75rem" }}>{title}</h3>
      <p style={{ fontSize:".85rem",color:"#7A8FA8",lineHeight:1.75,marginBottom:"1.25rem",maxWidth:"520px" }}>{desc}</p>
      <div style={{ display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap" }}>
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize:".72rem" }}>
          Open Studio →
        </a>
        <div>
          <span className="mono" style={{ fontSize:".6rem",color:G }}>{cost}</span>
          <span style={{ fontSize:".7rem",color:"#2E4060",marginLeft:".5rem" }}>· Your balance: {credits.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function ComingSoonNote() {
  return (
    <div style={{ padding:"1rem 1.25rem",background:"rgba(74,158,255,.05)",border:"1px solid rgba(74,158,255,.15)",borderRadius:"10px" }}>
      <p className="mono" style={{ fontSize:".58rem",color:"#4A9EFF",letterSpacing:".12em",marginBottom:".3rem" }}>PLATFORM ROADMAP</p>
      <p style={{ fontSize:".8rem",color:"#7A8FA8",lineHeight:1.65 }}>
        AI Interior, Furniture Construction, 3D Model Downloads and Recharge — all moving into this platform. Credits work identically across website, studio and future mobile clients.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [profile,   setProfile]   = useState<BHProfile | null>(null);
  const [txCount,   setTxCount]   = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [section,   setSection]   = useState<DashSection>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const uid = session.user.id;
      const [{ data: prof }, { count }] = await Promise.all([
        // READ ONLY — website never writes credits, transactions, or AI results
        supabase.from("profiles")
          .select("id,email,credits,is_paid,full_name,avatar_url")
          .eq("id", uid).single(),
        supabase.from("credit_transactions")
          .select("*", { count:"exact", head:true })
          .eq("user_id", uid),
      ]);
      setProfile(prof ? { ...prof, email: prof.email || session.user.email || "" }
        : { id:uid, email:session.user.email||"", credits:0, is_paid:false });
      setTxCount(count ?? 0);
      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div style={{ minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:"36px",height:"36px",border:"2px solid rgba(212,167,61,.2)",borderTop:`2px solid ${G}`,borderRadius:"50%",animation:"spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!profile) return null;

  const initial = (profile.full_name || profile.email || "U")[0].toUpperCase();

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh",background:"#010408",color:"#EDE8DC",paddingTop:"64px" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"220px 1fr",minHeight:"calc(100vh - 64px)" }} className="bh-dash-grid">

          {/* ── Sidebar ── */}
          <aside style={{ borderRight:"1px solid rgba(255,255,255,.06)",padding:"2rem 0",position:"sticky",top:"64px",height:"calc(100vh - 64px)",overflowY:"auto" }} className="bh-dash-sidebar">
            {/* User pill */}
            <div style={{ padding:"0 1.25rem 1.5rem",borderBottom:"1px solid rgba(255,255,255,.06)",marginBottom:"1rem" }}>
              <div style={{ display:"flex",alignItems:"center",gap:".75rem" }}>
                <div style={{ width:"38px",height:"38px",borderRadius:"50%",background:`linear-gradient(135deg,${G},#8B6820)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",fontWeight:"800",color:"#010408",flexShrink:0 }}>
                  {initial}
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:".8rem",color:"#EDE8DC",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {profile.full_name || profile.email?.split("@")[0]}
                  </p>
                  <p className="mono" style={{ fontSize:".58rem",color:G }}>⬡ {profile.credits.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {/* Nav */}
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setSection(item.id)}
                style={{ width:"100%",display:"flex",alignItems:"center",gap:".7rem",padding:".65rem 1.25rem",background:section===item.id?`${G}10`:"transparent",border:"none",borderLeft:`2px solid ${section===item.id?G:"transparent"}`,cursor:"pointer",color:section===item.id?G:"#7A8FA8",fontSize:".8rem",transition:"all .2s",textAlign:"left" }}
                onMouseEnter={e=>{if(section!==item.id)(e.currentTarget as HTMLElement).style.color="#EDE8DC";}}
                onMouseLeave={e=>{if(section!==item.id)(e.currentTarget as HTMLElement).style.color="#7A8FA8";}}>
                <span style={{ fontSize:".9rem" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </aside>

          {/* ── Main content ── */}
          <main style={{ padding:"2.5rem 2rem",overflowY:"auto" }}>
            {section === "overview"     && <OverviewSection     profile={profile} txCount={txCount} />}
            {section === "credits"      && <CreditsSection      profile={profile} />}
            {section === "ai-interior"  && <AiInteriorSection   credits={profile.credits} />}
            {section === "furniture"    && <FurnitureSection     credits={profile.credits} />}
            {section === "3d-models"    && <ModelsSection />}
            {section === "transactions" && <TransactionsSection  userId={profile.id} />}
            {section === "account"      && <AccountSection       profile={profile} />}
          </main>
        </div>
      </div>
      <Footer />
      <style>{`
        @media(max-width:768px){
          .bh-dash-grid{grid-template-columns:1fr!important}
          .bh-dash-sidebar{display:none!important}
        }
      `}</style>
    </>
  );
}
