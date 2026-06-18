/**
 * GET /api/admin/credit-settings
 *
 * Returns all rows from credit_settings ordered by category, key.
 *
 * Security:
 *   Requires header:  x-admin-secret: <ADMIN_SECRET env var>
 *
 *   TODO (Phase 3+): Replace secret-header guard with Supabase JWT
 *   check: verify session token is an admin role from profiles table.
 *   For now the secret header is sufficient for internal dashboard use.
 *
 * Response 200:
 *   { data: CreditSetting[] }
 *
 * Response 401:
 *   { error: "Unauthorized" }
 *
 * Response 500:
 *   { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  // ── Admin guard ────────────────────────────────────────────
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers.get("x-admin-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Fetch all credit_settings ──────────────────────────────
  const { data, error } = await supabaseAdmin
    .from("credit_settings")
    .select("*")
    .order("category", { ascending: true })
    .order("key",      { ascending: true });

  if (error) {
    console.error("[credit-settings GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
