/**
 * supabaseAdmin.ts
 *
 * Server-only Supabase client using the SERVICE ROLE key.
 * - Bypasses RLS — full table access.
 * - NEVER import this file in any "use client" component.
 * - NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Required env vars (server-side only, no NEXT_PUBLIC_ prefix):
 *   SUPABASE_URL              — your project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role secret key
 */

import { createClient } from "@supabase/supabase-js";

const url  = process.env.SUPABASE_URL;
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
    "Add them to .env.local (server-side only, no NEXT_PUBLIC_ prefix)."
  );
}

export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false },
});
