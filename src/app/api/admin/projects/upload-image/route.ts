import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET    = "project-images";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg","image/jpg","image/png","image/webp"];
const ALLOWED_EXT  = ["jpg","jpeg","png","webp"];

function sanitize(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]/g,"-").replace(/-+/g,"-").slice(0,120);
}

export async function POST(req: NextRequest) {
  const s = process.env.ADMIN_SECRET;
  if (!s || req.headers.get("x-admin-secret") !== s)
    return NextResponse.json({ error:"Unauthorized" },{ status:401 });

  let form: FormData;
  try { form = await req.formData(); }
  catch { return NextResponse.json({ error:"Invalid form data" },{ status:400 }); }

  const file = form.get("file");
  if (!file || !(file instanceof File))
    return NextResponse.json({ error:"No file provided" },{ status:400 });

  const mime = file.type.toLowerCase();
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_MIME.includes(mime) || !ALLOWED_EXT.includes(ext))
    return NextResponse.json({ error:`Invalid type. Allowed: jpg png webp` },{ status:400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error:"Max 10 MB" },{ status:400 });

  const base = sanitize(file.name.replace(/\.[^.]+$/,""));
  const path = `${Date.now()}-${base}.${ext}`;
  const { error } = await supabaseAdmin.storage.from(BUCKET)
    .upload(path, await file.arrayBuffer(), { contentType:mime, cacheControl:"3600", upsert:false });
  if (error) return NextResponse.json({ error:error.message },{ status:500 });

  const { data:{ publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: publicUrl });
}
