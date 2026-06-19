import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function guard(req: NextRequest) {
  const s = process.env.ADMIN_SECRET;
  return s && req.headers.get("x-admin-secret") === s;
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id:string; imageId:string }> }
) {
  if (!guard(req)) return Response.json({ error:"Unauthorized" },{ status:401 });
  const { imageId } = await context.params;
  const body = await req.json();
  const allowed = ["image_type","caption","sort_order"];
  const update = Object.fromEntries(Object.entries(body).filter(([k])=>allowed.includes(k)));
  const { data, error } = await supabaseAdmin.from("project_images")
    .update(update).eq("id",imageId).select().single();
  if (error) return Response.json({ error:error.message },{ status:500 });
  return Response.json({ data });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id:string; imageId:string }> }
) {
  if (!guard(req)) return Response.json({ error:"Unauthorized" },{ status:401 });
  const { imageId } = await context.params;
  const { error } = await supabaseAdmin.from("project_images").delete().eq("id",imageId);
  if (error) return Response.json({ error:error.message },{ status:500 });
  return Response.json({ success:true });
}
