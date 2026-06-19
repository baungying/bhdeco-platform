/**
 * GET  /api/admin/company  — fetch company_settings row id='main'
 * PUT  /api/admin/company  — upsert company_settings row id='main'
 *
 * Security: x-admin-secret header must match ADMIN_SECRET env var.
 * Uses service role (supabaseAdmin) server-side only.
 * Does NOT touch profiles, credits, recharge, or any existing table.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED_FIELDS = [
  "company_name", "phone", "email", "address",
  "whatsapp", "facebook_url", "tiktok_url", "youtube_url", "instagram_url",
  "about",
] as const;

function guard(req: NextRequest): NextResponse | null {
  const secret   = process.env.ADMIN_SECRET;
  const provided = req.headers.get("x-admin-secret");
  if (!secret || provided !== secret)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;

  const { data, error } = await supabaseAdmin
    .from("company_settings")
    .select("*")
    .eq("id", "main")
    .single();

  if (error) {
    console.error("[company GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// ── PUT ───────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only allow known fields — never write id, updated_at, or unknown keys
  const update: Record<string, unknown> = { id: "main" };
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      const v = body[field];
      if (v !== undefined && typeof v !== "string")
        return NextResponse.json({ error: `${field} must be a string` }, { status: 400 });
      update[field] = typeof v === "string" ? v.trim() : v;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("company_settings")
    .upsert(update)
    .eq("id", "main")
    .select()
    .single();

  if (error) {
    console.error("[company PUT]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
