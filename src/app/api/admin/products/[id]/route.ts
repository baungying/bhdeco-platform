import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED = ["name", "category", "description", "image_url", "price", "active", "sort_order"];

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await req.json();
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED.includes(k)));
  const { data, error } = await supabaseAdmin.from("cms_products").update(update).eq("id", id).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("cms_products").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
