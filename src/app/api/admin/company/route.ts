import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("company_settings").select("*").eq("id",1).single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function PUT(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("x-admin-secret") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const allowed = ["name","phone","email","address","whatsapp","facebook","tiktok","youtube","instagram"];
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabaseAdmin.from("company_settings").upsert({ id:1, ...update }).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}
