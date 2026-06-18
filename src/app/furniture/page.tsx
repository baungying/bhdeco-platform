"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteImage from "@/components/SiteImage";
import type { SiteImageKey } from "@/config/siteImages";

// ─── Sample project data (replace with real photos via dashboard) ───────────
const FEATURED = {
  title: "Luxury Villa — Mandalay",
  category: "Villa",
  location: "Mandalay, Myanmar",
  year: "2024",
  desc: "Full interior execution for a 4,800 sq ft private villa. Custom wardrobe systems, Italian-finish kitchen, and bespoke TV feature wall throughout.",
  imgKey: "furnitureHero" as SiteImageKey,
};

const FEATURED_SECONDARY = [
  {
    title: "Modern Kitchen — Chan Mya",
    category: "Kitchen",
    location: "Mandalay",
    year: "2024",
    imgKey: "kitchenCabinetImg" as SiteImageKey,
  },
  {
    title: "Master Wardrobe Suite",
    category: "Wardrobe",
    location: "Mandalay",
    year: "2023",
    imgKey: "wardrobeImg" as SiteImageKey,
  },
];

type Category = "All" | "Kitchen" | "Wardrobe" | "TV Wall" | "Bedroom" | "Office" | "Commercial" | "Villa";
const CATEGORIES: Category[] = ["All","Kitchen","Wardrobe","TV Wall","Bedroom","Office","Commercial","Villa"];

interface Project {
  title: string;
  category: Category;
  location: string;
  year: string;
  size?: string;
  imgKey: SiteImageKey;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  { title:"Peninsula Kitchen — Pyigyitagon",     category:"Kitchen",    location:"Mandalay", year:"2024", size:"18 ft run", imgKey:"kitchenCabinetImg", featured:true },
  { title:"Walk-In Wardrobe — Aung Myay Tha",    category:"Wardrobe",   location:"Mandalay", year:"2024", size:"240 sq ft", imgKey:"wardrobeImg" },
  { title:"TV Feature Wall — Chanayethazan",      category:"TV Wall",    location:"Mandalay", year:"2024", size:"14 ft wide", imgKey:"tvCabinetImg" },
  { title:"Master Bedroom Suite — Sagaing",       category:"Bedroom",    location:"Sagaing",  year:"2023", imgKey:"bedroom" as SiteImageKey },
  { title:"Executive Office — Downtown",          category:"Office",     location:"Mandalay", year:"2023", imgKey:"studyDeskImg" },
  { title:"Hotel Reception — Strand Rd",          category:"Commercial", location:"Mandalay", year:"2024", size:"32 ft counter", imgKey:"receptionImg" },
  { title:"Villa Project — Amarapura",            category:"Villa",      location:"Amarapura",year:"2024", imgKey:"furnitureHero" as SiteImageKey, featured:true },
  { title:"U-Shape Kitchen — Maha Aung Myay",    category:"Kitchen",    location:"Mandalay", year:"2023", size:"22 ft run", imgKey:"productKitchen" as SiteImageKey },
  { title:"Sliding Wardrobe — Chanmyathazi",     category:"Wardrobe",   location:"Mandalay", year:"2023", imgKey:"productWardrobe" as SiteImageKey },
  { title:"Living Room TV Wall — Pyinmana",      category:"TV Wall",    location:"Naypyidaw",year:"2023", imgKey:"productTvCabinet" as SiteImageKey },
  { title:"Office Fitout — 83rd St",             category:"Office",     location:"Mandalay", year:"2024", imgKey:"office" as SiteImageKey },
  { title:"Commercial Showroom — Patheingyi",    category:"Commercial", location:"Mandalay", year:"2024", imgKey:"commercial" as SiteImageKey },
];

const OVERLAY = "linear-gradient(to top,rgba(1,4,8,.95) 0%,rgba(1,4,8,.5) 50%,rgba(1,4,8,.15) 100%)";
const GOLD = "#D4A73D";
const MUTED = "#7A8FA8";
const BG = "#010408";
const BORDER = "rgba(255,255,255,.07)";
const BORDER_GOLD = "rgba(212,167,61,.25)";

export default function ProjectsGallery() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter(p => p.category === active);

  return (
    <div style={{ background: BG, color: "#EDE8DC", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <SiteImage imageKey="furnitureHero" asBackground style={{
        minHeight: "72vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "10rem 2rem 5rem", textAlign: "center", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(1,4,8,.88) 0%,rgba(1,4,8,.7) 50%,rgba(1,4,8,.97) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", border: `1px solid ${BORDER_GOLD}`, borderRadius: "100px", padding: ".3rem 1rem", marginBottom: "2rem" }}>
            <span style={{ display: "block", width: "5px", height: "5px", borderRadius: "50%", background: GOLD }} />
            <span style={{ fontFamily: "monospace", fontSize: ".6rem", color: GOLD, letterSpacing: ".16em" }}>OUR PROJECTS</span>
          </div>
          <h1 className="fd" style={{ fontSize: "clamp(2.8rem,6.5vw,5.5rem)", fontWeight: "300", lineHeight: 1.08, marginBottom: "1.5rem" }}>
            Our Project <span style={{ fontStyle: "italic", color: GOLD }}>Gallery</span>
          </h1>
          <p style={{ color: MUTED, fontSize: "clamp(.95rem,2vw,1.1rem)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
            A curated collection of interior, furniture and custom cabinet projects completed by Blessing Home.
          </p>
          <a href="#projects" style={{
            display: "inline-flex", alignItems: "center", gap: ".75rem",
            padding: ".9rem 2.2rem", background: GOLD, color: "#010408",
            fontSize: ".72rem", fontWeight: "700", letterSpacing: ".14em",
            textDecoration: "none", transition: "opacity .2s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = ".82"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >
            EXPLORE PROJECTS <span style={{ fontSize: "1rem" }}>↓</span>
          </a>
        </div>
      </SiteImage>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "1.75rem 2rem", display: "flex", justifyContent: "center", gap: "clamp(2rem,6vw,6rem)", flexWrap: "wrap" }}>
        {[["120+","Projects Completed"],["8","Project Types"],["10+","Years Experience"],["60+","Skilled Team"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div className="fd" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: "300", color: GOLD, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: ".65rem", color: MUTED, letterSpacing: ".12em", textTransform: "uppercase", marginTop: ".35rem" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURED PROJECTS ── */}
      <section id="projects" style={{ padding: "6rem 2rem 0", maxWidth: "1280px", margin: "0 auto" }}>
        <p style={{ fontFamily: "monospace", fontSize: ".6rem", color: GOLD, letterSpacing: ".22em", marginBottom: ".75rem" }}>FEATURED WORK</p>
        <h2 className="fd" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: "300", marginBottom: "2.5rem" }}>
          Signature <span style={{ fontStyle: "italic", color: GOLD }}>Projects</span>
        </h2>

        {/* Featured layout: 1 large + 2 small */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "340px 340px", gap: "1rem" }}>
          {/* Large featured */}
          <SiteImage imageKey={FEATURED.imgKey} asBackground style={{
            gridRow: "1 / 3", borderRadius: "4px", overflow: "hidden", cursor: "default", position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, background: OVERLAY }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem", right: "2rem" }}>
              <div style={{ display: "inline-block", background: "rgba(212,167,61,.12)", border: `1px solid ${BORDER_GOLD}`, borderRadius: "100px", padding: ".2rem .7rem", marginBottom: ".75rem" }}>
                <span style={{ fontSize: ".58rem", color: GOLD, letterSpacing: ".12em", fontFamily: "monospace" }}>{FEATURED.category}</span>
              </div>
              <h3 className="fd" style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: "300", marginBottom: ".6rem", lineHeight: 1.2 }}>{FEATURED.title}</h3>
              <p style={{ fontSize: ".82rem", color: "rgba(237,232,220,.65)", lineHeight: 1.7, marginBottom: "1rem" }}>{FEATURED.desc}</p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <span style={{ fontSize: ".65rem", color: MUTED, letterSpacing: ".1em" }}>📍 {FEATURED.location}</span>
                <span style={{ fontSize: ".65rem", color: MUTED, letterSpacing: ".1em" }}>📅 {FEATURED.year}</span>
              </div>
            </div>
          </SiteImage>

          {/* Two smaller */}
          {FEATURED_SECONDARY.map(p => (
            <SiteImage key={p.title} imageKey={p.imgKey} asBackground style={{
              borderRadius: "4px", overflow: "hidden", cursor: "default", position: "relative",
            }}>
              <div style={{ position: "absolute", inset: 0, background: OVERLAY }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem" }}>
                <div style={{ display: "inline-block", background: "rgba(212,167,61,.1)", border: `1px solid ${BORDER_GOLD}`, borderRadius: "100px", padding: ".18rem .6rem", marginBottom: ".5rem" }}>
                  <span style={{ fontSize: ".55rem", color: GOLD, letterSpacing: ".1em", fontFamily: "monospace" }}>{p.category}</span>
                </div>
                <h3 className="fd" style={{ fontSize: "clamp(1rem,1.8vw,1.3rem)", fontWeight: "300", marginBottom: ".4rem" }}>{p.title}</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ fontSize: ".6rem", color: MUTED }}>📍 {p.location}</span>
                  <span style={{ fontSize: ".6rem", color: MUTED }}>📅 {p.year}</span>
                </div>
              </div>
            </SiteImage>
          ))}
        </div>
      </section>

      {/* ── CATEGORY FILTERS ── */}
      <section style={{ padding: "5rem 2rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: ".6rem", color: GOLD, letterSpacing: ".22em", marginBottom: ".4rem" }}>ALL WORK</p>
            <h2 className="fd" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: "300" }}>
              Browse by <span style={{ fontStyle: "italic", color: GOLD }}>Category</span>
            </h2>
          </div>
          <div style={{ fontSize: ".7rem", color: MUTED }}>{filtered.length} projects</div>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: ".45rem 1.1rem", borderRadius: "100px", cursor: "pointer",
              fontFamily: "monospace", fontSize: ".6rem", letterSpacing: ".1em",
              border: `1px solid ${active === cat ? GOLD : BORDER}`,
              background: active === cat ? "rgba(212,167,61,.12)" : "transparent",
              color: active === cat ? GOLD : MUTED,
              transition: "all .2s",
            }}
              onMouseEnter={e => { if (active !== cat) (e.currentTarget as HTMLElement).style.borderColor = BORDER_GOLD; }}
              onMouseLeave={e => { if (active !== cat) (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── MASONRY GRID ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1rem",
        }}>
          {filtered.map((p, i) => {
            const tall = p.featured || i % 5 === 0;
            return (
              <div key={p.title} style={{
                gridRow: tall ? "span 2" : "span 1",
                borderRadius: "4px", overflow: "hidden",
                border: `1px solid ${BORDER}`,
                transition: "border-color .3s, transform .3s, box-shadow .3s",
                position: "relative", cursor: "default",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = BORDER_GOLD;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 24px 60px rgba(0,0,0,.5)";
                  const overlay = el.querySelector(".proj-overlay") as HTMLElement;
                  if (overlay) overlay.style.opacity = "1";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = BORDER;
                  el.style.transform = "none";
                  el.style.boxShadow = "none";
                  const overlay = el.querySelector(".proj-overlay") as HTMLElement;
                  if (overlay) overlay.style.opacity = "0";
                }}
              >
                <SiteImage imageKey={p.imgKey} asBackground style={{
                  height: tall ? "480px" : "240px",
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 0, background: OVERLAY }} />

                  {/* Category badge */}
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(1,4,8,.7)", border: `1px solid ${BORDER_GOLD}`, borderRadius: "100px", padding: ".18rem .65rem" }}>
                    <span style={{ fontSize: ".55rem", color: GOLD, letterSpacing: ".1em", fontFamily: "monospace" }}>{p.category}</span>
                  </div>

                  {/* Info bottom */}
                  <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem", right: "1.25rem" }}>
                    <h3 className="fd" style={{ fontSize: tall ? "1.3rem" : "1rem", fontWeight: "300", marginBottom: ".4rem", lineHeight: 1.25 }}>{p.title}</h3>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: ".6rem", color: "rgba(237,232,220,.55)" }}>📍 {p.location}</span>
                      <span style={{ fontSize: ".6rem", color: "rgba(237,232,220,.55)" }}>📅 {p.year}</span>
                      {p.size && <span style={{ fontSize: ".6rem", color: GOLD }}>⬛ {p.size}</span>}
                    </div>
                  </div>

                  {/* Hover overlay line */}
                  <div className="proj-overlay" style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "2px", background: GOLD,
                    opacity: 0, transition: "opacity .3s",
                  }} />
                </SiteImage>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: "7rem 2rem 8rem", textAlign: "center" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".6rem", color: GOLD, letterSpacing: ".22em", marginBottom: "1.25rem" }}>START YOUR PROJECT</p>
          <h2 className="fd" style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: "300", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            Want a Similar <span style={{ fontStyle: "italic", color: GOLD }}>Design?</span>
          </h2>
          <p style={{ color: MUTED, fontSize: "1rem", lineHeight: 1.85, marginBottom: "2.5rem" }}>
            Start your design with BH DECO AI. Upload a photo of your space, select a style, and get a professional render in seconds — then our team builds it for real.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://bh-deco-ai.vercel.app" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: ".75rem",
              padding: "1rem 2.4rem", background: GOLD, color: "#010408",
              fontSize: ".72rem", fontWeight: "700", letterSpacing: ".14em",
              textDecoration: "none", transition: "opacity .2s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = ".82"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              START DESIGNING →
            </a>
            <a href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: ".75rem",
              padding: "1rem 2.4rem", border: `1px solid ${BORDER_GOLD}`, color: GOLD,
              fontSize: ".72rem", fontWeight: "500", letterSpacing: ".14em",
              textDecoration: "none", transition: "all .2s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(212,167,61,.08)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; }}
            >
              TALK TO US →
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 700px) {
          /* Single column on mobile */
        }
      `}</style>
    </div>
  );
}
