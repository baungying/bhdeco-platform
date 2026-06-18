"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface Tx {
  id: number;
  feature_type: string;
  credits_used: number;
  before_balance: number;
  after_balance: number;
  metadata?: { job_id?: string; result_url?: string };
  created_at: string;
}

const FEATURE_LABELS: Record<string, string> = {
  ai_render:              "AI Interior Render",
  furniture_construction: "Furniture Construction",
  hd_download:            "HD Download",
  model_download_basic:   "3D Model Download",
  model_download_premium: "Premium 3D Model",
  recharge:               "Credits Recharge",
};

const G = "#D4A73D";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day:"2-digit", month:"short", year:"numeric",
    hour:"2-digit", minute:"2-digit",
  });
}

export default function TransactionsPage() {
  const [txs,     setTxs]     = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(0);
  const [total,   setTotal]   = useState(0);
  const PAGE_SIZE = 20;
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      loadTxs(session.user.id, 0);
    });
  }, [router]);

  const loadTxs = async (uid: string, p: number) => {
    setLoading(true);
    const from = p * PAGE_SIZE;
    const { data, count } = await supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    setTxs(data ?? []);
    setTotal(count ?? 0);
    setPage(p);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh",background:"#010408",color:"#EDE8DC",padding:"7rem 1.5rem 5rem" }}>
        <div style={{ maxWidth:"900px",margin:"0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom:"2.5rem" }}>
            <Link href="/dashboard" style={{ fontSize:".7rem",color:"#2E4060",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem",marginBottom:"1.25rem" }}
              onMouseEnter={e => (e.currentTarget.style.color = G)}
              onMouseLeave={e => (e.currentTarget.style.color = "#2E4060")}>
              ← Dashboard
            </Link>
            <p className="mono" style={{ fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".5rem" }}>ACCOUNT · HISTORY</p>
            <h1 className="fd" style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300" }}>
              Credit <span style={{ fontStyle:"italic",color:G }}>Transactions</span>
            </h1>
            <p style={{ color:"#7A8FA8",fontSize:".82rem",marginTop:".4rem" }}>{total} total transactions</p>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign:"center",padding:"4rem",color:"#2E4060" }}>Loading transactions…</div>
          ) : txs.length === 0 ? (
            <div style={{ textAlign:"center",padding:"4rem",color:"#2E4060" }}>
              <p className="mono" style={{ fontSize:".65rem",letterSpacing:".12em" }}>NO TRANSACTIONS YET</p>
              <p style={{ fontSize:".82rem",marginTop:".75rem" }}>Generate your first AI design to see credits used here.</p>
            </div>
          ) : (
            <>
              <div style={{ border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",overflow:"hidden" }}>
                {/* Table header */}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 100px 120px 120px 140px",gap:"0",background:"rgba(255,255,255,.02)",borderBottom:"1px solid rgba(255,255,255,.07)",padding:".75rem 1.25rem" }}>
                  {["Feature","Credits","Before","After","Date"].map(h => (
                    <span key={h} className="mono" style={{ fontSize:".55rem",color:"#2E4060",letterSpacing:".12em",textTransform:"uppercase" }}>{h}</span>
                  ))}
                </div>
                {/* Rows */}
                {txs.map((tx, i) => (
                  <div key={tx.id}
                    style={{ display:"grid",gridTemplateColumns:"1fr 100px 120px 120px 140px",gap:"0",padding:".95rem 1.25rem",borderBottom:i < txs.length-1?"1px solid rgba(255,255,255,.04)":"none",transition:"background .15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div>
                      <p style={{ fontSize:".82rem",color:"#EDE8DC",marginBottom:".15rem" }}>
                        {FEATURE_LABELS[tx.feature_type] ?? tx.feature_type}
                      </p>
                      {tx.metadata?.job_id && (
                        <p className="mono" style={{ fontSize:".58rem",color:"#2E4060" }}>
                          {tx.metadata.job_id.slice(0, 12)}…
                        </p>
                      )}
                    </div>
                    <span className="mono" style={{ fontSize:".8rem",color:"#ef4444",alignSelf:"center" }}>
                      −{tx.credits_used}
                    </span>
                    <span className="mono" style={{ fontSize:".8rem",color:"#7A8FA8",alignSelf:"center" }}>
                      {tx.before_balance.toLocaleString()}
                    </span>
                    <span className="mono" style={{ fontSize:".8rem",color:"#EDE8DC",alignSelf:"center" }}>
                      {tx.after_balance.toLocaleString()}
                    </span>
                    <span style={{ fontSize:".72rem",color:"#2E4060",alignSelf:"center" }}>
                      {fmt(tx.created_at)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {total > PAGE_SIZE && (
                <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:"1rem",marginTop:"2rem" }}>
                  <button disabled={page === 0} onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) loadTxs(session.user.id, page - 1);
                  }} className="btn-ghost" style={{ padding:".55rem 1.2rem",fontSize:".7rem",opacity:page===0?.4:1 }}>
                    ← Prev
                  </button>
                  <span className="mono" style={{ fontSize:".62rem",color:"#2E4060" }}>
                    Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
                  </span>
                  <button disabled={(page + 1) * PAGE_SIZE >= total} onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) loadTxs(session.user.id, page + 1);
                  }} className="btn-ghost" style={{ padding:".55rem 1.2rem",fontSize:".7rem",opacity:(page+1)*PAGE_SIZE>=total?.4:1 }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
