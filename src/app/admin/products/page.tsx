"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const G = "#D4A73D";
const CATS = ["C Channel Frame","Light Steel","Board","Flooring","Wall Panel","Hardware","Furniture","Cabinet Accessories","Mobihome","Other"];
const IMG_TYPES = ["gallery","cover","detail","installation","packaging"] as const;
type ImgType = typeof IMG_TYPES[number];

const inp: React.CSSProperties = { width:"100%",padding:".7rem .9rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",color:"#EDE8DC",fontSize:".85rem",outline:"none",fontFamily:"inherit",transition:"border-color .2s",boxSizing:"border-box" };
const fi = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor="rgba(212,167,61,.45)");
const bl = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => (e.target.style.borderColor="rgba(255,255,255,.1)");

// ─── Types ────────────────────────────────────────────────────
interface ProductImage {
  id:          string;
  product_id:  string;
  image_url:   string;
  image_type:  string;
  caption:     string;
  sort_order:  number;
}

interface Product {
  id?:             string;
  name:            string;
  category:        string;
  sub_category:    string;
  price:           string;
  description:     string;
  cover_image_url: string;
  active:          boolean;
  featured:        boolean;
  sort_order:      number;
  product_images?: ProductImage[];
}

const EMPTY: Product = {
  name:"", category:"C Channel Frame", sub_category:"", price:"",
  description:"", cover_image_url:"", active:true, featured:false, sort_order:0,
};

// ─── Helpers ──────────────────────────────────────────────────
const Lbl = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display:"block",fontFamily:"monospace",fontSize:".55rem",color:"#7A8FA8",letterSpacing:".1em",textTransform:"uppercase",marginBottom:".35rem" }}>{children}</label>
);

const FeedbackMsg = ({ msg }: { msg: { ok:boolean; text:string } }) => (
  <div style={{ padding:".65rem 1rem",background:msg.ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${msg.ok?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`,borderRadius:"8px",fontSize:".8rem",color:msg.ok?"#10B981":"#f87171" }}>
    {msg.text}
  </div>
);

// ─── Cover upload ─────────────────────────────────────────────
function CoverUpload({ secret, currentUrl, onDone }: { secret:string; currentUrl:string; onDone:(url:string)=>void }) {
  const [busy,setBusy] = useState(false);
  const [err, setErr]  = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/products/upload-image", { method:"POST", headers:{ "x-admin-secret":secret }, body:form });
    const j = await res.json();
    setBusy(false);
    if (j.error) { setErr(j.error); return; }
    if (j.url) onDone(j.url);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:".4rem" }}>
      <div style={{ display:"flex",gap:".5rem",alignItems:"center",flexWrap:"wrap" }}>
        <button type="button" disabled={busy} onClick={() => ref.current?.click()}
          style={{ padding:".42rem .9rem",borderRadius:"6px",border:`1px solid ${G}`,background:"rgba(212,167,61,.08)",color:G,fontSize:".68rem",letterSpacing:".08em",textTransform:"uppercase",cursor:busy?"wait":"pointer" }}>
          {busy?"Uploading…":"↑ Upload Cover"}
        </button>
        <span style={{ fontSize:".65rem",color:"#2E4060" }}>or paste URL below</span>
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handle} style={{ display:"none" }} />
      </div>
      {err && <p style={{ fontSize:".68rem",color:"#f87171" }}>{err}</p>}
      {currentUrl && <p style={{ fontSize:".65rem",color:"#10B981",wordBreak:"break-all" }}>✓ {currentUrl.split("/").pop()}</p>}
    </div>
  );
}

// ─── Gallery manager ──────────────────────────────────────────
function GalleryManager({ product, secret, onRefresh }: { product:Product; secret:string; onRefresh:()=>void }) {
  const [images,    setImages]    = useState<ProductImage[]>(product.product_images ?? []);
  const [uploading, setUploading] = useState(false);
  const [upErr,     setUpErr]     = useState("");
  const [imgType,   setImgType]   = useState<ImgType>("gallery");
  const [caption,   setCaption]   = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { setImages(product.product_images ?? []); }, [product.product_images]);

  const uploadAndAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product.id) return;
    setUploading(true); setUpErr("");
    const form = new FormData();
    form.append("file", file);
    const upRes = await fetch("/api/admin/products/upload-image", { method:"POST", headers:{ "x-admin-secret":secret }, body:form });
    const upJson = await upRes.json();
    if (upJson.error) { setUpErr(upJson.error); setUploading(false); return; }

    const addRes = await fetch(`/api/admin/products/${product.id}/images`, {
      method:"POST",
      headers:{ "Content-Type":"application/json","x-admin-secret":secret },
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
    if (!product.id || !confirm("Remove this image?")) return;
    await fetch(`/api/admin/products/${product.id}/images/${imgId}`, { method:"DELETE", headers:{ "x-admin-secret":secret } });
    setImages(prev => prev.filter(i => i.id !== imgId));
    onRefresh();
  };

  const updateImg = async (imgId: string, patch: Partial<ProductImage>) => {
    if (!product.id) return;
    const res = await fetch(`/api/admin/products/${product.id}/images/${imgId}`, {
      method:"PUT",
      headers:{ "Content-Type":"application/json","x-admin-secret":secret },
      body: JSON.stringify(patch),
    });
    const j = await res.json();
    if (j.data) setImages(prev => prev.map(i => i.id === imgId ? { ...i, ...j.data } : i));
  };

  return (
    <div style={{ marginTop:"1.5rem",borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:"1.5rem" }}>
      <p style={{ fontFamily:"monospace",fontSize:".6rem",color:G,letterSpacing:".14em",marginBottom:"1rem" }}>
        GALLERY — {images.length} IMAGE{images.length!==1?"S":""}
      </p>

      {/* Upload controls */}
      <div style={{ display:"grid",gridTemplateColumns:"130px 1fr auto",gap:".6rem",alignItems:"end",marginBottom:"1rem" }}>
        <div>
          <Lbl>Type</Lbl>
          <select value={imgType} onChange={e=>setImgType(e.target.value as ImgType)}
            style={inp} onFocus={fi as never} onBlur={bl as never}>
            {IMG_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <Lbl>Caption (optional)</Lbl>
          <input type="text" value={caption} onChange={e=>setCaption(e.target.value)}
            placeholder="Short description" style={inp} onFocus={fi} onBlur={bl} />
        </div>
        <button type="button" disabled={uploading} onClick={() => ref.current?.click()}
          style={{ padding:".7rem 1rem",borderRadius:"8px",border:`1px solid ${G}`,background:"rgba(212,167,61,.08)",color:G,fontSize:".72rem",letterSpacing:".06em",textTransform:"uppercase",cursor:uploading?"wait":"pointer",whiteSpace:"nowrap" }}>
          {uploading?"Uploading…":"+ Add Photo"}
        </button>
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={uploadAndAdd} style={{ display:"none" }} />
      </div>

      {upErr && <p style={{ fontSize:".72rem",color:"#f87171",marginBottom:".75rem" }}>{upErr}</p>}

      {images.length===0
        ? <p style={{ fontSize:".7rem",color:"#2E4060",fontFamily:"monospace",letterSpacing:".08em" }}>NO IMAGES YET</p>
        : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:".75rem" }}>
            {[...images].sort((a,b)=>a.sort_order-b.sort_order).map(img=>(
              <div key={img.id} style={{ background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"10px",overflow:"hidden" }}>
                <div style={{ height:"105px",backgroundImage:`url(${img.image_url})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative" }}>
                  <button type="button" onClick={()=>deleteImg(img.id)}
                    style={{ position:"absolute",top:".4rem",right:".4rem",width:"22px",height:"22px",borderRadius:"50%",background:"rgba(239,68,68,.85)",border:"none",color:"#fff",fontSize:".7rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    ×
                  </button>
                </div>
                <div style={{ padding:".55rem" }}>
                  <select value={img.image_type} onChange={e=>updateImg(img.id,{image_type:e.target.value})}
                    style={{ ...inp,fontSize:".65rem",padding:".32rem .5rem" }} onFocus={fi as never} onBlur={bl as never}>
                    {IMG_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <input type="text" value={img.caption||""} placeholder="Caption"
                    onChange={e=>updateImg(img.id,{caption:e.target.value})}
                    style={{ ...inp,fontSize:".7rem",padding:".32rem .5rem",marginTop:".35rem" }} onFocus={fi} onBlur={bl} />
                  <div style={{ display:"flex",alignItems:"center",gap:".4rem",marginTop:".35rem" }}>
                    <span style={{ fontSize:".58rem",color:"#2E4060",fontFamily:"monospace" }}>ORD</span>
                    <input type="number" value={img.sort_order}
                      onChange={e=>updateImg(img.id,{sort_order:Number(e.target.value)})}
                      style={{ ...inp,fontSize:".7rem",padding:".3rem .4rem",width:"56px" }} onFocus={fi} onBlur={bl} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function ProductsPage() {
  const [rows,    setRows]    = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ok:boolean;text:string}|null>(null);
  const [secret,  setSecret]  = useState("");

  useEffect(()=>{ setSecret(sessionStorage.getItem("bh_admin_secret")||""); },[]);

  const load = async (s=secret) => {
    setLoading(true);
    const r = await fetch("/api/admin/products",{ headers:{ "x-admin-secret":s } });
    const j = await r.json();
    setRows((j.data||[]).map((p: Product) => ({
      ...p,
      name:            p.name            ?? "",
      category:        p.category        ?? "",
      sub_category:    p.sub_category    ?? "",
      price:           p.price           ?? "",
      description:     p.description     ?? "",
      cover_image_url: p.cover_image_url ?? "",
      active:          p.active          ?? true,
      featured:        p.featured        ?? false,
      sort_order:      p.sort_order      ?? 0,
    })));
    setLoading(false);
  };
  useEffect(()=>{ if(secret) load(); },[secret]);

  const refreshEditing = async () => {
    if (!editing?.id) return;
    const r = await fetch("/api/admin/products",{ headers:{ "x-admin-secret":secret } });
    const j = await r.json();
    const updated = (j.data||[]).find((p: Product)=>p.id===editing.id);
    if (updated) setEditing(updated);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setMsg(null);
    const method = editing.id?"PUT":"POST";
    const url    = editing.id?`/api/admin/products/${editing.id}`:"/api/admin/products";
    const res = await fetch(url,{ method, headers:{ "Content-Type":"application/json","x-admin-secret":secret }, body:JSON.stringify(editing) });
    const j = await res.json();
    if (res.ok) {
      setMsg({ ok:true, text:"Product saved." });
      if (!editing.id && j.data) setEditing({ ...editing, id:j.data.id, product_images:[] });
      else load();
    } else {
      setMsg({ ok:false, text:j.error||"Failed." });
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product and all its images?")) return;
    await fetch(`/api/admin/products/${id}`,{ method:"DELETE", headers:{ "x-admin-secret":secret } });
    load();
  };

  return (
    <div style={{ minHeight:"100vh",background:"#010408",color:"#EDE8DC",padding:"4rem 2rem" }}>
      <div style={{ maxWidth:"1100px",margin:"0 auto" }}>

        <Link href="/admin" style={{ fontSize:".7rem",color:"#2E4060",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem",marginBottom:"1.5rem" }}
          onMouseEnter={e=>(e.currentTarget.style.color=G)} onMouseLeave={e=>(e.currentTarget.style.color="#2E4060")}>← Admin</Link>

        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem" }}>
          <div>
            <p style={{ fontFamily:"monospace",fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".4rem" }}>CMS · PRODUCTS</p>
            <h1 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300",fontFamily:"'Cormorant Garant',serif" }}>
              Product <span style={{ fontStyle:"italic",color:G }}>Catalogue</span>
            </h1>
          </div>
          <button onClick={()=>{ setEditing({...EMPTY}); setMsg(null); }}
            style={{ padding:".65rem 1.4rem",borderRadius:"8px",border:`1px solid ${G}`,background:"transparent",color:G,fontSize:".75rem",letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer" }}>
            + Add Product
          </button>
        </div>

        {/* ── Edit / New form ── */}
        {editing && (
          <div style={{ background:"rgba(212,167,61,.04)",border:"1px solid rgba(212,167,61,.2)",borderRadius:"12px",padding:"1.75rem",marginBottom:"2rem" }}>
            <h3 style={{ fontFamily:"monospace",fontSize:".65rem",color:G,letterSpacing:".14em",marginBottom:"1.5rem" }}>
              {editing.id?`EDITING: ${editing.name||"PRODUCT"}`:"NEW PRODUCT"}
            </h3>

            <form onSubmit={save}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.1rem" }}>

                <div style={{ gridColumn:"1 / -1" }}>
                  <Lbl>Product Name *</Lbl>
                  <input type="text" required value={editing.name}
                    onChange={e=>setEditing(p=>({...p!,name:e.target.value}))}
                    style={inp} onFocus={fi} onBlur={bl} />
                </div>

                <div>
                  <Lbl>Category</Lbl>
                  <select value={editing.category}
                    onChange={e=>setEditing(p=>({...p!,category:e.target.value}))}
                    style={inp} onFocus={fi as never} onBlur={bl as never}>
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <Lbl>Sub-Category</Lbl>
                  <input type="text" value={editing.sub_category}
                    onChange={e=>setEditing(p=>({...p!,sub_category:e.target.value}))}
                    placeholder="e.g. C75, C90, Track…" style={inp} onFocus={fi} onBlur={bl} />
                </div>

                <div>
                  <Lbl>Price (optional)</Lbl>
                  <input type="text" value={editing.price}
                    onChange={e=>setEditing(p=>({...p!,price:e.target.value}))}
                    placeholder="e.g. 2,500 MMK / pcs" style={inp} onFocus={fi} onBlur={bl} />
                </div>

                <div>
                  <Lbl>Sort Order</Lbl>
                  <input type="number" value={editing.sort_order}
                    onChange={e=>setEditing(p=>({...p!,sort_order:Number(e.target.value)}))}
                    style={inp} onFocus={fi} onBlur={bl} />
                </div>

                <div style={{ gridColumn:"1 / -1" }}>
                  <Lbl>Description</Lbl>
                  <textarea value={editing.description}
                    onChange={e=>setEditing(p=>({...p!,description:e.target.value}))}
                    rows={3} style={{ ...inp,resize:"vertical" } as React.CSSProperties}
                    onFocus={fi as never} onBlur={bl as never} />
                </div>

                <div style={{ gridColumn:"1 / -1" }}>
                  <Lbl>Cover Image</Lbl>
                  <CoverUpload secret={secret} currentUrl={editing.cover_image_url}
                    onDone={url=>setEditing(p=>({...p!,cover_image_url:url}))} />
                  <input type="text" value={editing.cover_image_url} placeholder="https://... or upload above"
                    onChange={e=>setEditing(p=>({...p!,cover_image_url:e.target.value}))}
                    style={{ ...inp,marginTop:".5rem" }} onFocus={fi} onBlur={bl} />
                </div>

                <div style={{ display:"flex",gap:"2rem",alignItems:"center",flexWrap:"wrap" }}>
                  <label style={{ display:"flex",alignItems:"center",gap:".5rem",cursor:"pointer",fontSize:".82rem",color:"#EDE8DC" }}>
                    <input type="checkbox" checked={editing.active}
                      onChange={e=>setEditing(p=>({...p!,active:e.target.checked}))}
                      style={{ width:"16px",height:"16px",accentColor:G }} />
                    Active
                  </label>
                  <label style={{ display:"flex",alignItems:"center",gap:".5rem",cursor:"pointer",fontSize:".82rem",color:"#EDE8DC" }}>
                    <input type="checkbox" checked={editing.featured}
                      onChange={e=>setEditing(p=>({...p!,featured:e.target.checked}))}
                      style={{ width:"16px",height:"16px",accentColor:G }} />
                    Featured
                  </label>
                </div>

                {msg && <div style={{ gridColumn:"1 / -1" }}><FeedbackMsg msg={msg} /></div>}

                <div style={{ gridColumn:"1 / -1",display:"flex",gap:".75rem" }}>
                  <button type="submit" disabled={saving}
                    style={{ padding:".7rem 1.6rem",borderRadius:"8px",border:"none",background:`linear-gradient(135deg,${G},#9A7020)`,color:"#010408",fontWeight:"700",fontSize:".75rem",letterSpacing:".08em",textTransform:"uppercase",cursor:saving?"wait":"pointer" }}>
                    {saving?"Saving…":editing.id?"Update Product":"Save & Continue →"}
                  </button>
                  <button type="button" onClick={()=>{ setEditing(null); setMsg(null); load(); }}
                    style={{ padding:".7rem 1.2rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#7A8FA8",fontSize:".75rem",cursor:"pointer" }}>
                    {editing.id?"Done":"Cancel"}
                  </button>
                </div>
              </div>
            </form>

            {editing.id
              ? <GalleryManager product={editing} secret={secret} onRefresh={refreshEditing} />
              : <p style={{ marginTop:"1.25rem",fontSize:".72rem",color:"#2E4060",fontFamily:"monospace" }}>
                  → Save the product first to unlock gallery photo upload.
                </p>
            }
          </div>
        )}

        {/* ── Product list ── */}
        {loading
          ? <p style={{ color:"#2E4060",fontFamily:"monospace",fontSize:".65rem" }}>Loading…</p>
          : rows.length===0
          ? <p style={{ color:"#2E4060",fontFamily:"monospace",fontSize:".65rem",letterSpacing:".1em" }}>NO PRODUCTS YET</p>
          : (
            <div style={{ border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",overflow:"hidden" }}>
              {rows.map((r,i)=>(
                <div key={r.id}
                  style={{ display:"grid",gridTemplateColumns:"auto 1fr 120px 70px 70px 80px 90px",gap:".75rem",padding:".9rem 1.25rem",borderBottom:i<rows.length-1?"1px solid rgba(255,255,255,.04)":"none",alignItems:"center",transition:"background .15s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,.02)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>

                  <div style={{ width:"44px",height:"44px",borderRadius:"6px",background:"rgba(255,255,255,.04)",backgroundImage:r.cover_image_url?`url(${r.cover_image_url})`:"none",backgroundSize:"cover",backgroundPosition:"center",flexShrink:0 }}/>

                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:".85rem",color:"#EDE8DC",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.name}</p>
                    <p style={{ fontSize:".7rem",color:"#7A8FA8" }}>
                      {r.category}{r.sub_category?` › ${r.sub_category}`:""}{r.price?` · ${r.price}`:""}
                      {r.product_images && r.product_images.length>0 ? ` · ${r.product_images.length} photo${r.product_images.length!==1?"s":""}` : ""}
                    </p>
                  </div>

                  <span style={{ fontFamily:"monospace",fontSize:".62rem",color:"#7A8FA8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.category}</span>

                  <span style={{ fontFamily:"monospace",fontSize:".58rem",padding:".18rem .45rem",borderRadius:"100px",background:r.featured?"rgba(212,167,61,.12)":"rgba(255,255,255,.04)",color:r.featured?G:"#2E4060" }}>
                    {r.featured?"★ TOP":"—"}
                  </span>

                  <span style={{ fontFamily:"monospace",fontSize:".6rem",padding:".2rem .5rem",borderRadius:"100px",background:r.active?"rgba(16,185,129,.1)":"rgba(255,255,255,.05)",color:r.active?"#10B981":"#2E4060" }}>
                    {r.active?"ON":"OFF"}
                  </span>

                  <button onClick={()=>{ setEditing({...EMPTY,...r}); setMsg(null); }}
                    style={{ fontSize:".7rem",color:G,background:"none",border:`1px solid rgba(212,167,61,.25)`,borderRadius:"6px",padding:".35rem .8rem",cursor:"pointer" }}>
                    Edit
                  </button>
                  <button onClick={()=>r.id&&del(r.id)}
                    style={{ fontSize:".7rem",color:"#f87171",background:"none",border:"1px solid rgba(239,68,68,.2)",borderRadius:"6px",padding:".35rem .8rem",cursor:"pointer" }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
