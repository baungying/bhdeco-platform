"use client";
import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateInterior, pollJob, absoluteUrl, JobStatus } from "@/lib/api";

const SPACES = [
  {id:"living_room",   label:"Living Room",  icon:"🛋️"},
  {id:"bedroom",       label:"Bedroom",      icon:"🛏️"},
  {id:"kitchen",       label:"Kitchen",      icon:"🍳"},
  {id:"dining_room",   label:"Dining Room",  icon:"🍽️"},
  {id:"office",        label:"Office",       icon:"💼"},
  {id:"cafe",          label:"Café",         icon:"☕"},
  {id:"restaurant",    label:"Restaurant",   icon:"🍴"},
  {id:"bathroom",      label:"Bathroom",     icon:"🚿"},
  {id:"kids_room",     label:"Kids Room",    icon:"🎨"},
  {id:"villa_exterior",label:"Villa Exterior",icon:"🏡"},
];

const STYLES = [
  {id:"modern-interior",       label:"Modern"},
  {id:"scandinavian-interior", label:"Scandinavian"},
  {id:"industrial-interior",   label:"Industrial"},
  {id:"bohemian-interior",     label:"Bohemian"},
  {id:"minimalist",            label:"Minimalist"},
  {id:"luxury",                label:"Luxury"},
  {id:"japandi",               label:"Japandi"},
  {id:"european",              label:"European"},
];

const PALETTES = [
  {id:"golden beige",    label:"Golden Beige"},
  {id:"warm white",      label:"Warm White"},
  {id:"cool grey",       label:"Cool Grey"},
  {id:"earth tones",     label:"Earth Tones"},
  {id:"navy blue",       label:"Navy Blue"},
  {id:"forest green",    label:"Forest Green"},
  {id:"charcoal black",  label:"Charcoal"},
  {id:"blush pink",      label:"Blush Pink"},
];

function DropZone({label, file, onFile}:{label:string; file:File|null; onFile:(f:File)=>void}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;
  const handle = useCallback((f:File)=>{ if(f.type.startsWith("image/")) onFile(f); },[onFile]);
  return (
    <div onClick={()=>ref.current?.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true);}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handle(f);}}
      style={{position:"relative",cursor:"pointer",borderRadius:"12px",border:`2px dashed ${drag?"#D4A73D":"rgba(255,255,255,.15)"}`,background:drag?"rgba(212,167,61,.05)":"rgba(255,255,255,.02)",transition:"all .25s",overflow:"hidden",minHeight:"180px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {preview?(
        <>
          <img src={preview} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.75}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,4,8,.8),transparent)"}}/>
          <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
            <div style={{fontSize:"1.2rem",marginBottom:".25rem"}}>✓</div>
            <span style={{fontFamily:"monospace",fontSize:".62rem",color:"#D4A73D",letterSpacing:".08em"}}>{file?.name}</span>
            <p style={{fontFamily:"monospace",fontSize:".55rem",color:"#2E4060",marginTop:".2rem"}}>Click to change</p>
          </div>
        </>
      ):(
        <div style={{textAlign:"center",padding:"2rem 1.5rem"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📸</div>
          <p style={{color:"#EDE8DC",fontSize:".9rem",fontWeight:"500",marginBottom:".3rem"}}>{label}</p>
          <p style={{color:"#2E4060",fontSize:".76rem"}}>Drop or click to browse</p>
          <div style={{marginTop:"1rem",display:"inline-flex",padding:".35rem .9rem",background:"rgba(212,167,61,.08)",border:"1px solid rgba(212,167,61,.2)",borderRadius:"100px"}}>
            <span style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".1em"}}>JPG · PNG · WEBP</span>
          </div>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)handle(f);}}/>
    </div>
  );
}

export default function AIInteriorPage() {
  const [photo, setPhoto] = useState<File|null>(null);
  const [space, setSpace] = useState("living_room");
  const [style, setStyle] = useState("modern-interior");
  const [palette, setPalette] = useState("golden beige");
  const [prompt, setPrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<JobStatus|null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!photo) { setError("Please upload a room photo."); return; }
    setError(""); setLoading(true); setResults([]); setJob(null);
    try {
      // POST /api/generate — multipart/form-data
      const initial = await generateInterior({
        image: photo,
        space,
        style,
        color_palette: palette,
        num_images: numImages,
        prompt: prompt || "",
        prompt_mode: prompt.trim() ? "true" : "false",
        intent: "residential",
      });

      // Backend returns { job_id, status: "pending" } immediately
      // Poll until completed
      const final = await pollJob(initial.job_id, j => setJob({...j}));
      setJob(final);

      const urls = (final.result_urls || (final.result_url ? [final.result_url] : [])).map(absoluteUrl);
      setResults(urls);
    } catch(e:unknown) {
      setError(e instanceof Error ? e.message : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pct = job?.status === "completed" ? 100 : job?.status === "processing" ? 65 : 25;
  const statusMsg: Record<string,string> = {
    pending: "Queued — waiting for AI...",
    processing: "Rendering your interior...",
    completed: "Done!",
    failed: "Failed.",
  };

  return (
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>
      <section style={{background:"linear-gradient(170deg,#010408 0%,#06111e 50%,#010408 100%)",padding:"7rem 2rem 3.5rem",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.22)",borderRadius:"100px",padding:".3rem .9rem",marginBottom:"1.25rem"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e"}}/>
          <span style={{fontFamily:"monospace",fontSize:".6rem",color:"#22c55e",letterSpacing:".12em"}}>LIVE · AI INTERIOR ENGINE</span>
        </div>
        <h1 className="fd" style={{fontSize:"clamp(2.4rem,5.5vw,4.5rem)",fontWeight:"300",marginBottom:"1rem"}}>
          AI Interior <span style={{fontStyle:"italic",color:"#D4A73D"}}>Design</span>
        </h1>
        <p style={{color:"#7A8FA8",maxWidth:"480px",margin:"0 auto",lineHeight:"1.85",fontSize:".95rem"}}>
          Upload your room photo, choose space and style, generate photorealistic designs instantly.
        </p>
      </section>

      <section style={{maxWidth:"1200px",margin:"0 auto",padding:"3rem 2rem 6rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"480px 1fr",gap:"3rem",alignItems:"start"}} className="bh-ai-grid">

          {/* ── LEFT: Controls ── */}
          <div style={{display:"flex",flexDirection:"column",gap:"1.75rem"}}>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".65rem"}}>01 · ROOM PHOTO</label>
              <DropZone label="Upload your room photo" file={photo} onFile={setPhoto}/>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".65rem"}}>02 · SPACE TYPE</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:".4rem"}}>
                {SPACES.map(s=>(
                  <button key={s.id} onClick={()=>setSpace(s.id)} style={{padding:".55rem .3rem",borderRadius:"8px",border:`1px solid ${space===s.id?"#D4A73D":"rgba(255,255,255,.07)"}`,background:space===s.id?"rgba(212,167,61,.1)":"rgba(255,255,255,.02)",cursor:"pointer",transition:"all .2s",textAlign:"center"}}>
                    <div style={{fontSize:"1.1rem",marginBottom:".2rem"}}>{s.icon}</div>
                    <div style={{fontSize:".56rem",color:space===s.id?"#D4A73D":"#7A8FA8",fontFamily:"monospace",lineHeight:1.2}}>{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".65rem"}}>03 · STYLE</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:".4rem"}}>
                {STYLES.map(s=>(
                  <button key={s.id} onClick={()=>setStyle(s.id)} style={{padding:".4rem .9rem",borderRadius:"100px",border:`1px solid ${style===s.id?"#D4A73D":"rgba(255,255,255,.1)"}`,background:style===s.id?"rgba(212,167,61,.1)":"transparent",color:style===s.id?"#D4A73D":"#7A8FA8",fontSize:".75rem",cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".65rem"}}>04 · COLOR PALETTE</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:".4rem"}}>
                {PALETTES.map(p=>(
                  <button key={p.id} onClick={()=>setPalette(p.id)} style={{padding:".38rem .85rem",borderRadius:"100px",border:`1px solid ${palette===p.id?"#D4A73D":"rgba(255,255,255,.1)"}`,background:palette===p.id?"rgba(212,167,61,.1)":"transparent",color:palette===p.id?"#D4A73D":"#7A8FA8",fontSize:".74rem",cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".65rem"}}>05 · PROMPT <span style={{color:"#2E4060"}}>(optional)</span></label>
              <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe exactly what you want... e.g. warm lighting, marble floors, large windows" rows={3}
                style={{width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"10px",padding:".85rem 1rem",color:"#EDE8DC",fontSize:".86rem",fontFamily:"inherit",resize:"vertical",outline:"none",transition:"border-color .2s",lineHeight:"1.6"}}
                onFocus={e=>(e.target.style.borderColor="#D4A73D44")}
                onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.1)")}/>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".65rem"}}>06 · NUMBER OF IMAGES</label>
              <div style={{display:"flex",gap:".5rem"}}>
                {[1,2,3,4].map(n=>(
                  <button key={n} onClick={()=>setNumImages(n)} style={{width:"50px",height:"40px",borderRadius:"8px",border:`1px solid ${numImages===n?"#D4A73D":"rgba(255,255,255,.1)"}`,background:numImages===n?"rgba(212,167,61,.1)":"transparent",color:numImages===n?"#D4A73D":"#7A8FA8",fontWeight:"600",cursor:"pointer",transition:"all .2s",fontFamily:"inherit"}}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{padding:"1rem 1.25rem",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"8px"}}>
                <p style={{color:"#f87171",fontSize:".85rem"}}>{error}</p>
              </div>
            )}

            <button onClick={generate} disabled={loading||!photo} style={{
              width:"100%",padding:"1.1rem",borderRadius:"8px",border:"none",
              cursor:loading||!photo?"not-allowed":"pointer",
              background:loading||!photo?"rgba(255,255,255,.06)":"linear-gradient(135deg,#D4A73D,#9A7020)",
              color:loading||!photo?"#2E4060":"#010408",
              fontWeight:"700",fontSize:".85rem",letterSpacing:".08em",textTransform:"uppercase",transition:"all .3s",
            }}>
              {loading?"GENERATING...":!photo?"UPLOAD A PHOTO FIRST":"✦ GENERATE INTERIOR"}
            </button>

            {loading&&job&&(
              <div style={{padding:"1.25rem",background:"rgba(212,167,61,.04)",border:"1px solid rgba(212,167,61,.15)",borderRadius:"10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:".65rem"}}>
                  <span style={{fontFamily:"monospace",fontSize:".65rem",color:"#D4A73D"}}>{statusMsg[job.status||"pending"]}</span>
                  <span style={{fontFamily:"monospace",fontSize:".65rem",color:"#2E4060"}}>{pct}%</span>
                </div>
                <div style={{height:"2px",background:"rgba(255,255,255,.06)",borderRadius:"1px"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#D4A73D,#F0C040)",transition:"width .5s"}}/>
                </div>
              </div>
            )}

            <p style={{textAlign:"center",fontFamily:"monospace",fontSize:".58rem",color:"#2E4060",letterSpacing:".06em"}}>
              Each image uses credits ·{" "}
              <a href="/recharge" style={{color:"#D4A73D",textDecoration:"none"}}>Recharge →</a>
            </p>
          </div>

          {/* ── RIGHT: Results ── */}
          <div>
            {results.length > 0 ? (
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
                  <h2 className="fd" style={{fontSize:"1.8rem",fontWeight:"300"}}>
                    Your <span style={{fontStyle:"italic",color:"#D4A73D"}}>Results</span>
                  </h2>
                  <span style={{fontFamily:"monospace",fontSize:".6rem",color:"#22c55e",background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:"100px",padding:".25rem .7rem"}}>
                    {results.length} image{results.length>1?"s":""} ready
                  </span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
                  {results.map((url,i)=>(
                    <div key={i} style={{borderRadius:"14px",overflow:"hidden",border:"1px solid rgba(212,167,61,.2)",background:"#06111e"}}>
                      <img src={url} alt={`Result ${i+1}`} style={{width:"100%",display:"block"}}/>
                      <div style={{padding:".85rem",display:"flex",gap:".75rem"}}>
                        <a href={url} download={`bhdeco-interior-${i+1}.jpg`} target="_blank" rel="noopener noreferrer"
                          style={{flex:1,textAlign:"center",padding:".6rem",background:"linear-gradient(135deg,#D4A73D,#9A7020)",color:"#010408",fontWeight:"700",fontSize:".7rem",letterSpacing:".08em",textTransform:"uppercase",borderRadius:"6px",textDecoration:"none"}}>
                          ↓ Download
                        </a>
                        <a href="/reference" style={{padding:".6rem 1rem",border:"1px solid rgba(255,255,255,.1)",borderRadius:"6px",color:"#7A8FA8",fontSize:".7rem",textDecoration:"none",display:"flex",alignItems:"center"}}>
                          + Style Ref
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:"1.5rem",padding:"1.25rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"10px"}}>
                  <p style={{fontFamily:"monospace",fontSize:".58rem",color:"#2E4060",marginBottom:".75rem"}}>NEXT STEPS</p>
                  <div style={{display:"flex",flexDirection:"column",gap:".5rem"}}>
                    <a href="/reference" style={{color:"#8B5CF6",fontSize:".85rem",textDecoration:"none"}}>→ Apply a reference style</a>
                    <a href="/furniture-ai" style={{color:"#D4A73D",fontSize:".85rem",textDecoration:"none"}}>→ Generate furniture construction plans</a>
                  </div>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"420px",border:"1px solid rgba(255,255,255,.05)",borderRadius:"16px",background:"rgba(255,255,255,.01)",textAlign:"center",padding:"3rem 2rem"}}>
                <div style={{fontSize:"4rem",marginBottom:"1.5rem",opacity:.2}}>🏠</div>
                <p className="fd" style={{fontSize:"1.4rem",fontWeight:"300",marginBottom:".5rem"}}>Your AI Interior</p>
                <p style={{color:"#2E4060",fontSize:".85rem",lineHeight:"1.7"}}>Upload a room photo, choose preferences<br/>and hit Generate.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer/>
      <style>{`@media(max-width:1024px){.bh-ai-grid{grid-template-columns:1fr!important}} textarea::placeholder{color:#2E4060}`}</style>
    </div>
  );
}
