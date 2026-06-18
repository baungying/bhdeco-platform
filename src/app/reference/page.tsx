"use client";
import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateReference, pollJob, absoluteUrl, JobStatus } from "@/lib/api";

function DropZone({label,sub,file,onFile,accent="#D4A73D"}:{label:string;sub:string;file:File|null;onFile:(f:File)=>void;accent?:string}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag,setDrag] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;
  const handle = useCallback((f:File)=>{if(f.type.startsWith("image/"))onFile(f);},[onFile]);
  return (
    <div onClick={()=>ref.current?.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true);}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handle(f);}}
      style={{position:"relative",cursor:"pointer",borderRadius:"12px",border:`2px dashed ${drag?accent:"rgba(255,255,255,.12)"}`,background:drag?`${accent}08`:"rgba(255,255,255,.02)",transition:"all .25s",overflow:"hidden",minHeight:"160px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {preview?(
        <>
          <img src={preview} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.75}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,4,8,.8),transparent)"}}/>
          <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
            <span style={{fontFamily:"monospace",fontSize:".6rem",color:accent}}>✓ {file?.name}</span>
          </div>
        </>
      ):(
        <div style={{textAlign:"center",padding:"1.5rem 1.25rem"}}>
          <div style={{fontSize:"1.8rem",marginBottom:".6rem"}}>📷</div>
          <p style={{color:"#EDE8DC",fontSize:".85rem",fontWeight:"500",marginBottom:".25rem"}}>{label}</p>
          <p style={{color:"#2E4060",fontSize:".72rem"}}>{sub}</p>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)handle(f);}}/>
    </div>
  );
}

export default function ReferencePage() {
  const [roomPhoto,setRoomPhoto] = useState<File|null>(null);
  const [refPhoto,setRefPhoto] = useState<File|null>(null);
  const [prompt,setPrompt] = useState("");
  const [space,setSpace] = useState("living_room");
  const [loading,setLoading] = useState(false);
  const [job,setJob] = useState<JobStatus|null>(null);
  const [results,setResults] = useState<string[]>([]);
  const [error,setError] = useState("");

  const generate = async () => {
    if (!roomPhoto||!refPhoto) { setError("Please upload both photos."); return; }
    setError(""); setLoading(true); setResults([]); setJob(null);
    try {
      // Uses POST /api/generate with reference_image field
      const initial = await generateReference(roomPhoto, refPhoto, { space, prompt });
      const final = await pollJob(initial.job_id, j=>setJob({...j}));
      setJob(final);
      const urls = (final.result_urls||(final.result_url?[final.result_url]:[])).map(absoluteUrl);
      setResults(urls);
    } catch(e:unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally { setLoading(false); }
  };

  const pct = job?.status==="completed"?100:job?.status==="processing"?65:25;

  return (
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>
      <section style={{background:"linear-gradient(170deg,#010408 0%,#08031a 50%,#010408 100%)",padding:"7rem 2rem 3.5rem",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.22)",borderRadius:"100px",padding:".3rem .9rem",marginBottom:"1.25rem"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#8B5CF6",boxShadow:"0 0 8px #8B5CF6"}}/>
          <span style={{fontFamily:"monospace",fontSize:".6rem",color:"#8B5CF6",letterSpacing:".12em"}}>REFERENCE MODE · STYLE TRANSFER</span>
        </div>
        <h1 className="fd" style={{fontSize:"clamp(2.4rem,5.5vw,4.5rem)",fontWeight:"300",marginBottom:"1rem"}}>
          Reference <span style={{fontStyle:"italic",color:"#8B5CF6"}}>Mode</span>
        </h1>
        <p style={{color:"#7A8FA8",maxWidth:"480px",margin:"0 auto",lineHeight:"1.85",fontSize:".95rem"}}>
          Upload your room + any style inspiration. AI transfers the color palette, materials, and mood to your space.
        </p>
      </section>

      <section style={{maxWidth:"1100px",margin:"0 auto",padding:"3rem 2rem 6rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"420px 1fr",gap:"3rem",alignItems:"start"}} className="bh-ref-grid">
          <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#8B5CF6",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".6rem"}}>01 · YOUR ROOM</label>
              <DropZone label="Upload your room photo" sub="The space to transform" file={roomPhoto} onFile={setRoomPhoto} accent="#8B5CF6"/>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#D4A73D",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".6rem"}}>02 · STYLE REFERENCE</label>
              <DropZone label="Upload inspiration image" sub="Magazine photo, design you love, anything" file={refPhoto} onFile={setRefPhoto} accent="#D4A73D"/>
              <p style={{fontFamily:"monospace",fontSize:".58rem",color:"#2E4060",marginTop:".45rem"}}>AI extracts: colors · materials · lighting · mood</p>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#8B5CF6",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".6rem"}}>03 · SPACE TYPE</label>
              <select value={space} onChange={e=>setSpace(e.target.value)}
                style={{width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",padding:".75rem 1rem",color:"#EDE8DC",fontSize:".86rem",fontFamily:"inherit",outline:"none"}}>
                {[["living_room","Living Room"],["bedroom","Bedroom"],["kitchen","Kitchen"],["dining_room","Dining Room"],["office","Office"],["cafe","Café"],["restaurant","Restaurant"],["bathroom","Bathroom"]].map(([v,l])=>(
                  <option key={v} value={v} style={{background:"#010408"}}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{display:"block",fontFamily:"monospace",fontSize:".58rem",color:"#8B5CF6",letterSpacing:".15em",textTransform:"uppercase",marginBottom:".6rem"}}>04 · EXTRA INSTRUCTIONS <span style={{color:"#2E4060"}}>(optional)</span></label>
              <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Additional instructions... e.g. keep the original sofa, add warm pendant lights" rows={3}
                style={{width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",padding:".8rem 1rem",color:"#EDE8DC",fontSize:".86rem",fontFamily:"inherit",resize:"vertical",outline:"none",transition:"border-color .2s"}}
                onFocus={e=>(e.target.style.borderColor="#8B5CF644")}
                onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.1)")}/>
            </div>

            {error&&<div style={{padding:"1rem",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"8px"}}><p style={{color:"#f87171",fontSize:".85rem"}}>{error}</p></div>}

            <button onClick={generate} disabled={loading||!roomPhoto||!refPhoto} style={{
              width:"100%",padding:"1.1rem",borderRadius:"8px",border:"none",
              cursor:loading||!roomPhoto||!refPhoto?"not-allowed":"pointer",
              background:loading||!roomPhoto||!refPhoto?"rgba(255,255,255,.06)":"linear-gradient(135deg,#8B5CF6,#6D28D9)",
              color:loading||!roomPhoto||!refPhoto?"#2E4060":"white",
              fontWeight:"700",fontSize:".85rem",letterSpacing:".08em",textTransform:"uppercase",transition:"all .3s",
            }}>
              {loading?"GENERATING...":!roomPhoto||!refPhoto?"UPLOAD BOTH PHOTOS":"✦ APPLY REFERENCE STYLE"}
            </button>

            {loading&&job&&(
              <div style={{padding:"1.25rem",background:"rgba(139,92,246,.05)",border:"1px solid rgba(139,92,246,.15)",borderRadius:"10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:".6rem"}}>
                  <span style={{fontFamily:"monospace",fontSize:".65rem",color:"#8B5CF6"}}>{job.status==="processing"?"Applying reference style...":"Queued..."}</span>
                  <span style={{fontFamily:"monospace",fontSize:".65rem",color:"#2E4060"}}>{pct}%</span>
                </div>
                <div style={{height:"2px",background:"rgba(255,255,255,.06)",borderRadius:"1px"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#8B5CF6,#D4A73D)",transition:"width .5s"}}/>
                </div>
              </div>
            )}
          </div>

          <div>
            {results.length>0?(
              <div>
                <h2 className="fd" style={{fontSize:"1.8rem",fontWeight:"300",marginBottom:"1.5rem"}}>Style <span style={{fontStyle:"italic",color:"#8B5CF6"}}>Applied</span></h2>
                {results.map((url,i)=>(
                  <div key={i} style={{borderRadius:"14px",overflow:"hidden",border:"1px solid rgba(139,92,246,.2)",marginBottom:"1.25rem"}}>
                    <img src={url} alt={`Reference result ${i+1}`} style={{width:"100%",display:"block"}}/>
                    <div style={{padding:".85rem"}}>
                      <a href={url} download={`bhdeco-reference-${i+1}.jpg`} target="_blank" rel="noopener noreferrer"
                        style={{display:"block",textAlign:"center",padding:".6rem",background:"linear-gradient(135deg,#8B5CF6,#6D28D9)",color:"white",fontWeight:"700",fontSize:".7rem",letterSpacing:".08em",textTransform:"uppercase",borderRadius:"6px",textDecoration:"none"}}>
                        ↓ Download
                      </a>
                    </div>
                  </div>
                ))}
                <div style={{padding:"1.25rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"10px"}}>
                  <a href="/furniture-ai" style={{color:"#D4A73D",fontSize:".85rem",textDecoration:"none",display:"block"}}>→ Generate furniture construction from this design</a>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"380px",border:"1px solid rgba(255,255,255,.05)",borderRadius:"16px",background:"rgba(255,255,255,.01)",textAlign:"center",padding:"3rem 2rem"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"1.5rem",opacity:.2}}>🖼️</div>
                <p className="fd" style={{fontSize:"1.4rem",fontWeight:"300",marginBottom:".5rem"}}>Reference Mode</p>
                <p style={{color:"#2E4060",fontSize:".85rem",lineHeight:"1.7"}}>Upload your room + a reference image<br/>to transfer the style with AI.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer/>
      <style>{`@media(max-width:1024px){.bh-ref-grid{grid-template-columns:1fr!important}} textarea::placeholder,select option{color:#2E4060}`}</style>
    </div>
  );
}
