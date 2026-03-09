import { useState } from "react";
import { DataTable, FilterBar, Toggle, Ico as SharedIco, Sidebar } from "./FetchShared";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const VALIDATED_STATUSES = ["Paid", "Partially Paid", "Overdue", "Sent"];

const INITIAL_INVOICES = [
  { id: 1, number: "INV-2026-001", customer: "Apex Technologies Ltd",  issueDate: "Jan 5, 2026",  dueDate: "Feb 4, 2026",  total: 450000,  amountPaid: 450000, status: "Paid",           items: 3, irn: "INV2026001-K4TR82NP-20260105" },
  { id: 2, number: "INV-2026-002", customer: "Chukwuemeka Obi",        issueDate: "Jan 12, 2026", dueDate: "Jan 27, 2026", total: 85000,   amountPaid: 40000,  status: "Partially Paid", items: 2, irn: "INV2026002-A9QZ55BX-20260112" },
  { id: 3, number: "INV-2026-003", customer: "BlueSky Logistics",      issueDate: "Jan 18, 2026", dueDate: "Feb 2, 2026",  total: 1200000, amountPaid: 0,      status: "Overdue",        items: 5, irn: "INV2026003-M7WC19DL-20260118" },
  { id: 4, number: "INV-2026-004", customer: "Fatima Al-Hassan",       issueDate: "Feb 1, 2026",  dueDate: "Mar 3, 2026",  total: 320000,  amountPaid: 0,      status: "Sent",           items: 4, irn: "INV2026004-H2YF73RK-20260201" },
  { id: 5, number: "INV-2026-005", customer: "GreenBuild Contractors", issueDate: "Feb 10, 2026", dueDate: "Mar 12, 2026", total: 75000,   amountPaid: 0,      status: "Draft",          items: 1, irn: null },
  { id: 6, number: "INV-2026-006", customer: "Apex Technologies Ltd",  issueDate: "Feb 14, 2026", dueDate: "Mar 16, 2026", total: 560000,  amountPaid: 0,      status: "Sent",           items: 6, irn: "INV2026006-T6NB44JU-20260214" },
  { id: 7, number: "INV-2026-007", customer: "Chukwuemeka Obi",        issueDate: "Feb 20, 2026", dueDate: "Mar 7, 2026",  total: 48000,   amountPaid: 0,      status: "Cancelled",      items: 2, irn: null },
  { id: 8, number: "INV-2026-008", customer: "BlueSky Logistics",      issueDate: "Mar 1, 2026",  dueDate: "Mar 31, 2026", total: 980000,  amountPaid: 0,      status: "Draft",          items: 7, irn: null },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  ...SharedIco,
  invoice: <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  bell:    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  send:    <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  eye:     <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS = {
  "Draft":          { color: "#6b7280", bg: "#f4f5f7", border: "#e5e7eb" },
  "Sent":           { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  "Paid":           { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Partially Paid": { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  "Overdue":        { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  "Cancelled":      { color: "#9ca3af", bg: "#f9fafb", border: "#e5e7eb" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS["Draft"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function fmt(n) { return `₦${Number(n).toLocaleString()}`; }

// ─── SUMMARY CARDS ────────────────────────────────────────────────────────────
function SummaryCards({ invoices }) {
  const total     = invoices.reduce((s, i) => s + i.total, 0);
  const paid      = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.total, 0);
  const overdue   = invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.total, 0);
  const pending   = invoices.filter(i => ["Sent","Partially Paid"].includes(i.status)).reduce((s, i) => s + (i.total - i.amountPaid), 0);

  const cards = [
    { label: "Total Invoiced",   value: fmt(total),   sub: `${invoices.length} invoices`,                              accent: "#e8472a", bg: "#fef2f0", border: "#fdd" },
    { label: "Collected",        value: fmt(paid),    sub: `${invoices.filter(i=>i.status==="Paid").length} paid`,      accent: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Pending",          value: fmt(pending), sub: `${invoices.filter(i=>["Sent","Partially Paid"].includes(i.status)).length} awaiting payment`, accent: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    { label: "Overdue",          value: fmt(overdue), sub: `${invoices.filter(i=>i.status==="Overdue").length} overdue`, accent: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "18px 20px", borderLeft: `4px solid ${c.accent}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{c.label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1f36", letterSpacing: -0.5 }}>{c.value}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FetchInvoices({ navigate }) {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [search, setSearch]     = useState("");

  const filtered = invoices.filter(i =>
    i.number.toLowerCase().includes(search.toLowerCase()) ||
    i.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = id => setInvoices(p => p.filter(i => i.id !== id));

  const handleStatusChange = (id, status) => setInvoices(p => p.map(i => i.id === id ? { ...i, status } : i));

  // Balance outstanding
  const outstanding = inv => inv.total - inv.amountPaid;

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`*, *::before, *::after{box-sizing:border-box;margin:0;padding:0}html,body,#root{width:100%;min-height:100vh}`}</style>

      <Sidebar activePage="invoices" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* ── Topbar ── */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#6b7280", fontWeight: 500, cursor: "pointer" }} onClick={() => navigate("invoices")}>Sales</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Invoices</span>
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

        {/* ── Content ── */}
        <main style={{ flex: 1, padding: "28px 32px 32px", display: "flex", flexDirection: "column" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", marginBottom: 5, letterSpacing: -0.3 }}>Invoices</h1>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Create, manage and track your sales invoices.</p>
            </div>
            <button
              onClick={() => navigate("invoice-builder")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#e8472a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(232,71,42,.35)", whiteSpace: "nowrap" }}>
              {Ico.invoice}&nbsp; Create Invoice
            </button>
          </div>

          {/* Summary cards */}
          <SummaryCards invoices={invoices} />

          {/* Filter bar */}
          <FilterBar
            search={search}
            onSearch={setSearch}
            onRefresh={() => setSearch("")}
            placeholder="Search by invoice number or customer..."
            filters={[
              { type: "select", placeholder: "Status",   options: ["Draft", "Sent", "Paid", "Partially Paid", "Overdue", "Cancelled"] },
              { type: "select", placeholder: "Customer", options: [...new Set(invoices.map(i => i.customer))] },
              { type: "date",   placeholder: "Issue Date" },
            ]}
          />

          {/* Table */}
          <DataTable
            columns={[
              { key: "number",   label: "Invoice #",  width: "160px", render: (v, row) => (
                <div>
                  <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#1a1f36" }}>{v}</span>
                  {row.irn && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <svg width={10} height={10} fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#16a34a", letterSpacing: 0.3 }}>FIRS Validated</span>
                    </div>
                  )}
                </div>
              )},
              { key: "customer", label: "Customer",   width: "1.6fr", render: v => <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{v}</span> },
              { key: "issueDate",label: "Issued",     width: "110px", muted: true },
              { key: "dueDate",  label: "Due",        width: "110px", render: (v, row) => (
                <span style={{ fontSize: 13, color: row.status === "Overdue" ? "#dc2626" : "#6b7280", fontWeight: row.status === "Overdue" ? 700 : 400 }}>{v}</span>
              )},
              { key: "total",    label: "Amount",     width: "130px", render: v => <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36" }}>{fmt(v)}</span> },
              { key: "__balance",label: "Outstanding",width: "130px", render: (_, row) => {
                const bal = outstanding(row);
                return bal === 0
                  ? <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>Settled</span>
                  : <span style={{ fontSize: 13.5, fontWeight: 700, color: row.status === "Overdue" ? "#dc2626" : "#374151" }}>{fmt(bal)}</span>;
              }},
              { key: "status",   label: "Status",     width: "140px", render: v => <StatusBadge status={v} /> },
              { key: "__action", label: "Action",     width: "60px" },
            ]}
            rows={filtered}
            rowActions={[
              { label: "View / Edit",    action: row => navigate("invoice-builder", { invoice: row }) },
              { label: "Record Payment", action: row => navigate("collections", { invoice: row }), hidden: row => !["Sent","Partially Paid","Overdue"].includes(row.status) },
              { label: "Mark as Sent",   action: row => handleStatusChange(row.id, "Sent"), hidden: row => row.status !== "Draft" },
              { label: "Mark as Paid",   action: row => handleStatusChange(row.id, "Paid"), hidden: row => ["Paid","Cancelled","Draft"].includes(row.status) },
              { label: "Cancel",         action: row => handleStatusChange(row.id, "Cancelled"), hidden: row => ["Paid","Cancelled"].includes(row.status), danger: true },
              { label: "Delete",         action: row => handleDelete(row.id), danger: true },
            ]}
            rowStyle={row => row.status === "Overdue" ? { background: "#fff9f9" } : {}}
            emptyTitle="No invoices found"
            emptySubtitle="Try adjusting your filters or create your first invoice."
            onClearFilter={() => setSearch("")}
            itemLabel="invoices"
            pageSize={10}
          />
        </main>
      </div>
    </div>
  );
}
