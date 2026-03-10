import { useState } from "react";
import { Ico, Sidebar } from "./FetchShared";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const ERP_GUIDES = [
  { id: "sap",        name: "SAP S/4HANA",           logo: "S",    logoColor: "#0070f3", logoBg: "#e8f4ff",
    steps: ["In SAP BTP, go to Connectivity → Destinations and create a new HTTP Destination.", "Set the URL to your FETCH Webhook URL and authentication to NoAuthentication.", "Add a header: X-Fetch-API-Key with your FETCH API Key as the value.", "Create a Business Event Handler on Invoice posting (accounting document type RE/RV) to trigger the destination.", "Use the FETCH field mapping reference to configure the outbound payload structure.", "Use the Test Connection tool below to fire a sandbox invoice and confirm the IRN is returned."] },
  { id: "odoo",       name: "Odoo",                   logo: "O",    logoColor: "#714b67", logoBg: "#f3eef6",
    steps: ["Install the FETCH E-Invoicing module from the Odoo App Store (search: FETCH Nigeria).", "Go to Accounting → Configuration → FETCH Settings.", "Paste your FETCH Webhook URL and API Key into the respective fields.", "Enable Real-time Stamping to trigger transmission on invoice confirmation.", "Map your Odoo invoice fields to FIRS fields using the field mapping reference below.", "Confirm an invoice in sandbox mode and verify the IRN appears on the invoice record."] },
  { id: "sage",       name: "Sage 300",               logo: "SG",   logoColor: "#00a651", logoBg: "#e6f7ed",
    steps: ["In Sage 300, open System Manager → Transaction Management → Webhooks.", "Create a new webhook pointing to your FETCH Webhook URL.", "Set the trigger to: Accounts Receivable → Invoice → Post.", "Add a custom header: X-Fetch-API-Key with your FETCH API Key.", "Configure the payload using the FETCH field mapping reference.", "Post a test invoice in sandbox mode and confirm the FETCH Test Connection tool returns a valid IRN."] },
  { id: "quickbooks", name: "QuickBooks Online",      logo: "QB",   logoColor: "#2ca01c", logoBg: "#eaf6e9",
    steps: ["Log in to the Intuit Developer Portal and open your app's Webhooks settings.", "Add your FETCH Webhook URL as a new webhook endpoint.", "Select the Invoice entity and subscribe to Created and Updated events.", "In your webhook handler, include the X-Fetch-API-Key header on all forwarded payloads.", "Use the field mapping reference to ensure the QBO payload structure matches FIRS requirements.", "Create a test invoice in QuickBooks sandbox and verify the IRN via the Test Connection tool."] },
  { id: "netsuite",   name: "Oracle NetSuite",        logo: "NS",   logoColor: "#c74634", logoBg: "#fdecea",
    steps: ["In NetSuite, go to Customisation → Workflow → New Workflow.", "Set the trigger to: Invoice → After Record Submit.", "Add an HTTP POST action pointing to your FETCH Webhook URL.", "Set the request header X-Fetch-API-Key to your FETCH API Key.", "Format the outbound JSON using the FETCH field mapping reference.", "Submit a test invoice and verify the IRN is stored back on the NetSuite invoice record via the Test Connection tool."] },
  { id: "dynamics",   name: "Microsoft Dynamics 365", logo: "D365", logoColor: "#0078d4", logoBg: "#e8f3fd",
    steps: ["Open Power Automate and create a new automated flow.", "Set the trigger to: When a record is created or updated (Dynamics 365 — Invoice).", "Add a condition: Invoice Status equals Posted.", "Add an HTTP POST action pointing to your FETCH Webhook URL.", "Include X-Fetch-API-Key in the HTTP request headers.", "Use the field mapping reference to build the request body, then run the Test Connection tool to confirm end-to-end stamping."] },
  { id: "tally",      name: "Tally Prime",            logo: "T",    logoColor: "#f57c00", logoBg: "#fff3e0",
    steps: ["Download the FETCH TDL script from your integration credentials section below.", "Copy the TDL file to your Tally Prime TDL folder.", "In Tally, go to F12: Configure → TDL Management and load the FETCH TDL.", "The script will auto-POST confirmed sales invoices to your FETCH Webhook URL using your API Key.", "Confirm the API Key embedded in the TDL matches the key shown in your credentials.", "Post a test entry and confirm the IRN appears on the invoice using the Test Connection tool."] },
  { id: "custom",     name: "Custom / REST API",      logo: "</>",  logoColor: "#6b7280", logoBg: "#f4f5f7",
    steps: ["From your application, send a POST request to your FETCH Webhook URL.", "Include the header X-Fetch-API-Key: <your API key> on every request.", "The request body must be a JSON object. Refer to the field mapping reference for all required and optional fields.", "FETCH will validate, sign, and transmit the invoice to FIRS and return the IRN in the webhook response payload.", "Handle the response: on success, store the IRN against your invoice record. On failure, parse the FIRS error code.", "Use the Test Connection tool to send a sandbox payload and confirm your integration before going live."] },
];

const FIRS_FIELDS = [
  { key: "invoiceNumber",  label: "Invoice Number",        type: "string",  required: true,  example: "INV-2026-001",      note: "Your internal invoice reference"           },
  { key: "issueDate",      label: "Issue Date",            type: "date",    required: true,  example: "2026-03-10",        note: "ISO 8601 format: YYYY-MM-DD"               },
  { key: "invoiceAmount",  label: "Invoice Amount",        type: "number",  required: true,  example: "450000.00",         note: "Subtotal before tax, in Naira"             },
  { key: "taxAmount",      label: "Tax Amount (VAT)",      type: "number",  required: true,  example: "67500.00",          note: "7.5% VAT on taxable amount"               },
  { key: "totalAmount",    label: "Total Amount",          type: "number",  required: true,  example: "517500.00",         note: "invoiceAmount + taxAmount"                 },
  { key: "supplierTIN",    label: "Supplier TIN",          type: "string",  required: true,  example: "TIN-0034-2091",     note: "Must match your FIRS-registered TIN"       },
  { key: "supplierName",   label: "Supplier Name",         type: "string",  required: true,  example: "Dangote Industries","note": "Registered business name"               },
  { key: "buyerTIN",       label: "Buyer TIN",             type: "string",  required: false, example: "TIN-0099-1234",     note: "Required for B2B; optional for B2C"        },
  { key: "buyerName",      label: "Buyer Name",            type: "string",  required: false, example: "Nestle Nigeria PLC","note": "Buyer's registered business name"        },
  { key: "currency",       label: "Currency Code",         type: "string",  required: false, example: "NGN",               note: "ISO 4217. Defaults to NGN if omitted"      },
  { key: "lineItems",      label: "Line Items",            type: "array",   required: false, example: "[{...}]",           note: "Array of item objects. See API docs."      },
];

const TEST_RESULTS = [
  { step: "Payload received by FETCH",    ms: 42,  ok: true  },
  { step: "Field validation",             ms: 18,  ok: true  },
  { step: "CSID cryptographic signing",   ms: 31,  ok: true  },
  { step: "Submitted to FIRS MBS",        ms: 640, ok: true  },
  { step: "IRN issued by FIRS",           ms: 210, ok: true  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1f36" }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      style={{ padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 7, background: copied ? "#f0fdf4" : "#fff", fontSize: 12.5, fontWeight: 600, color: copied ? "#16a34a" : "#374151", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}>
      {copied ? "✓ Copied" : label}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — CONNECTION STATUS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    color: "#b45309", bg: "#fffbeb", border: "#fde68a",
    label: "Pending Setup", dot: "#f59e0b", pulse: false,
    cardBorder: "#fde68a", cardBg: "#fffbeb",
    stats: [
      { label: "Webhook",       value: "—",         accent: "#9ca3af", sub: "awaiting SI config"    },
      { label: "Fields Mapped", value: "—",         accent: "#9ca3af", sub: "not yet configured"    },
      { label: "Last Sync",     value: "—",         accent: "#9ca3af", sub: "no transmissions yet"  },
      { label: "FIRS Gateway",  value: "—",         accent: "#9ca3af", sub: "pending connection"    },
    ],
    alert: { bg: "#fffbeb", border: "#fde68a", color: "#92400e",
      icon: "⏳",
      message: "Your ERP has not transmitted any invoices yet. Share the Integration Credentials below with your SI or IT team to complete setup.",
      steps: ["Credentials Generated", "SI Configuring", "First Transmission"],
      activeStep: 1,
    },
    actions: null,
  },
  active: {
    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",
    label: "Connected & Live", dot: "#16a34a", pulse: true,
    cardBorder: "#e5e7eb", cardBg: "#fff",
    stats: [
      { label: "Webhook",       value: "Active",       accent: "#16a34a", sub: "inbound endpoint"      },
      { label: "Fields Mapped", value: "11/11",        accent: "#1a1f36", sub: "FIRS fields configured" },
      { label: "Last Sync",     value: "2 min ago",    accent: "#374151", sub: "invoice received"       },
      { label: "FIRS Gateway",  value: "Operational",  accent: "#16a34a", sub: "99.98% uptime today"    },
    ],
    alert: null,
    actions: null,
  },
  degraded: {
    color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    label: "Degraded", dot: "#f59e0b", pulse: false,
    cardBorder: "#fcd34d", cardBg: "#fff",
    stats: [
      { label: "Webhook",       value: "Active",       accent: "#16a34a", sub: "inbound endpoint"      },
      { label: "Fields Mapped", value: "11/11",        accent: "#1a1f36", sub: "FIRS fields configured" },
      { label: "Last Sync",     value: "4 hrs ago",    accent: "#d97706", sub: "delayed — check ERP"   },
      { label: "FIRS Gateway",  value: "Degraded",     accent: "#d97706", sub: "elevated error rate"   },
    ],
    alert: { bg: "#fffbeb", border: "#fcd34d", color: "#92400e",
      icon: "⚠️",
      message: "FIRS MBS is returning errors on some submissions. Last successful transmission was 4 hours ago. Invoices may be queued.",
      steps: null, activeStep: null,
    },
    actions: ["Get Support"],
  },
  disconnected: {
    color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    label: "Disconnected", dot: "#dc2626", pulse: false,
    cardBorder: "#fca5a5", cardBg: "#fff",
    stats: [
      { label: "Webhook",       value: "Inactive",     accent: "#dc2626", sub: "not responding"        },
      { label: "Fields Mapped", value: "11/11",        accent: "#9ca3af", sub: "last known config"      },
      { label: "Last Sync",     value: "2 days ago",   accent: "#dc2626", sub: "last successful"        },
      { label: "FIRS Gateway",  value: "Unreachable",  accent: "#dc2626", sub: "auth failure"           },
    ],
    alert: { bg: "#fef2f2", border: "#fecaca", color: "#991b1b",
      icon: "✕",
      message: "No invoices are being transmitted. Your webhook is not responding — this may be due to an expired API key or ERP misconfiguration. This affects FIRS compliance.",
      steps: null, activeStep: null,
    },
    actions: ["Reconnect", "Get Support"],
  },
};

const DEMO_STATUSES = [
  { key: "pending",      label: "Pending",      color: "#b45309" },
  { key: "active",       label: "Live",         color: "#16a34a" },
  { key: "degraded",     label: "Degraded",     color: "#d97706" },
  { key: "disconnected", label: "Disconnected", color: "#dc2626" },
];

function ConnectionStatus({ onSupport, erp }) {
  const [status, setStatus] = useState("active");
  const cfg  = STATUS_CONFIG[status];
  const conn = {
    erpName:       erp?.name       || "SAP S/4HANA",
    erpVendor:     erp?.vendor     || "SAP SE",
    logo:          erp?.logo       || "S",
    logoColor:     erp?.logoColor  || "#0070f3",
    logoBg:        erp?.logoBg     || "#e8f4ff",
    connectedSince: "Jan 12, 2026",
    instanceUrl:   erp?.instanceUrl || "https://dangote-prod.s4hana.cloud.sap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 14, border: `1.5px solid ${cfg.cardBorder}`, overflow: "hidden", background: "#fff", transition: "border-color .25s" }}>

      {/* Demo switcher */}
      <div style={{ padding: "8px 16px", background: "#1a1f36", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.6, marginRight: 4 }}>Demo</span>
        {DEMO_STATUSES.map(s => (
          <button key={s.key} onClick={() => setStatus(s.key)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${status === s.key ? s.color : "#374151"}`, background: status === s.key ? s.color + "22" : "transparent", fontSize: 11.5, fontWeight: 700, color: status === s.key ? s.color : "#6b7280", cursor: "pointer", transition: "all .15s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ERP identity row */}
      <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18, borderBottom: "1px solid #f0f0f0", background: cfg.cardBg, transition: "background .25s" }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: conn.logoBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: conn.logoColor, flexShrink: 0 }}>
          {conn.logo}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1f36" }}>{conn.erpName}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "2px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", animation: cfg.pulse ? "pulse 2s infinite" : "none" }} />
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {status !== "pending" && <><span>{conn.erpVendor}</span><span>·</span><span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{conn.instanceUrl}</span><span>·</span></>}
            <span>{status === "pending" ? "Credentials generated — awaiting SI setup" : `Since ${conn.connectedSince}`}</span>
          </div>
        </div>
        <button onClick={onSupport}
          style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
          Get Support
        </button>
      </div>

      {/* Alert strip */}
      {cfg.alert && (
        <div style={{ padding: "14px 24px", background: cfg.alert.bg, borderBottom: `1px solid ${cfg.alert.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{cfg.alert.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: cfg.alert.color, lineHeight: 1.6, marginBottom: cfg.alert.steps ? 12 : 0 }}>{cfg.alert.message}</div>
            {/* Setup progress steps for pending */}
            {cfg.alert.steps && (
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 4 }}>
                {cfg.alert.steps.map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800,
                        background: i < cfg.alert.activeStep ? "#16a34a" : i === cfg.alert.activeStep ? "#f59e0b" : "#e5e7eb",
                        color: i <= cfg.alert.activeStep ? "#fff" : "#9ca3af",
                      }}>
                        {i < cfg.alert.activeStep ? "✓" : i + 1}
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: i === cfg.alert.activeStep ? "#92400e" : i < cfg.alert.activeStep ? "#16a34a" : "#9ca3af", whiteSpace: "nowrap" }}>{step}</div>
                    </div>
                    {i < cfg.alert.steps.length - 1 && (
                      <div style={{ width: 40, height: 2, background: i < cfg.alert.activeStep ? "#16a34a" : "#e5e7eb", margin: "0 4px", marginBottom: 14, flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Action buttons for degraded/disconnected */}
          {cfg.actions && (
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {cfg.actions.map(action => (
                <button key={action} onClick={action === "Get Support" ? onSupport : undefined}
                  style={{ padding: "7px 16px", border: `1px solid ${action === "Reconnect" ? cfg.color : "#e5e7eb"}`, borderRadius: 8, background: action === "Reconnect" ? cfg.color : "#fff", fontSize: 12.5, fontWeight: 700, color: action === "Reconnect" ? "#fff" : "#374151", cursor: "pointer" }}>
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {cfg.stats.map((s, i) => (
          <div key={i} style={{ padding: "16px 20px", borderRight: i < 3 ? "1px solid #f0f0f0" : "none" }}>
            <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.accent, marginBottom: 3 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — INTEGRATION CREDENTIALS
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_KEY  = "fk_live_9aK2mX7pQrT4vLnBdWcYeJsU3hGzFo";
const WEBHOOK_URL  = "https://api.fetchnigeria.com/inbound/dangote-prod-x7k2";

function Credentials() {
  const [apiKey, setApiKey]           = useState(INITIAL_KEY);
  const [revealed, setRevealed]       = useState(false);
  const [confirmRegen, setConfirm]    = useState(false);
  const [regenDone, setRegenDone]     = useState(false);
  const [regenLoading, setLoading]    = useState(false);

  const maskedKey = apiKey.slice(0, 10) + "•".repeat(apiKey.length - 14) + apiKey.slice(-4);

  const handleRegen = () => {
    setLoading(true);
    setTimeout(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const newKey = "fk_live_" + Array.from({ length: 28 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      setApiKey(newKey);
      setLoading(false);
      setConfirm(false);
      setRevealed(false);
      setRegenDone(true);
      setTimeout(() => setRegenDone(false), 6000);
    }, 1400);
  };

  return (
    <Card>
      <div style={{ padding: "20px 24px 0" }}>
        <SectionHead
          title="Integration Credentials"
          sub="Share these with your SI (system integrator) or IT team to connect your ERP. Keep your API key private — it authorises invoice transmission on your behalf."
        />
      </div>

      <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Webhook URL */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Inbound Webhook URL</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, lineHeight: 1.6 }}>Your SI configures your ERP to POST approved invoices to this endpoint. FETCH receives them here and routes them to FIRS.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <code style={{ flex: 1, padding: "11px 14px", background: "#1a1f36", color: "#e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "monospace", overflowX: "auto", whiteSpace: "nowrap" }}>
              {WEBHOOK_URL}
            </code>
            <CopyButton value={WEBHOOK_URL} label="Copy URL" />
          </div>
        </div>

        <div style={{ height: 1, background: "#f0f0f0" }} />

        {/* API Key */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}>API Key</div>
            <div style={{ fontSize: 11.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Never share publicly or commit to source code
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, lineHeight: 1.6 }}>Your SI adds this as the <code style={{ background: "#f4f5f7", padding: "1px 5px", borderRadius: 4, fontSize: 11.5 }}>X-Fetch-API-Key</code> header in every request to your webhook URL.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <code style={{ flex: 1, padding: "11px 14px", background: "#1a1f36", color: "#e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "monospace", overflowX: "auto", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
              {revealed ? apiKey : maskedKey}
            </code>
            <button onClick={() => setRevealed(r => !r)}
              style={{ padding: "11px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              {revealed ? "Hide" : "Reveal"}
            </button>
            {revealed && <CopyButton value={apiKey} label="Copy Key" />}
          </div>
        </div>

        {/* Regen warning banner */}
        {regenDone && (
          <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, fontSize: 12.5, color: "#92400e", lineHeight: 1.65 }}>
            <strong>New API key generated.</strong> Your previous key has been permanently invalidated. Make sure your SI updates the <code style={{ background: "#fef3c7", padding: "1px 5px", borderRadius: 4 }}>X-Fetch-API-Key</code> header in your ERP configuration — invoice transmission will fail until they do.
          </div>
        )}

        {/* Regen confirm */}
        {confirmRegen ? (
          <div style={{ padding: "16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#991b1b", marginBottom: 6 }}>⚠️ Regenerate API key?</div>
            <div style={{ fontSize: 12.5, color: "#b91c1c", lineHeight: 1.65, marginBottom: 14 }}>
              Your current key will be <strong>immediately invalidated</strong>. All invoice transmissions from your ERP will fail until your SI updates the key in your ERP configuration. Only proceed if your current key has been compromised.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleRegen} disabled={regenLoading}
                style={{ padding: "9px 20px", background: "#dc2626", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: regenLoading ? "not-allowed" : "pointer", opacity: regenLoading ? 0.7 : 1 }}>
                {regenLoading ? "Regenerating…" : "Yes, regenerate key"}
              </button>
              <button onClick={() => setConfirm(false)}
                style={{ padding: "9px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)}
            style={{ alignSelf: "flex-start", padding: "8px 18px", background: "#fff", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: "#dc2626", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
            Regenerate API Key
          </button>
        )}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — FIELD MAPPING REFERENCE
// ─────────────────────────────────────────────────────────────────────────────

function FieldMapping() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? FIRS_FIELDS : FIRS_FIELDS.slice(0, 5);

  return (
    <Card>
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionHead
            title="Field Mapping Reference"
            sub="Your ERP payload must include these fields. Share this with your SI so they know exactly how to structure each invoice before sending it to FETCH."
          />
          <button
            style={{ padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer", flexShrink: 0, marginTop: 2 }}
            onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            Download JSON Schema
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.7fr 1.6fr", gap: 0, padding: "8px 24px", background: "#f9fafb", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        {["Field Key", "Type", "Required", "Notes & Example"].map(h => (
          <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</div>
        ))}
      </div>

      {visible.map((f, i) => (
        <div key={f.key} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.7fr 1.6fr", gap: 0, padding: "13px 24px", borderBottom: i < visible.length - 1 ? "1px solid #f9fafb" : "none", alignItems: "start" }}>
          <code style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: "#1a1f36" }}>{f.key}</code>
          <div style={{ fontSize: 12.5, color: "#6b7280", fontFamily: "monospace" }}>{f.type}</div>
          <div>
            {f.required
              ? <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", background: "#fef2f2", borderRadius: 4, padding: "2px 8px" }}>Required</span>
              : <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", background: "#f4f5f7", borderRadius: 4, padding: "2px 8px" }}>Optional</span>}
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#374151", marginBottom: 3 }}>{f.note}</div>
            <code style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>e.g. {f.example}</code>
          </div>
        </div>
      ))}

      {!expanded && (
        <div style={{ padding: "12px 24px", borderTop: "1px solid #f9fafb" }}>
          <button onClick={() => setExpanded(true)} style={{ background: "none", border: "none", color: "#e8472a", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}>
            Show {FIRS_FIELDS.length - 5} more fields ↓
          </button>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — ERP SETUP GUIDES
// ─────────────────────────────────────────────────────────────────────────────

function SetupGuides({ erp }) {
  const [selected, setSelected] = useState(erp?.id || "sap");
  const guide = ERP_GUIDES.find(g => g.id === selected);

  return (
    <Card>
      <div style={{ padding: "20px 24px 0" }}>
        <SectionHead
          title="ERP Setup Guides"
          sub="Step-by-step instructions for your SI or IT team to configure each supported ERP to send invoices to FETCH."
        />
      </div>

      <div style={{ padding: "0 24px 6px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ERP_GUIDES.map(g => (
          <button key={g.id} onClick={() => setSelected(g.id)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: `1px solid ${selected === g.id ? g.logoColor + "60" : "#e5e7eb"}`, background: selected === g.id ? g.logoBg : "#fafafa", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: selected === g.id ? g.logoColor : "#6b7280", transition: "all .12s" }}>
            <span style={{ fontWeight: 800, fontSize: 11, color: g.logoColor }}>{g.logo}</span>
            {g.name}
          </button>
        ))}
      </div>

      {guide && (
        <div style={{ margin: "16px 24px 24px", padding: "18px 20px", background: "#f9fafb", borderRadius: 12, border: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: guide.logoBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: guide.logoColor }}>
              {guide.logo}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1f36" }}>{guide.name} — Integration Steps</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {guide.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1a1f36", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, paddingTop: 2 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — TEST CONNECTION
// ─────────────────────────────────────────────────────────────────────────────

function TestConnection() {
  const [state, setState] = useState("idle"); // idle | running | success | fail
  const [progress, setProgress] = useState(0);

  const runTest = () => {
    setState("running");
    setProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(step);
      if (step >= TEST_RESULTS.length) {
        clearInterval(interval);
        setTimeout(() => setState("success"), 400);
      }
    }, 480);
  };

  const reset = () => { setState("idle"); setProgress(0); };

  const totalMs = TEST_RESULTS.reduce((s, r) => s + r.ms, 0);

  return (
    <Card>
      <div style={{ padding: "20px 24px" }}>
        <SectionHead
          title="Test Connection"
          sub="Fire a sandbox invoice through the full pipeline — FETCH validates, signs, and submits it to the FIRS sandbox — and confirms an IRN comes back. Use this after any ERP configuration change."
        />

        {state === "idle" && (
          <div style={{ padding: "32px", border: "2px dashed #e5e7eb", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧪</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Ready to test</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 22, lineHeight: 1.6 }}>Sends a test invoice through the full pipeline in sandbox mode. No real invoice is created and no FIRS record is generated.</div>
            <button onClick={runTest}
              style={{ padding: "11px 32px", background: "#1a1f36", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Run Test
            </button>
          </div>
        )}

        {(state === "running" || state === "success") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TEST_RESULTS.map((r, i) => {
              const done    = progress > i;
              const active  = progress === i && state === "running";
              const pending = progress < i;
              return (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? "#16a34a" : active ? "#b45309" : "#f0f0f0", border: `2px solid ${done ? "#16a34a" : active ? "#b45309" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: done ? "#fff" : active ? "#fff" : "#9ca3af", transition: "all .3s" }}>
                      {done ? "✓" : active ? "…" : i + 1}
                    </div>
                    {i < TEST_RESULTS.length - 1 && <div style={{ width: 2, height: 20, background: done ? "#bbf7d0" : "#f0f0f0", margin: "3px 0", transition: "background .3s" }} />}
                  </div>
                  <div style={{ paddingBottom: i < TEST_RESULTS.length - 1 ? 14 : 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: done ? "#1a1f36" : active ? "#374151" : "#9ca3af", transition: "color .3s" }}>{r.step}</div>
                    {done && <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{r.ms}ms</div>}
                    {active && <div style={{ fontSize: 11.5, color: "#b45309", marginTop: 2 }}>Running…</div>}
                  </div>
                </div>
              );
            })}

            {state === "success" && (
              <div style={{ marginTop: 20, padding: "16px 20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d", marginBottom: 6 }}>✅ All checks passed — {totalMs}ms end-to-end</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#16a34a", marginBottom: 12 }}>IRN-SANDBOX-TEST-2026-001</div>
                <button onClick={reset} style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 16px", cursor: "pointer" }}>Run again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function SupportModal({ onClose, navigate }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 440, background: "#fff", borderRadius: 16, zIndex: 201, boxShadow: "0 24px 64px rgba(0,0,0,.2)", overflow: "hidden" }}>
        <div style={{ background: "#1a1f36", padding: "22px 24px" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Contact FETCH Support</div>
          <div style={{ fontSize: 12.5, color: "#9ca3af" }}>Our team can help with ERP setup, FIRS rejections, and transmission issues.</div>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "🐛", title: "Report a connection issue",  sub: "Webhook failures, transmission gaps, sync errors"         },
            { icon: "🏛️", title: "FIRS rejection help",        sub: "IRN errors, TIN mismatches, clearance failures"            },
            { icon: "🔌", title: "Change my ERP setup",        sub: "Switch ERP, update instance URL, remap fields"             },
            { icon: "💬", title: "General enquiry",            sub: "Questions about your connection or transmission logs"       },
          ].map(item => (
            <button key={item.title} onClick={() => { onClose(); navigate("tickets"); }}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fafafa", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8472a"; e.currentTarget.style.background = "#fff8f7"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{item.sub}</div>
              </div>
              <svg width={14} height={14} fill="none" stroke="#d1d5db" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          ))}
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

const ERP_OPTIONS = [
  { id: "sap",        name: "SAP S/4HANA",           logo: "S",    logoColor: "#0070f3", logoBg: "#e8f4ff" },
  { id: "odoo",       name: "Odoo",                   logo: "O",    logoColor: "#714b67", logoBg: "#f3eef6" },
  { id: "sage",       name: "Sage 300",               logo: "SG",   logoColor: "#00a651", logoBg: "#e6f7ed" },
  { id: "quickbooks", name: "QuickBooks Online",      logo: "QB",   logoColor: "#2ca01c", logoBg: "#eaf6e9" },
  { id: "netsuite",   name: "Oracle NetSuite",        logo: "NS",   logoColor: "#c74634", logoBg: "#fdecea" },
  { id: "dynamics",   name: "Microsoft Dynamics 365", logo: "D365", logoColor: "#0078d4", logoBg: "#e8f3fd" },
  { id: "tally",      name: "Tally Prime",            logo: "T",    logoColor: "#f57c00", logoBg: "#fff3e0" },
  { id: "custom",     name: "Custom / REST API",      logo: "</>",  logoColor: "#6b7280", logoBg: "#f4f5f7" },
];

function NoErpState({ onConnect, navigate }) {
  const [selectedErp, setSelectedErp] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (erp) => {
    setSelectedErp(erp);
    setShowConfirm(false);
  };

  const handleConnect = () => {
    if (selectedErp) setShowConfirm(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Hero empty state */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {/* Illustration */}
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "#f4f5f7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width={36} height={36} fill="none" stroke="#9ca3af" strokeWidth={1.5} viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="8" rx="1.5"/>
            <rect x="13" y="3" width="8" height="8" rx="1.5"/>
            <rect x="3" y="13" width="8" height="8" rx="1.5"/>
            <rect x="13" y="13" width="8" height="8" rx="1.5"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1f36", margin: "0 0 10px", letterSpacing: -0.3 }}>No ERP Connected</h2>
        <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 480, margin: "0 0 8px", lineHeight: 1.7 }}>
          Connect your ERP or accounting system to start transmitting e-invoices to FIRS through FETCH.
          Your SI or IT team will use the integration credentials generated here to configure the connection.
        </p>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 32px" }}>
          No technical setup required on your end — just select your ERP and share the credentials below.
        </p>

        {/* Steps */}
        <div style={{ display: "flex", gap: 0, marginBottom: 36, width: "100%", maxWidth: 640 }}>
          {[
            { n: "1", label: "Select your ERP",          sub: "Choose from the list below" },
            { n: "2", label: "Share credentials",         sub: "Send to your SI or IT team" },
            { n: "3", label: "SI configures connection",  sub: "They handle the technical setup" },
            { n: "4", label: "Go live",                   sub: "Invoices transmit automatically" },
          ].map((step, i, arr) => (
            <div key={step.n} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "#e8472a" : "#f4f5f7", border: `2px solid ${i === 0 ? "#e8472a" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: i === 0 ? "#fff" : "#9ca3af" }}>{step.n}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: i === 0 ? "#1a1f36" : "#6b7280", textAlign: "center" }}>{step.label}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af", textAlign: "center", lineHeight: 1.4 }}>{step.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 24, height: 1.5, background: "#e5e7eb", flexShrink: 0, marginBottom: 28 }} />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={() => document.getElementById("erp-picker")?.scrollIntoView({ behavior: "smooth" })}
          style={{ padding: "12px 32px", background: "#e8472a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(232,71,42,.3)" }}>
          Get Started — Select Your ERP
        </button>
      </div>

      {/* ERP Picker */}
      <div id="erp-picker" style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1f36", marginBottom: 4 }}>Select Your ERP System</div>
          <div style={{ fontSize: 12.5, color: "#9ca3af" }}>Choose the system your business uses to manage invoices. Not sure? Select Custom / REST API.</div>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {ERP_OPTIONS.map(erp => (
            <button key={erp.id} onClick={() => handleSelect(erp)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "18px 12px", borderRadius: 12, border: `2px solid ${selectedErp?.id === erp.id ? "#e8472a" : "#e5e7eb"}`, background: selectedErp?.id === erp.id ? "#fef2f0" : "#fff", cursor: "pointer", transition: "all .15s", position: "relative" }}>
              {selectedErp?.id === erp.id && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: "#e8472a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={10} height={10} fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
              <div style={{ width: 44, height: 44, borderRadius: 10, background: erp.logoBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: erp.logoColor, letterSpacing: -0.5 }}>{erp.logo}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a1f36", textAlign: "center", lineHeight: 1.3 }}>{erp.name}</div>
            </button>
          ))}
        </div>

        {/* Confirm bar — slides in when an ERP is selected */}
        {selectedErp && (
          <div style={{ padding: "16px 24px", background: "#fef2f0", borderTop: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: selectedErp.logoBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: selectedErp.logoColor }}>{selectedErp.logo}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36" }}>{selectedErp.name} selected</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>FETCH will generate integration credentials for this ERP.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSelectedErp(null)}
                style={{ padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                Change
              </button>
              <button onClick={() => onConnect(selectedErp)}
                style={{ padding: "9px 22px", border: "none", borderRadius: 8, background: "#e8472a", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 1px 4px rgba(232,71,42,.3)" }}>
                Connect {selectedErp.name}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1f36", marginBottom: 4 }}>What happens after you connect?</div>
          <div style={{ fontSize: 12.5, color: "#9ca3af" }}>Once you select and confirm your ERP, FETCH will set up everything needed for your SI or IT team.</div>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { icon: "🔑", title: "Integration credentials generated",    desc: "A unique Webhook URL and API Key are created for your account and ERP." },
            { icon: "📋", title: "Field mapping reference unlocked",      desc: "A full FIRS field mapping guide specific to your ERP will be available for your SI." },
            { icon: "📖", title: "Step-by-step setup guide provided",     desc: "A detailed configuration guide tailored to your ERP for your SI or IT team." },
            { icon: "🧪", title: "Sandbox test connection enabled",       desc: "Your SI can fire test invoices and verify IRN generation before going live." },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", gap: 14, padding: "14px 16px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f0f0f0" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Need help */}
      <div style={{ padding: "14px 20px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <div style={{ fontSize: 13, color: "#1e40af" }}>
            <strong>Not sure where to start?</strong> Our team can walk your SI or IT through the setup process.
          </div>
        </div>
        <button onClick={() => navigate("tickets")}
          style={{ padding: "8px 18px", border: "none", borderRadius: 8, background: "#1d4ed8", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
          Talk to Support
        </button>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function FetchConnectors({ navigate }) {
  const [showSupport, setShowSupport] = useState(false);
  const [connectedErp, setConnectedErp] = useState(null);
  const isConnected = connectedErp !== null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
      `}</style>

      <Sidebar activePage="connectors" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>ERP Connection</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {isConnected ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 2s infinite" }} />
                FIRS Transmission Active
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#b45309" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                No ERP Connected
              </div>
            )}
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

        <main style={{ flex: 1, padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 22 }}>

          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", margin: "0 0 6px", letterSpacing: -0.3 }}>ERP Connection</h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Monitor your ERP connection health and share integration credentials with your SI or IT team to configure invoice transmission.</p>
          </div>

          {!isConnected ? (
            <NoErpState onConnect={(erp) => setConnectedErp(erp)} navigate={navigate} />
          ) : (
            <>
              <ConnectionStatus onSupport={() => setShowSupport(true)} erp={connectedErp} />
              <Credentials />
              <FieldMapping />
              <SetupGuides erp={connectedErp} />
              <TestConnection />
              <div style={{ padding: "13px 18px", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 10, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
                <div style={{ fontSize: 12.5, color: "#9ca3af", lineHeight: 1.65 }}>
                  <strong style={{ color: "#6b7280" }}>Network & compliance controls</strong> — including Access Point routing, FIRS MBS gateway management, Peppol network status, CSID infrastructure, and multi-client oversight — are available in the <strong style={{ color: "#6b7280" }}>FETCH Admin Dashboard</strong>.
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} navigate={navigate} />}
    </div>
  );
}
