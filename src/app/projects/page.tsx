"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const G    = "#D4A73D";
const CATS = ["All","Construction","Interior","Furniture","Commercial","Before & After"] as const;
type  Cat  = typeof CATS[number];

interface Project {
  id:              string;
  title:           string;
  category:        string;
  location:        string;
  cover_image_url: string;
  featured:        boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<Cat>("All");
  const [error,    setError]    = useState("");

  useEffect(() => {
    supabase
      .from("cms_projects")
      .select("id,title,category,location,cover_image_url,featured")
      .eq("active", true)
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError("Failed to load projects."); setLoading(false); return; }
        setProjects((data ?? []).map(p => ({
          id:              String(p.id              ?? ""),
          title:           String(p.title           ?? ""),
          category:        String(p.category        ?? ""),
          location:        String(p.location        ?? ""),
          cover_image_url: String(p.cover_image_url ?? ""),
          featured:        Boolean(p.featured),
        })));
        setLoading(false);
      });
  }, []);

  const filtered = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <div style={{ minHeight:"100vh", background:"#010408", color:"#EDE8DC" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ padding:"9rem 2rem 4rem", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <p className="mono" style={{ fontSize:".6rem", color:G, letterSpacing:".22em", marginBottom:"1rem" }}>OUR WORK</p>
        <h1 className="fd" style={{ fontSize:"clamp(2.8rem,6vw,5rem)", fontWeight:"300", marginBottom:"1.25rem", lineHeight:1.08 }}>
          Project <span style={{ fontStyle:"italic", color:G }}>Gallery</span>
        </h1>
        <p style={{ color:"#7A8FA8", maxWidth:"460px", margin:"0 auto", fontSize:".95rem", lineHeight:1.85 }}>
          Construction, interior and furniture projects completed by Blessing Home.
        </p>
      </section>

      {/* ── Grid ── */}
      <section style={{ padding:"4rem 2rem 8rem", maxWidth:"1300px", margin:"0 auto" }}>

        {/* Filter pills */}
        <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"2.5rem" }}>
          {CATS.map(cat => {
            const active = filter === cat;
            return (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding:".42rem 1.1rem", borderRadius:"100px", cursor:"pointer",
                fontFamily:"monospace", fontSize:".6rem", letterSpacing:".1em",
                border:`1px solid ${active ? G : "rgba(255,255,255,.1)"}`,
                background: active ? "rgba(212,167,61,.12)" : "transparent",
                color: active ? G : "#7A8FA8",
                transition:"all .2s", outline:"none",
              }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor="rgba(212,167,61,.3)"; (e.currentTarget as HTMLElement).style.color="#EDE8DC"; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color="#7A8FA8"; } }}
              >
                {cat}
              </button>
            );
          })}
          <span className="mono" style={{ fontSize:".6rem", color:"#2E4060", alignSelf:"center", marginLeft:".5rem" }}>
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* States */}
        {error && <p style={{ color:"#f87171", fontFamily:"monospace", fontSize:".7rem" }}>{error}</p>}

        {loading && (
          <div style={{ textAlign:"center", padding:"6rem" }}>
            <div style={{ width:"36px", height:"36px", border:"2px solid rgba(212,167,61,.2)", borderTop:`2px solid ${G}`, borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto" }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <p className="mono" style={{ fontSize:".65rem", color:"#2E4060", letterSpacing:".1em" }}>
            NO PROJECTS YET
          </p>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
            {filtered.map(p => <Card key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function Card({ p }: { p: Project }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:"10px", overflow:"hidden",
        border:`1px solid ${hov ? "rgba(212,167,61,.3)" : "rgba(255,255,255,.07)"}`,
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 20px 50px rgba(0,0,0,.5)" : "none",
        transition:"all .3s", background:"rgba(255,255,255,.02)",
      }}>
      {/* Cover — fixed 4:3 */}
      <div style={{ paddingBottom:"75%", position:"relative", overflow:"hidden" }}>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage: p.cover_image_url ? `url(${p.cover_image_url})` : "none",
          backgroundColor: p.cover_image_url ? undefined : "rgba(212,167,61,.04)",
          backgroundSize:"cover", backgroundPosition:"center",
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition:"transform .6s cubic-bezier(.25,.46,.45,.94)",
        }}>
          {!p.cover_image_url && (
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(212,167,61,.2)", fontSize:"3rem" }}>🏡</div>
          )}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(1,4,8,.88) 0%,rgba(1,4,8,.15) 60%,transparent 100%)" }}/>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,${G},transparent)`, opacity:hov?1:0, transition:"opacity .3s" }}/>
          <div style={{ position:"absolute", top:".875rem", left:".875rem" }}>
            <span style={{ fontFamily:"monospace", fontSize:".52rem", color:G, background:"rgba(1,4,8,.75)", border:"1px solid rgba(212,167,61,.25)", borderRadius:"100px", padding:".18rem .6rem", letterSpacing:".08em" }}>
              {p.category}
            </span>
          </div>
          {p.featured && (
            <div style={{ position:"absolute", top:".875rem", right:".875rem" }}>
              <span style={{ fontFamily:"monospace", fontSize:".5rem", color:"#010408", background:G, borderRadius:"100px", padding:".18rem .55rem" }}>★</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"1.1rem 1.25rem" }}>
        <h3 style={{ fontSize:".92rem", fontWeight:"600", color:"#EDE8DC", marginBottom:".3rem", lineHeight:1.3 }}>{p.title}</h3>
        {p.location && <p style={{ fontSize:".72rem", color:"#7A8FA8" }}>📍 {p.location}</p>}
      </div>
    </div>
  );
}
