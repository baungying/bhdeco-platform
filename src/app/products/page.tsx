"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteImage from "@/components/SiteImage";
import { supabase } from "@/lib/supabase";

const G = "#D4A73D";

// Categories match admin exactly
const CATS = [
  { id:"All",                 label:"All",                 icon:"◈"  },
  { id:"C Channel Frame",     label:"C Channel Frame",     icon:"🔩" },
  { id:"Light Steel",         label:"Light Steel",         icon:"🏗️" },
  { id:"Board",               label:"Board",               icon:"🪵" },
  { id:"Flooring",            label:"Flooring",            icon:"🟫" },
  { id:"Wall Panel",          label:"Wall Panel",          icon:"🎨" },
  { id:"Hardware",            label:"Hardware",            icon:"🔧" },
  { id:"Furniture",           label:"Furniture",           icon:"🪑" },
  { id:"Cabinet Accessories", label:"Cabinet Accessories", icon:"🗄️" },
  { id:"Mobihome",            label:"Mobihome",            icon:"🏡" },
  { id:"Other",               label:"Other",               icon:"📦" },
];

interface Product {
  id:              string;
  name:            string;
  category:        string;
  sub_category:    string;
  price:           string;
  description:     string;
  cover_image_url: string;
  featured:        boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [active,   setActive]   = useState("All");

  useEffect(() => {
    supabase
      .from("cms_products")
      .select("id,name,category,sub_category,price,description,cover_image_url,featured")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at",  { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { setError("Failed to load products."); setLoading(false); return; }
        setProducts((data ?? []).map(p => ({
          id:              String(p.id              ?? ""),
          name:            String(p.name            ?? ""),
          category:        String(p.category        ?? ""),
          sub_category:    String(p.sub_category    ?? ""),
          price:           String(p.price           ?? ""),
          description:     String(p.description     ?? ""),
          cover_image_url: String(p.cover_image_url ?? ""),
          featured:        Boolean(p.featured),
        })));
        setLoading(false);
      });
  }, []);

  // Categories that actually have products, plus "All"
  const populated = CATS.filter(c =>
    c.id === "All" || products.some(p => p.category === c.id)
  );

  const filtered = active === "All"
    ? products
    : products.filter(p => p.category === active);

  // Group for section display when showing All
  const groups = active === "All"
    ? populated.filter(c => c.id !== "All")
    : populated.filter(c => c.id === active);

  return (
    <div style={{ background:"#010408", color:"#EDE8DC", minHeight:"100vh" }}>
      <Navbar/>

      {/* Hero */}
      <SiteImage imageKey="productsHero" asBackground style={{
        padding:"9rem 2rem 5rem", textAlign:"center", position:"relative",
        minHeight:"55vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(1,4,8,.92) 0%,rgba(1,4,8,.82) 50%,rgba(1,4,8,.96) 100%)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ fontFamily:"monospace", fontSize:".6rem", color:G, letterSpacing:".22em", marginBottom:"1rem" }}>BLESSING HOME PRODUCTS</p>
          <h1 className="fd" style={{ fontSize:"clamp(2.5rem,6vw,4.5rem)", fontWeight:"300", marginBottom:"1.25rem" }}>
            Premium <span style={{ fontStyle:"italic", color:G }}>Products</span>
          </h1>
          <p style={{ color:"#7A8FA8", maxWidth:"520px", margin:"0 auto", lineHeight:"1.9" }}>
            From light steel framing and container houses to premium boards, wall systems and modular homes — discover products engineered for modern construction.
          </p>
        </div>
      </SiteImage>

      {/* Sticky filter tabs */}
      <div style={{ padding:"1.75rem", background:"rgba(1,4,8,.95)", borderBottom:"1px solid rgba(255,255,255,.06)", position:"sticky", top:"64px", zIndex:100, backdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"flex", gap:".5rem", flexWrap:"wrap", justifyContent:"center" }}>
          {populated.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              style={{
                display:"flex", alignItems:"center", gap:".4rem",
                padding:".4rem 1rem",
                background: active===c.id ? "rgba(212,167,61,.12)" : "rgba(255,255,255,.04)",
                border: `1px solid ${active===c.id ? "rgba(212,167,61,.4)" : "rgba(255,255,255,.08)"}`,
                borderRadius:"100px", cursor:"pointer",
                color: active===c.id ? G : "#7A8FA8",
                fontSize:".76rem", transition:"all .2s", outline:"none",
                fontFamily:"inherit",
              }}
              onMouseEnter={e => { if(active!==c.id){ (e.currentTarget as HTMLElement).style.borderColor="rgba(212,167,61,.3)"; (e.currentTarget as HTMLElement).style.color=G; }}}
              onMouseLeave={e => { if(active!==c.id){ (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.08)"; (e.currentTarget as HTMLElement).style.color="#7A8FA8"; }}}>
              <span>{c.icon}</span><span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <section style={{ padding:"5rem 2rem 7rem", background:"#010408" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:"center", padding:"6rem" }}>
              <div style={{ width:"36px", height:"36px", border:"2px solid rgba(212,167,61,.2)", borderTop:`2px solid ${G}`, borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto" }}/>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Error */}
          {error && <p style={{ color:"#f87171", fontFamily:"monospace", fontSize:".7rem" }}>{error}</p>}

          {/* No products */}
          {!loading && !error && filtered.length===0 && (
            <p style={{ color:"#2E4060", fontFamily:"monospace", fontSize:".65rem", letterSpacing:".1em" }}>
              NO PRODUCTS IN THIS CATEGORY YET
            </p>
          )}

          {/* Products grouped by category */}
          {!loading && !error && groups.map(cat => {
            const list = active==="All"
              ? products.filter(p => p.category===cat.id)
              : filtered;
            if (!list.length) return null;
            return (
              <div key={cat.id} id={cat.id} style={{ marginBottom:"5rem" }}>
                {/* Section heading */}
                <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
                  <span style={{ fontSize:"1.5rem" }}>{cat.icon}</span>
                  <h2 className="fd" style={{ fontSize:"clamp(1.8rem,3.5vw,2.5rem)", fontWeight:"300" }}>{cat.label}</h2>
                  <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,rgba(212,167,61,.3),transparent)` }}/>
                </div>

                {/* Card grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
                  {list.map(p => (
                    <div key={p.id}
                      style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"14px", overflow:"hidden", transition:"all .3s" }}
                      onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor="rgba(212,167,61,.22)"; el.style.transform="translateY(-4px)"; el.style.boxShadow="0 20px 60px rgba(0,0,0,.4)"; }}
                      onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor="rgba(255,255,255,.07)"; el.style.transform="none"; el.style.boxShadow="none"; }}>

                      {/* Cover image */}
                      <div style={{ height:"180px", position:"relative", borderBottom:"1px solid rgba(255,255,255,.06)", overflow:"hidden" }}>
                        {p.cover_image_url ? (
                          <div style={{ position:"absolute", inset:0, backgroundImage:`url(${p.cover_image_url})`, backgroundSize:"cover", backgroundPosition:"center" }}>
                            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(1,4,8,.6) 0%,transparent 60%)" }}/>
                          </div>
                        ) : (
                          <div style={{ position:"absolute", inset:0, background:"rgba(212,167,61,.03)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:"2.5rem", opacity:.15 }}>{cat.icon}</span>
                          </div>
                        )}
                        {p.featured && (
                          <div style={{ position:"absolute", top:".75rem", right:".75rem" }}>
                            <span style={{ fontFamily:"monospace", fontSize:".52rem", color:"#010408", background:G, borderRadius:"100px", padding:".18rem .55rem" }}>★ FEATURED</span>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div style={{ padding:"1.5rem" }}>
                        <h3 style={{ fontSize:"1rem", fontWeight:"600", marginBottom:".3rem" }}>{p.name}</h3>
                        {p.sub_category && (
                          <p style={{ fontFamily:"monospace", fontSize:".6rem", color:G, letterSpacing:".08em", marginBottom:".5rem" }}>{p.sub_category}</p>
                        )}
                        {p.description && (
                          <p style={{ color:"#7A8FA8", fontSize:".82rem", lineHeight:"1.65", marginBottom:"1rem" }}>{p.description}</p>
                        )}
                        {p.price && (
                          <div style={{ display:"flex", gap:".6rem", marginBottom:"1.25rem" }}>
                            <span style={{ fontFamily:"monospace", fontSize:".6rem", color:"#2E4060", width:"65px", flexShrink:0 }}>PRICE</span>
                            <span style={{ fontSize:".8rem", color:"#EDE8DC" }}>{p.price}</span>
                          </div>
                        )}
                        <div
  style={{
    display:"flex",
    gap:".75rem",
    marginTop:"1rem"
  }}
>

  <a
    href="tel:+959xxxxxxxxx"
    style={{
      flex:1,
      textAlign:"center",
      padding:".75rem",
      borderRadius:"10px",
      border:"1px solid rgba(212,167,61,.35)",
      background:"rgba(212,167,61,.08)",
      color:"#D4A73D",
      textDecoration:"none",
      fontSize:".75rem",
      fontWeight:600,
    }}
  >
    📞 CALL
  </a>

  <a
    href="viber://chat?number=%2B959xxxxxxxxx"
    style={{
      flex:1,
      textAlign:"center",
      padding:".75rem",
      borderRadius:"10px",
      border:"1px solid rgba(255,255,255,.08)",
      background:"rgba(255,255,255,.03)",
      color:"#EDE8DC",
      textDecoration:"none",
      fontSize:".75rem",
      fontWeight:600,
    }}
  >
    💜 VIBER
  </a>

</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer/>
    </div>
  );
}
