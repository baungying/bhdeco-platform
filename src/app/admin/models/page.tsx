"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const G = "#D4A73D";
const CATS = ["SketchUp Models","Furniture Modules","Kitchen Cabinets","Wardrobe Systems","TV Walls","Ceiling Designs","Villa Exterior","Interior Scenes"];

const inp: React.CSSProperties = { width:"100%",padding:".7rem .9rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",color:"#EDE8DC",fontSize:".85rem",outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxSizing:"border-box" };
const fi = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor="rgba(212,167,61,.45)");
const bl = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor="rgba(255,255,255,.1)");

interface Model {
  id?:          string;
  title:        string;
  category:     string;
  description:  string;
  image_url:    string;
  file_url:     string;
  file_type:    string;
  credits_cost: number;
  active:       boolean;
  is_featured:  boolean;
}

const EMPTY: Model = {
  title:"", category:"SketchUp Models", description:"",
  image_url:"", file_url:"", file_type:"",
  credits_cost:80, active:true, is_featured:false,
};

// ── Upload helper ─────────────────────────────────────────────
async function uploadToAdmin(
  endpoint: string,
  file: File,
  secret: string
): Promise<{ url?: string; file_type?: string; error?: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "x-admin-secret": secret },
    body: form,
  });
  return res.json();
}

// ── Upload button sub-component ───────────────────────────────
function UploadField({
  label, accept, endpoint, secret,
  currentUrl, onUploaded,
}: {
  label: string;
  accept: string;
  endpoint: string;
  secret: string;
  currentUrl: string;
  onUploaded: (url: string, fileType?: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err,       setErr]       = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    const result = await uploadToAdmin(endpoint, file, secret);
    setUploading(false);
    if (result.error) { setErr(result.error); return; }
    if (result.url) onUploaded(result.url, result.file_type);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
      <div style={{ display:"flex", gap:".5rem", alignItems:"center", flexWrap:"wrap" }}>
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          style={{ padding:".45rem .9rem", borderRadius:"6px", border:`1px solid ${G}`, background:"rgba(212,167,61,.08)", color:G, fontSize:".68rem", letterSpacing:".08em", textTransform:"uppercase", cursor:uploading?"wait":"pointer", whiteSpace:"nowrap" }}>
          {uploading ? "Uploading…" : `↑ Upload ${label}`}
        </button>
        <span style={{ fontSize:".65rem", color:"#2E4060" }}>or paste URL below</span>
        <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display:"none" }} />
      </div>
      {err && <p style={{ fontSize:".68rem", color:"#f87171" }}>{err}</p>}
      {currentUrl && (
        <p style={{ fontSize:".65rem", color:"#10B981", wordBreak:"break-all" }}>✓ {currentUrl.split("/").pop()}</p>
      )}
    </div>
  );
}

// ── Label ─────────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display:"block", fontFamily:"monospace", fontSize:".55rem", color:"#7A8FA8", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".35rem" }}>
    {children}
  </label>
);

// ── Page ──────────────────────────────────────────────────────
export default function ModelsPage() {
  const [rows,    setRows]    = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Model|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ok:boolean;text:string}|null>(null);
  const [secret,  setSecret]  = useState("");

  useEffect(() => { setSecret(sessionStorage.getItem("bh_admin_secret") || ""); }, []);

  const load = async (s = secret) => {
    setLoading(true);
    const r = await fetch("/api/admin/models", { headers:{ "x-admin-secret": s } });
    const j = await r.json();
    setRows(j.data || []);
    setLoading(false);
  };
  useEffect(() => { if (secret) load(); }, [secret]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setMsg(null);
    const method = editing.id ? "PUT" : "POST";
    const url    = editing.id ? `/api/admin/models/${editing.id}` : "/api/admin/models";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type":"application/json", "x-admin-secret": secret },
      body: JSON.stringify(editing),
    });
    const j = await res.json();
    if (res.ok) { setMsg({ ok:true, text:"Saved." }); setEditing(null); load(); }
    else setMsg({ ok:false, text: j.error || "Failed." });
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this model?")) return;
    await fetch(`/api/admin/models/${id}`, { method:"DELETE", headers:{ "x-admin-secret": secret } });
    load();
  };

  return (
    <div style={{ minHeight:"100vh", background:"#010408", color:"#EDE8DC", padding:"4rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

        {/* Header */}
        <Link href="/admin" style={{ fontSize:".7rem",color:"#2E4060",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem",marginBottom:"1.5rem" }}
          onMouseEnter={e=>(e.currentTarget.style.color=G)} onMouseLeave={e=>(e.currentTarget.style.color="#2E4060")}>← Admin</Link>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem" }}>
          <div>
            <p style={{ fontFamily:"monospace",fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".4rem" }}>CMS · DIGITAL ASSETS</p>
            <h1 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300",fontFamily:"'Cormorant Garant',serif" }}>
              3D <span style={{ fontStyle:"italic",color:G }}>Models</span>
            </h1>
          </div>
          <button onClick={() => setEditing({ ...EMPTY })}
            style={{ padding:".65rem 1.4rem",borderRadius:"8px",border:`1px solid ${G}`,background:"transparent",color:G,fontSize:".75rem",letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer" }}>
            + Add Model
          </button>
        </div>

        {/* ── Edit / Add form ── */}
        {editing && (
          <div style={{ background:"rgba(212,167,61,.04)",border:"1px solid rgba(212,167,61,.2)",borderRadius:"12px",padding:"1.75rem",marginBottom:"2rem" }}>
            <h3 style={{ fontFamily:"monospace",fontSize:".65rem",color:G,letterSpacing:".14em",marginBottom:"1.5rem" }}>
              {editing.id ? "EDIT MODEL" : "NEW MODEL"}
            </h3>

            <form onSubmit={save}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.1rem" }}>

                {/* Title — full width */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Title *</Label>
                  <input type="text" required value={editing.title}
                    onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))}
                    style={inp} onFocus={fi} onBlur={bl} />
                </div>

                {/* Category + Credits */}
                <div>
                  <Label>Category</Label>
                  <select value={editing.category}
                    onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))}
                    style={inp} onFocus={fi as never} onBlur={bl as never}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Credits Cost</Label>
                  <input type="number" min={0} value={editing.credits_cost}
                    onChange={e => setEditing(p => ({ ...p!, credits_cost: Number(e.target.value) }))}
                    style={inp} onFocus={fi} onBlur={bl} />
                </div>

                {/* Description — full width */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Description</Label>
                  <textarea value={editing.description}
                    onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
                    rows={3} style={{ ...inp, resize:"vertical" } as React.CSSProperties}
                    onFocus={fi as never} onBlur={bl as never} />
                </div>

                {/* Cover image upload + URL */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Cover Image</Label>
                  <UploadField
                    label="Image"
                    accept=".jpg,.jpeg,.png,.webp"
                    endpoint="/api/admin/models/upload-image"
                    secret={secret}
                    currentUrl={editing.image_url}
                    onUploaded={url => setEditing(p => ({ ...p!, image_url: url }))}
                  />
                  <input type="text" value={editing.image_url} placeholder="https://... or upload above"
                    onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))}
                    style={{ ...inp, marginTop:".5rem" }} onFocus={fi} onBlur={bl} />
                </div>

                {/* Model file upload + URL + file_type */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Model File (ZIP / SKP / GLB / FBX)</Label>
                  <UploadField
                    label="Model File"
                    accept=".zip,.skp,.glb,.fbx"
                    endpoint="/api/admin/models/upload-file"
                    secret={secret}
                    currentUrl={editing.file_url}
                    onUploaded={(url, fileType) => setEditing(p => ({
                      ...p!,
                      file_url:  url,
                      file_type: fileType ?? p!.file_type,
                    }))}
                  />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 120px", gap:".75rem", marginTop:".5rem" }}>
                    <input type="text" value={editing.file_url} placeholder="https://... or upload above"
                      onChange={e => setEditing(p => ({ ...p!, file_url: e.target.value }))}
                      style={inp} onFocus={fi} onBlur={bl} />
                    <div>
                      <input type="text" value={editing.file_type} placeholder="SKP / ZIP"
                        onChange={e => setEditing(p => ({ ...p!, file_type: e.target.value }))}
                        style={inp} onFocus={fi} onBlur={bl} />
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div style={{ gridColumn:"1 / -1", display:"flex", gap:"2rem", flexWrap:"wrap" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:".6rem", cursor:"pointer", fontSize:".82rem", color:"#EDE8DC" }}>
                    <input type="checkbox" checked={editing.active}
                      onChange={e => setEditing(p => ({ ...p!, active: e.target.checked }))}
                      style={{ width:"16px", height:"16px", accentColor:G }} />
                    Active (visible on website)
                  </label>
                  <label style={{ display:"flex", alignItems:"center", gap:".6rem", cursor:"pointer", fontSize:".82rem", color:"#EDE8DC" }}>
                    <input type="checkbox" checked={editing.is_featured}
                      onChange={e => setEditing(p => ({ ...p!, is_featured: e.target.checked }))}
                      style={{ width:"16px", height:"16px", accentColor:G }} />
                    Featured (show on homepage / top)
                  </label>
                </div>

                {/* Feedback */}
                {msg && (
                  <div style={{ gridColumn:"1 / -1", padding:".65rem 1rem", background:msg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)", border:`1px solid ${msg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`, borderRadius:"8px", fontSize:".8rem", color:msg.ok?"#10B981":"#f87171" }}>
                    {msg.text}
                  </div>
                )}

                {/* Actions */}
                <div style={{ gridColumn:"1 / -1", display:"flex", gap:".75rem" }}>
                  <button type="submit" disabled={saving}
                    style={{ padding:".7rem 1.6rem", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${G},#9A7020)`, color:"#010408", fontWeight:"700", fontSize:".75rem", letterSpacing:".08em", textTransform:"uppercase", cursor:saving?"wait":"pointer" }}>
                    {saving ? "Saving…" : "Save Model"}
                  </button>
                  <button type="button" onClick={() => { setEditing(null); setMsg(null); }}
                    style={{ padding:".7rem 1.2rem", borderRadius:"8px", border:"1px solid rgba(255,255,255,.1)", background:"transparent", color:"#7A8FA8", fontSize:".75rem", cursor:"pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Table ── */}
        {loading ? (
          <p style={{ color:"#2E4060", fontFamily:"monospace", fontSize:".65rem" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color:"#2E4060", fontFamily:"monospace", fontSize:".65rem", letterSpacing:".1em" }}>
            NO MODELS YET — ADD YOUR FIRST ONE
          </p>
        ) : (
          <div style={{ border:"1px solid rgba(255,255,255,.07)", borderRadius:"12px", overflow:"hidden" }}>
            {rows.map((r, i) => (
              <div key={r.id}
                style={{ display:"grid", gridTemplateColumns:"auto 1fr 80px 70px 70px 80px 90px", gap:".75rem", padding:".9rem 1.25rem", borderBottom:i<rows.length-1?"1px solid rgba(255,255,255,.04)":"none", alignItems:"center", transition:"background .15s" }}
                onMouseEnter={e => (e.currentTarget.style.background="rgba(255,255,255,.02)")}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}>

                {/* Thumbnail */}
                <div style={{ width:"44px", height:"44px", borderRadius:"6px", background:"rgba(255,255,255,.04)", backgroundImage:r.image_url?`url(${r.image_url})`:"none", backgroundSize:"cover", backgroundPosition:"center", flexShrink:0 }} />

                {/* Title + meta */}
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:".85rem", color:"#EDE8DC", fontWeight:"500", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</p>
                  <p style={{ fontSize:".7rem", color:"#7A8FA8" }}>{r.category}{r.file_type ? ` · ${r.file_type}` : ""}</p>
                </div>

                {/* Credits */}
                <span style={{ fontFamily:"monospace", fontSize:".72rem", color:G }}>⬡ {r.credits_cost}</span>

                {/* Featured */}
                <span style={{ fontFamily:"monospace", fontSize:".58rem", padding:".18rem .45rem", borderRadius:"100px", background:r.is_featured?"rgba(212,167,61,.12)":"rgba(255,255,255,.04)", color:r.is_featured?G:"#2E4060" }}>
                  {r.is_featured?"★ TOP":"—"}
                </span>

                {/* Active */}
                <span style={{ fontFamily:"monospace", fontSize:".6rem", padding:".2rem .5rem", borderRadius:"100px", background:r.active?"rgba(16,185,129,.1)":"rgba(255,255,255,.05)", color:r.active?"#10B981":"#2E4060" }}>
                  {r.active?"ON":"OFF"}
                </span>

                <button onClick={() => setEditing({ ...EMPTY, ...r })}
                  style={{ fontSize:".7rem", color:G, background:"none", border:`1px solid rgba(212,167,61,.25)`, borderRadius:"6px", padding:".35rem .8rem", cursor:"pointer" }}>
                  Edit
                </button>
                <button onClick={() => r.id && del(r.id)}
                  style={{ fontSize:".7rem", color:"#f87171", background:"none", border:"1px solid rgba(239,68,68,.2)", borderRadius:"6px", padding:".35rem .8rem", cursor:"pointer" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
