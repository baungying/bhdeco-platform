/**
 * PATCH /api/admin/credit-settings/:id
 *
 * Updates credits and/or enabled for a single credit_settings row.
 * Only the fields provided in the body are updated.
 *
 * Security:
 *   Requires header:  x-admin-secret: <ADMIN_SECRET env var>
 *
 * Body (JSON):
 *   { credits?: number, enabled?: boolean, description?: string }
 *
 * Rules:
 *   - credits must be integer >= 0
 *   - enabled must be boolean
 *   - key and category are NOT editable (structural)
 *   - updated_at is set automatically by the DB trigger
 *   - Does NOT touch profiles.credits or any other table
 *
 * Response 200:
 *   { data: CreditSetting }
 *
 * Response 400:
 *   { error: string }   (validation failure)
 *
 * Response 401:
 *   { error: "Unauthorized" }
 *
 * Response 404:
 *   { error: "Row not found" }
 *
 * Response 500:
 *   { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ── Admin guard ────────────────────────────────────────────
  const secret   = process.env.ADMIN_SECRET;
  const provided = req.headers.get("x-admin-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse & validate id ────────────────────────────────────
  const { id: rawId } = await context.params;
  const id = parseInt(rawId, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // ── Parse body ─────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Build update payload — only allowed fields ─────────────
  const update: Record<string, unknown> = {};

  if ("credits" in body) {
    const c = body.credits;
    if (typeof c !== "number" || !Number.isInteger(c) || c < 0) {
      return NextResponse.json(
        { error: "credits must be a non-negative integer" },
        { status: 400 }
      );
    }
    update.credits = c;
  }

  if ("enabled" in body) {
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: "enabled must be boolean" },
        { status: 400 }
      );
    }
    update.enabled = body.enabled;
  }

  if ("description" in body) {
    if (typeof body.description !== "string") {
      return NextResponse.json(
        { error: "description must be a string" },
        { status: 400 }
      );
    }
    update.description = body.description.trim();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided. Allowed: credits, enabled, description" },
      { status: 400 }
    );
  }

  // ── Perform update ─────────────────────────────────────────
  const { data, error } = await supabaseAdmin
    .from("credit_settings")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // PostgREST "no rows returned" — id not found
      return NextResponse.json({ error: "Row not found" }, { status: 404 });
    }
    console.error("[credit-settings PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
