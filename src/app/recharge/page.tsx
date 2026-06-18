"use client";
import { useState, useEffect } from "react";
import SiteImage from "@/components/SiteImage";
import { siteImages } from "@/config/siteImages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const packages = [
  { id: "starter", name: "Starter", credits: 500, price: "$9", priceUSD: 9, desc: "Suitable for testing" },
  { id: "pro", name: "Pro", credits: 2000, price: "$29", priceUSD: 29, desc: "For designers" },
  { id: "business", name: "Business", credits: 5000, price: "$59", priceUSD: 59, desc: "For companies", hot: true },
];

const paymentMethods = [
  { id: "kbz", name: "KBZ Pay", abbr: "KBZ", color: "#E8342A", note: "KBZ Bank mobile payment" },
  { id: "aya", name: "AYA Pay", abbr: "AYA", color: "#0061AF", note: "AYA Bank digital wallet" },
  { id: "thai_qr", name: "Thai QR", abbr: "QR", color: "#1A56A0", note: "PromptPay QR code" },
  { id: "transfer", name: "Manual Transfer", abbr: "WIRE", color: "#4A5568", note: "Bank wire transfer" },
];

const howItWorks = [
  { n: "1", title: "Send Payment", desc: "Make payment using your preferred method (KBZ, AYA, Thai QR, or bank transfer)." },
  { n: "2", title: "Contact Admin", desc: "Send proof of payment to support@bhdeco.ai with your account email." },
  { n: "3", title: "Credits Added", desc: "Our team verifies and applies your credits manually within 24 hours." },
];

export default function RechargePage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [selectedPkg, setSelectedPkg] = useState("business");
  const [selectedMethod, setSelectedMethod] = useState("kbz");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Existing auth/credits logic — untouched
    const token = typeof window !== "undefined"
      ? localStorage.getItem("access_token") || localStorage.getItem("token")
      : null;
    if (token) {
      setIsLoggedIn(true);
      fetch(`${API_BASE}/credits`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.credits !== undefined) setCredits(data.credits);
          else if (data.balance !== undefined) setCredits(data.balance);
        })
        .catch(() => setCredits(null))
        .finally(() => setAuthChecked(true));
    } else {
      setIsLoggedIn(false);
      setAuthChecked(true);
    }
  }, []);

  const pkg = packages.find(p => p.id === selectedPkg)!;
  const method = paymentMethods.find(m => m.id === selectedMethod)!;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--black)", padding: "7rem 1.75rem 4rem",
        }}>
          <div style={{
            maxWidth: "500px", width: "100%", textAlign: "center",
            padding: "3.5rem 3rem",
            background: "rgba(12,24,41,0.7)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px",
          }}>
            <div style={{
              width: "72px", height: "72px",
              background: "linear-gradient(135deg, #C9A84C, #7A5F24)",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", margin: "0 auto 2rem",
              boxShadow: "0 0 40px rgba(201,168,76,0.25)",
            }}>✓</div>
            <h2 className="font-display" style={{ fontSize: "2.2rem", fontWeight: "300", color: "var(--cream)", marginBottom: "1rem" }}>
              Request Submitted
            </h2>
            <p style={{ color: "var(--cream-dim)", fontSize: "0.95rem", lineHeight: "1.8", marginBottom: "0.75rem" }}>
              Your recharge request for <strong style={{ color: "var(--gold)" }}>{pkg.credits.toLocaleString()} credits</strong> via <strong style={{ color: "var(--cream)" }}>{method.name}</strong> has been received.
            </p>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "2.5rem" }}>
              Our team will verify and apply your credits within 24 hours. Check your email or contact{" "}
              <a href="mailto:support@bhdeco.ai" style={{ color: "var(--gold)", textDecoration: "none" }}>support@bhdeco.ai</a>.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-outline">Make Another Request</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <SiteImage imageKey="rechargeHero" asBackground style={{
        padding: "8.5rem 1.75rem 3rem", textAlign: "center",
        position: "relative",
        minHeight: "48vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(1,4,8,.9) 0%, rgba(1,4,8,.75) 50%, rgba(1,4,8,.95) 100%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="section-eyebrow">Recharge Center</p>
          <h1 className="font-display" style={{
            fontSize: "clamp(2.2rem, 6vw, 4.2rem)", fontWeight: "300",
            color: "var(--cream)", letterSpacing: "-0.02em", marginBottom: "1.5rem",
          }}>
            Top Up Your <span className="gold-text" style={{ fontStyle: "italic" }}>Credits</span>
          </h1>

          {/* Credit balance pill */}
          {authChecked && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "100px", padding: "0.7rem 1.6rem",
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: isLoggedIn ? "#4CAF50" : "var(--muted)",
                boxShadow: isLoggedIn ? "0 0 8px #4CAF50" : "none",
              }} />
              {isLoggedIn ? (
                <>
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Current Balance:</span>
                  <span className="font-display gold-text" style={{ fontSize: "1.3rem", fontWeight: "600" }}>
                    {credits !== null ? credits.toLocaleString() : "—"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>credits</span>
                </>
              ) : (
                <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                  <a href="/login" style={{ color: "var(--gold)", textDecoration: "none" }}>Log in</a>{" "}to see your credit balance
                </span>
              )}
            </div>
          )}
        </div>
      </SiteImage>

      {/* Main content */}
      <section style={{ background: "var(--black)", padding: "3rem 1.75rem 5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start",
          }} className="recharge-layout">

            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Package selection */}
              <div style={{
                background: "rgba(12,24,41,0.55)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "2rem",
              }}>
                <h3 style={{ fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.25rem" }}>
                  Select Package
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {packages.map(p => (
                    <button key={p.id} onClick={() => setSelectedPkg(p.id)} style={{
                      background: selectedPkg === p.id ? "rgba(201,168,76,0.07)" : "transparent",
                      border: selectedPkg === p.id ? "1px solid rgba(201,168,76,0.38)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "10px", padding: "1.1rem 1.25rem",
                      cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", textAlign: "left", transition: "all 0.2s",
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", color: selectedPkg === p.id ? "var(--cream)" : "var(--cream-dim)" }}>{p.name}</span>
                          {p.hot && <span style={{ fontSize: "0.58rem", background: "linear-gradient(135deg, #C9A84C, #A07830)", color: "#08080D", padding: "0.12rem 0.45rem", borderRadius: "100px", fontWeight: "800", letterSpacing: "0.08em" }}>BEST VALUE</span>}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{p.credits.toLocaleString()} credits · {p.desc}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span className="font-display gold-text" style={{ fontSize: "1.4rem", fontWeight: "600" }}>{p.price}</span>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "50%",
                          border: selectedPkg === p.id ? "none" : "2px solid rgba(255,255,255,0.15)",
                          background: selectedPkg === p.id ? "linear-gradient(135deg, #C9A84C, #A07830)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {selectedPkg === p.id && <span style={{ color: "#08080D", fontSize: "10px", fontWeight: "800" }}>✓</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment methods */}
              <div style={{
                background: "rgba(12,24,41,0.55)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "2rem",
              }}>
                <h3 style={{ fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.25rem" }}>
                  Payment Method
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {paymentMethods.map(m => (
                    <button key={m.id} onClick={() => setSelectedMethod(m.id)} style={{
                      background: selectedMethod === m.id ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.02)",
                      border: selectedMethod === m.id ? "1px solid rgba(201,168,76,0.38)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "10px", padding: "1.25rem 1rem",
                      cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                    }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: `${m.color}22`, border: `1px solid ${m.color}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 0.75rem",
                        fontSize: "0.7rem", fontWeight: "800", color: m.color,
                        letterSpacing: "0.04em",
                      }}>{m.abbr}</div>
                      <p style={{ fontSize: "0.82rem", fontWeight: "600", color: selectedMethod === m.id ? "var(--gold)" : "var(--cream-dim)", marginBottom: "0.2rem" }}>{m.name}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{m.note}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Summary */}
            <div style={{
              background: "rgba(12,24,41,0.7)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: "16px", padding: "2rem",
              position: "sticky", top: "88px",
            }}>
              <h3 style={{ fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.75rem" }}>
                Order Summary
              </h3>

              {[
                { label: "Package", val: pkg.name },
                { label: "Credits", val: pkg.credits.toLocaleString() },
                { label: "Payment via", val: method.name },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                  <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{row.label}</span>
                  <span style={{ color: "var(--cream)", fontSize: "0.875rem", fontWeight: "500" }}>{row.val}</span>
                </div>
              ))}

              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "1.25rem 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
                <span style={{ color: "var(--cream-dim)", fontSize: "1rem" }}>Total</span>
                <span className="font-display gold-text" style={{ fontSize: "2.6rem", fontWeight: "600" }}>{pkg.price}</span>
              </div>

              <div style={{
                background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.14)",
                borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem",
                fontSize: "0.8rem", color: "var(--muted)", lineHeight: "1.65",
              }}>
                <span style={{ color: "var(--gold)", fontWeight: "600" }}>Manual Process: </span>
                Submit request, then send payment proof to our team. Credits applied within 24 hours.
              </div>

              <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{
                width: "100%", justifyContent: "center",
                opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "Processing..." : `Submit Request — ${pkg.price}`}
              </button>

              <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.75rem", marginTop: "1.1rem" }}>
                <a href="mailto:support@bhdeco.ai" style={{ color: "var(--gold)", textDecoration: "none" }}>support@bhdeco.ai</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Recharge Works */}
      <section style={{ background: "var(--navy)", padding: "5rem 1.75rem 6rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p className="section-eyebrow">Process</p>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "3.5rem" }}>
            How Recharge <span style={{ fontStyle: "italic" }} className="gold-text">Works</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {howItWorks.map((step, i) => (
              <div key={i} style={{
                background: "rgba(8,8,13,0.5)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "2rem 1.75rem",
                position: "relative",
              }}>
                <div style={{
                  width: "44px", height: "44px",
                  background: "linear-gradient(135deg, #C9A84C, #7A5F24)",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", fontWeight: "800", color: "#08080D",
                  fontFamily: "Inter, sans-serif",
                  margin: "0 auto 1.25rem",
                  boxShadow: "0 4px 16px rgba(201,168,76,0.25)",
                }}>{step.n}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--cream)", marginBottom: "0.6rem" }}>{step.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.7" }}>{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hide-mobile" style={{
                    position: "absolute", top: "3rem", right: "-0.8rem",
                    fontSize: "1rem", color: "rgba(201,168,76,0.3)",
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @media (max-width: 820px) { .recharge-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
