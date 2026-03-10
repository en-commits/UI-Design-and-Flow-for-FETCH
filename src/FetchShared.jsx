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
  send:      <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  clock:     <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>,
  eye:       <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>,
  key:       <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  link:      <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  unlink:    <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/><line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round"/></svg>,
  info:      <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 16v-4M12 8h.01"/></svg>,
  check:     <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  star:      <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
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
// ─── DATE RANGE PICKER ───────────────────────────────────────────────────────
function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState("from"); // "from" | "to"
  const todayD = new Date();

  const initView = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : todayD;
    return { month: d.getMonth(), year: d.getFullYear() };
  };
  const [viewFrom, setViewFrom] = useState(() => initView(from));
  // "to" calendar always shows next month relative to from view
  const viewTo = viewFrom.month === 11
    ? { month: 0, year: viewFrom.year + 1 }
    : { month: viewFrom.month + 1, year: viewFrom.year };

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS   = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  const buildCells = (year, month) => {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset      = (firstDay + 6) % 7;
    const cells       = Array.from({ length: offset + daysInMonth }, (_, i) => i < offset ? null : i - offset + 1);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const toISO = (year, month, day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const handleDayClick = (year, month, day) => {
    if (!day) return;
    const iso = toISO(year, month, day);
    if (picking === "from") {
      onChange(iso, to && iso > to ? "" : to);
      setPicking("to");
    } else {
      if (from && iso < from) {
        onChange(iso, "");
        setPicking("to");
      } else {
        onChange(from, iso);
        setPicking("from");
        setOpen(false);
      }
    }
  };

  const dayState = (year, month, day) => {
    if (!day) return "empty";
    const iso = toISO(year, month, day);
    const isToday = iso === todayD.toISOString().split("T")[0];
    const isFrom  = iso === from;
    const isTo    = iso === to;
    const inRange = from && to && iso > from && iso < to;
    return { iso, isToday, isFrom, isTo, inRange };
  };

  const fmtDisp = iso => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const hasRange = from || to;
  const triggerLabel = hasRange
    ? `${fmtDisp(from) || "Start"} → ${fmtDisp(to) || "End"}`
    : "Date range";

  const CalMonth = ({ year, month, isRight }) => {
    const cells = buildCells(year, month);
    const prevM = () => setViewFrom(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year });
    const nextM = () => setViewFrom(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year });

    return (
      <div style={{ width: 210 }}>
        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          {!isRight ? (
            <button onClick={prevM} style={{ width: 26, height: 26, border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <svg width={13} height={13} fill="none" stroke="#6b7280" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
          ) : <div style={{ width: 26 }} />}
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36" }}>{MONTHS[month]} {year}</span>
          {isRight ? (
            <button onClick={nextM} style={{ width: 26, height: 26, border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <svg width={13} height={13} fill="none" stroke="#6b7280" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          ) : <div style={{ width: 26 }} />}
        </div>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 3 }}>
          {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "#b0b7c3" }}>{d}</div>)}
        </div>
        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px 0" }}>
          {cells.map((day, idx) => {
            const s = dayState(year, month, day);
            if (s === "empty") return <div key={idx} />;
            const { isFrom, isTo, inRange, isToday } = s;
            const isEndpoint = isFrom || isTo;
            return (
              <div key={idx} onClick={() => handleDayClick(year, month, day)}
                style={{
                  position: "relative", textAlign: "center", padding: "5px 0", fontSize: 12.5, cursor: "pointer", borderRadius: 0,
                  background: inRange ? "#fde8e4" : "transparent",
                  borderRadius: isFrom ? "6px 0 0 6px" : isTo ? "0 6px 6px 0" : inRange ? 0 : 6,
                }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 26, height: 26, borderRadius: 6,
                  background: isEndpoint ? "#e8472a" : "transparent",
                  color: isEndpoint ? "#fff" : isToday ? "#e8472a" : "#374151",
                  fontWeight: isEndpoint || isToday ? 700 : 400,
                  outline: isToday && !isEndpoint ? "1.5px solid #e8472a" : "none",
                  outlineOffset: "-1px",
                }}
                  onMouseEnter={e => { if (!isEndpoint) e.currentTarget.style.background = "#fef2f0"; }}
                  onMouseLeave={e => { if (!isEndpoint) e.currentTarget.style.background = "transparent"; }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
      {/* Trigger */}
      <div onClick={() => { setOpen(o => !o); setPicking("from"); }}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 52, cursor: "pointer", userSelect: "none" }}>
        <svg width={14} height={14} fill="none" stroke={hasRange ? "#1a1f36" : "#9ca3af"} strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
        <span style={{ fontSize: 13, fontWeight: hasRange ? 600 : 400, color: hasRange ? "#1a1f36" : "#6b7280", whiteSpace: "nowrap" }}>
          {triggerLabel}
        </span>
        {hasRange && (
          <span onClick={e => { e.stopPropagation(); onChange("", ""); setOpen(false); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", background: "#e5e7eb", cursor: "pointer", flexShrink: 0 }}>
            <svg width={8} height={8} fill="none" stroke="#6b7280" strokeWidth={2.5} viewBox="0 0 12 12"><path strokeLinecap="round" d="M1 1l10 10M11 1L1 11"/></svg>
          </span>
        )}
        <span style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>{Ico.chevron}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, left: "auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,.13)", zIndex: 400, padding: 14, width: 472 }}>
          {/* Picking hint */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, background: "#f4f5f7", borderRadius: 8, padding: 4 }}>
            {["from","to"].map(p => (
              <button key={p} onClick={() => setPicking(p)}
                style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                  background: picking === p ? "#e8472a" : "transparent",
                  color: picking === p ? "#fff" : "#9ca3af",
                  transition: "background .15s, color .15s" }}>
                {p === "from" ? `From: ${fmtDisp(from) || "—"}` : `To: ${fmtDisp(to) || "—"}`}
              </button>
            ))}
          </div>
          {/* Two calendars */}
          <div style={{ display: "flex", gap: 20 }}>
            <CalMonth year={viewFrom.year} month={viewFrom.month} isRight={false} />
            <div style={{ width: 1, background: "#f0f0f0" }} />
            <CalMonth year={viewTo.year} month={viewTo.month} isRight={true} />
          </div>
          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
            <button onClick={() => { onChange("", ""); setOpen(false); }}
              style={{ fontSize: 12.5, fontWeight: 600, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}
              onMouseEnter={e => e.currentTarget.style.background = "#f4f5f7"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              Clear
            </button>
            {from && to && (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {fmtDisp(from)} → {fmtDisp(to)}
              </span>
            )}
            <button onClick={() => setOpen(false)}
              style={{ fontSize: 12.5, fontWeight: 700, color: "#e8472a", background: "none", border: "none", cursor: "pointer", padding: "4px 12px", borderRadius: 6 }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f0"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterBar({ search, onSearch, onRefresh, filters = [], showExport = true, placeholder = "Search..." }) {
  const [openFilter, setOpenFilter] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [dateRanges, setDateRanges] = useState({}); // { [filterIndex]: { from, to } }

  const setVal = (i, v) => setFilterValues(prev => ({ ...prev, [i]: v === prev[i] ? "" : v }));
  const setRange = (i, from, to) => setDateRanges(prev => ({ ...prev, [i]: { from, to } }));

  return (
    <div
      style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e4e6ea", borderRadius: 10, padding: "0 16px", marginBottom: 16, minHeight: 52, gap: 0 }}
      onClick={() => setOpenFilter(null)}
    >
      {/* Search */}
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
        if (f.type === "date") {
          const range = dateRanges[i] || { from: "", to: "" };
          return (
            <DateRangePicker key={i}
              from={range.from} to={range.to}
              onChange={(from, to) => setRange(i, from, to)} />
          );
        }

        if (f.type === "select") {
          const val = filterValues[i] || "";
          const isOpen = openFilter === i;
          return (
            <div key={i} style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              {/* Trigger */}
              <div
                onClick={() => setOpenFilter(isOpen ? null : i)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 52, cursor: "pointer", userSelect: "none" }}
              >
                <span style={{ fontSize: 13, fontWeight: val ? 600 : 400, color: val ? "#1a1f36" : "#6b7280", whiteSpace: "nowrap" }}>
                  {val || f.placeholder}
                </span>
                {val && (
                  <span
                    onClick={e => { e.stopPropagation(); setVal(i, ""); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", background: "#e5e7eb", cursor: "pointer", flexShrink: 0 }}
                  >
                    <svg width={8} height={8} fill="none" stroke="#6b7280" strokeWidth={2.5} viewBox="0 0 12 12"><path strokeLinecap="round" d="M1 1l10 10M11 1L1 11"/></svg>
                  </span>
                )}
                <span style={{ color: "#9ca3af", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .15s" }}>{Ico.chevron}</span>
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 160, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 300, overflow: "hidden" }}>
                  {(f.options || []).map(opt => (
                    <div
                      key={opt}
                      onClick={() => { setVal(i, opt); setOpenFilter(null); }}
                      style={{ padding: "10px 14px", fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: val === opt ? "#e8472a" : "#374151", fontWeight: val === opt ? 600 : 400, background: val === opt ? "#fef2f0" : "transparent" }}
                      onMouseEnter={e => { if (val !== opt) e.currentTarget.style.background = "#f9fafb"; }}
                      onMouseLeave={e => { if (val !== opt) e.currentTarget.style.background = val === opt ? "#fef2f0" : "transparent"; }}
                    >
                      {val === opt && <svg width={13} height={13} fill="none" stroke="#e8472a" strokeWidth={2.5} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return null;
      })}

      {/* Refresh */}
      <button onClick={onRefresh} title="Refresh"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: "none", borderRadius: 6, background: "transparent", cursor: "pointer", color: "#9ca3af", flexShrink: 0, marginLeft: 4 }}
        onMouseEnter={e => e.currentTarget.style.color = "#374151"}
        onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
        {Ico.refresh}
      </button>

      {/* Export */}
      {showExport && (
        <button
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid #e4e6ea", borderRadius: 7, background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", flexShrink: 0, marginLeft: 6 }}
          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
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
  rowStyle,
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
          paginated.map((row, idx) => {
            const extraStyle = rowStyle ? rowStyle(row) : {};
            return (
              <div
                key={row.id ?? idx}
                style={{ display: "grid", gridTemplateColumns: gridCols, padding: "14px 24px", borderBottom: idx < paginated.length - 1 ? "1px solid #f5f5f7" : "none", alignItems: "center", transition: "background .12s", ...extraStyle }}
                onMouseEnter={e => e.currentTarget.style.background = extraStyle.background ? extraStyle.background : "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = extraStyle.background || "transparent"}
              >
                {columns.map(col => {
                  if (col.key === "__action") {
                    const visibleActions = rowActions.filter(m => !m.hidden || !m.hidden(row));
                    return (
                      <div key="__action" style={{ position: "relative" }} onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === (row.id ?? idx) ? null : (row.id ?? idx)); }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>
                          {Ico.dots}
                        </button>
                        {openMenu === (row.id ?? idx) && visibleActions.length > 0 && (
                          <div style={{ position: "absolute", right: 0, top: 28, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 10, minWidth: 130, overflow: "hidden" }}>
                            {visibleActions.map(m => (
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
          );
          })
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
            style={{ width: 28, height: 28, border: "1px solid #e5e7eb", borderRadius: 6, background: page === 1 ? "#f4f5f7" : "#fff", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width={14} height={14} fill="none" stroke={page === 1 ? "#c0c6d4" : "#374151"} strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ width: 28, height: 28, border: "1px solid #e5e7eb", borderRadius: 6, background: page === totalPages ? "#f4f5f7" : "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width={14} height={14} fill="none" stroke={page === totalPages ? "#c0c6d4" : "#374151"} strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5l7 7-7 7"/></svg>
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
  erp:         <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>,
  gateway:     <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
};

const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard",          icon: "dashboard", page: null        },
      {
        label: "Sales", icon: "sales", page: null,
        children: [
          { label: "Invoices",       icon: "invoice",   page: "invoices"  },
          { label: "Collections",    icon: "payments",  page: "collections" },
        ],
      },
      { label: "Customers",          icon: "customers", page: "customers" },
    ],
  },
  {
    label: "CATALOGUE",
    items: [
      { label: "Product & Services", icon: "products",  page: "products" },
    ],
  },
  {
    label: "INTEGRATIONS",
    items: [
      { label: "ERP Connection",     icon: "erp",       page: "connectors"       },
      { label: "Payment Gateways",   icon: "gateway",   page: "payment-gateways" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { label: "Tickets",            icon: "tickets",   page: "tickets" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Settings", icon: "settings", page: "settings" },
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

// ─── SINGLE DATE PICKER ───────────────────────────────────────────────────────
export function SingleDatePicker({ label, value, onChange, placeholder = "Select date" }) {
  const [open, setOpen]   = useState(false);
  const [view, setView]   = useState("days");
  const today             = new Date();
  const parsed            = value ? new Date(value) : null;
  const [cursor, setCursor] = useState(parsed || today);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const year  = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const select = (day) => {
    const d = new Date(year, month, day);
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    setOpen(false);
  };

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  const isSelected = (day) => {
    if (!parsed || !day) return false;
    return parsed.getFullYear() === year && parsed.getMonth() === month && parsed.getDate() === day;
  };
  const isToday = (day) => day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const displayValue = parsed ? parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, position: "relative" }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: displayValue ? "#1a1f36" : "#9ca3af", background: "#fff", cursor: "pointer", userSelect: "none" }}>
        <span>{displayValue || placeholder}</span>
        <svg width={14} height={14} fill="none" stroke="#9ca3af" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
          <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,.12)", zIndex: 100, padding: "14px", width: 260 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px 8px", borderRadius: 6, fontSize: 16 }}>‹</button>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1f36" }}>{monthNames[month]} {year}</span>
              <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px 8px", borderRadius: 6, fontSize: 16 }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
              {dayNames.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "4px 0" }}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {cells.map((day, i) => (
                <button key={i} onClick={() => day && select(day)} disabled={!day}
                  style={{ padding: "6px 0", border: "none", borderRadius: 6, cursor: day ? "pointer" : "default", fontSize: 13, fontWeight: isSelected(day) ? 700 : 400, textAlign: "center",
                    background: isSelected(day) ? "#e8472a" : "transparent",
                    color: isSelected(day) ? "#fff" : isToday(day) ? "#e8472a" : day ? "#1a1f36" : "transparent",
                    outline: isToday(day) && !isSelected(day) ? "1px solid #e8472a" : "none",
                  }}>
                  {day || ""}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── CUSTOM SELECT ────────────────────────────────────────────────────────────
// options = [{ value, label }] or plain strings. searchable adds a filter input.
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
