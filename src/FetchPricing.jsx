import { useState } from "react";
import { Sidebar, Ico } from "./FetchShared";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 0,
    freeNote: "Free for up to a year",
    features: ["1,000 Mass emails", "Standard modules", "Shared commercial terms"],
    cta: "trial",
    ctaLabel: "Start Free Trial",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 18000,
    features: ["10,000 Mass emails", "Custom modules", "General commercial terms"],
    cta: "trial",
    ctaLabel: "Start Free Trial",
    featured: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 30000,
    features: ["Unlimited mass emails", "API & Custom modules", "Priority 24/7 Support", "Member gallery access"],
    cta: "red",
    ctaLabel: "Get Started Now",
    featured: true,
    badge: "RECOMMENDED",
  },
  {
    id: "ultimate",
    name: "Ultimate",
    monthlyPrice: 40000,
    features: ["Everything in Enterprise", "Dedicated Manager", "White-labeling options"],
    cta: "outline",
    ctaLabel: "Contact Sales",
    featured: false,
  },
];

// ─── PRICING CARD ─────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CtaButton({ variant, label }) {
  const [hovered, setHovered] = useState(false);
  const styles = {
    red:     { background: hovered ? "#d63d22" : "#e8472a", color: "#fff", border: "none",                  boxShadow: hovered ? "0 6px 20px rgba(232,71,42,.45)" : "0 2px 8px rgba(232,71,42,.3)" },
    trial:   { background: "#fff",                           color: "#1a1f36", border: "1.5px solid #d1d5db", boxShadow: hovered ? "0 4px 12px rgba(0,0,0,.08)" : "none" },
    outline: { background: "#fff",                           color: "#1a1f36", border: "1.5px solid #d1d5db", boxShadow: hovered ? "0 4px 12px rgba(0,0,0,.08)" : "none" },
  };
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", padding: "13px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .2s", transform: hovered ? "translateY(-1px)" : "translateY(0)", ...styles[variant] }}
    >
      {label}
    </button>
  );
}

function PricingCard({ plan, billing }) {
  const [hovered, setHovered] = useState(false);
  const amount = billing === "yearly" ? Math.round(plan.monthlyPrice * 12 * 0.8) : plan.monthlyPrice;
  const period = billing === "yearly" ? "/yr" : "/mo";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: plan.featured ? "2px solid #e8472a" : "1px solid #e8e8e8",
        borderRadius: 16, padding: "32px 28px 28px",
        position: "relative", flex: 1,
        transition: "transform .25s, box-shadow .25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,.1)"
          : plan.featured ? "0 4px 20px rgba(232,71,42,.12)" : "0 1px 4px rgba(0,0,0,.04)",
      }}
    >
      {plan.badge && (
        <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#e8472a", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>
          {plan.badge}
        </div>
      )}

      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", marginBottom: 16 }}>{plan.name}</div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: plan.freeNote ? 6 : 24 }}>
        {plan.monthlyPrice === 0 ? (
          <>
            <span style={{ fontSize: 40, fontWeight: 800, color: "#1a1f36", lineHeight: 1 }}>0</span>
            <span style={{ fontSize: 15, color: "#6b7694", fontWeight: 400 }}>{period}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 40, fontWeight: 800, color: "#1a1f36", lineHeight: 1 }}>{amount.toLocaleString()}</span>
            <span style={{ fontSize: 15, color: "#6b7694", fontWeight: 400 }}>{period}</span>
          </>
        )}
      </div>

      {plan.freeNote && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8472a", fontStyle: "italic", marginBottom: 20 }}>{plan.freeNote}</div>
      )}

      <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
            <CheckIcon />{f}
          </li>
        ))}
      </ul>

      <CtaButton variant={plan.cta} label={plan.ctaLabel} />
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
function BillingToggle({ billing, setBilling }) {
  const isYearly = billing === "yearly";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14, color: isYearly ? "#6b7694" : "#1a1f36", fontWeight: isYearly ? 400 : 600 }}>Monthly</span>
      <div
        onClick={() => setBilling(isYearly ? "monthly" : "yearly")}
        style={{ width: 44, height: 24, borderRadius: 12, background: "#e8472a", position: "relative", cursor: "pointer" }}
      >
        <div style={{ position: "absolute", top: 3, left: isYearly ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
      </div>
      <span style={{ fontSize: 14, color: isYearly ? "#1a1f36" : "#6b7694", fontWeight: isYearly ? 600 : 400 }}>Yearly</span>
      <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>Up to 20% off</span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function FetchPricing({ navigate }) {
  const [billing, setBilling] = useState("monthly");

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } html, body, #root { width: 100%; min-height: 100vh; }`}</style>

      <Sidebar activePage="billing" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af" }}>
            <span style={{ color: "#6b7280", cursor: "pointer", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Billing &amp; Plans</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ cursor: "pointer", color: "#6b7280" }}>{Ico.bell}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36", lineHeight: 1 }}>Jonathan</div>
                <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", marginTop: 1 }}>Admin</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e8472a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>JO</div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ flex: 1, padding: "56px 40px 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#1a1f36", letterSpacing: -0.8, marginBottom: 10, textAlign: "center" }}>
            Upgrade Your Plan
          </h1>
          <p style={{ fontSize: 15, color: "#6b7694", marginBottom: 32, textAlign: "center" }}>
            Choose the plan that grows with your business
          </p>

          <div style={{ marginBottom: 48 }}>
            <BillingToggle billing={billing} setBilling={setBilling} />
          </div>

          <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 1100, alignItems: "stretch" }}>
            {PLANS.map(plan => (
              <PricingCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>

          <p style={{ marginTop: 40, fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
            All plans include a 14-day free trial · No credit card required ·{" "}
            <a href="#" style={{ color: "#e8472a", textDecoration: "none", fontWeight: 500 }}>Compare all features</a>
            {" · "}
            <a href="#" style={{ color: "#e8472a", textDecoration: "none", fontWeight: 500 }}>Talk to sales</a>
          </p>
        </main>
      </div>
    </div>
  );
}
