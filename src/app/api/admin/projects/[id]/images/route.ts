import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function guard(req: NextRequest) {
  const s = process.env.ADMIN_SECRET;
  return s && req.headers.get("x-admin-secret") === s;
}

export async function POST(req: NextRequest, context: { params: Promise<{ id:string }> }) {
  if (!guard(req)) return Response.json({ error:"Unauthorized" },{ status:401 });
  const { id: project_id } = await context.params;
  const body = await req.json();
  const { image_url, image_type="gallery", caption="", sort_order=0 } = body;
  if (!image_url) return Response.json({ error:"image_url required" },{ status:400 });
  const { data, error } = await supabaseAdmin.from("project_images")
    .insert({ project_id, image_url, image_type, caption, sort_order }).select().single();
  if (error) return Response.json({ error:error.message },{ status:500 });
  return Response.json({ data },{ status:201 });
}
