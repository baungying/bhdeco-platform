"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteImage from "@/components/SiteImage";
import type { SiteImageKey } from "@/config/siteImages";

// ─── Types ────────────────────────────────────────────────────────────────────
// Dashboard-ready — replace with getModels() API call when backend is live
type ModelFormat = "SKP" | "OBJ" | "FBX" | "3DS";
type ModelCategory =
  | "SketchUp Models" | "Furniture Modules" | "Kitchen Cabinets"
  | "Wardrobe Systems" | "TV Walls" | "Ceiling Designs"
  | "Villa Exterior" | "Interior Scenes";

interface Model3D {
  id: string;
  title: string;
  category: ModelCategory;
  previewImage: SiteImageKey; // maps to dashboard: previewImage
  format: ModelFormat[];
  fileSize: string;
  price: string;
  isFree: boolean;
  description: string;
  visible: boolean;
  sortOrder: number;
}

// ─── Category list (future: getCategories()) ──────────────────────────────────
type FilterCat = "All" | ModelCategory;
const CATEGORIES: FilterCat[] = [
  "All", "SketchUp Models", "Furniture Modules", "Kitchen Cabinets",
  "Wardrobe Systems", "TV Walls", "Ceiling Designs", "Villa Exterior", "Interior Scenes",
];

// ─── Sample data (future: getModels()) ───────────────────────────────────────
const MODELS: Model3D[] = [
  {
    id: "modern-kitchen-cabinet-set",
    title: "Modern Kitchen Cabinet Set",
    category: "Kitchen Cabinets",
    previewImage: "course1",
    format: ["SKP", "OBJ"],
    fileSize: "48 MB",
    price: "$29",
    isFree: false,
    description: "Full handleless kitchen cabinet system with island, upper cabinets and appliance zones. SketchUp 2021+.",
    visible: true, sortOrder: 1,
  },
  {
    id: "walk-in-wardrobe-system",
    title: "Walk-In Wardrobe System",
    category: "Wardrobe Systems",
    previewImage: "course2",
    format: ["SKP", "FBX"],
    fileSize: "36 MB",
    price: "$24",
    isFree: false,
    description: "Modular walk-in wardrobe with hanging sections, shoe racks, drawers and lighting strips.",
    visible: true, sortOrder: 2,
  },
  {
    id: "tv-feature-wall-model",
    title: "TV Feature Wall Model",
    category: "TV Walls",
    previewImage: "course3",
    format: ["SKP", "OBJ", "FBX"],
    fileSize: "22 MB",
    price: "Free",
    isFree: true,
    description: "14ft TV feature wall with floating shelves, fluted panel sections and integrated LED channel details.",
    visible: true, sortOrder: 3,
  },
  {
    id: "luxury-villa-exterior",
    title: "Luxury Villa Exterior",
    category: "Villa Exterior",
    previewImage: "course4",
    format: ["SKP", "OBJ"],
    fileSize: "92 MB",
    price: "$59",
    isFree: false,
    description: "Full villa exterior with landscaping, driveway, pool terrace and façade details. Mandalay contemporary style.",
    visible: true, sortOrder: 4,
  },
  {
    id: "minimal-bedroom-scene",
    title: "Minimal Bedroom Scene",
    category: "Interior Scenes",
    previewImage: "course5",
    format: ["SKP", "FBX", "3DS"],
    fileSize: "31 MB",
    price: "Free",
    isFree: true,
    description: "Complete minimalist master bedroom scene with bed, side tables, wardrobe and ceiling detail.",
    visible: true, sortOrder: 5,
  },
  {
    id: "office-reception-counter",
    title: "Office Reception Counter",
    category: "Furniture Modules",
    previewImage: "course6",
    format: ["SKP", "OBJ"],
    fileSize: "18 MB",
    price: "$19",
    isFree: false,
    description: "Curved reception counter with backlit panel, brand signage slot and storage below.",
    visible: true, sortOrder: 6,
  },
  {
    id: "ceiling-design-module",
    title: "Ceiling Design Module Pack",
    category: "Ceiling Designs",
    previewImage: "course1",
    format: ["SKP"],
    fileSize: "14 MB",
    price: "$15",
    isFree: false,
    description: "6 ceiling design modules: cove light, coffered, layered tray, linear baffle, stretched fabric and acoustic tile.",
    visible: true, sortOrder: 7,
  },
  {
    id: "vanity-cabinet-set",
    title: "Vanity Cabinet Set",
    category: "Furniture Modules",
    previewImage: "course2",
    format: ["SKP", "OBJ", "FBX"],
    fileSize: "26 MB",
    price: "$22",
    isFree: false,
    description: "Three bathroom vanity configurations with mirror cabinet, wall-hung and freestanding options.",
    visible: true, sortOrder: 8,
  },
  {
    id: "living-room-interior-scene",
    title: "Living Room Interior Scene",
    category: "Interior Scenes",
    previewImage: "course3",
    format: ["SKP", "FBX", "3DS"],
    fileSize: "55 MB",
    price: "$35",
    isFree: false,
    description: "Full living room scene with sofa, coffee table, TV wall, curtains and ambient lighting setup.",
    visible: true, sortOrder: 9,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const G = "#D4A73D";
const MUTED = "#7A8FA8";
const BORDER = "rgba(255,255,255,.07)";
const BORDER_HOV = "rgba(212,167,61,.25)";

// ─── Format badge ─────────────────────────────────────────────────────────────
function FormatBadge({ fmt }: { fmt: string }) {
  return (
    <span style={{
      fontFamily: "JetBrains Mono,monospace", fontSize: ".52rem",
      color: G, background: "rgba(212,167,61,.10)",
      border: "1px solid rgba(212,167,61,.22)",
      borderRadius: "3px", padding: ".14rem .42rem", letterSpacing: ".06em",
    }}>{fmt}</span>
  );
}

// ─── Model card ───────────────────────────────────────────────────────────────
function ModelCard({ m }: { m: Model3D }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{
        background: "rgba(255,255,255,.02)",
        border: `1px solid ${hov ? BORDER_HOV : BORDER}`,
        borderRadius: "14px", overflow: "hidden",
        transition: "all .3s", display: "flex", flexDirection: "column",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 24px 60px rgba(0,0,0,.45)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Preview image */}
      <SiteImage imageKey={m.previewImage} asBackground style={{ height: "200px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(1,4,8,.88) 0%,rgba(1,4,8,.2) 100%)" }} />

        {/* Price badge */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <span style={{
            fontFamily: "JetBrains Mono,monospace", fontSize: ".62rem", fontWeight: "700",
            color: m.isFree ? "#10B981" : G,
            background: m.isFree ? "rgba(16,185,129,.12)" : "rgba(212,167,61,.12)",
            border: `1px solid ${m.isFree ? "rgba(16,185,129,.3)" : "rgba(212,167,61,.3)"}`,
            borderRadius: "100px", padding: ".22rem .7rem",
          }}>{m.price}</span>
        </div>

        {/* Category badge */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <span style={{
            fontFamily: "JetBrains Mono,monospace", fontSize: ".52rem",
            color: "rgba(237,232,220,.6)",
            background: "rgba(1,4,8,.6)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "100px", padding: ".18rem .6rem", letterSpacing: ".08em",
          }}>{m.category}</span>
        </div>

        {/* Formats row */}
        <div style={{ position: "absolute", bottom: ".875rem", left: "1rem", display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {m.format.map(f => <FormatBadge key={f} fmt={f} />)}
        </div>
      </SiteImage>

      {/* Card body */}
      <div style={{ padding: "1.4rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: ".5rem", lineHeight: 1.3, color: "#EDE8DC" }}>
          {m.title}
        </h3>
        <p style={{ color: MUTED, fontSize: ".8rem", lineHeight: 1.65, flex: 1, marginBottom: "1rem" }}>
          {m.description}
        </p>

        {/* File size */}
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.1rem" }}>
          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".55rem", color: "#2E4060", letterSpacing: ".1em" }}>FILE SIZE</span>
          <span style={{ fontSize: ".78rem", color: "#EDE8DC" }}>{m.fileSize}</span>
        </div>

        {/* CTA */}
        <a
          href={m.isFree
            ? `mailto:support@bhdeco.ai?subject=Download Request — ${m.title}`
            : `mailto:support@bhdeco.ai?subject=Purchase Request — ${m.title}`}
          className={m.isFree ? "btn-outline" : "btn-gold"}
          style={{ width: "100%", justifyContent: "center", fontSize: ".72rem", padding: ".8rem 1rem" }}
        >
          {m.isFree ? "DOWNLOAD FREE →" : "BUY NOW →"}
        </a>
      </div>
    </div>
  );
}

// ─── Stat ────────────────────────────────────────────────────────────────────
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="fd" style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: "300", color: G, lineHeight: 1 }}>{n}</div>
      <div className="mono" style={{ fontSize: ".58rem", color: "#2E4060", letterSpacing: ".14em", textTransform: "uppercase", marginTop: ".4rem" }}>{label}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Models3D() {
  const [active, setActive] = useState<FilterCat>("All");
  const visible = MODELS.filter(m => m.visible);
  const filtered = active === "All" ? visible : visible.filter(m => m.category === active);

  return (
    <div style={{ background: "#010408", color: "#EDE8DC", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <SiteImage imageKey="coursesHero" asBackground style={{
        padding: "9rem 2rem 5rem", textAlign: "center", position: "relative",
        minHeight: "55vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(1,4,8,.92) 0%,rgba(1,4,8,.78) 50%,rgba(1,4,8,.97) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 80%,rgba(212,167,61,.05) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "620px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: ".5rem",
            border: "1px solid rgba(212,167,61,.28)", borderRadius: "100px",
            padding: ".3rem 1rem", marginBottom: "1.5rem",
            background: "rgba(212,167,61,.06)",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: G, display: "block" }} />
            <span className="mono" style={{ fontSize: ".58rem", color: G, letterSpacing: ".18em" }}>DIGITAL ASSETS</span>
          </div>

          <h1 className="fd" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: "300", marginBottom: "1.25rem", lineHeight: 1.08 }}>
            3D Model <span style={{ fontStyle: "italic" }} className="gt">Library</span>
          </h1>
          <p style={{ color: MUTED, maxWidth: "480px", margin: "0 auto 2.25rem", lineHeight: 1.9, fontSize: "clamp(.9rem,1.6vw,1rem)" }}>
            Premium SketchUp, furniture and interior design models for faster design workflow.
          </p>
          <a href="#models" className="btn-gold" style={{ fontSize: ".7rem" }}>
            BROWSE MODELS ↓
          </a>
        </div>
      </SiteImage>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)",
        padding: "2rem", display: "flex", justifyContent: "center",
        gap: "clamp(2.5rem,7vw,7rem)", flexWrap: "wrap",
        background: "rgba(4,12,28,.6)",
      }}>
        <Stat n={String(MODELS.length)} label="Models Available" />
        <Stat n={MODELS.filter(m => m.isFree).length + "+"} label="Free Downloads" />
        <Stat n="4" label="File Formats" />
        <Stat n="8" label="Categories" />
      </div>

      {/* ── FILTER + GRID ─────────────────────────────────────────────────── */}
      <section id="models" style={{ padding: "5rem 2rem 7rem", maxWidth: "1320px", margin: "0 auto" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <p className="mono" style={{ fontSize: ".58rem", color: G, letterSpacing: ".22em", marginBottom: ".6rem" }}>ALL ASSETS</p>
            <h2 className="fd" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: "300" }}>
              Browse by <span className="gt" style={{ fontStyle: "italic" }}>Category</span>
            </h2>
          </div>
          <span className="mono" style={{ fontSize: ".6rem", color: "#2E4060", letterSpacing: ".1em" }}>
            {filtered.length} MODEL{filtered.length !== 1 ? "S" : ""}
          </span>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {CATEGORIES.map(cat => {
            const isActive = cat === active;
            return (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: ".42rem 1.1rem", borderRadius: "100px", cursor: "pointer",
                fontFamily: "JetBrains Mono,monospace", fontSize: ".58rem", letterSpacing: ".08em",
                border: `1px solid ${isActive ? G : "rgba(255,255,255,.1)"}`,
                background: isActive ? "rgba(212,167,61,.12)" : "transparent",
                color: isActive ? G : MUTED,
                transition: "all .2s", outline: "none",
              }}
                onMouseEnter={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(212,167,61,.28)"; el.style.color = "#EDE8DC"; } }}
                onMouseLeave={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,.1)"; el.style.color = MUTED; } }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Model grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
          {filtered.map(m => <ModelCard key={m.id} m={m} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <p className="mono" style={{ fontSize: ".65rem", color: "#2E4060", letterSpacing: ".14em" }}>NO MODELS IN THIS CATEGORY YET</p>
          </div>
        )}
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{
        padding: "6rem 2rem 7rem", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,.04)",
        background: "linear-gradient(180deg,rgba(4,12,28,.4) 0%,rgba(1,4,8,1) 100%)",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p className="mono" style={{ fontSize: ".58rem", color: G, letterSpacing: ".22em", marginBottom: "1.25rem" }}>DESIGN FASTER</p>
          <h2 className="fd" style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: "300", marginBottom: "1.25rem", lineHeight: 1.08 }}>
            Use Models Inside <span className="gt" style={{ fontStyle: "italic" }}>BH DECO AI</span>
          </h2>
          <p style={{ color: MUTED, fontSize: "clamp(.88rem,1.5vw,1rem)", lineHeight: 1.9, marginBottom: "2.5rem" }}>
            Import your SketchUp models directly into the AI design workflow. Generate professional renders from your own 3D assets in seconds.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://bh-deco-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: ".72rem" }}>
              OPEN DESIGN STUDIO →
            </a>
            <a href="/contact" className="btn-outline" style={{ fontSize: ".72rem" }}>
              REQUEST CUSTOM MODEL →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
