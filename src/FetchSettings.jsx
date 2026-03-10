import { useState, useRef } from "react";
import { Sidebar, Ico } from "./FetchShared";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1f36" }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Field({ label, hint, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
        {label}{required && <span style={{ color: "#e8472a", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 12, color: "#9ca3af" }}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 13px", border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13.5, color: "#1a1f36", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box", background: "#fff",
};

const readonlyStyle = {
  ...inputStyle, background: "#f9fafb", color: "#6b7280", cursor: "not-allowed",
};

function SaveButton({ saving, saved, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: "10px 28px", background: saving ? "#9ca3af" : saved ? "#16a34a" : "#e8472a", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer", transition: "background .2s", minWidth: 120 }}>
      {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
    </button>
  );
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: copied ? "#f0fdf4" : "#fff", fontSize: 13, fontWeight: 600, color: copied ? "#16a34a" : "#374151", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — ACCOUNT
// ─────────────────────────────────────────────────────────────────────────────

const BUSINESS_SECTORS = [
  "Agriculture & Forestry", "Construction & Real Estate", "Education",
  "Energy & Utilities", "Financial Services", "Healthcare & Pharmaceuticals",
  "Hospitality & Tourism", "Information Technology", "Logistics & Transportation",
  "Manufacturing", "Media & Entertainment", "Mining & Extraction",
  "Oil & Gas", "Professional Services", "Retail & Wholesale Trade",
  "Telecommunications", "Other",
];

function AccountTab() {
  const [form, setForm] = useState({
    businessName: "Dangote Industries Ltd",
    tin:          "TIN-0034-2091",
    sector:       "Manufacturing",
    description:  "A diversified business conglomerate operating across cement, sugar, flour, salt, pasta, beverages, real estate and agriculture sectors.",
    email:        "jonathan@dangote.com",
    phone:        "+234 803 000 0001",
    website:      "https://dangote.com",
    address:      "1 Dangote House, Billings Way, Oregun",
    city:         "Lagos",
    postalCode:   "100001",
    state:        "Lagos State",
    country:      "Nigeria",
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [logo,   setLogo]   = useState(null);
  const fileRef = useRef();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1200);
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Business identity */}
      <Card>
        <CardHeader title="Business Identity" sub="Your registered business details as submitted to FIRS. TIN cannot be changed here." />
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field label="Business Name" required>
              <input value={form.businessName} onChange={set("businessName")} style={inputStyle} />
            </Field>
            <Field label="Tax Identification Number (TIN)" hint="Registered with FIRS. Contact support to update.">
              <div style={{ position: "relative" }}>
                <input value={form.tin} readOnly style={readonlyStyle} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: "#9ca3af", background: "#f0f0f0", borderRadius: 4, padding: "2px 6px" }}>READ ONLY</span>
              </div>
            </Field>
            <Field label="Business Sector" required>
              <select value={form.sector} onChange={set("sector")} style={{ ...inputStyle }}>
                <option value="">Select sector</option>
                {BUSINESS_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Business Email" required>
              <input value={form.email} onChange={set("email")} type="email" style={inputStyle} />
            </Field>
            <Field label="Phone Number">
              <input value={form.phone} onChange={set("phone")} style={inputStyle} />
            </Field>
            <Field label="Website">
              <input value={form.website} onChange={set("website")} style={inputStyle} />
            </Field>
          </div>
          <Field label="Business Description" required hint="A brief description of your business activities. Used on FIRS submissions.">
            <textarea value={form.description} onChange={set("description")} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </Field>
        </div>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader title="Registered Address" sub="Used on stamped invoices submitted to FIRS." />
        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Street Address" required>
              <input value={form.address} onChange={set("address")} style={inputStyle} />
            </Field>
          </div>
          <Field label="City" required>
            <input value={form.city} onChange={set("city")} style={inputStyle} />
          </Field>
          <Field label="Postal Code">
            <input value={form.postalCode} onChange={set("postalCode")} style={inputStyle} placeholder="e.g. 100001" />
          </Field>
          <Field label="State" required>
            <input value={form.state} onChange={set("state")} style={inputStyle} />
          </Field>
          <Field label="Country">
            <input value={form.country} readOnly style={readonlyStyle} />
          </Field>
        </div>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader title="Business Logo" sub="Appears on your invoices. PNG or JPG, max 2MB, minimum 200×200px." />
        <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: 14, border: "2px dashed #e5e7eb", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
            {logo
              ? <img src={logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <span style={{ fontSize: 28 }}>🏭</span>}
          </div>
          <div style={{ flex: 1 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()}
              style={{ padding: "9px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13.5, fontWeight: 600, color: "#374151", cursor: "pointer", marginRight: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              Upload Logo
            </button>
            {logo && (
              <button onClick={() => setLogo(null)}
                style={{ padding: "9px 20px", border: "1px solid #fecaca", borderRadius: 8, background: "#fff", fontSize: 13.5, fontWeight: 600, color: "#dc2626", cursor: "pointer" }}>
                Remove
              </button>
            )}
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>Recommended: square image, at least 400×400px for best quality on printed invoices.</div>
          </div>
        </div>
      </Card>

      {/* Save row */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — CONTACT
// ─────────────────────────────────────────────────────────────────────────────

function ContactTab() {
  const [form, setForm] = useState({
    firstName: "Jonathan",
    lastName:  "Obi",
    email:     "jonathan@dangote.com",
    phone:     "+234 803 000 0001",
  });
  const [hasTaxRep, setHasTaxRep] = useState(false);
  const [taxRep, setTaxRep] = useState({
    name:        "",
    tin:         "",
    description: "",
    email:       "",
    phone:       "",
    address:     "",
    city:        "",
    postalCode:  "",
    state:       "",
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const set  = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setT = (k) => (e) => setTaxRep(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Primary contact */}
      <Card>
        <CardHeader
          title="Primary Contact Person"
          sub="The person FETCH will contact regarding your account, invoices, and compliance matters."
        />
        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="First Name" required>
            <input value={form.firstName} onChange={set("firstName")} style={inputStyle} />
          </Field>
          <Field label="Last Name" required>
            <input value={form.lastName} onChange={set("lastName")} style={inputStyle} />
          </Field>
          <Field label="Email Address" required>
            <input value={form.email} onChange={set("email")} type="email" style={inputStyle} />
          </Field>
          <Field label="Phone Number" required>
            <input value={form.phone} onChange={set("phone")} style={inputStyle} />
          </Field>
        </div>
      </Card>

      {/* Tax representative */}
      <Card>
        <CardHeader
          title="Business Tax Representative"
          sub="A tax representative is a third party authorised to act on your behalf for FIRS tax matters."
        />
        <div style={{ padding: "20px 24px", borderBottom: hasTaxRep ? "1px solid #f0f0f0" : "none" }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Does your business have a tax representative?</div>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ val: true, label: "Yes" }, { val: false, label: "No" }].map(opt => (
              <label key={String(opt.val)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: hasTaxRep === opt.val ? 700 : 400, color: hasTaxRep === opt.val ? "#1a1f36" : "#6b7280" }}>
                <div onClick={() => setHasTaxRep(opt.val)}
                  style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${hasTaxRep === opt.val ? "#e8472a" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                  {hasTaxRep === opt.val && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8472a" }} />}
                </div>
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {hasTaxRep && (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Field label="Tax Representative Name" required>
                <input value={taxRep.name} onChange={setT("name")} style={inputStyle} placeholder="Full name" />
              </Field>
              <Field label="Tax Identification Number (TIN)" required>
                <input value={taxRep.tin} onChange={setT("tin")} style={inputStyle} placeholder="e.g. TIN-0099-1234" />
              </Field>
              <Field label="Email Address" required>
                <input value={taxRep.email} onChange={setT("email")} type="email" style={inputStyle} />
              </Field>
              <Field label="Phone Number" required>
                <input value={taxRep.phone} onChange={setT("phone")} style={inputStyle} />
              </Field>
            </div>
            <Field label="Business Description" required hint="Describe the tax representative's firm or role.">
              <textarea value={taxRep.description} onChange={setT("description")} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} placeholder="e.g. Certified tax advisory firm specialising in corporate VAT compliance..." />
            </Field>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 2 }}>Postal Address</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Street Address" required>
                  <input value={taxRep.address} onChange={setT("address")} style={inputStyle} />
                </Field>
              </div>
              <Field label="City" required>
                <input value={taxRep.city} onChange={setT("city")} style={inputStyle} />
              </Field>
              <Field label="Postal Code">
                <input value={taxRep.postalCode} onChange={setT("postalCode")} style={inputStyle} placeholder="e.g. 100001" />
              </Field>
              <Field label="State" required>
                <input value={taxRep.state} onChange={setT("state")} style={inputStyle} />
              </Field>
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — FIRS CREDENTIALS
// ─────────────────────────────────────────────────────────────────────────────

function CredentialField({ label, sub, value, onSave, type = "key", placeholder }) {
  const [current, setCurrent]   = useState(value);
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(value);
  const [revealed, setRevealed] = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);
  const fileRef = useRef();

  const isEmpty  = !current;
  const masked   = current ? current.slice(0, 8) + "•".repeat(Math.max(0, current.length - 12)) + current.slice(-4) : "";

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setCurrent(draft);
      setSaving(false); setSaved(true); setEditing(false); setRevealed(false);
      setTimeout(() => setSaved(false), 3000);
    }, 900);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDraft(ev.target.result.trim());
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "20px 24px", borderBottom: "1px solid #f9fafb" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36", marginBottom: 3 }}>{label}</div>
          <div style={{ fontSize: 12.5, color: "#9ca3af" }}>{sub}</div>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, borderRadius: 20, padding: "3px 10px", flexShrink: 0, marginLeft: 12,
          color: isEmpty ? "#b45309" : "#16a34a",
          background: isEmpty ? "#fffbeb" : "#f0fdf4",
          border: `1px solid ${isEmpty ? "#fde68a" : "#bbf7d0"}` }}>
          {isEmpty ? "Not configured" : "Configured"}
        </span>
      </div>

      {!editing ? (
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
          {!isEmpty && (
            <>
              <code style={{ flex: 1, padding: "10px 14px", background: "#1a1f36", color: "#e2e8f0", borderRadius: 8, fontSize: 12.5, fontFamily: "monospace", overflowX: "auto", whiteSpace: "nowrap" }}>
                {revealed ? current : masked}
              </code>
              <button onClick={() => setRevealed(r => !r)}
                style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                {revealed ? "Hide" : "Reveal"}
              </button>
              {revealed && <CopyButton value={current} />}
            </>
          )}
          <button onClick={() => { setDraft(current); setEditing(true); }}
            style={{ padding: "10px 18px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            {isEmpty ? "+ Configure" : "Update"}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {type === "cert" ? (
            <>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={placeholder || "Paste your PEM certificate here (-----BEGIN CERTIFICATE-----)"}
                rows={6}
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input ref={fileRef} type="file" accept=".pem,.crt,.cer,.key" onChange={handleFile} style={{ display: "none" }} />
                <button onClick={() => fileRef.current.click()}
                  style={{ padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                  Upload .pem / .crt file
                </button>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>or paste the certificate text above</span>
              </div>
            </>
          ) : (
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={placeholder || "Paste your key here"}
              style={{ ...inputStyle, fontFamily: "monospace" }}
            />
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSave} disabled={!draft || saving}
              style={{ padding: "9px 22px", background: saving ? "#9ca3af" : saved ? "#16a34a" : "#e8472a", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: !draft || saving ? "not-allowed" : "pointer" }}>
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
            </button>
            <button onClick={() => { setEditing(false); setDraft(current); }}
              style={{ padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FirsCredentialsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Source notice */}
      <div style={{ padding: "14px 18px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>🏛️</span>
        <div style={{ fontSize: 13, color: "#1e40af", lineHeight: 1.65 }}>
          <strong>These credentials are issued by FIRS</strong> and obtained from your{" "}
          <a href="https://mytax.firs.gov.ng" target="_blank" rel="noreferrer" style={{ color: "#1d4ed8", fontWeight: 600 }}>FIRS Taxpayer Portal</a>.
          {" "}FETCH uses them to authenticate and sign invoices on your behalf. Keep them private and update them here whenever you rotate them in your FIRS account.
        </div>
      </div>

      {/* Credentials card */}
      <Card>
        <CardHeader
          title="FIRS API Credentials"
          sub="Used to authenticate FETCH with FIRS MBS when submitting invoices for clearance."
        />
        <CredentialField
          label="Taxpayer API Key"
          sub="Identifies your business to the FIRS MBS clearance API."
          value="firs_api_9aK2mX7pQrT4vLnBdWcY"
          placeholder="Paste your FIRS Taxpayer API Key"
        />
        <CredentialField
          label="API Secret Key"
          sub="Used alongside your API key to sign FIRS API requests. Never share this publicly."
          value="firs_secret_eJsU3hGzFo8mP1xNqRvK"
          placeholder="Paste your FIRS API Secret Key"
        />
      </Card>

      {/* Cryptographic key card */}
      <Card>
        <CardHeader
          title="Cryptographic Certificate"
          sub="Your FIRS-issued digital certificate used to cryptographically sign invoice submissions (CSID generation). Obtained from the FIRS Taxpayer Portal under e-Invoicing Certificates."
        />
        <CredentialField
          label="Signing Certificate (Public Key)"
          sub="PEM-encoded X.509 certificate issued by FIRS. Required for CSID generation on every invoice."
          value="CERT_CONFIGURED"
          type="cert"
          placeholder={"-----BEGIN CERTIFICATE-----\nPaste your PEM certificate here\n-----END CERTIFICATE-----"}
        />
        <CredentialField
          label="Private Signing Key"
          sub="PEM-encoded private key corresponding to your FIRS certificate. Used to generate cryptographic signatures. Never transmitted — stored securely by FETCH."
          value="KEY_CONFIGURED"
          type="cert"
          placeholder={"-----BEGIN PRIVATE KEY-----\nPaste your private key here\n-----END PRIVATE KEY-----"}
        />

        {/* Certificate status */}
        <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Certificate Status</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { label: "Issuer",       value: "FIRS CA Nigeria"    },
              { label: "Bound TIN",    value: "TIN-0034-2091"      },
              { label: "Valid From",   value: "Jan 12, 2026"       },
              { label: "Expires",      value: "Jan 12, 2028",      accent: "#16a34a", sub: "703 days remaining" },
            ].map(s => (
              <div key={s.label} style={{ padding: "12px 14px", background: "#fff", borderRadius: 10, border: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: s.accent || "#1a1f36" }}>{s.value}</div>
                {s.sub && <div style={{ fontSize: 11, color: s.accent || "#9ca3af", marginTop: 2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12.5, color: "#9ca3af", lineHeight: 1.65 }}>
            When your certificate expires, generate a new one from your{" "}
            <a href="https://mytax.firs.gov.ng" target="_blank" rel="noreferrer" style={{ color: "#e8472a", fontWeight: 600 }}>FIRS Taxpayer Portal</a>
            {" "}and update both fields above. FETCH will begin using the new certificate immediately.
          </div>
        </div>
      </Card>

      {/* Security notice */}
      <div style={{ padding: "13px 18px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", gap: 10 }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>🔒</span>
        <div style={{ fontSize: 12.5, color: "#9a3412", lineHeight: 1.65 }}>
          <strong>Security:</strong> All credentials are encrypted at rest using AES-256 and never exposed in FETCH API responses. If you suspect any credential has been compromised, update it here immediately and rotate it in your FIRS Taxpayer Portal.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — SUBSCRIPTION
// ─────────────────────────────────────────────────────────────────────────────

const PLANS = [
  { id: "basic",      name: "Basic",      monthlyPrice: 0,     freeNote: "Free for up to a year", features: ["1,000 invoices/mo", "Standard modules", "Shared commercial terms"],                                          cta: "outline", ctaLabel: "Current Plan", current: true  },
  { id: "pro",        name: "Pro",        monthlyPrice: 18000, features: ["10,000 invoices/mo", "Custom modules", "General commercial terms"],                                                                              cta: "outline", ctaLabel: "Upgrade"                    },
  { id: "enterprise", name: "Enterprise", monthlyPrice: 30000, features: ["Unlimited invoices", "API & Custom modules", "Priority 24/7 Support", "Member gallery access"],                                                  cta: "red",     ctaLabel: "Upgrade",       badge: "RECOMMENDED" },
  { id: "ultimate",   name: "Ultimate",   monthlyPrice: 40000, features: ["Everything in Enterprise", "Dedicated Manager", "White-labeling options"],                                                                       cta: "ghost",   ctaLabel: "Contact Sales"                  },
];

function SubscriptionTab() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Current plan summary */}
      <Card>
        <CardHeader title="Current Plan" sub="You are on the Basic plan." />
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { label: "Plan",               value: "Basic",       accent: "#1a1f36" },
            { label: "Invoices This Month", value: "47 / 1,000", accent: "#1a1f36" },
            { label: "Next Billing Date",   value: "Apr 12, 2026",accent: "#374151" },
          ].map(s => (
            <div key={s.label} style={{ padding: "14px 16px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#6b7280", marginBottom: 7 }}>
            <span>Invoice usage this month</span>
            <span><strong style={{ color: "#1a1f36" }}>47</strong> of 1,000</span>
          </div>
          <div style={{ height: 7, background: "#f0f0f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ width: "4.7%", height: "100%", background: "#e8472a", borderRadius: 10, transition: "width .4s" }} />
          </div>
        </div>
      </Card>

      {/* Billing toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1f36" }}>Upgrade Your Plan</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13.5, color: billing === "yearly" ? "#9ca3af" : "#1a1f36", fontWeight: billing === "yearly" ? 400 : 600 }}>Monthly</span>
          <div onClick={() => setBilling(b => b === "yearly" ? "monthly" : "yearly")}
            style={{ width: 40, height: 22, borderRadius: 11, background: "#e8472a", position: "relative", cursor: "pointer" }}>
            <div style={{ position: "absolute", top: 3, left: billing === "yearly" ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </div>
          <span style={{ fontSize: 13.5, color: billing === "yearly" ? "#1a1f36" : "#9ca3af", fontWeight: billing === "yearly" ? 600 : 400 }}>Yearly</span>
          <span style={{ fontSize: 12.5, color: "#16a34a", fontWeight: 600 }}>Save 20%</span>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, alignItems: "start" }}>
        {PLANS.map(plan => {
          const amount = billing === "yearly" ? Math.round(plan.monthlyPrice * 12 * 0.8) : plan.monthlyPrice;
          const period = billing === "yearly" ? "/yr" : "/mo";
          return (
            <div key={plan.id} style={{ background: "#fff", border: plan.current ? "2px solid #e8472a" : plan.badge ? "2px solid #e8472a" : "1px solid #e5e7eb", borderRadius: 14, padding: "24px 20px", position: "relative" }}>
              {plan.badge && !plan.current && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#e8472a", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}
              {plan.current && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#16a34a", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  YOUR PLAN
                </div>
              )}
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1f36", marginBottom: 14 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: plan.freeNote ? 4 : 18 }}>
                {plan.monthlyPrice === 0
                  ? <span style={{ fontSize: 34, fontWeight: 800, color: "#1a1f36" }}>Free</span>
                  : <><span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", alignSelf: "flex-start", marginTop: 6 }}>₦</span><span style={{ fontSize: 34, fontWeight: 800, color: "#1a1f36" }}>{amount.toLocaleString()}</span><span style={{ fontSize: 13, color: "#9ca3af" }}>{period}</span></>
                }
              </div>
              {plan.freeNote && <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e8472a", marginBottom: 16, fontStyle: "italic" }}>{plan.freeNote}</div>}
              <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#374151" }}>
                    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M3 8l3.5 3.5L13 5" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.current}
                style={{ width: "100%", padding: "11px 0", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: plan.current ? "default" : "pointer", border: "none", transition: "all .15s",
                  background: plan.current ? "#f0fdf4" : plan.cta === "red" ? "#e8472a" : "#f4f5f7",
                  color: plan.current ? "#16a34a" : plan.cta === "red" ? "#fff" : "#1a1f36",
                }}>
                {plan.ctaLabel}
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 12.5, color: "#9ca3af", textAlign: "center" }}>
        All plans include a 14-day free trial · No credit card required ·{" "}
        <a href="#" style={{ color: "#e8472a", textDecoration: "none", fontWeight: 500 }}>Compare all features</a>
        {" · "}
        <a href="#" style={{ color: "#e8472a", textDecoration: "none", fontWeight: 500 }}>Talk to sales</a>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "account",      label: "Account",          icon: "🏢" },
  { key: "contact",      label: "Contacts",         icon: "👤" },
  { key: "firs",         label: "FIRS Credentials", icon: "🏛️" },
  { key: "subscription", label: "Subscription",     icon: "💳" },
];

export default function FetchSettings({ navigate }) {
  const [tab, setTab] = useState("account");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Sidebar activePage="settings" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Settings</span>
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

        <main style={{ flex: 1, padding: "28px 32px 48px" }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", margin: "0 0 6px", letterSpacing: -0.3 }}>Settings</h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Manage your business profile, FIRS credentials, and subscription.</p>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 2, background: "#f4f5f7", borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 24 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 9, border: "none", cursor: "pointer", transition: "all .15s",
                  background: tab === t.key ? "#fff" : "transparent",
                  boxShadow: tab === t.key ? "0 1px 6px rgba(0,0,0,.08)" : "none",
                }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: tab === t.key ? "#1a1f36" : "#9ca3af" }}>{t.label}</span>
              </button>
            ))}
          </div>

          {tab === "account"      && <AccountTab />}
          {tab === "contact"      && <ContactTab />}
          {tab === "firs"         && <FirsCredentialsTab />}
          {tab === "subscription" && <SubscriptionTab />}

        </main>
      </div>
    </div>
  );
}
