import { useState } from "react";
import { DataTable, FilterBar, Toggle, Ico as SharedIco, Sidebar, CustomSelect } from "./FetchShared";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const INITIAL_CUSTOMERS = [
  { id: 1, type: "Company",    name: "Apex Technologies Ltd",  tin: "12345678-0001", tinStatus: "verified", email: "info@apextech.ng",       phone: "+234 801 234 5678", website: "apextech.ng",       street: "14 Broad Street",   city: "Lagos",    state: "Lagos",   country: "Nigeria", postcode: "100001", paymentMethod: "Bank Transfer", paymentTerms: "Net 30", status: true  },
  { id: 2, type: "Individual", name: "Chukwuemeka Obi",        tin: "98765432-0002", tinStatus: "verified", email: "emeka.obi@gmail.com",     phone: "+234 802 345 6789", website: "",                  street: "7 Akin Adesola St", city: "Lagos",    state: "Lagos",   country: "Nigeria", postcode: "101233", paymentMethod: "Cash",          paymentTerms: "Due on Receipt", status: true  },
  { id: 3, type: "Company",    name: "GreenBuild Contractors", tin: "",              tinStatus: "unverified", email: "contact@greenbuild.ng",  phone: "+234 803 456 7890", website: "greenbuild.ng",     street: "22 Ring Road",      city: "Ibadan",   state: "Oyo",     country: "Nigeria", postcode: "200001", paymentMethod: "Cheque",        paymentTerms: "Net 60", status: false },
  { id: 4, type: "Individual", name: "Fatima Al-Hassan",       tin: "11223344-0004", tinStatus: "verified", email: "fatima.ah@yahoo.com",     phone: "+234 804 567 8901", website: "",                  street: "5 Sultan Road",     city: "Kano",     state: "Kano",    country: "Nigeria", postcode: "700001", paymentMethod: "Bank Transfer", paymentTerms: "Net 15", status: true  },
  { id: 5, type: "Company",    name: "BlueSky Logistics",      tin: "55667788-0005", tinStatus: "verified", email: "ops@bluesky.com.ng",      phone: "+234 805 678 9012", website: "bluesky.com.ng",    street: "3 Trans Amadi",     city: "Port Harcourt", state: "Rivers", country: "Nigeria", postcode: "500001", paymentMethod: "Direct Debit",  paymentTerms: "Net 45", status: true  },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  ...SharedIco,
  user:    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>,
  close:   <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  bell:    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  shield:  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  warn:    <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
  globe:   <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  spin:    <svg width={14} height={14} fill="none" stroke="#e8472a" strokeWidth={2.5} viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}><path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
};

// ─── FIELD HELPERS ────────────────────────────────────────────────────────────
function FieldInput({ label, value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: disabled ? "#9ca3af" : "#1a1f36", outline: "none", fontFamily: "inherit", background: disabled ? "#f9fafb" : "#fff", width: "100%", boxSizing: "border-box" }}
      />
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 10, marginBottom: 2 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

// ─── TIN FIELD WITH VERIFICATION ─────────────────────────────────────────────
function TinField({ value, onChange, status, onVerify }) {
  // status: "idle" | "loading" | "verified" | "failed"
  const canVerify = value.trim().length >= 6 && status !== "verified" && status !== "loading";

  const badge = status === "verified"
    ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "2px 8px" }}>{Ico.shield} Verified</span>
    : status === "failed"
    ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 20, padding: "2px 8px" }}>{Ico.warn} Failed</span>
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>TIN (Tax Identification Number)</label>
        {badge}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={value}
          onChange={e => { onChange(e.target.value); }}
          placeholder="e.g. 12345678-0001"
          disabled={status === "loading" || status === "verified"}
          style={{ flex: 1, padding: "9px 12px", border: `1px solid ${status === "failed" ? "#fca5a5" : status === "verified" ? "#86efac" : "#e5e7eb"}`, borderRadius: 8, fontSize: 14, color: "#1a1f36", outline: "none", fontFamily: "inherit", background: status === "verified" ? "#f0fdf4" : status === "loading" ? "#f9fafb" : "#fff" }}
        />
        <button
          onClick={onVerify}
          disabled={!canVerify}
          style={{ flexShrink: 0, padding: "9px 16px", borderRadius: 8, border: "none", background: canVerify ? "#e8472a" : "#f0f2f5", color: canVerify ? "#fff" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: canVerify ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          {status === "loading" ? <>{Ico.spin} Verifying…</> : "Verify"}
        </button>
      </div>
      {status === "failed" && (
        <div style={{ fontSize: 12.5, color: "#dc2626", display: "flex", alignItems: "center", gap: 5 }}>
          {Ico.warn} TIN not found. Please check the number and try again.
        </div>
      )}
      {status === "idle" && value.trim().length > 0 && (
        <div style={{ fontSize: 12, color: "#9ca3af" }}>Enter your TIN and click Verify to continue.</div>
      )}
    </div>
  );
}

// ─── CUSTOMER TYPE TOGGLE ─────────────────────────────────────────────────────
function TypeToggle({ value, onChange }) {
  return (
    <div style={{ display: "flex", background: "#f4f5f7", borderRadius: 8, padding: 3, gap: 2 }}>
      {["Individual", "Company"].map(t => (
        <button key={t} onClick={() => onChange(t)}
          style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: value === t ? "#fff" : "transparent", color: value === t ? "#e8472a" : "#6b7280", boxShadow: value === t ? "0 1px 4px rgba(0,0,0,.1)" : "none", transition: "all .15s" }}>
          {t}
        </button>
      ))}
    </div>
  );
}

// ─── DRAWER ───────────────────────────────────────────────────────────────────
function Drawer({ item, isNew, onClose, onSave }) {
  const blank = { type: "Company", name: "", tin: "", tinStatus: "idle", email: "", phone: "", website: "", street: "", city: "", state: "", country: "Nigeria", postcode: "", paymentMethod: "", paymentTerms: "", status: true };
  const [form, setForm] = useState(item ? { ...item, tinStatus: item.tinStatus || "idle" } : blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSave = form.name.trim() && form.email.trim() && form.tin.trim() && form.tinStatus === "verified";

  const handleVerify = () => {
    set("tinStatus", "loading");
    setTimeout(() => {
      // Simulate: TINs ending in odd digit = verified, even = failed
      const lastChar = form.tin.trim().slice(-1);
      const pass = parseInt(lastChar) % 2 !== 0 || isNaN(parseInt(lastChar));
      set("tinStatus", pass ? "verified" : "failed");
    }, 1600);
  };

  const handleTinChange = (v) => {
    setForm(f => ({ ...f, tin: v, tinStatus: "idle" }));
  };

  return (
    <>
      <style>{`
        @keyframes drawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 580, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-6px 0 32px rgba(0,0,0,.1)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, background: "#fef2f0", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8472a" }}>{Ico.user}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1f36" }}>{isNew ? "Add Customer" : "View / Edit Customer"}</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{isNew ? "Create a new customer record" : "Update customer information"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>{Ico.close}</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Section 1: Customer Information ── */}
          <SectionHeader title="Customer Information" subtitle="Basic details and tax identification" />

          <TypeToggle value={form.type} onChange={v => set("type", v)} />

          <FieldInput
            label={form.type === "Company" ? "Company Name" : "Full Name"}
            value={form.name}
            onChange={v => set("name", v)}
            placeholder={form.type === "Company" ? "e.g. Apex Technologies Ltd" : "e.g. Chukwuemeka Obi"}
          />

          <TinField
            value={form.tin}
            onChange={handleTinChange}
            status={form.tinStatus}
            onVerify={handleVerify}
          />

          {/* ── Section 2: Contact Details ── */}
          <SectionHeader title="Contact Details" subtitle="How to reach this customer" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FieldInput label="Email Address" value={form.email} onChange={v => set("email", v)} placeholder="e.g. info@company.com" type="email" />
            <FieldInput label="Contact Number" value={form.phone} onChange={v => set("phone", v)} placeholder="e.g. +234 801 234 5678" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Website</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
              <span style={{ padding: "9px 10px 9px 12px", color: "#9ca3af", display: "flex", alignItems: "center", borderRight: "1px solid #e5e7eb", background: "#f9fafb" }}>{Ico.globe}</span>
              <input value={form.website} onChange={e => set("website", e.target.value)} placeholder="e.g. company.com"
                style={{ flex: 1, padding: "9px 12px", border: "none", fontSize: 14, color: "#1a1f36", outline: "none", fontFamily: "inherit" }} />
            </div>
          </div>

          {/* ── Section 3: Address ── */}
          <SectionHeader title="Address" subtitle="Billing and correspondence address" />

          <FieldInput label="Street Address" value={form.street} onChange={v => set("street", v)} placeholder="e.g. 14 Broad Street" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FieldInput label="City" value={form.city} onChange={v => set("city", v)} placeholder="e.g. Lagos" />
            <FieldInput label="State / Province" value={form.state} onChange={v => set("state", v)} placeholder="e.g. Lagos" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FieldInput label="Country" value={form.country} onChange={v => set("country", v)} placeholder="e.g. Nigeria" />
            <FieldInput label="Post Code" value={form.postcode} onChange={v => set("postcode", v)} placeholder="e.g. 100001" />
          </div>

          {/* ── Section 4: Payment ── */}
          <SectionHeader title="Payment" subtitle="Preferred payment settings" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <CustomSelect
              label="Primary Payment Method"
              value={form.paymentMethod}
              onChange={v => set("paymentMethod", v)}
              placeholder="Select method"
              options={["Bank Transfer", "Card", "Cash", "Cheque", "Direct Debit"]}
            />
            <CustomSelect
              searchable
              label="Payment Terms"
              value={form.paymentTerms}
              onChange={v => set("paymentTerms", v)}
              placeholder="Select terms"
              options={["Due on Receipt", "Net 7", "Net 15", "Net 30", "Net 45", "Net 60", "End of Month", "50% Upfront"]}
            />
          </div>

          {/* Save blocked notice */}
          {!canSave && (form.tin || form.name) && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#92400e", display: "flex", alignItems: "flex-start", gap: 8 }}>
              {Ico.warn}
              <span>
                {!form.name.trim() ? "Customer name is required." :
                 !form.tin.trim() ? "TIN is required for e-invoicing." :
                 form.tinStatus !== "verified" ? "Please verify the TIN before saving." :
                 "Email address is required."}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Status</span>
            <Toggle on={form.status} onChange={v => set("status", v)} />
            <span style={{ fontSize: 12.5, color: form.status ? "#16a34a" : "#9ca3af", fontWeight: 600 }}>{form.status ? "Active" : "Inactive"}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
            <button
              onClick={() => canSave && onSave(form)}
              style={{ padding: "10px 26px", borderRadius: 8, border: "none", background: canSave ? "#e8472a" : "#f0b4a8", fontSize: 14, fontWeight: 600, color: "#fff", cursor: canSave ? "pointer" : "not-allowed", boxShadow: canSave ? "0 2px 8px rgba(232,71,42,.3)" : "none" }}>
              {isNew ? "Add Customer" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FetchCustomers({ navigate }) {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch]       = useState("");
  const [drawer, setDrawer]       = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.tin.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = form => {
    if (drawer.isNew) {
      setCustomers(p => [...p, { ...form, id: Date.now() }]);
    } else {
      setCustomers(p => p.map(c => c.id === form.id ? form : c));
    }
    setDrawer(null);
  };

  const handleDelete = id => setCustomers(p => p.filter(c => c.id !== id));
  const toggleStatus = id => setCustomers(p => p.map(c => c.id === id ? { ...c, status: !c.status } : c));

  const TinBadge = ({ status }) => status === "verified"
    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "2px 7px" }}>{Ico.shield} Verified</span>
    : <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 20, padding: "2px 7px" }}>{Ico.warn} Unverified</span>;

  const TypeTag = ({ type }) => (
    <span style={{ fontSize: 10.5, fontWeight: 700, color: type === "Company" ? "#3b82f6" : "#8b5cf6", background: type === "Company" ? "#eff6ff" : "#f5f3ff", border: `1px solid ${type === "Company" ? "#bfdbfe" : "#ddd6fe"}`, borderRadius: 4, padding: "1px 6px", marginLeft: 6, letterSpacing: 0.3, verticalAlign: "middle" }}>
      {type === "Company" ? "CO" : "IND"}
    </span>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`*, *::before, *::after{box-sizing:border-box;margin:0;padding:0}html,body,#root{width:100%;min-height:100vh}`}</style>

      <Sidebar activePage="customers" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Customers</span>
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

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 32px 32px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", marginBottom: 5, letterSpacing: -0.3 }}>Customers</h1>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Manage your customer records and billing information.</p>
            </div>
            <button onClick={() => setDrawer({ item: null, isNew: true })}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 24px", background: "#e8472a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(232,71,42,.35)", whiteSpace: "nowrap" }}>
              + Add Customer
            </button>
          </div>

          <FilterBar
            search={search}
            onSearch={setSearch}
            onRefresh={() => setSearch("")}
            placeholder="Search by name, email or TIN..."
            filters={[
              { type: "select", placeholder: "Type",   options: ["Individual", "Company"] },
              { type: "select", placeholder: "Status", options: ["Active", "Inactive"] },
            ]}
          />

          <DataTable
            columns={[
              { key: "name",          label: "Name",           width: "1.6fr", render: (v, row) => (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{v}</span>
                  <TypeTag type={row.type} />
                </span>
              )},
              { key: "tin",           label: "TIN",            width: "1.2fr", render: (v, row) => (
                <div>
                  <div style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>{v || "—"}</div>
                  <div style={{ marginTop: 3 }}><TinBadge status={row.tinStatus} /></div>
                </div>
              )},
              { key: "email",         label: "Email",          width: "1.4fr", muted: true },
              { key: "phone",         label: "Phone",          width: "1fr",   muted: true },
              { key: "paymentTerms",  label: "Payment Terms",  width: "110px" },
              { key: "status",        label: "Status",         width: "70px",  render: (v, row) => <Toggle on={v} onChange={() => toggleStatus(row.id)} /> },
              { key: "__action",      label: "Action",         width: "60px"  },
            ]}
            rows={filtered}
            rowActions={[
              { label: "Edit",   action: row => setDrawer({ item: row, isNew: false }) },
              { label: "Delete", action: row => handleDelete(row.id), danger: true },
            ]}
            emptyTitle="No customers found"
            emptySubtitle="Try adjusting your search or add a new customer."
            onClearFilter={() => setSearch("")}
            itemLabel="customers"
            pageSize={10}
          />
        </main>
      </div>

      {drawer && (
        <Drawer
          item={drawer.item}
          isNew={drawer.isNew}
          onClose={() => setDrawer(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
