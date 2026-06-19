import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED = ["name", "category", "description", "image_url", "price", "active", "sort_order"];

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("cms_products").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const insert = Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED.includes(k)));
  const { data, error } = await supabaseAdmin.from("cms_products").insert(insert).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data }, { status: 201 });
}
