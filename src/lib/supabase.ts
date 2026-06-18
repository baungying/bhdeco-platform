/**
 * BH DECO AI — Universal Supabase Client
 *
 * Same project as App. One auth system, one profiles table,
 * one credits wallet. Never create website_users or website_credits.
 *
 * Uses NEXT_PUBLIC_ anon key — safe for browser.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key, {
  auth: {
    persistSession:     true,
    storageKey:         "bh_deco_ai_session",
    autoRefreshToken:   true,
    detectSessionInUrl: true,
  },
});

export interface BHProfile {
  id:          string;
  email:       string;
  credits:     number;
  is_paid:     boolean;
  full_name?:  string;
  avatar_url?: string;
  created_at?: string;
}
