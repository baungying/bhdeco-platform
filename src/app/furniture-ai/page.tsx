"use client";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateFurniture, pollJob, absoluteUrl, JobStatus } from "@/lib/api";
type JobWithId = JobStatus & { job_id: string };

const FURNITURE_TYPES = [
  { id:"wardrobe",       label:"Wardrobe",         icon:"🪟", desc:"Walk-in, sliding or swing doors" },
  { id:"tv_cabinet",     label:"TV Cabinet",        icon:"📺", desc:"Feature wall with shelving" },
  { id:"kitchen_cabinet",label:"Kitchen Cabinet",   icon:"🍳", desc:"L-shape, U-shape, island" },
  { id:"vanity",         label:"Vanity",            icon:"💄", desc:"Bathroom vanity with mirror" },
  { id:"study_desk",     label:"Study Desk",        icon:"📖", desc:"Built-in desk with bookshelf" },
  { id:"reception",      label:"Reception Counter", icon:"🏢", desc:"Commercial reception desk" },
];

function DrawingTab({ label, url, active, onClick }: { label: string; url?: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding:".55rem 1.1rem", borderRadius:"6px", border:`1px solid ${active ? "#D4A73D" : "rgba(255,255,255,.08)"}`,
      background: active ? "rgba(212,167,61,.1)" : "transparent",
      color: active ? "#D4A73D" : url ? "#7A8FA8" : "#2E4060",
      fontFamily:"monospace", fontSize:".65rem", letterSpacing:".08em", cursor: url ? "pointer" : "default",
      transition:"all .2s",
    }}>
      {label} {!url && "(pending)"}
    </button>
  );
}

export default function FurnitureAIPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [furType, setFurType] = useState("wardrobe");
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [result, setResult] = useState<{ job_id: string; front_elevation_url?: string; plan_url?: string; section_url?: string; svg_url?: string; modules?: string[]; dimensions?: { width:number; height:number; depth:number }; material_list?: { item:string; qty:number; unit:string }[] } | null>(null);
  const [activeView, setActiveView] = useState("front_elevation");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const generate = async () => {
    if (!photo) { setError("Please upload a furniture photo."); return; }
    setError(""); setLoading(true); setResult(null); setJob(null);
    try {
      // POST /api/furniture-construction/generate — multipart/form-data
      const initial = await generateFurniture({ image: photo, furniture_type: furType }) as JobWithId;
      setJob(initial);
      const final = await pollJob(initial.job_id, j => setJob({ ...j }));
      setJob(final);
      // Build result from job data
      const urls = final.result_urls || (final.result_url ? [final.result_url] : []);
      setResult({
        job_id: initial.job_id,
        front_elevation_url: urls[0] ? absoluteUrl(urls[0]) : undefined,
        plan_url: urls[1] ? absoluteUrl(urls[1]) : undefined,
        section_url: urls[2] ? absoluteUrl(urls[2]) : undefined,
        svg_url: urls[3] ? absoluteUrl(urls[3]) : undefined,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally { setLoading(false); }
  };

  const pct = job?.progress ?? (job?.status === "completed" ? 100 : job?.status === "processing" ? 55 : 20);

  const views = [
    { id:"front_elevation", label:"Front Elevation", url: result?.front_elevation_url },
    { id:"plan",            label:"Plan View",       url: result?.plan_url },
    { id:"section",         label:"Section",         url: result?.section_url },
    { id:"svg",             label:"SVG Drawing",     url: result?.svg_url },
  ];

  const activeUrl = views.find(v => v.id === activeView)?.url;

  return (
    <div style={{ background:"#010408", color:"#EDE8DC", minHeight:"100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background:"linear-gradient(170deg,#010408 0%,#040e08 50%,#010408 100%)", padding:"7rem 2rem 4rem", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"rgba(212,167,61,.08)", border:"1px solid rgba(212,167,61,.25)", borderRadius:"100px", padding:".3rem .9rem", marginBottom:"1.5rem" }}>
          <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#D4A73D", boxShadow:"0 0 8px #D4A73D88" }} />
          <span style={{ fontFamily:"monospace", fontSize:".6rem", color:"#D4A73D", letterSpacing:".12em" }}>FURNITURE CONSTRUCTION AI ⭐ CORE PRODUCT</span>
        </div>
        <h1 className="fd" style={{ fontSize:"clamp(2.5rem,6vw,5rem)", fontWeight:"300", marginBottom:"1rem" }}>
          Furniture <span style={{ fontStyle:"italic", color:"#D4A73D" }}>Construction</span>
        </h1>
        <p style={{ color:"#7A8FA8", maxWidth:"560px", margin:"0 auto", lineHeight:"1.85", fontSize:".97rem" }}>
          Upload any furniture photo. AI detects the layout, modules, and dimensions — then generates front elevation, plan, section, material list, and SVG drawings.
        </p>
        <div style={{ display:"flex", gap:".75rem", justifyContent:"center", flexWrap:"wrap", marginTop:"1.5rem" }}>
          {["No competitor has this","Manufacturing-ready drawings","SVG download","Material & hardware lists"].map(t => (
            <span key={t} style={{ fontFamily:"monospace", fontSize:".62rem", color:"#D4A73D", background:"rgba(212,167,61,.08)", border:"1px solid rgba(212,167,61,.15)", borderRadius:"100px", padding:".25rem .75rem" }}>{t}</span>
          ))}
        </div>
      </section>

      <section style={{ maxWidth:"1280px", margin:"0 auto", padding:"3rem 2rem 6rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:"3rem", alignItems:"start" }} className="bh-fur-grid">

          {/* LEFT — Controls */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.75rem" }}>

            {/* Upload */}
            <div>
              <label style={{ display:"block", fontFamily:"monospace", fontSize:".6rem", color:"#D4A73D", letterSpacing:".15em", textTransform:"uppercase", marginBottom:".75rem" }}>01 · FURNITURE PHOTO</label>
              <div onClick={() => ref.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                style={{ position:"relative", cursor:"pointer", borderRadius:"12px", border:`2px dashed ${drag ? "#D4A73D" : "rgba(255,255,255,.12)"}`, background: drag ? "rgba(212,167,61,.05)" : "rgba(255,255,255,.02)", transition:"all .25s", overflow:"hidden", minHeight:"200px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {preview ? (
                  <>
                    <img src={preview} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.75 }} />
                    <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,4,8,.8),transparent)" }} />
                    <div style={{ position:"relative",zIndex:1,textAlign:"center" }}>
                      <span style={{ fontFamily:"monospace",fontSize:".62rem",color:"#D4A73D" }}>✓ {photo?.name}</span>
                      <p style={{ fontFamily:"monospace",fontSize:".55rem",color:"#2E4060",marginTop:".25rem" }}>Click to change</p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:"center", padding:"2rem" }}>
                    <div style={{ fontSize:"2.5rem",marginBottom:"1rem" }}>🪑</div>
                    <p style={{ color:"#EDE8DC",fontSize:".9rem",fontWeight:"500",marginBottom:".3rem" }}>Upload Furniture Photo</p>
                    <p style={{ color:"#2E4060",fontSize:".75rem" }}>Photo, render, or sketch</p>
                  </div>
                )}
                <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            </div>

            {/* Furniture type */}
            <div>
              <label style={{ display:"block", fontFamily:"monospace", fontSize:".6rem", color:"#D4A73D", letterSpacing:".15em", textTransform:"uppercase", marginBottom:".75rem" }}>02 · FURNITURE TYPE</label>
              <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
                {FURNITURE_TYPES.map(t => (
                  <button key={t.id} onClick={() => setFurType(t.id)} style={{
                    display:"flex", alignItems:"center", gap:"1rem", padding:".8rem 1rem",
                    borderRadius:"8px", border:`1px solid ${furType === t.id ? "#D4A73D" : "rgba(255,255,255,.07)"}`,
                    background: furType === t.id ? "rgba(212,167,61,.08)" : "rgba(255,255,255,.02)",
                    cursor:"pointer", transition:"all .2s", textAlign:"left",
                  }}>
                    <span style={{ fontSize:"1.3rem", flexShrink:0 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize:".85rem", fontWeight:"500", color: furType === t.id ? "#D4A73D" : "#EDE8DC", marginBottom:".15rem" }}>{t.label}</div>
                      <div style={{ fontSize:".72rem", color:"#2E4060" }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ padding:"1rem", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)", borderRadius:"8px" }}>
                <p style={{ color:"#f87171", fontSize:".85rem" }}>{error}</p>
              </div>
            )}

            <button onClick={generate} disabled={loading || !photo} style={{
              width:"100%", padding:"1.1rem", borderRadius:"8px", border:"none",
              cursor: loading || !photo ? "not-allowed" : "pointer",
              background: loading || !photo ? "rgba(255,255,255,.06)" : "linear-gradient(135deg,#D4A73D,#9A7020)",
              color: loading || !photo ? "#2E4060" : "#010408",
              fontWeight:"700", fontSize:".85rem", letterSpacing:".08em", textTransform:"uppercase", transition:"all .3s",
            }}>
              {loading ? "GENERATING DRAWINGS..." : !photo ? "UPLOAD A PHOTO FIRST" : "✦ GENERATE CONSTRUCTION PLANS"}
            </button>

            {loading && job && (
              <div style={{ padding:"1.25rem", background:"rgba(212,167,61,.04)", border:"1px solid rgba(212,167,61,.15)", borderRadius:"10px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".6rem" }}>
                  <span style={{ fontFamily:"monospace", fontSize:".65rem", color:"#D4A73D" }}>
                    {job.status === "pending" ? "Queued — waiting..." : "Generating construction drawings..."}
                  </span>
                  <span style={{ fontFamily:"monospace", fontSize:".65rem", color:"#2E4060" }}>{pct}%</span>
                </div>
                <div style={{ height:"2px", background:"rgba(255,255,255,.06)", borderRadius:"1px" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#D4A73D,#F0C040)", transition:"width .5s" }} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Drawings output */}
          <div>
            {result ? (
              <div>
                {/* Drawing tabs */}
                <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
                  {views.map(v => <DrawingTab key={v.id} label={v.label} url={v.url} active={activeView === v.id} onClick={() => v.url && setActiveView(v.id)} />)}
                </div>

                {/* Drawing display */}
                <div style={{ borderRadius:"14px", overflow:"hidden", border:"1px solid rgba(212,167,61,.2)", background:"#030810", minHeight:"400px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {activeUrl ? (
                    <img src={activeUrl} alt={activeView} style={{ width:"100%", display:"block", objectFit:"contain", maxHeight:"600px" }} />
                  ) : (
                    <div style={{ textAlign:"center", padding:"3rem" }}>
                      <p style={{ color:"#2E4060", fontFamily:"monospace", fontSize:".72rem" }}>This view is generating...</p>
                    </div>
                  )}
                </div>

                {/* Download buttons */}
                <div style={{ display:"flex", gap:".75rem", marginTop:"1rem", flexWrap:"wrap" }}>
                  {views.filter(v => v.url).map(v => (
                    <a key={v.id} href={v.url} download={`bhdeco-${v.id}.${v.id === "svg" ? "svg" : "jpg"}`} target="_blank" rel="noopener noreferrer"
                      style={{ display:"inline-flex", alignItems:"center", gap:".4rem", padding:".55rem 1rem", background:"rgba(212,167,61,.08)", border:"1px solid rgba(212,167,61,.2)", borderRadius:"6px", color:"#D4A73D", fontFamily:"monospace", fontSize:".65rem", letterSpacing:".08em", textDecoration:"none", transition:"all .2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,167,61,.15)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(212,167,61,.08)")}>
                      ↓ {v.label}
                    </a>
                  ))}
                </div>

                {/* Module info */}
                {result.modules && result.modules.length > 0 && (
                  <div style={{ marginTop:"1.5rem", padding:"1.5rem", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:"12px" }}>
                    <p style={{ fontFamily:"monospace", fontSize:".6rem", color:"#D4A73D", letterSpacing:".12em", marginBottom:"1rem" }}>AI DETECTION RESULTS</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                      <div>
                        <p style={{ fontFamily:"monospace", fontSize:".58rem", color:"#2E4060", marginBottom:".5rem" }}>MODULES DETECTED</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem" }}>
                          {result.modules.map(m => <span key={m} style={{ fontFamily:"monospace", fontSize:".65rem", color:"#EDE8DC", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"4px", padding:".2rem .5rem" }}>{m}</span>)}
                        </div>
                      </div>
                      {result.dimensions && (
                        <div>
                          <p style={{ fontFamily:"monospace", fontSize:".58rem", color:"#2E4060", marginBottom:".5rem" }}>DIMENSIONS</p>
                          <p style={{ fontFamily:"monospace", fontSize:".72rem", color:"#EDE8DC" }}>W {result.dimensions.width} × H {result.dimensions.height} × D {result.dimensions.depth} mm</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Material list */}
                {result.material_list && result.material_list.length > 0 && (
                  <div style={{ marginTop:"1rem", padding:"1.5rem", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:"12px" }}>
                    <p style={{ fontFamily:"monospace", fontSize:".6rem", color:"#D4A73D", letterSpacing:".12em", marginBottom:"1rem" }}>MATERIAL LIST</p>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr>
                          {["Item","Qty","Unit"].map(h => <th key={h} style={{ textAlign:"left", fontFamily:"monospace", fontSize:".58rem", color:"#2E4060", paddingBottom:".5rem", fontWeight:"normal" }}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {result.material_list.map((m, i) => (
                          <tr key={i} style={{ borderTop:"1px solid rgba(255,255,255,.04)" }}>
                            <td style={{ padding:".4rem 0", fontSize:".8rem" }}>{m.item}</td>
                            <td style={{ padding:".4rem 0", fontSize:".8rem", fontFamily:"monospace" }}>{m.qty}</td>
                            <td style={{ padding:".4rem 0", fontSize:".8rem", color:"#7A8FA8" }}>{m.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"500px", border:"1px solid rgba(255,255,255,.05)", borderRadius:"16px", background:"rgba(255,255,255,.01)", textAlign:"center", padding:"3rem 2rem" }}>
                <div style={{ fontSize:"4rem", marginBottom:"1.5rem", opacity:.2 }}>📐</div>
                <p className="fd" style={{ fontSize:"1.5rem", fontWeight:"300", marginBottom:".5rem" }}>Construction Drawings</p>
                <p style={{ color:"#2E4060", fontSize:".85rem", lineHeight:"1.8", maxWidth:"320px" }}>
                  Upload a furniture photo and hit generate. AI will produce manufacturing-ready technical drawings.
                </p>
                <div style={{ marginTop:"2rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", maxWidth:"360px" }}>
                  {["Front Elevation","Plan View","Section Cut","SVG Export","Material List","Hardware List"].map(item => (
                    <div key={item} style={{ display:"flex", alignItems:"center", gap:".5rem", padding:".65rem .85rem", background:"rgba(212,167,61,.04)", border:"1px solid rgba(212,167,61,.1)", borderRadius:"7px" }}>
                      <span style={{ color:"#D4A73D", fontSize:".8rem" }}>◈</span>
                      <span style={{ fontSize:".78rem", color:"#7A8FA8" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@media(max-width:1024px){.bh-fur-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
