"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { siteImages } from "@/config/siteImages";

const plans = [
  {
    name: "Starter",
    credits: 500,
    price: "$9",
    desc: "Suitable for testing",
    tagline: "Explore AI design with no commitment.",
    features: [
      "500 AI design generations",
      "All 40+ design styles",
      "Reference image upload",
      "Full history access",
      "HD export",
      "Email support",
    ],
    hot: false,
  },
  {
    name: "Pro",
    credits: 2000,
    price: "$29",
    desc: "For designers",
    tagline: "The choice of professional interior designers.",
    features: [
      "2,000 AI design generations",
      "All 40+ design styles",
      "Reference image upload",
      "Full history access",
      "HD export",
      "Priority support",
      "Early feature access",
    ],
    hot: false,
  },
  {
    name: "Business",
    credits: 5000,
    price: "$59",
    desc: "For companies",
    tagline: "Scale your design studio with AI power.",
    features: [
      "5,000 AI design generations",
      "All 40+ design styles",
      "Reference image upload",
      "Full history access",
      "HD export",
      "Priority support",
      "Early feature access",
      "Commercial use license",
    ],
    hot: true,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <SiteImage imageKey="pricingHero" asBackground style={{
        padding: "8.5rem 1.75rem 5rem",
        textAlign: "center",
        position: "relative",
        minHeight: "52vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(1,4,8,.9) 0%, rgba(1,4,8,.75) 50%, rgba(1,4,8,.95) 100%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="section-eyebrow">Pricing</p>
          <h1 className="font-display" style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: "300", color: "var(--cream)",
            letterSpacing: "-0.025em", lineHeight: "1.08", marginBottom: "1.25rem",
          }}>
            Flexible Credits,<br />
            <span className="gold-text" style={{ fontStyle: "italic" }}>No Commitment</span>
          </h1>
          <p style={{ color: "var(--cream-dim)", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto", lineHeight: "1.8" }}>
            Buy once, use anytime. Credits never expire. Scale when your projects demand it.
          </p>
        </div>
      </SiteImage>

      {/* Cards */}
      <section style={{ background: "var(--black)", padding: "3rem 1.75rem 7rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                background: plan.hot ? "rgba(201,168,76,0.045)" : "rgba(12,24,41,0.55)",
                border: plan.hot ? "1px solid rgba(201,168,76,0.32)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "18px",
                padding: "2.75rem 2.25rem",
                position: "relative",
                boxShadow: plan.hot ? "0 0 80px rgba(201,168,76,0.08), 0 40px 80px rgba(0,0,0,0.3)" : "0 20px 60px rgba(0,0,0,0.2)",
                transform: plan.hot ? "scale(1.025)" : "scale(1)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}>
                {plan.hot && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #C9A84C, #A07830)",
                    color: "#08080D", fontSize: "0.62rem", fontWeight: "800",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    padding: "0.32rem 1.1rem", borderRadius: "100px", whiteSpace: "nowrap",
                  }}>Best Value</div>
                )}

                <div style={{ marginBottom: "2rem" }}>
                  <p style={{
                    fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase",
                    color: plan.hot ? "var(--gold)" : "var(--muted)", marginBottom: "0.7rem",
                  }}>{plan.name}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span className="font-display gold-text" style={{ fontSize: "3.2rem", fontWeight: "600", lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>one-time</span>
                  </div>
                  <p style={{ color: "var(--cream)", fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.4rem" }}>
                    {plan.credits.toLocaleString()} Credits
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.6" }}>{plan.tagline}</p>
                </div>

                <Link href="/recharge" className={plan.hot ? "btn-gold" : "btn-outline"}
                  style={{ width: "100%", justifyContent: "center", marginBottom: "2.25rem" }}>
                  Recharge Now
                </Link>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.75rem" }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.1rem" }}>Includes</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.875rem", color: "var(--cream-dim)" }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                          <circle cx="8" cy="8" r="7.5" stroke="rgba(201,168,76,0.3)"/>
                          <path d="M5 8l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{
            marginTop: "4rem", padding: "1.75rem 2rem",
            background: "rgba(12,24,41,0.4)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "10px",
            textAlign: "center",
          }}>
            <p style={{ color: "var(--cream-dim)", fontSize: "0.9rem", lineHeight: "1.8" }}>
              All packages are one-time purchases · Credits never expire · No hidden fees<br />
              Questions? <a href="mailto:support@bhdeco.ai" style={{ color: "var(--gold)", textDecoration: "none" }}>support@bhdeco.ai</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
