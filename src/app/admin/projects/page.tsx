"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────
const G    = "#D4A73D";
const CATS = ["Construction","Interior","Furniture","Commercial","Before & After"];
const IMG_TYPES = ["gallery","before","after","construction","cover"] as const;
type ImgType = typeof IMG_TYPES[number];

const inp: React.CSSProperties = {
  width:"100%", padding:".7rem .9rem",
  background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)",
  borderRadius:"8px", color:"#EDE8DC", fontSize:".85rem",
  outline:"none", fontFamily:"inherit", transition:"border-color .2s", boxSizing:"border-box",
};
const fi = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
  (e.target.style.borderColor = "rgba(212,167,61,.45)");
const bl = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
  (e.target.style.borderColor = "rgba(255,255,255,.1)");

// ─── Types ────────────────────────────────────────────────────
interface ProjectImage {
  id:         string;
  project_id: string;
  image_url:  string;
  image_type: string;
  caption:    string;
  sort_order: number;
}

interface Project {
  id?:             string;
  title:           string;
  category:        string;
  location:        string;
  description:     string;
  cover_image_url: string;
  active:          boolean;
  featured:        boolean;
  sort_order:      number;
  project_images?: ProjectImage[];
}

const EMPTY: Project = {
  title:"", category:"Interior", location:"Mandalay", description:"",
  cover_image_url:"", active:true, featured:false, sort_order:0,
};

// ─── Small helpers ────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display:"block", fontFamily:"monospace", fontSize:".55rem", color:"#7A8FA8", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".35rem" }}>
    {children}
  </label>
);

const Msg = ({ msg }: { msg: { ok:boolean; text:string } }) => (
  <div style={{ padding:".65rem 1rem", background:msg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)", border:`1px solid ${msg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`, borderRadius:"8px", fontSize:".8rem", color:msg.ok?"#10B981":"#f87171" }}>
    {msg.text}
  </div>
);

// ─── Cover upload button ──────────────────────────────────────
function CoverUpload({ secret, currentUrl, onDone }: {
  secret: string;
  currentUrl: string;
  onDone: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/projects/upload-image", {
      method:"POST", headers:{ "x-admin-secret":secret }, body:form,
    });
    const j = await res.json();
    setBusy(false);
    if (j.error) { setErr(j.error); return; }
    if (j.url) onDone(j.url);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
      <div style={{ display:"flex", gap:".5rem", alignItems:"center", flexWrap:"wrap" }}>
        <button type="button" disabled={busy} onClick={() => ref.current?.click()}
          style={{ padding:".42rem .9rem", borderRadius:"6px", border:`1px solid ${G}`, background:"rgba(212,167,61,.08)", color:G, fontSize:".68rem", letterSpacing:".08em", textTransform:"uppercase", cursor:busy?"wait":"pointer" }}>
          {busy ? "Uploading…" : "↑ Upload Cover"}
        </button>
        <span style={{ fontSize:".65rem", color:"#2E4060" }}>or paste URL below</span>
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handle} style={{ display:"none" }} />
      </div>
      {err && <p style={{ fontSize:".68rem", color:"#f87171" }}>{err}</p>}
      {currentUrl && <p style={{ fontSize:".65rem", color:"#10B981", wordBreak:"break-all" }}>✓ {currentUrl.split("/").pop()}</p>}
    </div>
  );
}

// ─── Gallery manager (used in edit mode after project is saved) ─
function GalleryManager({ project, secret, onRefresh }: {
  project: Project;
  secret: string;
  onRefresh: () => void;
}) {
  const [images,    setImages]    = useState<ProjectImage[]>(project.project_images ?? []);
  const [uploading, setUploading] = useState(false);
  const [upErr,     setUpErr]     = useState("");
  const [imgType,   setImgType]   = useState<ImgType>("gallery");
  const [caption,   setCaption]   = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // Sync when project changes
  useEffect(() => { setImages(project.project_images ?? []); }, [project.project_images]);

  const uploadAndAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project.id) return;
    setUploading(true); setUpErr("");

    // 1. Upload to storage
    const form = new FormData();
    form.append("file", file);
    const upRes = await fetch("/api/admin/projects/upload-image", {
      method:"POST", headers:{ "x-admin-secret":secret }, body:form,
    });
    const upJson = await upRes.json();
    if (upJson.error) { setUpErr(upJson.error); setUploading(false); return; }

    // 2. Insert into project_images
    const addRes = await fetch(`/api/admin/projects/${project.id}/images`, {
      method:"POST",
      headers:{ "Content-Type":"application/json", "x-admin-secret":secret },
      body: JSON.stringify({ image_url:upJson.url, image_type:imgType, caption, sort_order:images.length }),
    });
    const addJson = await addRes.json();
    setUploading(false);
    if (addJson.error) { setUpErr(addJson.error); return; }
    setImages(prev => [...prev, addJson.data]);
    setCaption("");
    onRefresh();
    if (ref.current) ref.current.value = "";
  };

  const deleteImg = async (imgId: string) => {
    if (!project.id || !confirm("Remove this image?")) return;
    await fetch(`/api/admin/projects/${project.id}/images/${imgId}`, {
      method:"DELETE", headers:{ "x-admin-secret":secret },
    });
    setImages(prev => prev.filter(i => i.id !== imgId));
    onRefresh();
  };

  const updateImg = async (imgId: string, patch: Partial<ProjectImage>) => {
    if (!project.id) return;
    const res = await fetch(`/api/admin/projects/${project.id}/images/${imgId}`, {
      method:"PUT",
      headers:{ "Content-Type":"application/json", "x-admin-secret":secret },
      body: JSON.stringify(patch),
    });
    const j = await res.json();
    if (j.data) setImages(prev => prev.map(i => i.id === imgId ? { ...i, ...j.data } : i));
  };

  return (
    <div style={{ marginTop:"1.5rem", borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:"1.5rem" }}>
      <p style={{ fontFamily:"monospace", fontSize:".6rem", color:G, letterSpacing:".14em", marginBottom:"1rem" }}>
        GALLERY — {images.length} IMAGE{images.length !== 1 ? "S" : ""}
      </p>

      {/* Upload controls */}
      <div style={{ display:"grid", gridTemplateColumns:"130px 1fr auto", gap:".6rem", alignItems:"end", marginBottom:"1rem" }}>
        <div>
          <Label>Type</Label>
          <select value={imgType} onChange={e => setImgType(e.target.value as ImgType)}
            style={inp} onFocus={fi as never} onBlur={bl as never}>
            {IMG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <Label>Caption (optional)</Label>
          <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
            placeholder="Short description" style={inp} onFocus={fi} onBlur={bl} />
        </div>
        <button type="button" disabled={uploading} onClick={() => ref.current?.click()}
          style={{ padding:".7rem 1rem", borderRadius:"8px", border:`1px solid ${G}`, background:"rgba(212,167,61,.08)", color:G, fontSize:".72rem", letterSpacing:".06em", textTransform:"uppercase", cursor:uploading?"wait":"pointer", whiteSpace:"nowrap" }}>
          {uploading ? "Uploading…" : "+ Add Photo"}
        </button>
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={uploadAndAdd} style={{ display:"none" }} />
      </div>

      {upErr && <p style={{ fontSize:".72rem", color:"#f87171", marginBottom:".75rem" }}>{upErr}</p>}

      {/* Image grid */}
      {images.length === 0 ? (
        <p style={{ fontSize:".7rem", color:"#2E4060", fontFamily:"monospace", letterSpacing:".08em" }}>NO IMAGES YET</p>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:".75rem" }}>
          {images.sort((a,b) => a.sort_order - b.sort_order).map(img => (
            <div key={img.id} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"10px", overflow:"hidden" }}>
              {/* Thumbnail */}
              <div style={{ height:"110px", backgroundImage:`url(${img.image_url})`, backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
                <button type="button" onClick={() => deleteImg(img.id)}
                  style={{ position:"absolute", top:".4rem", right:".4rem", width:"22px", height:"22px", borderRadius:"50%", background:"rgba(239,68,68,.85)", border:"none", color:"#fff", fontSize:".7rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ×
                </button>
              </div>
              {/* Controls */}
              <div style={{ padding:".6rem" }}>
                <select value={img.image_type}
                  onChange={e => updateImg(img.id, { image_type:e.target.value })}
                  style={{ ...inp, fontSize:".65rem", padding:".35rem .5rem" }}
                  onFocus={fi as never} onBlur={bl as never}>
                  {IMG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="text" value={img.caption || ""} placeholder="Caption"
                  onChange={e => updateImg(img.id, { caption:e.target.value })}
                  style={{ ...inp, fontSize:".7rem", padding:".35rem .5rem", marginTop:".4rem" }}
                  onFocus={fi} onBlur={bl} />
                <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginTop:".4rem" }}>
                  <span style={{ fontSize:".6rem", color:"#2E4060", fontFamily:"monospace" }}>ORDER</span>
                  <input type="number" value={img.sort_order}
                    onChange={e => updateImg(img.id, { sort_order:Number(e.target.value) })}
                    style={{ ...inp, fontSize:".7rem", padding:".3rem .5rem", width:"60px" }}
                    onFocus={fi} onBlur={bl} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function ProjectsPage() {
  const [rows,    setRows]    = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ok:boolean;text:string}|null>(null);
  const [secret,  setSecret]  = useState("");

  useEffect(() => { setSecret(sessionStorage.getItem("bh_admin_secret") || ""); }, []);

  const load = async (s = secret) => {
    setLoading(true);
    const r = await fetch("/api/admin/projects", { headers:{ "x-admin-secret":s } });
    const j = await r.json();
    setRows((j.data || []).map((p: Project) => ({
      ...p,
      title:           p.title           ?? "",
      category:        p.category        ?? "",
      location:        p.location        ?? "",
      description:     p.description     ?? "",
      cover_image_url: p.cover_image_url ?? "",
      active:          p.active          ?? true,
      featured:        p.featured        ?? false,
      sort_order:      p.sort_order      ?? 0,
    })));
    setLoading(false);
  };
  useEffect(() => { if (secret) load(); }, [secret]);

  // Refresh editing state with updated images after gallery changes
  const refreshEditing = async () => {
    if (!editing?.id) return;
    const r = await fetch("/api/admin/projects", { headers:{ "x-admin-secret":secret } });
    const j = await r.json();
    const updated = (j.data || []).find((p: Project) => p.id === editing.id);
    if (updated) setEditing(updated);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setMsg(null);
    const method = editing.id ? "PUT" : "POST";
    const url    = editing.id ? `/api/admin/projects/${editing.id}` : "/api/admin/projects";
    const res = await fetch(url, {
      method,
      headers:{ "Content-Type":"application/json", "x-admin-secret":secret },
      body: JSON.stringify(editing),
    });
    const j = await res.json();
    if (res.ok) {
      setMsg({ ok:true, text:"Project saved." });
      // If new project, switch to edit mode so gallery becomes available
      if (!editing.id && j.data) setEditing({ ...editing, id:j.data.id, project_images:[] });
      else load();
    } else {
      setMsg({ ok:false, text:j.error || "Failed." });
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project and all its images?")) return;
    await fetch(`/api/admin/projects/${id}`, { method:"DELETE", headers:{ "x-admin-secret":secret } });
    load();
  };

  return (
    <div style={{ minHeight:"100vh", background:"#010408", color:"#EDE8DC", padding:"4rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

        {/* Header */}
        <Link href="/admin" style={{ fontSize:".7rem", color:"#2E4060", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:".4rem", marginBottom:"1.5rem" }}
          onMouseEnter={e=>(e.currentTarget.style.color=G)} onMouseLeave={e=>(e.currentTarget.style.color="#2E4060")}>← Admin</Link>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
          <div>
            <p style={{ fontFamily:"monospace", fontSize:".58rem", color:G, letterSpacing:".18em", marginBottom:".4rem" }}>CMS · PORTFOLIO</p>
            <h1 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:"300", fontFamily:"'Cormorant Garant',serif" }}>
              Project <span style={{ fontStyle:"italic", color:G }}>Gallery</span>
            </h1>
          </div>
          <button onClick={() => { setEditing({ ...EMPTY }); setMsg(null); }}
            style={{ padding:".65rem 1.4rem", borderRadius:"8px", border:`1px solid ${G}`, background:"transparent", color:G, fontSize:".75rem", letterSpacing:".08em", textTransform:"uppercase", cursor:"pointer" }}>
            + Add Project
          </button>
        </div>

        {/* ── Edit / New form ── */}
        {editing && (
          <div style={{ background:"rgba(212,167,61,.04)", border:"1px solid rgba(212,167,61,.2)", borderRadius:"12px", padding:"1.75rem", marginBottom:"2rem" }}>
            <h3 style={{ fontFamily:"monospace", fontSize:".65rem", color:G, letterSpacing:".14em", marginBottom:"1.5rem" }}>
              {editing.id ? `EDITING: ${editing.title || "PROJECT"}` : "NEW PROJECT"}
            </h3>

            <form onSubmit={save}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.1rem" }}>

                {/* Title */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Title *</Label>
                  <input type="text" required value={editing.title}
                    onChange={e => setEditing(p => ({ ...p!, title:e.target.value }))}
                    style={inp} onFocus={fi} onBlur={bl} />
                </div>

                {/* Category + Location */}
                <div>
                  <Label>Category</Label>
                  <select value={editing.category}
                    onChange={e => setEditing(p => ({ ...p!, category:e.target.value }))}
                    style={inp} onFocus={fi as never} onBlur={bl as never}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Location</Label>
                  <input type="text" value={editing.location}
                    onChange={e => setEditing(p => ({ ...p!, location:e.target.value }))}
                    placeholder="Mandalay, Myanmar" style={inp} onFocus={fi} onBlur={bl} />
                </div>

                {/* Description */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Description</Label>
                  <textarea value={editing.description}
                    onChange={e => setEditing(p => ({ ...p!, description:e.target.value }))}
                    rows={3} style={{ ...inp, resize:"vertical" } as React.CSSProperties}
                    onFocus={fi as never} onBlur={bl as never} />
                </div>

                {/* Cover image */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <Label>Cover Image</Label>
                  <CoverUpload secret={secret} currentUrl={editing.cover_image_url}
                    onDone={url => setEditing(p => ({ ...p!, cover_image_url:url }))} />
                  <input type="text" value={editing.cover_image_url} placeholder="https://... or upload above"
                    onChange={e => setEditing(p => ({ ...p!, cover_image_url:e.target.value }))}
                    style={{ ...inp, marginTop:".5rem" }} onFocus={fi} onBlur={bl} />
                </div>

                {/* Sort order */}
                <div>
                  <Label>Sort Order</Label>
                  <input type="number" value={editing.sort_order}
                    onChange={e => setEditing(p => ({ ...p!, sort_order:Number(e.target.value) }))}
                    style={inp} onFocus={fi} onBlur={bl} />
                </div>

                {/* Checkboxes */}
                <div style={{ display:"flex", gap:"2rem", alignItems:"center", flexWrap:"wrap" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:".5rem", cursor:"pointer", fontSize:".82rem", color:"#EDE8DC" }}>
                    <input type="checkbox" checked={editing.active}
                      onChange={e => setEditing(p => ({ ...p!, active:e.target.checked }))}
                      style={{ width:"16px", height:"16px", accentColor:G }} />
                    Active
                  </label>
                  <label style={{ display:"flex", alignItems:"center", gap:".5rem", cursor:"pointer", fontSize:".82rem", color:"#EDE8DC" }}>
                    <input type="checkbox" checked={editing.featured}
                      onChange={e => setEditing(p => ({ ...p!, featured:e.target.checked }))}
                      style={{ width:"16px", height:"16px", accentColor:G }} />
                    Featured
                  </label>
                </div>

                {/* Feedback + actions */}
                {msg && <div style={{ gridColumn:"1 / -1" }}><Msg msg={msg} /></div>}

                <div style={{ gridColumn:"1 / -1", display:"flex", gap:".75rem" }}>
                  <button type="submit" disabled={saving}
                    style={{ padding:".7rem 1.6rem", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${G},#9A7020)`, color:"#010408", fontWeight:"700", fontSize:".75rem", letterSpacing:".08em", textTransform:"uppercase", cursor:saving?"wait":"pointer" }}>
                    {saving ? "Saving…" : editing.id ? "Update Project" : "Save & Continue →"}
                  </button>
                  <button type="button" onClick={() => { setEditing(null); setMsg(null); load(); }}
                    style={{ padding:".7rem 1.2rem", borderRadius:"8px", border:"1px solid rgba(255,255,255,.1)", background:"transparent", color:"#7A8FA8", fontSize:".75rem", cursor:"pointer" }}>
                    {editing.id ? "Done" : "Cancel"}
                  </button>
                </div>
              </div>
            </form>

            {/* Gallery — only shown after project exists in DB */}
            {editing.id && (
              <GalleryManager project={editing} secret={secret} onRefresh={refreshEditing} />
            )}
            {!editing.id && (
              <p style={{ marginTop:"1.25rem", fontSize:".72rem", color:"#2E4060", fontFamily:"monospace" }}>
                → Save the project first to unlock gallery photo upload.
              </p>
            )}
          </div>
        )}

        {/* ── Project list ── */}
        {loading ? (
          <p style={{ color:"#2E4060", fontFamily:"monospace", fontSize:".65rem" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color:"#2E4060", fontFamily:"monospace", fontSize:".65rem", letterSpacing:".1em" }}>NO PROJECTS YET</p>
        ) : (
          <div style={{ border:"1px solid rgba(255,255,255,.07)", borderRadius:"12px", overflow:"hidden" }}>
            {rows.map((r, i) => (
              <div key={r.id}
                style={{ display:"grid", gridTemplateColumns:"auto 1fr 80px 70px 70px 80px 90px", gap:".75rem", padding:".9rem 1.25rem", borderBottom:i<rows.length-1?"1px solid rgba(255,255,255,.04)":"none", alignItems:"center", transition:"background .15s" }}
                onMouseEnter={e => (e.currentTarget.style.background="rgba(255,255,255,.02)")}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}>

                {/* Cover thumbnail */}
                <div style={{ width:"44px", height:"44px", borderRadius:"6px", background:"rgba(255,255,255,.04)", backgroundImage:r.cover_image_url?`url(${r.cover_image_url})`:"none", backgroundSize:"cover", backgroundPosition:"center", flexShrink:0 }} />

                {/* Title + meta */}
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:".85rem", color:"#EDE8DC", fontWeight:"500", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</p>
                  <p style={{ fontSize:".7rem", color:"#7A8FA8" }}>
                    {r.category} · {r.location}
                    {r.project_images && r.project_images.length > 0
                      ? ` · ${r.project_images.length} photo${r.project_images.length !== 1 ? "s" : ""}`
                      : ""}
                  </p>
                </div>

                {/* Featured */}
                <span style={{ fontFamily:"monospace", fontSize:".58rem", padding:".18rem .45rem", borderRadius:"100px", background:r.featured?"rgba(212,167,61,.12)":"rgba(255,255,255,.04)", color:r.featured?G:"#2E4060" }}>
                  {r.featured ? "★ TOP" : "—"}
                </span>

                {/* Active */}
                <span style={{ fontFamily:"monospace", fontSize:".6rem", padding:".2rem .5rem", borderRadius:"100px", background:r.active?"rgba(16,185,129,.1)":"rgba(255,255,255,.05)", color:r.active?"#10B981":"#2E4060" }}>
                  {r.active ? "ON" : "OFF"}
                </span>

                <span />

                <button onClick={() => { setEditing({ ...EMPTY, ...r }); setMsg(null); }}
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
