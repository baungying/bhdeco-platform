import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED = ["name","category","sub_category","price","description","cover_image_url","active","featured","sort_order"];

function guard(req: NextRequest) {
  const s = process.env.ADMIN_SECRET;
  return s && req.headers.get("x-admin-secret") === s;
}

export async function GET(req: NextRequest) {
  if (!guard(req)) return Response.json({ error:"Unauthorized" },{ status:401 });
  const { data, error } = await supabaseAdmin
    .from("cms_products").select("*, product_images(*)")
    .order("sort_order").order("created_at",{ ascending:false });
  if (error) return Response.json({ error:error.message },{ status:500 });
  return Response.json({ data });
}

export async function POST(req: NextRequest) {
  if (!guard(req)) return Response.json({ error:"Unauthorized" },{ status:401 });
  const body = await req.json();
  const insert = Object.fromEntries(Object.entries(body).filter(([k])=>ALLOWED.includes(k)));
  const { data, error } = await supabaseAdmin.from("cms_products").insert(insert).select().single();
  if (error) return Response.json({ error:error.message },{ status:500 });
  return Response.json({ data },{ status:201 });
}
