/**
 * BH DECO AI — API Client
 * Backend: https://bh-deco-ai-production.up.railway.app
 *
 * Routes verified from main.py — NO guessing.
 *
 * ══════════════════════════════════════════════════════
 * CONFIRMED REAL ENDPOINTS (from main.py):
 *
 * AI INTERIOR (both work, /api/generate is the full version):
 *   POST /generate             — legacy, sync, no reference support
 *   POST /api/generate         — MAIN: multipart/form-data, supports reference image
 *
 * JOB POLLING:
 *   GET  /api/job/{job_id}     — returns { status, result_url, result_urls, error, seed }
 *   GET  /api/result/{job_id}/{filename}  — serve result image file
 *   GET  /api/results/{job_id} — list all result files for a job
 *
 * FURNITURE CONSTRUCTION (from furniture_router prefix /api/furniture-construction):
 *   POST /api/furniture-construction/generate
 *   (other routes from furniture_route.py — not yet seen)
 *
 * CONSTRUCTION/BLUEPRINT:
 *   POST /api/construction/generate  — text output (ceiling/lighting/cabinet/material plan)
 *   POST /api/construction/drawing   — SVG floor plan output
 *
 * PAYMENT (Stripe):
 *   POST /api/stripe/create_checkout  — { user_id, package } → { checkout_url }
 *   POST /api/stripe/webhook          — Stripe webhook handler
 *
 * PAYMENT (Manual/Myanmar):
 *   POST /api/payment_requests/create  — manual payment request
 *   GET  /api/recharge_history         — { user_id } → history
 *
 * HISTORY:
 *   GET  /api/generation_history       — { user_id, email } → history
 *
 * ADMIN (internal):
 *   GET  /api/admin/payment-requests
 *   POST /api/admin/approve-payment
 *   GET  /api/admin/generations
 *
 * AUTH: Handled by Supabase client-side (NOT through Railway backend)
 * CREDITS: Stored in Supabase profiles.credits (NOT a Railway endpoint)
 *
 * REFERENCE MODE: Uses POST /api/generate with reference_image field
 * ══════════════════════════════════════════════════════
 */

const BASE = (process.env.NEXT_PUBLIC_API_URL || "https://bh-deco-ai-production.up.railway.app").replace(/\/$/, "");

export const API_BASE = BASE;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobStatus {
  status: "pending" | "processing" | "completed" | "failed" | "busy";
  result_url?: string;
  result_urls?: string[];
  error?: string;
  seed?: number;
  progress?: number;
  created_at?: string;
}

/** POST /api/generate — multipart/form-data */
export interface GeneratePayload {
  image: File;                       // room photo
  reference_image?: File | null;     // optional reference image
  space?: string;                    // e.g. "living_room", "bedroom"
  style?: string;                    // e.g. "modern-interior"
  color_palette?: string;            // e.g. "golden beige"
  num_images?: number;               // default 1
  prompt?: string;                   // user prompt text
  prompt_mode?: "true" | "false";    // "true" = use prompt as-is
  similar_style?: "true" | "false";  // reuse last seed
  intent?: string;                   // "residential", "furniture_only"
  user_id?: string;
  email?: string;
  username?: string;
}

/** POST /api/furniture-construction/generate */
export interface FurniturePayload {
  image: File;
  furniture_type?: string;
}

/** POST /api/construction/generate — text output */
export interface ConstructionTextPayload {
  room_length: string;
  room_width: string;
  room_height: string;
  door_width: string;
  window_width: string;
  ceiling_height: string;
  cabinet_length?: string;
  notes?: string;
}

/** POST /api/construction/drawing — SVG output */
export interface DrawingPayload {
  section: string;   // "ceiling" | "floor" | "electrical" etc.
  width?: number;    // feet
  length?: number;   // feet
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a relative /api/result/... URL to absolute */
export function absoluteUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE}${path}`;
}

// ─── AI Interior (POST /api/generate) ────────────────────────────────────────
// Uses multipart/form-data — NOT JSON

export async function generateInterior(payload: GeneratePayload): Promise<JobStatus & { job_id: string }> {
  const form = new FormData();
  form.append("image", payload.image);
  if (payload.reference_image) form.append("reference_image", payload.reference_image);
  form.append("space", payload.space || "living_room");
  form.append("style", payload.style || "modern-interior");
  form.append("color_palette", payload.color_palette || "golden beige");
  form.append("num_images", String(payload.num_images || 1));
  form.append("prompt", payload.prompt || "");
  form.append("prompt_mode", payload.prompt_mode || "false");
  form.append("similar_style", payload.similar_style || "false");
  form.append("intent", payload.intent || "residential");
  form.append("user_id", payload.user_id || "");
  form.append("email", payload.email || "");
  form.append("username", payload.username || "");

  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    body: form,
    // DO NOT set Content-Type — browser sets multipart boundary automatically
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `Generate failed: ${res.status}`);
  }

  const data = await res.json();

  // Backend returns { job_id, status: "pending" } immediately (async job)
  // OR { state: "busy", error } if busy
  if (data.status === "busy" || data.state === "busy") {
    throw new Error("AI is busy, please wait a moment and try again.");
  }
  if (data.state === "failed") {
    throw new Error(data.error || "Generation failed");
  }

  return data;
}

// ─── Reference Mode ───────────────────────────────────────────────────────────
// Same endpoint as AI Interior — just include reference_image

export async function generateReference(
  roomPhoto: File,
  referencePhoto: File,
  opts: { space?: string; style?: string; color_palette?: string; prompt?: string; user_id?: string; email?: string; username?: string } = {}
): Promise<JobStatus & { job_id: string }> {
  return generateInterior({
    image: roomPhoto,
    reference_image: referencePhoto,
    space: opts.space || "living_room",
    style: opts.style || "modern-interior",
    color_palette: opts.color_palette || "golden beige",
    prompt: opts.prompt || "",
    prompt_mode: "false",
    intent: "residential",
    user_id: opts.user_id,
    email: opts.email,
    username: opts.username,
  });
}

// ─── Job Polling (GET /api/job/{job_id}) ─────────────────────────────────────

export async function getJob(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${BASE}/api/job/${jobId}`);
  if (!res.ok) throw new Error(`Job poll failed: ${res.status}`);
  return res.json();
}

export async function pollJob(
  jobId: string,
  onProgress?: (j: JobStatus) => void,
  maxAttempts = 80,
  intervalMs = 3000
): Promise<JobStatus> {
  for (let i = 0; i < maxAttempts; i++) {
    const job = await getJob(jobId);
    onProgress?.(job);
    if (job.status === "completed") return job;
    if (job.status === "failed") throw new Error(job.error || "Job failed");
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error("Generation timed out — please try again.");
}

// ─── Furniture Construction (POST /api/furniture-construction/generate) ───────

export async function generateFurniture(payload: FurniturePayload): Promise<JobStatus & { job_id: string }> {
  const form = new FormData();
  form.append("image", payload.image);
  if (payload.furniture_type) form.append("furniture_type", payload.furniture_type);

  const res = await fetch(`${BASE}/api/furniture-construction/generate`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `Furniture generate failed: ${res.status}`);
  }

  const data = await res.json();
  if (data.state === "failed") throw new Error(data.error || "Furniture generation failed");
  return data;
}

// ─── Construction/Blueprint (POST /api/construction/generate) ─────────────────

export async function generateConstructionPlan(payload: ConstructionTextPayload): Promise<{ status: string; message: string }> {
  const res = await fetch(`${BASE}/api/construction/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Construction plan failed: ${res.status}`);
  return res.json();
}

// ─── Construction SVG Drawing (POST /api/construction/drawing) ─────────────────

export async function generateConstructionDrawing(payload: DrawingPayload): Promise<{ status: string; message: string; section: string; svg: string }> {
  const res = await fetch(`${BASE}/api/construction/drawing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Drawing failed: ${res.status}`);
  return res.json();
}

// ─── Payment — Stripe (POST /api/stripe/create_checkout) ─────────────────────

export async function createStripeCheckout(
  user_id: string,
  pkg: "basic" | "pro" | "vip" | "highboss"
): Promise<{ state: string; checkout_url?: string; error?: string }> {
  const res = await fetch(`${BASE}/api/stripe/create_checkout?user_id=${encodeURIComponent(user_id)}&package=${pkg}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Checkout failed: ${res.status}`);
  return res.json();
}

// ─── Payment — Manual Myanmar (POST /api/payment_requests/create) ─────────────

export interface ManualPaymentPayload {
  username: string;
  method: string;
  package: string;
  credits: number;
  amount: number;
  user_id?: string;
  email?: string;
  note?: string;
  screenshot_url?: string;
}

export async function createPaymentRequest(payload: ManualPaymentPayload): Promise<{ state: string; error?: string; data?: unknown }> {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });

  const res = await fetch(`${BASE}/api/payment_requests/create?${params.toString()}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Payment request failed: ${res.status}`);
  return res.json();
}

// ─── History ──────────────────────────────────────────────────────────────────

export async function getGenerationHistory(email: string, user_id?: string): Promise<{ state: string; history: unknown[] }> {
  const params = new URLSearchParams({ email });
  if (user_id) params.set("user_id", user_id);
  const res = await fetch(`${BASE}/api/generation_history?${params.toString()}`);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  return res.json();
}

export async function getRechargeHistory(user_id: string): Promise<{ state: string; history: unknown[] }> {
  const res = await fetch(`${BASE}/api/recharge_history?user_id=${encodeURIComponent(user_id)}`);
  if (!res.ok) throw new Error(`Recharge history failed: ${res.status}`);
  return res.json();
}

// ─── Auth — Supabase (NOT Railway) ────────────────────────────────────────────
// Auth is handled directly by Supabase client.
// Import from @/lib/supabase.ts for login/register/session.
// user_id and email come from supabase session, then passed to /api/generate etc.
