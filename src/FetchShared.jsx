import { useState } from "react";

// ─── SHARED ICONS ─────────────────────────────────────────────────────────────
export const Ico = {
  search:    <svg width={15} height={15} fill="none" stroke="#9ca3af" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>,
  chevron:   <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M19 9l-7 7-7-7"/></svg>,
  chevLeft:  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 19l-7-7 7-7"/></svg>,
  chevRight: <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5l7 7-7 7"/></svg>,
  refresh:   <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  export:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/></svg>,
  dots:      <svg width={16} height={16} fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  emptyDoc:  <svg width={40} height={40} fill="none" stroke="#d1d5db" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  bell:      <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  close:     <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  box:       <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>,
};

// ─── SHARED TOGGLE ────────────────────────────────────────────────────────────
export function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{ width: 38, height: 22, borderRadius: 11, background: on ? "#e8472a" : "#d1d5db", position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </div>
  );
}

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
/**
 * Props:
 *  search       – string
 *  onSearch     – fn(value)
 *  onRefresh    – fn()
 *  filters      – array of { type: "date"|"select", placeholder, options? }
 *  showExport   – bool (default true)
 */
export function FilterBar({ search, onSearch, onRefresh, filters = [], showExport = true, placeholder = "Search..." }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      background: "#fff", border: "1px solid #e4e6ea", borderRadius: 10,
      padding: "0 16px", marginBottom: 16, minHeight: 52, gap: 0,
    }}>
      {/* Search — takes all remaining space, no border of its own */}
      <div style={{ position: "relative", flex: 1 }}>
        <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}>{Ico.search}</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", padding: "14px 12px 14px 24px", border: "none", fontSize: 13.5, color: "#374151", outline: "none", background: "transparent", fontFamily: "inherit" }}
        />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#e4e6ea", flexShrink: 0, margin: "0 4px" }} />

      {/* Dynamic filters */}
      {filters.map((f, i) => {
        if (f.type === "date") return (
          <input
            key={i} type="date"
            style={{ padding: "0 12px", border: "none", height: 52, fontSize: 13, color: "#9ca3af", outline: "none", background: "transparent", fontFamily: "inherit", cursor: "pointer", flexShrink: 0 }}
          />
        );
        if (f.type === "select") return (
          <div key={i} style={{ position: "relative", flexShrink: 0 }}>
            <select style={{ padding: "0 28px 0 12px", border: "none", height: 52, fontSize: 13, color: "#6b7280", outline: "none", appearance: "none", background: "transparent", fontFamily: "inherit", cursor: "pointer" }}>
              <option>{f.placeholder}</option>
              {(f.options || []).map(o => <option key={o}>{o}</option>)}
            </select>
            <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>{Ico.chevron}</span>
          </div>
        );
        return null;
      })}

      {/* Refresh */}
      <button
        onClick={onRefresh}
        title="Refresh"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: "none", borderRadius: 6, background: "transparent", cursor: "pointer", color: "#9ca3af", flexShrink: 0, marginLeft: 4 }}
        onMouseEnter={e => e.currentTarget.style.color = "#374151"}
        onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
      >
        {Ico.refresh}
      </button>

      {/* Export */}
      {showExport && (
        <button
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid #e4e6ea", borderRadius: 7, background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", flexShrink: 0, marginLeft: 6 }}
          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
        >
          {Ico.export}&nbsp;Export
        </button>
      )}
    </div>
  );
}

// ─── DATA TABLE ───────────────────────────────────────────────────────────────
/**
 * Props:
 *  columns       – array of { key, label, width?, render? }
 *  rows          – array of data objects
 *  rowActions    – array of { label, action(row), danger? }
 *  emptyTitle    – string  (default "No records found")
 *  emptySubtitle – string
 *  onClearFilter – fn() shown as red link in empty state
 *  itemLabel     – string (default "records") for footer count
 *  pageSize      – number (default 10)
 */
export function DataTable({
  columns = [],
  rows = [],
  rowActions = [],
  emptyTitle = "No records found",
  emptySubtitle = "Try adjusting your filters or add a new entry to get started.",
  onClearFilter,
  itemLabel = "records",
  pageSize = 10,
}) {
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paginated = rows.slice((page - 1) * pageSize, page * pageSize);

  // Build gridTemplateColumns from column widths
  const gridCols = columns.map(c => c.width || "1fr").join(" ");

  return (
    <div
      onClick={() => setOpenMenu(null)}
      style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e6ea", overflow: "hidden", display: "flex", flexDirection: "column", flex: 1 }}
    >
      {/* ── HEAD ── */}
      <div style={{ display: "grid", gridTemplateColumns: gridCols, padding: "12px 24px", borderBottom: "1px solid #f0f0f0" }}>
        {columns.map(col => (
          <div key={col.key} style={{ fontSize: 11, fontWeight: 700, color: "#b0b7c3", letterSpacing: 0.7, textTransform: "uppercase" }}>
            {col.label}
          </div>
        ))}
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1 }}>
        {paginated.length === 0 ? (
          // Empty state
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 20px", gap: 12 }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {Ico.emptyDoc}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1f36", marginTop: 4 }}>{emptyTitle}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", maxWidth: 270, lineHeight: 1.6 }}>{emptySubtitle}</div>
            {onClearFilter && (
              <button onClick={onClearFilter} style={{ fontSize: 13, fontWeight: 600, color: "#e8472a", background: "none", border: "none", cursor: "pointer", marginTop: 2 }}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          paginated.map((row, idx) => (
            <div
              key={row.id ?? idx}
              style={{ display: "grid", gridTemplateColumns: gridCols, padding: "14px 24px", borderBottom: idx < paginated.length - 1 ? "1px solid #f5f5f7" : "none", alignItems: "center", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {columns.map(col => {
                // Last column is action menu
                if (col.key === "__action") {
                  return (
                    <div key="__action" style={{ position: "relative" }} onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === (row.id ?? idx) ? null : (row.id ?? idx)); }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>
                        {Ico.dots}
                      </button>
                      {openMenu === (row.id ?? idx) && rowActions.length > 0 && (
                        <div style={{ position: "absolute", right: 0, top: 28, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 10, minWidth: 130, overflow: "hidden" }}>
                          {rowActions.map(m => (
                            <button
                              key={m.label}
                              onClick={() => { m.action(row); setOpenMenu(null); }}
                              style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", fontSize: 13, fontWeight: 500, color: m.danger ? "#e8472a" : "#374151", cursor: "pointer" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                              onMouseLeave={e => e.currentTarget.style.background = "none"}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                // Custom render or default
                return (
                  <div key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (
                      <span style={{ fontSize: 13.5, color: col.muted ? "#9ca3af" : "#374151", fontWeight: col.bold ? 600 : 400 }}>
                        {row[col.key] ?? "—"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12.5, color: "#9ca3af" }}>
          Showing {rows.length === 0 ? 0 : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, rows.length)}`} of {rows.length} {itemLabel}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ width: 28, height: 28, border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#d1d5db" : "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {Ico.chevLeft}
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ width: 28, height: 28, border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "#d1d5db" : "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {Ico.chevRight}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED SIDEBAR ───────────────────────────────────────────────────────────
/**
 * Props:
 *  activePage  – "products" | "billing" | etc.
 *  navigate    – fn(page)
 */

const NAV_ICONS = {
  dashboard:   <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  sales:       <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  customers:   <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  invoice:     <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  products:    <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>,
  tickets:     <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>,
  payments:    <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M2 10h20"/></svg>,
  settings:    <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  subscription:<svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
  logout:      <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  chevDown:    <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M19 9l-7 7-7-7"/></svg>,
};

const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard",          icon: "dashboard", page: null       },
      { label: "Sales",              icon: "sales",     page: null       },
      { label: "Customers",          icon: "customers", page: null       },
      { label: "Verify Invoice",     icon: "invoice",   page: null       },
    ],
  },
  {
    label: "CATALOGUE",
    items: [
      { label: "Product & Services", icon: "products",  page: "products" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { label: "Tickets",            icon: "tickets",   page: null       },
      { label: "Payments",           icon: "payments",  page: null       },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        label: "Settings", icon: "settings", page: null,
        children: [
          { label: "Subscription",   icon: "subscription", page: "billing" },
        ],
      },
    ],
  },
];

function NavItem({ item, activePage, navigate, depth = 0 }) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive    = item.page === activePage;
  const childActive = hasChildren && item.children.some(c => c.page === activePage);
  const [open, setOpen] = useState(childActive);

  const handleClick = (e) => {
    e.preventDefault();
    if (hasChildren) { setOpen(o => !o); return; }
    if (item.page && navigate) navigate(item.page);
  };

  return (
    <>
      <a
        href="#"
        onClick={handleClick}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 10, padding: depth > 0 ? "8px 10px 8px 36px" : "9px 10px",
          borderRadius: 8, fontSize: 13.5, textDecoration: "none",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#e8472a" : "#5a6272",
          background: isActive ? "#fef2f0" : "transparent",
          borderLeft: isActive ? "3px solid #e8472a" : "3px solid transparent",
          marginBottom: 1, transition: "all .15s", cursor: "pointer",
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#f5f6f8"; e.currentTarget.style.color = "#1a1f36"; }}}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a6272"; }}}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: isActive ? "#e8472a" : "#9ca3af", display: "flex", flexShrink: 0 }}>
            {NAV_ICONS[item.icon]}
          </span>
          {item.label}
        </span>
        {hasChildren && (
          <span style={{ color: "#9ca3af", display: "flex", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>
            {NAV_ICONS.chevDown}
          </span>
        )}
      </a>

      {/* Sub-items */}
      {hasChildren && open && (
        <div style={{ overflow: "hidden" }}>
          {item.children.map(child => (
            <NavItem key={child.label} item={child} activePage={activePage} navigate={navigate} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  );
}

export function Sidebar({ activePage, navigate }) {
  return (
    <aside style={{ width: 224, flexShrink: 0, background: "#fff", borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column", padding: "0 10px 20px", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>

      {/* Logo */}
      <div style={{ padding: "18px 8px 16px", borderBottom: "1px solid #f0f0f0", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, background: "#e8472a", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1f36", lineHeight: 1.1, letterSpacing: -0.3 }}>FETCH<sup style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0 }}>TM</sup></div>
            <div style={{ fontSize: 9.5, color: "#9ca3af", marginTop: 2 }}>Let's File Smarter, Together</div>
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#c0c6d4", letterSpacing: 1, padding: "6px 10px 4px", textTransform: "uppercase" }}>
              {section.label}
            </div>
            {section.items.map(item => (
              <NavItem key={item.label} item={item} activePage={activePage} navigate={navigate} />
            ))}
            {si < NAV_SECTIONS.length - 1 && (
              <div style={{ height: 1, background: "#f0f2f5", margin: "8px 4px 0" }} />
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ borderTop: "1px solid #f0f2f5", paddingTop: 10, marginTop: 4 }}>
        <a href="#" onClick={e => e.preventDefault()}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, fontSize: 13.5, textDecoration: "none", color: "#e8472a", fontWeight: 500, borderLeft: "3px solid transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ color: "#e8472a", display: "flex" }}>{NAV_ICONS.logout}</span>
          Logout
        </a>
      </div>
    </aside>
  );
}

// ─── CUSTOM SELECT ────────────────────────────────────────────────────────────
// options = [{ value, label }] or plain strings
// searchable = true adds a search input at the top
export function CustomSelect({ label, value, onChange, options, searchable = false, placeholder = "Select..." }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");

  const normalised = options.map(o => typeof o === "string" ? { value: o, label: o } : o);
  const filtered   = searchable
    ? normalised.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : normalised;
  const selected = normalised.find(o => o.value === value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, position: "relative" }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}

      <div onClick={() => { setOpen(o => !o); setQuery(""); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: selected ? "#1a1f36" : "#9ca3af", background: "#fff", cursor: "pointer", userSelect: "none" }}>
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s", flexShrink: 0 }}>{Ico.chevron}</span>
      </div>

      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 300, overflow: "hidden" }}>
          {searchable && (
            <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}>{Ico.search}</span>
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..."
                  style={{ width: "100%", padding: "7px 10px 7px 28px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
              </div>
            </div>
          )}
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 && <div style={{ padding: "12px 14px", fontSize: 13, color: "#9ca3af", textAlign: "center" }}>No results found</div>}
            {filtered.map(opt => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); setQuery(""); }}
                style={{ padding: "10px 14px", fontSize: 13.5, color: opt.value === value ? "#e8472a" : "#374151", fontWeight: opt.value === value ? 600 : 400, background: opt.value === value ? "#fef2f0" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = "transparent"; }}>
                {opt.value === value && <svg width={13} height={13} fill="none" stroke="#e8472a" strokeWidth={2.5} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
