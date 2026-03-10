import { useState, useRef, useEffect } from "react";
import { DataTable, FilterBar, CustomSelect, SingleDatePicker, Ico, Sidebar } from "./FetchShared";


const APP_TICKET_CATEGORIES = ["Bug Report", "Billing & Subscription", "FIRS / Compliance", "Feature Request", "Account & Access", "Data & Export", "Other"];
const APP_TICKET_PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const inp = () => ({ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#1a1f36", outline: "none", fontFamily: "inherit", boxSizing: "border-box" });

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

const INITIAL_APP_TICKETS = [
  {
    id: "A1", number: "SUP-2026-001",
    subject: "FIRS validation spinner never stops after network timeout",
    category: "Bug Report", priority: "High", status: "In Progress",
    openedDate: "Mar 4, 2026", lastUpdate: "Mar 8, 2026",
    description: "When submitting an invoice for FIRS validation and the network drops mid-request, the spinner on the Send Invoice button keeps spinning indefinitely. There is no timeout or error message shown. The user has to reload the page to recover.",
    thread: [
      { id: 1, author: "Jonathan", role: "user",   date: "Mar 4, 2026 · 9:11am",  message: "Reproduced this twice today. When I lose network during the FIRS submission, the button spins forever and I can't do anything without a full page refresh. No error shown at all." },
      { id: 2, author: "Fetch Support", role: "fetch", date: "Mar 5, 2026 · 10:00am", message: "Thanks for the detailed report! We've reproduced this on our end. This is a known gap — we don't currently have a request timeout handler on the FIRS submission call. We've logged it as a bug and it's assigned to our engineering team. Expected fix: next release (v2.3.1)." },
      { id: 3, author: "Jonathan", role: "user",   date: "Mar 7, 2026 · 2:30pm",  message: "Any update on the timeline? This is causing frustration for our team when working in areas with patchy internet." },
      { id: 4, author: "Fetch Support", role: "fetch", date: "Mar 8, 2026 · 9:00am", message: "The fix is currently in QA. We've added a 30-second timeout with a clear error message and retry button. Should be in production by end of this week." },
    ],
  },
  {
    id: "A2", number: "SUP-2026-002",
    subject: "Invoice PDF download missing IRN when generated immediately after validation",
    category: "Bug Report", priority: "Medium", status: "Open",
    openedDate: "Mar 6, 2026", lastUpdate: "Mar 6, 2026",
    description: "If you click the PDF button within a few seconds of a successful FIRS validation, the IRN section is blank in the generated PDF. If you wait ~10 seconds and then download, the IRN appears correctly. Seems like a race condition between state update and the PDF generation.",
    thread: [
      { id: 1, author: "Jonathan", role: "user", date: "Mar 6, 2026 · 11:40am", message: "Just noticed the PDF sometimes doesn't include the IRN. Happens if I download right after the invoice gets validated. Waiting a bit fixes it but it's inconsistent." },
    ],
  },
  {
    id: "A3", number: "SUP-2026-003",
    subject: "Request: Bulk invoice status export to CSV",
    category: "Feature Request", priority: "Low", status: "Under Review",
    openedDate: "Feb 20, 2026", lastUpdate: "Mar 1, 2026",
    description: "It would be very helpful to export all invoices with their FIRS IRN, status, customer, amount and due date to a CSV file in one click. We currently have to copy this data manually for our monthly reporting.",
    thread: [
      { id: 1, author: "Jonathan", role: "user", date: "Feb 20, 2026 · 3:00pm", message: "Our accountant asks for a monthly summary of all invoices. An export button on the Invoices page that downloads a CSV with IRN included would save us about 2 hours a month." },
      { id: 2, author: "Fetch Support", role: "fetch", date: "Mar 1, 2026 · 11:00am", message: "This is on our roadmap! We're currently scoping a full export feature for Q2 2026 that will cover invoices, collections, and products. We've added your vote to this request. We'll update this ticket once it enters development." },
    ],
  },
  {
    id: "A4", number: "SUP-2026-004",
    subject: "Billing: Charged twice for March subscription",
    category: "Billing & Subscription", priority: "Urgent", status: "Resolved",
    openedDate: "Mar 1, 2026", lastUpdate: "Mar 3, 2026",
    description: "Our card was charged ₦15,000 twice on March 1st for the monthly Growth plan subscription. Bank statement shows two identical debits from Fetch at 00:02 and 00:04. Please refund the duplicate charge.",
    thread: [
      { id: 1, author: "Jonathan", role: "user",  date: "Mar 1, 2026 · 8:00am",  message: "We were double-charged this month. Two debits of ₦15,000 each from Fetch on our statement for March 1st. Please refund the duplicate." },
      { id: 2, author: "Fetch Support", role: "fetch", date: "Mar 1, 2026 · 10:30am", message: "We're very sorry about this! We can see the duplicate charge on our end — this was caused by a retry logic issue in our billing system during a brief downtime window. We've initiated a full refund of ₦15,000. It should reflect within 3–5 business days." },
      { id: 3, author: "Jonathan", role: "user",  date: "Mar 3, 2026 · 9:00am",  message: "Refund received. Thank you for the quick resolution." },
      { id: 4, author: "Fetch Support", role: "fetch", date: "Mar 3, 2026 · 9:30am", message: "Glad to confirm! We've also applied a one-month credit to your account as an apology for the inconvenience. Closing this ticket now." },
    ],
  },
];

const APP_STATUS_CONFIG = {
  "Open":         { color: "#2563eb", bg: "#eff6ff",  border: "#bfdbfe" },
  "In Progress":  { color: "#b45309", bg: "#fffbeb",  border: "#fde68a" },
  "Under Review": { color: "#7c3aed", bg: "#f5f3ff",  border: "#ddd6fe" },
  "Resolved":     { color: "#16a34a", bg: "#f0fdf4",  border: "#bbf7d0" },
  "Closed":       { color: "#6b7280", bg: "#f4f5f7",  border: "#e5e7eb" },
};
const APP_STATUSES = ["Open", "In Progress", "Under Review", "Resolved", "Closed"];

const APP_CATEGORY_CONFIG = {
  "Bug Report":             { color: "#dc2626", bg: "#fef2f2" },
  "Billing & Subscription": { color: "#b45309", bg: "#fffbeb" },
  "FIRS / Compliance":      { color: "#7c3aed", bg: "#f5f3ff" },
  "Feature Request":        { color: "#2563eb", bg: "#eff6ff" },
  "Account & Access":       { color: "#0891b2", bg: "#ecfeff" },
  "Data & Export":          { color: "#16a34a", bg: "#f0fdf4" },
  "Other":                  { color: "#6b7280", bg: "#f4f5f7" },
};

function AppCategoryBadge({ category }) {
  const c = APP_CATEGORY_CONFIG[category] || { color: "#6b7280", bg: "#f4f5f7" };
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap" }}>{category}</span>;
}

function AppStatusBadge({ status }) {
  const c = APP_STATUS_CONFIG[status] || APP_STATUS_CONFIG["Open"];
  return <span style={{ fontSize: 11.5, fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: "2px 9px", whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── APP TICKET DETAIL DRAWER ─────────────────────────────────────────────────
function AppTicketDetail({ ticket, onClose, onUpdate }) {
  const [reply, setReply]   = useState("");
  const [sending, setSending] = useState(false);
  const [thread, setThread] = useState(ticket.thread);
  const [status, setStatus] = useState(ticket.status);
  const bottomRef           = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread]);

  const handleSend = () => {
    if (!reply.trim()) return;
    setSending(true);
    setTimeout(() => {
      setThread(t => [...t, { id: Date.now(), author: "Jonathan", role: "user", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), message: reply }]);
      setReply("");
      setSending(false);
    }, 500);
  };

  const sc = APP_STATUS_CONFIG[status] || APP_STATUS_CONFIG["Open"];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 600, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-4px 0 32px rgba(0,0,0,.12)" }}>

        {/* Header — Fetch branded */}
        <div style={{ background: "#1a1f36", padding: "18px 24px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#e8472a", background: "rgba(232,71,42,.15)", borderRadius: 4, padding: "2px 8px" }}>{ticket.number}</span>
                <AppCategoryBadge category={ticket.category} />
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: "#fff", lineHeight: 1.35 }}>{ticket.subject}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <AppStatusBadge status={status} />
                <span style={{ fontSize: 11.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>{Ico.clock} Opened {ticket.openedDate}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, flexShrink: 0 }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Thread */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "#f9fafb" }}>
          {/* Description */}
          <div style={{ padding: "14px 16px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Issue Description</div>
            <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65 }}>{ticket.description}</div>
          </div>

          {thread.map(msg => {
            const isFetch = msg.role === "fetch";
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: isFetch ? "flex-start" : "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isFetch && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#e8472a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", flexShrink: 0 }}>FT</div>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{msg.author}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{msg.date}</span>
                  {isFetch && <span style={{ fontSize: 10, fontWeight: 700, color: "#e8472a", background: "#fff5f5", borderRadius: 4, padding: "1px 6px" }}>FETCH SUPPORT</span>}
                  {!isFetch && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#1a1f36", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>JO</div>
                  )}
                </div>
                <div style={{
                  maxWidth: "85%", padding: "11px 14px",
                  borderRadius: isFetch ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                  background: isFetch ? "#fff" : "#1a1f36",
                  border: isFetch ? "1px solid #e5e7eb" : "none",
                  color: isFetch ? "#1a1f36" : "#fff",
                  fontSize: 13.5, lineHeight: 1.6,
                  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply — only if not closed/resolved */}
        {status !== "Closed" && status !== "Resolved" && (
          <div style={{ padding: "14px 24px", borderTop: "1px solid #e5e7eb", background: "#fff", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Reply to Fetch Support</div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleSend(); }}
                placeholder="Add more details, describe steps to reproduce, or follow up…"
                rows={3}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13.5, lineHeight: 1.55, resize: "none", outline: "none", fontFamily: "inherit", color: "#1a1f36" }}
              />
              <button onClick={handleSend} disabled={!reply.trim() || sending}
                style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: reply.trim() ? "#e8472a" : "#f0b4a8", color: "#fff", cursor: reply.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {sending
                  ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} style={{ animation: "spin 1s linear infinite" }}><path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  : Ico.send}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── NEW APP TICKET DRAWER ────────────────────────────────────────────────────
function NewAppTicketDrawer({ onClose, onSubmit }) {
  const [form, setForm] = useState({ subject: "", category: "", priority: "Medium", description: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.subject.trim() && form.category && form.description.trim();

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 540, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-4px 0 40px rgba(0,0,0,.14)" }}>

        {/* Header */}
        <div style={{ background: "#1a1f36", padding: "22px 28px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#e8472a", letterSpacing: -0.5 }}>FETCH</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", background: "rgba(255,255,255,.08)", borderRadius: 4, padding: "2px 8px" }}>SUPPORT</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Report an App Issue</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 4 }}>Our team typically responds within 4 business hours.</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* What kind of issue hint cards */}
          {!form.category && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>What best describes your issue?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { cat: "Bug Report",             icon: "🐛", desc: "Something isn't working" },
                  { cat: "Billing & Subscription", icon: "💳", desc: "Charges or plan issues" },
                  { cat: "FIRS / Compliance",       icon: "🏛️", desc: "e-invoicing or IRN issues" },
                  { cat: "Feature Request",         icon: "💡", desc: "Suggest an improvement" },
                  { cat: "Account & Access",        icon: "🔐", desc: "Login or permissions" },
                  { cat: "Data & Export",           icon: "📊", desc: "Reports or file exports" },
                ].map(({ cat, icon, desc }) => (
                  <button key={cat} onClick={() => set("category", cat)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fafafa", cursor: "pointer", textAlign: "left", transition: "all .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8472a"; e.currentTarget.style.background = "#fff8f7"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36" }}>{cat}</div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* After category selected */}
          {form.category && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
                <AppCategoryBadge category={form.category} />
                <button onClick={() => set("category", "")} style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>Change</button>
              </div>

              <Field label="Subject *">
                <input autoFocus value={form.subject} onChange={e => set("subject", e.target.value)}
                  placeholder={form.category === "Bug Report" ? "e.g. PDF download missing IRN after validation" : form.category === "Feature Request" ? "e.g. Bulk CSV export for invoices" : "Brief summary of your issue"}
                  style={inp()} />
              </Field>

              <Field label="Priority">
                <div style={{ display: "flex", gap: 8 }}>
                  {APP_TICKET_PRIORITIES.map(p => {
                    const colors = { Low: "#6b7280", Medium: "#b45309", High: "#dc2626", Urgent: "#7c3aed" };
                    const bgs    = { Low: "#f4f5f7", Medium: "#fffbeb", High: "#fef2f2", Urgent: "#f5f3ff" };
                    const active = form.priority === p;
                    return (
                      <button key={p} onClick={() => set("priority", p)}
                        style={{ flex: 1, padding: "8px 0", border: `2px solid ${active ? colors[p] : "#e5e7eb"}`, borderRadius: 8, background: active ? bgs[p] : "#fff", color: active ? colors[p] : "#9ca3af", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all .12s" }}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label={form.category === "Bug Report" ? "Steps to reproduce *" : "Describe your issue *"}>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  placeholder={form.category === "Bug Report"
                    ? "1. What were you doing?  2. What did you expect to happen?  3. What actually happened?  4. Does it happen every time?"
                    : "Please give as much detail as possible so we can help you quickly."}
                  rows={7}
                  style={{ ...inp(), resize: "vertical", lineHeight: 1.7 }}
                />
              </Field>

              {/* SLA note */}
              <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: 18 }}>
                  {form.priority === "Urgent" ? "🚨" : form.priority === "High" ? "⚡" : "📬"}
                </span>
                <div style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55 }}>
                  {form.priority === "Urgent"
                    ? <><strong style={{ color: "#7c3aed" }}>Urgent tickets</strong> are escalated immediately and reviewed within <strong>1 business hour</strong>.</>
                    : form.priority === "High"
                    ? <><strong style={{ color: "#dc2626" }}>High priority tickets</strong> are reviewed within <strong>2 business hours</strong>.</>
                    : <>Our team typically responds within <strong>4 business hours</strong> on business days.</>
                  }
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {form.category && (
          <div style={{ padding: "18px 28px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 12, flexShrink: 0 }}>
            <button onClick={onClose} style={{ padding: "11px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
            <button onClick={() => valid && onSubmit(form)} disabled={!valid}
              style={{ flex: 1, padding: "11px", border: "none", borderRadius: 8, background: valid ? "#e8472a" : "#f0b4a8", fontSize: 14, fontWeight: 700, color: "#fff", cursor: valid ? "pointer" : "not-allowed", boxShadow: valid ? "0 2px 10px rgba(232,71,42,.3)" : "none" }}>
              Submit to Fetch Support
            </button>
          </div>
        )}
      </div>
    </>
  );
}

let nextAppId = 200;

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FetchTickets({ navigate }) {
  const [appTickets, setAppTickets]     = useState(INITIAL_APP_TICKETS);
  const [search, setSearch]             = useState("");
  const [creating, setCreating]         = useState(false);
  const [selected, setSelected]         = useState(null);

  const handleCreate = (form) => {
    const t = {
      id: `A${++nextAppId}`,
      number: `SUP-2026-${String(nextAppId).padStart(3, "0")}`,
      subject: form.subject,
      category: form.category,
      priority: form.priority,
      status: "Open",
      openedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      lastUpdate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      description: form.description,
      thread: [],
    };
    setAppTickets(ts => [t, ...ts]);
    setCreating(false);
  };

  const filtered = appTickets.filter(t =>
    !search ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.number.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const pc = { Low: "#9ca3af", Medium: "#f59e0b", High: "#ef4444", Urgent: "#7c3aed" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Sidebar activePage="tickets" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Support</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Tickets</span>
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

        <main style={{ flex: 1, padding: "28px 32px 32px", display: "flex", flexDirection: "column" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", letterSpacing: -0.3, margin: 0 }}>App Support</h1>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#e8472a", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 20, padding: "3px 10px" }}>Fetch Support Team</span>
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Report bugs, billing issues or feature requests directly to the Fetch team.</p>
            </div>
            <button onClick={() => setCreating(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "#1a1f36", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(26,31,54,.25)", whiteSpace: "nowrap" }}>
              + Report an Issue
            </button>
          </div>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Open",         value: appTickets.filter(t => t.status === "Open").length,        accent: "#2563eb", border: "#bfdbfe" },
              { label: "In Progress",  value: appTickets.filter(t => t.status === "In Progress").length, accent: "#b45309", border: "#fde68a" },
              { label: "Under Review", value: appTickets.filter(t => t.status === "Under Review").length,accent: "#7c3aed", border: "#ddd6fe" },
              { label: "Resolved",     value: appTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length, accent: "#16a34a", border: "#bbf7d0" },
            ].map(c => (
              <div key={c.label} style={{ background: "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "18px 20px", borderLeft: `4px solid ${c.accent}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.4 }}>{c.label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: c.accent, lineHeight: 1 }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <svg width={15} height={15} fill="none" stroke="#9ca3af" strokeWidth={2} viewBox="0 0 24 24" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by ticket #, subject or category…"
              style={{ width: "100%", padding: "10px 14px 10px 38px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#1a1f36", outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }} />
          </div>

          {/* Ticket list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(t => (
              <button key={t.id} onClick={() => setSelected(t)}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#fff", border: `1px solid ${t.priority === "Urgent" ? "#c4b5fd" : "#e5e7eb"}`, borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all .12s", borderLeft: `4px solid ${pc[t.priority] || "#e5e7eb"}`, opacity: t.status === "Resolved" || t.status === "Closed" ? 0.7 : 1 }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.07)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, fontFamily: "monospace", fontWeight: 700, color: "#e8472a" }}>{t.number}</span>
                    <AppCategoryBadge category={t.category} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: pc[t.priority], background: t.priority === "Urgent" ? "#f5f3ff" : "transparent", borderRadius: 4, padding: t.priority === "Urgent" ? "1px 6px" : 0 }}>{t.priority === "Urgent" ? "🚨 Urgent" : t.priority}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1f36", marginBottom: 5, lineHeight: 1.35 }}>{t.subject}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
                    {Ico.clock} {t.openedDate}
                    <span>·</span>
                    <span>{t.thread.length} {t.thread.length === 1 ? "message" : "messages"}</span>
                    {t.lastUpdate !== t.openedDate && <><span>·</span><span>Updated {t.lastUpdate}</span></>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <AppStatusBadge status={t.status} />
                  <svg width={16} height={16} fill="none" stroke="#d1d5db" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{search ? "🔍" : "🎉"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                  {search ? "No tickets match your search" : "No issues reported yet"}
                </div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>
                  {search ? "Try a different search term." : "Everything is running smoothly. Click 'Report an Issue' if something comes up."}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {creating && <NewAppTicketDrawer onClose={() => setCreating(false)} onSubmit={handleCreate} />}
      {selected && (
        <AppTicketDetail
          key={selected.id}
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, patch) => {
            setAppTickets(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
            setSelected(s => s?.id === id ? { ...s, ...patch } : s);
          }}
        />
      )}
    </div>
  );
}
