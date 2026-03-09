import { useState } from "react";
import { DataTable, FilterBar, CustomSelect, Ico as SharedIco, Sidebar } from "./FetchShared";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const INITIAL_COLLECTIONS = [
  { id: 1,  receiptNumber: "RCP-2026-001", invoiceNumber: "INV-2026-001", irn: "INV2026001-K4TR82NP-20260105", customer: "Apex Technologies Ltd",  date: "Jan 20, 2026", amount: 450000, method: "Bank Transfer", reference: "TRF/2026/0012345", notes: "",                        status: "Confirmed" },
  { id: 2,  receiptNumber: "RCP-2026-002", invoiceNumber: "INV-2026-002", irn: "INV2026002-A9QZ55BX-20260112", customer: "Chukwuemeka Obi",        date: "Jan 22, 2026", amount: 40000,  method: "POS",           reference: "POS/TXN/884421",     notes: "Partial — balance pending", status: "Confirmed" },
  { id: 3,  receiptNumber: "RCP-2026-003", invoiceNumber: "INV-2026-004", irn: "INV2026004-H2YF73RK-20260201", customer: "Fatima Al-Hassan",       date: "Feb 10, 2026", amount: 100000, method: "Bank Transfer", reference: "TRF/2026/0018822", notes: "First instalment",          status: "Confirmed" },
  { id: 4,  receiptNumber: "RCP-2026-004", invoiceNumber: "INV-2026-004", irn: "INV2026004-H2YF73RK-20260201", customer: "Fatima Al-Hassan",       date: "Feb 25, 2026", amount: 100000, method: "Bank Transfer", reference: "TRF/2026/0021903", notes: "Second instalment",         status: "Confirmed" },
  { id: 5,  receiptNumber: "RCP-2026-005", invoiceNumber: "INV-2026-006", irn: "INV2026006-T6NB44JU-20260214", customer: "Apex Technologies Ltd",  date: "Mar 2, 2026",  amount: 280000, method: "Cheque",        reference: "CHQ/0042198",        notes: "",                        status: "Pending"   },
  { id: 6,  receiptNumber: "RCP-2026-006", invoiceNumber: "INV-2026-003", irn: "INV2026003-M7WC19DL-20260118", customer: "BlueSky Logistics",      date: "Mar 5, 2026",  amount: 500000, method: "Bank Transfer", reference: "TRF/2026/0029441", notes: "Part payment on overdue",  status: "Confirmed" },
  { id: 7,  receiptNumber: "RCP-2026-007", invoiceNumber: "INV-2026-001", irn: "INV2026001-K4TR82NP-20260105", customer: "Apex Technologies Ltd",  date: "Dec 10, 2025", amount: 120000, method: "USSD",          reference: "USSD/9912830",       notes: "Pre-invoice deposit",     status: "Reversed"  },
];

const INVOICE_TOTALS = {
  "INV-2026-001": 450000,
  "INV-2026-002": 85000,
  "INV-2026-003": 1200000,
  "INV-2026-004": 320000,
  "INV-2026-006": 560000,
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  ...SharedIco,
  receipt:  <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  download: <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  share:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>,
  email:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  copy:     <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path strokeLinecap="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  bell:     <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  close:    <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  whatsapp: <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => `₦${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const METHOD_COLORS = {
  "Bank Transfer": { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  "POS":           { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  "Cheque":        { color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  "Cash":          { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "USSD":          { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
};

const STATUS_CONFIG = {
  "Confirmed": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Pending":   { color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  "Reversed":  { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function MethodBadge({ method }) {
  const c = METHOD_COLORS[method] || { color: "#6b7280", bg: "#f4f5f7", border: "#e5e7eb" };
  return <span style={{ fontSize: 11.5, fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: "2px 9px", whiteSpace: "nowrap" }}>{method}</span>;
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  return <span style={{ fontSize: 11.5, fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: "2px 9px", whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── SUMMARY CARDS ────────────────────────────────────────────────────────────
function SummaryCards({ collections }) {
  const confirmed = collections.filter(c => c.status === "Confirmed");
  const pending   = collections.filter(c => c.status === "Pending");
  const reversed  = collections.filter(c => c.status === "Reversed");
  const thisMonth = confirmed.filter(c => c.date.includes("Mar 2026"));

  const cards = [
    { label: "Total Collected",   value: fmt(confirmed.reduce((s, c) => s + c.amount, 0)), sub: `${confirmed.length} confirmed payments`,      accent: "#16a34a", border: "#bbf7d0" },
    { label: "This Month",        value: fmt(thisMonth.reduce((s, c) => s + c.amount, 0)), sub: `${thisMonth.length} payments in March`,         accent: "#3b82f6", border: "#bfdbfe" },
    { label: "Pending Confirmation", value: fmt(pending.reduce((s, c) => s + c.amount, 0)), sub: `${pending.length} awaiting confirmation`,     accent: "#b45309", border: "#fde68a" },
    { label: "Reversed",          value: fmt(reversed.reduce((s, c) => s + c.amount, 0)), sub: `${reversed.length} reversed transactions`,      accent: "#dc2626", border: "#fecaca" },
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

// ─── RECEIPT PANEL ────────────────────────────────────────────────────────────
function ReceiptPanel({ entry, allEntries, onClose }) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // All confirmed payments for this invoice
  const invoicePayments = allEntries.filter(e => e.invoiceNumber === entry.invoiceNumber && e.status === "Confirmed");
  const invoiceTotal    = INVOICE_TOTALS[entry.invoiceNumber] || 0;
  const totalPaid       = invoicePayments.reduce((s, e) => s + e.amount, 0);
  const balance         = Math.max(0, invoiceTotal - totalPaid);

  const copyRef = () => {
    navigator.clipboard.writeText(entry.receiptNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("receipt-printable");
    const win = window.open("", "_blank", "width=600,height=800");
    win.document.write(`
      <html><head><title>${entry.receiptNumber}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1f36; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #e8472a; }
        .brand { font-size: 22px; font-weight: 800; color: #e8472a; }
        .receipt-title { font-size: 13px; color: #9ca3af; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }
        .badge { font-size: 11px; font-weight: 700; color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 3px 10px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .label { font-size: 13px; color: #6b7280; }
        .value { font-size: 13px; font-weight: 600; color: #1a1f36; }
        .mono { font-family: monospace; font-size: 12px; }
        .divider { border: none; border-top: 1px solid #f0f0f0; margin: 16px 0; }
        .amount-box { background: #f9fafb; border-radius: 10px; padding: 16px 20px; margin-top: 20px; }
        .amount-label { font-size: 13px; color: #6b7280; }
        .amount-value { font-size: 28px; font-weight: 800; color: #e8472a; }
        .balance { font-size: 13px; color: ${balance === 0 ? "#16a34a" : "#dc2626"}; font-weight: 600; margin-top: 6px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #f0f0f0; font-size: 11px; color: #9ca3af; text-align: center; }
        .irn-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin-top: 12px; }
        .irn-label { font-size: 10px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px; }
        .irn-value { font-family: monospace; font-size: 12px; font-weight: 700; color: #1a1f36; margin-top: 3px; }
      </style></head><body>
      <div class="header">
        <div>
          <div class="brand">FETCH</div>
          <div class="receipt-title">Payment Receipt</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:20px;font-weight:800;color:#1a1f36">${entry.receiptNumber}</div>
          <div class="badge" style="display:inline-block;margin-top:6px">✓ ${entry.status}</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Payment Details</div>
        <div class="row"><span class="label">Date</span><span class="value">${entry.date}</span></div>
        <div class="row"><span class="label">Customer</span><span class="value">${entry.customer}</span></div>
        <div class="row"><span class="label">Payment Method</span><span class="value">${entry.method}</span></div>
        <div class="row"><span class="label">Reference</span><span class="value mono">${entry.reference || "—"}</span></div>
        ${entry.notes ? `<div class="row"><span class="label">Notes</span><span class="value">${entry.notes}</span></div>` : ""}
      </div>
      <hr class="divider"/>
      <div class="section">
        <div class="section-title">Invoice Reference</div>
        <div class="row"><span class="label">Invoice Number</span><span class="value mono">${entry.invoiceNumber}</span></div>
        <div class="row"><span class="label">Invoice Total</span><span class="value">${fmt(invoiceTotal)}</span></div>
        <div class="row"><span class="label">Total Paid to Date</span><span class="value">${fmt(totalPaid)}</span></div>
        <div class="irn-box">
          <div class="irn-label">FIRS Invoice Reference Number (IRN)</div>
          <div class="irn-value">${entry.irn}</div>
        </div>
      </div>
      <div class="amount-box">
        <div class="amount-label">Amount Received</div>
        <div class="amount-value">${fmt(entry.amount)}</div>
        <div class="balance">${balance === 0 ? "✓ Invoice fully settled" : `Outstanding balance: ${fmt(balance)}`}</div>
      </div>
      <div class="footer">
        This receipt was generated by Fetch · ${entry.receiptNumber} · ${entry.date}<br/>
        For queries contact support@fetchinvoice.ng
      </div>
    </body></html>`);
    win.document.close();
    win.print();
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, please find your payment receipt below.\n\nReceipt: ${entry.receiptNumber}\nInvoice: ${entry.invoiceNumber}\nAmount Paid: ${fmt(entry.amount)}\nDate: ${entry.date}\nReference: ${entry.reference || "N/A"}\nIRN: ${entry.irn}\n\nThank you for your payment.`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 480, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-6px 0 32px rgba(0,0,0,.12)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}>
        <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, background: "#fef2f0", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8472a" }}>{Ico.receipt}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1f36" }}>{entry.receiptNumber}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{entry.customer}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>{Ico.close}</button>
        </div>

        {/* Action bar */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={handlePrint}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", border: "none", borderRadius: 8, background: "#e8472a", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.background = "#d03d22"}
            onMouseLeave={e => e.currentTarget.style.background = "#e8472a"}>
            {Ico.download} Download PDF
          </button>

          {/* Share dropdown */}
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShareOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              {Ico.share} Share
              <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ transform: shareOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {shareOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: 200, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 10, overflow: "hidden" }}>
                {[
                  { label: "Copy Receipt Ref",  icon: Ico.copy,      action: copyRef },
                  { label: "Share via WhatsApp", icon: Ico.whatsapp,  action: () => { handleWhatsApp(); setShareOpen(false); }, color: "#16a34a" },
                  { label: "Email to Customer", icon: Ico.email,      action: () => { window.location.href = `mailto:?subject=${entry.receiptNumber}&body=Receipt for payment on ${entry.invoiceNumber}`; setShareOpen(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: item.color || "#374151", textAlign: "left" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <span style={{ color: item.color || "#9ca3af" }}>{item.icon}</span>
                    {copied && item.label === "Copy Receipt Ref" ? "Copied!" : item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Receipt body */}
        <div id="receipt-printable" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {/* Receipt header card */}
          <div style={{ background: "linear-gradient(135deg, #1a1f36 0%, #2d3561 100%)", borderRadius: 12, padding: "24px", marginBottom: 20, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Payment Receipt</div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{fmt(entry.amount)}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{entry.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.9)", fontFamily: "monospace" }}>{entry.receiptNumber}</div>
                <div style={{ marginTop: 8 }}>
                  <StatusBadge status={entry.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Payment Details */}
          <SectionBlock title="Payment Details">
            <InfoRow label="Customer"        value={entry.customer} />
            <InfoRow label="Payment Method"  value={<MethodBadge method={entry.method} />} />
            <InfoRow label="Reference"       value={<span style={{ fontFamily: "monospace", fontSize: 13 }}>{entry.reference || "—"}</span>} />
            {entry.notes && <InfoRow label="Notes" value={entry.notes} />}
          </SectionBlock>

          {/* Section: Invoice Reference */}
          <SectionBlock title="Invoice Reference">
            <InfoRow label="Invoice Number"  value={<span style={{ fontFamily: "monospace", fontWeight: 700 }}>{entry.invoiceNumber}</span>} />
            <InfoRow label="Invoice Total"   value={fmt(invoiceTotal)} />
            <InfoRow label="Total Paid"      value={<span style={{ color: "#16a34a", fontWeight: 700 }}>{fmt(totalPaid)}</span>} />
            <InfoRow label="Balance"         value={
              balance === 0
                ? <span style={{ color: "#16a34a", fontWeight: 700 }}>Fully Settled ✓</span>
                : <span style={{ color: "#dc2626", fontWeight: 700 }}>{fmt(balance)} outstanding</span>
            } />

            {/* IRN */}
            <div style={{ marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                <svg width={11} height={11} fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5 }}>FIRS Invoice Reference Number</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#1a1f36", letterSpacing: 0.5 }}>{entry.irn}</span>
            </div>
          </SectionBlock>

          {/* Payment history on this invoice */}
          {invoicePayments.length > 1 && (
            <SectionBlock title={`Payment History — ${entry.invoiceNumber}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {invoicePayments.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < invoicePayments.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: p.id === entry.id ? 700 : 500, color: p.id === entry.id ? "#e8472a" : "#374151" }}>
                        {p.receiptNumber} {p.id === entry.id && <span style={{ fontSize: 11, color: "#e8472a" }}>← this</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{p.date} · {p.method}</div>
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36" }}>{fmt(p.amount)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total Collected</span>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#16a34a" }}>{fmt(totalPaid)}</span>
                </div>
              </div>
            </SectionBlock>
          )}

          {/* Footer note */}
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
            This receipt was generated by Fetch. For queries, contact support@fetchinvoice.ng
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────
function SectionBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 12 }}>{title}</div>
      <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 10, padding: "4px 16px", display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
      <span style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#1a1f36", fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

// ─── RECORD PAYMENT DRAWER ────────────────────────────────────────────────────
function RecordPaymentDrawer({ onClose, onSave, collections, prefilledInvoice }) {
  const nextNum = `RCP-2026-00${collections.length + 1}`;

  const INVOICES_WITH_IRN = [
    { number: "INV-2026-001", customer: "Apex Technologies Ltd",  irn: "INV2026001-K4TR82NP-20260105", total: 450000,  paid: 450000 },
    { number: "INV-2026-002", customer: "Chukwuemeka Obi",        irn: "INV2026002-A9QZ55BX-20260112", total: 85000,   paid: 40000  },
    { number: "INV-2026-003", customer: "BlueSky Logistics",      irn: "INV2026003-M7WC19DL-20260118", total: 1200000, paid: 500000 },
    { number: "INV-2026-004", customer: "Fatima Al-Hassan",       irn: "INV2026004-H2YF73RK-20260201", total: 320000,  paid: 200000 },
    { number: "INV-2026-006", customer: "Apex Technologies Ltd",  irn: "INV2026006-T6NB44JU-20260214", total: 560000,  paid: 280000 },
  ];

  // If pre-filled from invoice list, init with that invoice locked
  const initInv = prefilledInvoice
    ? INVOICES_WITH_IRN.find(i => i.number === prefilledInvoice.number) || null
    : null;

  const [form, setForm] = useState({
    invoiceNumber: initInv ? initInv.number : "",
    customer:      initInv ? initInv.customer : "",
    amount: "", method: "Bank Transfer",
    reference: "", date: new Date().toISOString().split("T")[0], notes: "",
  });
  const [invoiceLocked, setInvoiceLocked] = useState(!!initInv);
  const [invSearch, setInvSearch]         = useState("");
  const [invOpen, setInvOpen]             = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { padding: "8px 11px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13.5, color: "#1a1f36", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  const selectedInv = INVOICES_WITH_IRN.find(i => i.number === form.invoiceNumber);
  const outstanding = selectedInv ? selectedInv.total - selectedInv.paid : 0;
  const canSave = form.invoiceNumber && form.amount && form.method;

  const filteredInvoices = INVOICES_WITH_IRN.filter(i =>
    i.number.toLowerCase().includes(invSearch.toLowerCase()) ||
    i.customer.toLowerCase().includes(invSearch.toLowerCase())
  );

  const selectInvoice = (inv) => {
    set("invoiceNumber", inv.number);
    set("customer", inv.customer);
    setInvOpen(false);
    setInvSearch("");
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 480, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-6px 0 32px rgba(0,0,0,.12)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}
        onClick={() => setInvOpen(false)}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, background: "#fef2f0", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8472a" }}>{Ico.receipt}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1f36" }}>Record Payment</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 1 }}>Generate receipt {nextNum}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>{Ico.close}</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}
          onClick={e => e.stopPropagation()}>

          {/* ── Invoice searchable picker ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Invoice <span style={{ color: "#e8472a" }}>*</span></label>
              {invoiceLocked && (
                <button onClick={() => { setInvoiceLocked(false); set("invoiceNumber",""); set("customer",""); }}
                  style={{ fontSize: 12, fontWeight: 600, color: "#e8472a", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Change invoice
                </button>
              )}
            </div>

            {invoiceLocked && selectedInv ? (
              /* Locked state — show selected invoice as a card */
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36", fontFamily: "monospace" }}>{selectedInv.number}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>{selectedInv.customer}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Outstanding</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: outstanding > 0 ? "#dc2626" : "#16a34a" }}>{fmt(outstanding)}</div>
                </div>
              </div>
            ) : (
              /* Open search input */
              <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", border: `1px solid ${invOpen ? "#e8472a" : "#e5e7eb"}`, borderRadius: 8, background: "#fff", cursor: "text", transition: "border-color .15s" }}
                  onClick={() => setInvOpen(true)}>
                  <svg width={14} height={14} fill="none" stroke="#9ca3af" strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
                  <input
                    autoFocus={!invoiceLocked}
                    value={invSearch}
                    onChange={e => { setInvSearch(e.target.value); setInvOpen(true); }}
                    onFocus={() => setInvOpen(true)}
                    placeholder="Search by invoice number or customer…"
                    style={{ flex: 1, border: "none", outline: "none", fontSize: 13.5, color: "#374151", background: "transparent", fontFamily: "inherit" }}
                  />
                  {invSearch && (
                    <button onClick={() => { setInvSearch(""); setInvOpen(true); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                      <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 12 12"><path strokeLinecap="round" d="M1 1l10 10M11 1L1 11"/></svg>
                    </button>
                  )}
                </div>

                {/* Dropdown list */}
                {invOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.13)", zIndex: 10, overflow: "hidden", maxHeight: 280, overflowY: "auto" }}>
                    {filteredInvoices.length === 0 ? (
                      <div style={{ padding: "16px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>No invoices found</div>
                    ) : filteredInvoices.map(inv => {
                      const bal = inv.total - inv.paid;
                      const isSelected = form.invoiceNumber === inv.number;
                      return (
                        <div key={inv.number} onClick={() => { selectInvoice(inv); setInvoiceLocked(true); }}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer", background: isSelected ? "#fef2f0" : "transparent", borderBottom: "1px solid #f9fafb" }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: isSelected ? "#e8472a" : "#1a1f36" }}>{inv.number}</span>
                              {isSelected && <svg width={13} height={13} fill="none" stroke="#e8472a" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                            </div>
                            <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.customer}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Outstanding</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: bal > 0 ? "#dc2626" : "#16a34a" }}>{fmt(bal)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* IRN preview — shown when invoice selected */}
          {selectedInv && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={13} height={13} fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>FIRS IRN</div>
                <span style={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 700, color: "#1a1f36" }}>{selectedInv.irn}</span>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Payment Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inp} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "#374151" }}>
                <span>Amount (₦) <span style={{ color: "#e8472a" }}>*</span></span>
                {outstanding > 0 && <span style={{ fontSize: 11.5, fontWeight: 500, color: "#9ca3af", cursor: "pointer" }}
                  onClick={() => set("amount", String(outstanding))}>Use outstanding</span>}
              </label>
              <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" style={{ ...inp, textAlign: "right" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Payment Method <span style={{ color: "#e8472a" }}>*</span></label>
            <CustomSelect value={form.method} onChange={v => set("method", v)} options={["Bank Transfer", "POS", "Cash", "Cheque", "USSD"]} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Reference / Transaction ID</label>
            <input value={form.reference} onChange={e => set("reference", e.target.value)} placeholder="e.g. TRF/2026/0012345" style={inp} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Optional notes about this payment…" style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => canSave && onSave(form)} disabled={!canSave}
            style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: canSave ? "#e8472a" : "#f0b4a8", fontSize: 14, fontWeight: 700, color: "#fff", cursor: canSave ? "pointer" : "not-allowed", boxShadow: canSave ? "0 2px 8px rgba(232,71,42,.3)" : "none" }}>
            Record &amp; Generate Receipt
          </button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FetchCollections({ navigate, prefilledInvoice = null }) {
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [search, setSearch]           = useState("");
  const [receipt, setReceipt]         = useState(null);
  const [recording, setRecording]     = useState(!!prefilledInvoice); // auto-open if coming from invoice

  const filtered = collections.filter(c =>
    c.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.customer.toLowerCase().includes(search.toLowerCase()) ||
    (c.reference || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRecord = form => {
    const inv = {
      "INV-2026-001": "INV2026001-K4TR82NP-20260105",
      "INV-2026-002": "INV2026002-A9QZ55BX-20260112",
      "INV-2026-003": "INV2026003-M7WC19DL-20260118",
      "INV-2026-004": "INV2026004-H2YF73RK-20260201",
      "INV-2026-006": "INV2026006-T6NB44JU-20260214",
    };
    const newEntry = {
      id: Date.now(),
      receiptNumber: `RCP-2026-00${collections.length + 1}`,
      invoiceNumber: form.invoiceNumber,
      irn: inv[form.invoiceNumber] || "",
      customer: form.customer,
      date: new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: parseFloat(form.amount) || 0,
      method: form.method,
      reference: form.reference,
      notes: form.notes,
      status: "Confirmed",
    };
    setCollections(p => [newEntry, ...p]);
    setRecording(false);
    setReceipt(newEntry);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`*, *::before, *::after{box-sizing:border-box;margin:0;padding:0}html,body,#root{width:100%;min-height:100vh}`}</style>

      <Sidebar activePage="collections" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Sales</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Collections</span>
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
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", marginBottom: 5, letterSpacing: -0.3 }}>Collections</h1>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Track payments received and manage receipts.</p>
            </div>
            <button onClick={() => setRecording(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "#e8472a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(232,71,42,.35)", whiteSpace: "nowrap" }}>
              + Record Payment
            </button>
          </div>

          <SummaryCards collections={collections} />

          <FilterBar
            search={search}
            onSearch={setSearch}
            onRefresh={() => setSearch("")}
            placeholder="Search by receipt, invoice, customer or reference…"
            filters={[
              { type: "select", placeholder: "Method",   options: ["Bank Transfer", "POS", "Cash", "Cheque", "USSD"] },
              { type: "select", placeholder: "Status",   options: ["Confirmed", "Pending", "Reversed"] },
              { type: "date" },
            ]}
          />

          <DataTable
            columns={[
              { key: "receiptNumber", label: "Receipt #",  width: "150px", render: v => <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#e8472a" }}>{v}</span> },
              { key: "invoiceNumber", label: "Invoice #",  width: "140px", render: v => <span style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>{v}</span> },
              { key: "customer",      label: "Customer",   width: "1.4fr", render: v => <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{v}</span> },
              { key: "date",          label: "Date",       width: "120px", muted: true },
              { key: "method",        label: "Method",     width: "140px", render: v => <MethodBadge method={v} /> },
              { key: "amount",        label: "Amount",     width: "130px", render: v => <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36" }}>{fmt(v)}</span> },
              { key: "status",        label: "Status",     width: "120px", render: v => <StatusBadge status={v} /> },
              { key: "__action",      label: "Action",     width: "60px" },
            ]}
            rows={filtered}
            rowActions={[
              { label: "View Receipt",     action: row => setReceipt(row) },
              { label: "Download PDF",     action: row => { setReceipt(row); } },
              { label: "Mark as Reversed", action: row => setCollections(p => p.map(c => c.id === row.id ? { ...c, status: "Reversed" } : c)), hidden: row => row.status === "Reversed", danger: true },
            ]}
            rowStyle={row => row.status === "Reversed" ? { background: "#fff9f9", opacity: 0.75 } : {}}
            emptyTitle="No payments recorded"
            emptySubtitle="Record your first payment to generate a receipt."
            onClearFilter={() => setSearch("")}
            itemLabel="payments"
            pageSize={10}
          />
        </main>
      </div>

      {receipt && (
        <ReceiptPanel
          entry={receipt}
          allEntries={collections}
          onClose={() => setReceipt(null)}
        />
      )}

      {recording && (
        <RecordPaymentDrawer
          collections={collections}
          onClose={() => setRecording(false)}
          onSave={handleRecord}
          prefilledInvoice={prefilledInvoice}
        />
      )}
    </div>
  );
}
