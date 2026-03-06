import { useState, useEffect } from "react";
import { Ico as SharedIco, CustomSelect } from "./FetchShared";

// ─── SAMPLE CATALOGUE & CUSTOMERS ────────────────────────────────────────────
// In production these would come from shared state / API
const CATALOGUE = [
  { sku: "SKU-001", name: "Standing Desk",   unitPrice: 1000,   taxRate: 7.5,  itemType: "Product" },
  { sku: "SKU-002", name: "Laptop Bag",      unitPrice: 10000,  taxRate: 7.5,  itemType: "Product" },
  { sku: "SKU-003", name: "Office Chairs",   unitPrice: 50000,  taxRate: 7.5,  itemType: "Product" },
  { sku: "SKU-004", name: "Horse",           unitPrice: 500000, taxRate: 0,    itemType: "Product" },
  { sku: "SVC-001", name: "IT Consulting",   unitPrice: 25000,  taxRate: 7.5,  itemType: "Service" },
  { sku: "SVC-002", name: "Delivery",        unitPrice: 5000,   taxRate: 0,    itemType: "Service" },
];

const CUSTOMERS = [
  { name: "Apex Technologies Ltd",  tin: "12345678-0001", email: "info@apextech.ng",      address: "14 Broad Street, Lagos" },
  { name: "Chukwuemeka Obi",        tin: "98765432-0002", email: "emeka.obi@gmail.com",   address: "7 Akin Adesola St, Lagos" },
  { name: "GreenBuild Contractors", tin: "",              email: "contact@greenbuild.ng", address: "22 Ring Road, Ibadan" },
  { name: "Fatima Al-Hassan",       tin: "11223344-0004", email: "fatima.ah@yahoo.com",   address: "5 Sultan Road, Kano" },
  { name: "BlueSky Logistics",      tin: "55667788-0005", email: "ops@bluesky.com.ng",    address: "3 Trans Amadi, Port Harcourt" },
];

const PAYMENT_TERMS = ["Due on Receipt", "Net 7", "Net 15", "Net 30", "Net 45", "Net 60", "50% Upfront"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  ...SharedIco,
  back:    <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  plus:    <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>,
  trash:   <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  send:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  save:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>,
  info:    <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 16v-4M12 8h.01"/></svg>,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt   = n  => `₦${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().split("T")[0];
const addDays = (dateStr, days) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const termToDays = term => {
  if (term === "Due on Receipt") return 0;
  if (term === "50% Upfront")    return 30;
  const m = term.match(/Net (\d+)/);
  return m ? parseInt(m[1]) : 30;
};
const fmtDate = str => {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
const nextInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${year}-${num}`;
};

const blankLine = () => ({
  id: Date.now() + Math.random(),
  sku: "", name: "", description: "", qty: 1, unitPrice: 0, discount: 0, taxRate: 7.5,
});

const lineTotal  = l => {
  const gross    = l.qty * l.unitPrice;
  const discAmt  = gross * (l.discount / 100);
  const net      = gross - discAmt;
  const taxAmt   = net * (l.taxRate / 100);
  return { gross, discAmt, net, taxAmt, total: net + taxAmt };
};

// ─── FIELD COMPONENTS ─────────────────────────────────────────────────────────
function Field({ label, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{label}{required && <span style={{ color: "#e8472a", marginLeft: 3 }}>*</span>}</label>}
      {children}
    </div>
  );
}

const inp = (extra = {}) => ({
  padding: "8px 11px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13.5,
  color: "#1a1f36", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  background: "#fff", ...extra,
});

// ─── LINE ITEM ROW ────────────────────────────────────────────────────────────
function LineRow({ line, onChange, onRemove, idx }) {
  const [itemOpen, setItemOpen] = useState(false);
  const [itemQuery, setItemQuery] = useState("");

  const filtered = CATALOGUE.filter(c =>
    c.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
    c.sku.toLowerCase().includes(itemQuery.toLowerCase())
  );

  const { discAmt, net, taxAmt, total } = lineTotal(line);

  const selectItem = (cat) => {
    onChange({ ...line, sku: cat.sku, name: cat.name, unitPrice: cat.unitPrice, taxRate: cat.taxRate });
    setItemOpen(false);
    setItemQuery("");
  };

  const numInp = (val, key, min = 0) => (
    <input
      type="number" min={min} value={val}
      onChange={e => onChange({ ...line, [key]: parseFloat(e.target.value) || 0 })}
      style={{ ...inp(), textAlign: "right", width: "100%", MozAppearance: "textfield" }}
    />
  );

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      {/* # */}
      <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#9ca3af", width: 32, textAlign: "center", verticalAlign: "middle" }}>{idx + 1}</td>

      {/* Item */}
      <td style={{ padding: "8px 8px", verticalAlign: "top", minWidth: 180 }}>
        <div style={{ position: "relative" }}>
          <div onClick={() => setItemOpen(o => !o)}
            style={{ ...inp({ cursor: "pointer", paddingRight: 28 }), color: line.name ? "#1a1f36" : "#9ca3af", position: "relative", userSelect: "none" }}>
            {line.name || "Select item…"}
            <span style={{ position: "absolute", right: 8, top: "50%", transform: `translateY(-50%) ${itemOpen ? "rotate(180deg)" : ""}`, transition: "transform .15s", color: "#9ca3af" }}>{Ico.chevron}</span>
          </div>
          {itemOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: 280, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.13)", zIndex: 200, overflow: "hidden" }}>
              <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>
                <input autoFocus value={itemQuery} onChange={e => setItemQuery(e.target.value)}
                  placeholder="Search items…" style={{ ...inp({ border: "1px solid #e5e7eb" }), fontSize: 13 }} />
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto" }}>
                {filtered.length === 0 && <div style={{ padding: "12px", fontSize: 13, color: "#9ca3af", textAlign: "center" }}>No items found</div>}
                {filtered.map(cat => (
                  <div key={cat.sku} onClick={() => selectItem(cat)}
                    style={{ padding: "9px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{cat.name}</div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{cat.sku} · {cat.itemType}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "#374151", flexShrink: 0 }}>₦{cat.unitPrice.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Description */}
        <input value={line.description} onChange={e => onChange({ ...line, description: e.target.value })}
          placeholder="Description (optional)" style={{ ...inp({ marginTop: 5, fontSize: 12.5, color: "#6b7280", background: "#fafafa" }) }} />
      </td>

      {/* Qty */}
      <td style={{ padding: "8px 6px", verticalAlign: "top", width: 72 }}>{numInp(line.qty, "qty", 1)}</td>

      {/* Unit Price */}
      <td style={{ padding: "8px 6px", verticalAlign: "top", width: 120 }}>{numInp(line.unitPrice, "unitPrice")}</td>

      {/* Discount % */}
      <td style={{ padding: "8px 6px", verticalAlign: "top", width: 80 }}>{numInp(line.discount, "discount")}</td>

      {/* Tax % */}
      <td style={{ padding: "8px 6px", verticalAlign: "top", width: 80 }}>{numInp(line.taxRate, "taxRate")}</td>

      {/* Line Total */}
      <td style={{ padding: "8px 12px", verticalAlign: "top", width: 130, textAlign: "right" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36", paddingTop: 9 }}>{fmt(total)}</div>
        {(line.discount > 0 || line.taxRate > 0) && (
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3, lineHeight: 1.5 }}>
            {line.discount > 0 && <div>Disc: -{fmt(discAmt)}</div>}
            {line.taxRate > 0  && <div>Tax: +{fmt(taxAmt)}</div>}
          </div>
        )}
      </td>

      {/* Remove */}
      <td style={{ padding: "8px 8px", verticalAlign: "top", width: 36, textAlign: "center" }}>
        <button onClick={onRemove}
          style={{ width: 28, height: 28, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7", border: "none", borderRadius: 6, cursor: "pointer", color: "#9ca3af" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fde8e4"; e.currentTarget.style.color = "#e8472a"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f4f5f7"; e.currentTarget.style.color = "#9ca3af"; }}>
          {Ico.trash}
        </button>
      </td>
    </tr>
  );
}

// ─── INVOICE BUILDER ──────────────────────────────────────────────────────────
export default function FetchInvoiceBuilder({ navigate, invoiceData }) {
  const isEdit = !!invoiceData;

  const [invoiceNumber]                  = useState(isEdit ? invoiceData.number : nextInvoiceNumber());
  const [status, setStatus]              = useState(isEdit ? invoiceData.status : "Draft");
  const [customer, setCustomer]          = useState(isEdit ? invoiceData.customer : "");
  const [issueDate, setIssueDate]        = useState(isEdit ? "" : today());
  const [paymentTerms, setPaymentTerms]  = useState("Net 30");
  const [dueDate, setDueDate]            = useState(isEdit ? "" : addDays(today(), 30));
  const [lines, setLines]                = useState(isEdit ? [] : [blankLine()]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [notes, setNotes]                = useState("");
  const [terms, setTerms]                = useState("Payment is due within the agreed payment terms. Late payments may attract interest.");
  const [saved, setSaved]                = useState(false);

  // Recalculate due date when terms change
  useEffect(() => {
    setDueDate(addDays(issueDate, termToDays(paymentTerms)));
  }, [paymentTerms, issueDate]);

  const customerObj = CUSTOMERS.find(c => c.name === customer);

  // Totals
  const linesSummary = lines.reduce((acc, l) => {
    const t = lineTotal(l);
    return { subtotal: acc.subtotal + t.net, tax: acc.tax + t.taxAmt, discount: acc.discount + t.discAmt };
  }, { subtotal: 0, tax: 0, discount: 0 });

  const globalDiscAmt  = linesSummary.subtotal * (globalDiscount / 100);
  const grandTotal     = linesSummary.subtotal - globalDiscAmt + linesSummary.tax;
  const totalDiscount  = linesSummary.discount + globalDiscAmt;

  const updateLine = (id, updated) => setLines(ls => ls.map(l => l.id === id ? updated : l));
  const removeLine = id => setLines(ls => ls.filter(l => l.id !== id));
  const addLine    = () => setLines(ls => [...ls, blankLine()]);

  const handleSave = (newStatus = status) => {
    setStatus(newStatus);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const STATUS_COLORS = {
    "Draft":    { color: "#6b7280", bg: "#f4f5f7" },
    "Sent":     { color: "#3b82f6", bg: "#eff6ff" },
    "Paid":     { color: "#16a34a", bg: "#f0fdf4" },
    "Overdue":  { color: "#dc2626", bg: "#fef2f2" },
    "Cancelled":{ color: "#9ca3af", bg: "#f9fafb" },
  };
  const sc = STATUS_COLORS[status] || STATUS_COLORS["Draft"];

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
        html, body, #root { width: 100%; min-height: 100vh }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* ── Sticky Top Bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 8px rgba(0,0,0,.06)" }}>
        {/* Left: back + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => navigate("invoices")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            {Ico.back} Back
          </button>
          <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1f36", letterSpacing: -0.3 }}>{invoiceNumber}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: sc.color, background: sc.bg, borderRadius: 20, padding: "3px 10px" }}>{status}</span>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {saved && (
            <span style={{ fontSize: 12.5, color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, animation: "fadeIn .3s ease" }}>
              <svg width={14} height={14} fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              Saved
            </span>
          )}
          <button onClick={() => handleSave("Draft")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#374151" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            {Ico.save} Save Draft
          </button>
          <button onClick={() => handleSave("Sent")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", border: "none", borderRadius: 7, background: "#e8472a", cursor: "pointer", fontSize: 13.5, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(232,71,42,.3)" }}
            onMouseEnter={e => e.currentTarget.style.background = "#d03d22"}
            onMouseLeave={e => e.currentTarget.style.background = "#e8472a"}>
            {Ico.send} Send Invoice
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

        {/* ═══ LEFT COLUMN ═══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Invoice metadata ── */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>Invoice Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Field label="Invoice Number">
                <input value={invoiceNumber} readOnly style={{ ...inp({ background: "#f9fafb", color: "#9ca3af", fontFamily: "monospace", fontWeight: 700, cursor: "default" }) }} />
              </Field>
              <Field label="Issue Date" required>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} style={inp()} />
              </Field>
              <Field label="Payment Terms">
                <CustomSelect value={paymentTerms} onChange={setPaymentTerms} options={PAYMENT_TERMS} searchable />
              </Field>
            </div>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
              <Field label="Due Date">
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inp()} />
              </Field>
              <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 1 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 4, alignItems: "center" }}>
                  {Ico.info} Due date auto-calculated from issue date and payment terms. You can override it manually.
                </span>
              </div>
            </div>
          </div>

          {/* ── Bill To ── */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>Bill To</div>
            <Field label="Customer" required>
              <CustomSelect
                value={customer}
                onChange={setCustomer}
                placeholder="Select a customer…"
                options={CUSTOMERS.map(c => c.name)}
                searchable
              />
            </Field>
            {customerObj && (
              <div style={{ marginTop: 14, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["Email",   customerObj.email   || "—"],
                  ["TIN",     customerObj.tin      || "Not verified"],
                  ["Address", customerObj.address  || "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.4 }}>{k}</div>
                    <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Line Items ── */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Line Items</div>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{lines.length} {lines.length === 1 ? "item" : "items"}</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fb" }}>
                    {["#","Item","Qty","Unit Price (₦)","Disc %","Tax %","Total",""].map((h, i) => (
                      <th key={i} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, color: "#b0b7c3", textTransform: "uppercase", letterSpacing: 0.6, textAlign: i >= 2 ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => (
                    <LineRow key={line.id} line={line} idx={idx}
                      onChange={updated => updateLine(line.id, updated)}
                      onRemove={() => removeLine(line.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add line button */}
            <div style={{ padding: "14px 24px", borderTop: "1px solid #f0f0f0" }}>
              <button onClick={addLine}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1.5px dashed #d1d5db", borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b7280" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8472a"; e.currentTarget.style.color = "#e8472a"; e.currentTarget.style.background = "#fef2f0"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; }}>
                {Ico.plus} Add Line Item
              </button>
            </div>
          </div>

          {/* ── Notes & Terms ── */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>Notes & Terms</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Notes">
                <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Additional notes for the customer…"
                  style={{ ...inp(), resize: "vertical", lineHeight: 1.6 }} />
              </Field>
              <Field label="Payment Terms & Conditions">
                <textarea rows={4} value={terms} onChange={e => setTerms(e.target.value)}
                  style={{ ...inp(), resize: "vertical", lineHeight: 1.6 }} />
              </Field>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN — Invoice Summary (sticky) ═══ */}
        <div style={{ position: "sticky", top: 76, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Summary card */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", fontSize: 13, fontWeight: 700, color: "#374151" }}>Summary</div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>Subtotal</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{fmt(linesSummary.subtotal + linesSummary.discount)}</span>
              </div>

              {linesSummary.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Line Discounts</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#dc2626" }}>-{fmt(linesSummary.discount)}</span>
                </div>
              )}

              {/* Global discount */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#6b7280", flexShrink: 0 }}>Invoice Discount</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="number" min={0} max={100} value={globalDiscount}
                    onChange={e => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    style={{ width: 54, padding: "4px 7px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>%</span>
                  {globalDiscAmt > 0 && <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>-{fmt(globalDiscAmt)}</span>}
                </div>
              </div>

              {totalDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>After Discount</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{fmt(linesSummary.subtotal - globalDiscAmt)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>VAT / Tax</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>+{fmt(linesSummary.tax)}</span>
              </div>

              <div style={{ height: 1, background: "#f0f0f0", margin: "4px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1f36" }}>Total Due</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#e8472a", letterSpacing: -0.5 }}>{fmt(grandTotal)}</span>
              </div>

              {lines.length > 0 && (
                <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "right", marginTop: -6 }}>
                  {lines.filter(l => l.name).length} of {lines.length} items priced
                </div>
              )}
            </div>
          </div>

          {/* Invoice info card */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>Invoice Info</div>
            {[
              ["From",     "Your Business Name"],
              ["Issue Date", fmtDate(issueDate) || "—"],
              ["Due Date",  fmtDate(dueDate) || "—"],
              ["Terms",    paymentTerms],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{k}</span>
                <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => handleSave("Sent")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", border: "none", borderRadius: 8, background: "#e8472a", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 2px 10px rgba(232,71,42,.3)" }}
              onMouseEnter={e => e.currentTarget.style.background = "#d03d22"}
              onMouseLeave={e => e.currentTarget.style.background = "#e8472a"}>
              {Ico.send} Send Invoice
            </button>
            <button onClick={() => handleSave("Draft")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#374151" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              {Ico.save} Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
