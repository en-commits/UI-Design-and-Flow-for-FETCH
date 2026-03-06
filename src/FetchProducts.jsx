import { useState } from "react";
import { DataTable, FilterBar, Toggle, Ico as SharedIco, Sidebar, CustomSelect } from "./FetchShared";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const makeLog = (id, date, type, qty, reference, note, balanceAfter) => ({ id, date, type, qty, reference, note, balanceAfter });

const INITIAL_ITEMS = [
  { id: 1, sku: "SKU-001", name: "Standing Desk",  itemType: "Product", category: "Office",              unitPrice: 1000,   taxRate: 7.5,  dateAdded: "Sep 3, 2025",  status: true,  lowStockThreshold: 5,
    stockLogs: [makeLog(1,"Sep 3, 2025","Stock In",20,"PO-001","Initial stock",20), makeLog(2,"Oct 1, 2025","Sale",-3,"INV-001","",17), makeLog(3,"Nov 5, 2025","Sale",-2,"INV-002","",15)] },
  { id: 2, sku: "SKU-002", name: "Laptop Bag",     itemType: "Product", category: "Office",              unitPrice: 10000,  taxRate: 7.5,  dateAdded: "Oct 6, 2025",  status: false, lowStockThreshold: 10,
    stockLogs: [makeLog(1,"Oct 6, 2025","Stock In",50,"PO-002","Initial stock",50), makeLog(2,"Oct 20, 2025","Sale",-5,"INV-003","",45), makeLog(3,"Nov 1, 2025","Write-off",-2,"","Damaged in transit",43), makeLog(4,"Jan 10, 2026","Sale",-40,"INV-010","Bulk order",3)] },
  { id: 3, sku: "SKU-003", name: "Office Chairs",  itemType: "Product", category: "New Office Category", unitPrice: 50000,  taxRate: 7.5,  dateAdded: "Oct 17, 2025", status: false, lowStockThreshold: 3,
    stockLogs: [makeLog(1,"Oct 17, 2025","Stock In",10,"PO-003","Initial stock",10), makeLog(2,"Dec 1, 2025","Sale",-4,"INV-005","",6)] },
  { id: 4, sku: "SKU-004", name: "Horse",          itemType: "Product", category: "Animals",             unitPrice: 500000, taxRate: 0,    dateAdded: "Feb 17, 2026", status: true,  lowStockThreshold: 2,
    stockLogs: [makeLog(1,"Feb 17, 2026","Stock In",2,"PO-010","Initial stock",2)] },
  { id: 5, sku: "SVC-001", name: "IT Consulting",  itemType: "Service", category: "Electronics",         unitPrice: 25000,  taxRate: 7.5,  dateAdded: "Jan 1, 2026",  status: true,  lowStockThreshold: 0, stockLogs: [] },
  { id: 6, sku: "SVC-002", name: "Delivery",       itemType: "Service", category: "Office",              unitPrice: 5000,   taxRate: 0,    dateAdded: "Jan 15, 2026", status: true,  lowStockThreshold: 0, stockLogs: [] },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Ico = { ...SharedIco,
  dashboard:  <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  customers:  <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  product:    <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>,
  verify:     <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  logout:     <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  close:      <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  bell:       <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  box:        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
// Toggle, DataTable, FilterBar are imported from FetchShared

function FieldInput({ label, value, onChange, multiline, placeholder }) {
  const s = { width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: "#1a1f36", outline: "none", fontFamily: "inherit", background: "#fff", resize: "vertical" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}
      {multiline ? <textarea rows={4} style={s} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /> : <input style={s} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "9px 32px 9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: "#1a1f36", outline: "none", appearance: "none", background: "#fff", fontFamily: "inherit", cursor: "pointer" }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>{Ico.chevron}</span>
      </div>
    </div>
  );
}

// ─── CATEGORY MANAGER DRAWER ─────────────────────────────────────────────────
function CategoryManagerDrawer({ categories, onAdd, onEdit, onRemove, onClose }) {
  const [search, setSearch]         = useState("");
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState({ name: "", description: "" });
  const [editingCat, setEditingCat] = useState(null);
  const [editForm, setEditForm]     = useState({ name: "", description: "" });
  const [confirmDel, setConfirmDel] = useState(null);
  const [sortAZ, setSortAZ]         = useState(true);

  const filtered = categories
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAZ ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    onAdd({ name: addForm.name.trim(), description: addForm.description.trim() });
    setAddForm({ name: "", description: "" });
    setShowAdd(false);
  };

  const startEdit = (cat) => {
    setEditingCat(cat.name);
    setEditForm({ name: cat.name, description: cat.description || "" });
    setConfirmDel(null);
  };

  const handleEdit = () => {
    if (!editForm.name.trim()) return;
    onEdit(editingCat, { name: editForm.name.trim(), description: editForm.description.trim() });
    setEditingCat(null);
  };

  const inp = (extra = {}) => ({ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, color: "#1a1f36", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box", ...extra });

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 210 }} />
      <div style={{ position: "fixed", top: 0, right: 560, bottom: 0, width: 400, background: "#fff", zIndex: 211, display: "flex", flexDirection: "column", boxShadow: "-6px 0 24px rgba(0,0,0,.1)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}>

        {/* ── Header ── */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, background: "#fef2f0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={14} height={14} fill="none" stroke="#e8472a" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1f36" }}>Manage Categories</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{categories.length} total · {filtered.length} shown</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>
            <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* ── Toolbar: search + sort + add ── */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {/* Search */}
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width={13} height={13} fill="none" stroke="#9ca3af" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories..."
              style={{ ...inp(), paddingLeft: 28, fontSize: 12.5 }}
            />
          </div>
          {/* Sort toggle */}
          <button
            onClick={() => setSortAZ(v => !v)}
            title={sortAZ ? "Sorted A→Z" : "Sorted Z→A"}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#f9fafb", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6b7280" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f2f5"}
            onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
          >
            <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ display: "block" }}>
              {sortAZ
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5m8 0l4-4m0 0l4 4m-4-4v12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5m8 4l4 4m0 0l4-4m-4 4V8"/>
              }
            </svg>
            {sortAZ ? "A→Z" : "Z→A"}
          </button>
          {/* Add button */}
          <button
            onClick={() => { setShowAdd(true); setSearch(""); }}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "none", borderRadius: 7, background: "#e8472a", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.background = "#d03d22"}
            onMouseLeave={e => e.currentTarget.style.background = "#e8472a"}
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ display: "block" }}><path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            Add
          </button>
        </div>

        {/* ── Add form ── */}
        {showAdd && (
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafbfc", flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>New Category</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input autoFocus value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="Category name *" style={{ ...inp({ borderColor: addForm.name.trim() ? "#e8472a" : "#e5e7eb" }) }} />
              <input value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="Description (optional)" style={inp()} />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setShowAdd(false); setAddForm({ name: "", description: "" }); }}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleAdd} disabled={!addForm.name.trim()}
                  style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: addForm.name.trim() ? "#e8472a" : "#f0b4a8", fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: addForm.name.trim() ? "pointer" : "not-allowed" }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Table header ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 72px", padding: "8px 20px", background: "#f8f9fb", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
          {["Name", "Description", ""].map((h, i) => (
            <div key={i} style={{ fontSize: 10.5, fontWeight: 700, color: "#b0b7c3", textTransform: "uppercase", letterSpacing: 0.7 }}>{h}</div>
          ))}
        </div>

        {/* ── Table body ── */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              {search ? `No categories matching "${search}"` : "No categories yet. Click Add to create one."}
            </div>
          )}

          {filtered.map((cat, idx) => (
            <div key={cat.name} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f5f5f7" : "none" }}>

              {/* Edit row */}
              {editingCat === cat.name ? (
                <div style={{ padding: "10px 20px", background: "#fffbf9", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 8 }}>
                    <input autoFocus value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") handleEdit(); if (e.key === "Escape") setEditingCat(null); }}
                      style={{ ...inp({ borderColor: "#e8472a" }) }} />
                    <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") handleEdit(); if (e.key === "Escape") setEditingCat(null); }}
                      placeholder="Description" style={inp()} />
                  </div>
                  <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                    <button onClick={() => setEditingCat(null)}
                      style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleEdit} disabled={!editForm.name.trim()}
                      style={{ padding: "5px 14px", borderRadius: 6, border: "none", background: "#e8472a", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Save</button>
                  </div>
                </div>
              ) : (

                /* View row */
                <div
                  style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 72px", padding: "11px 20px", alignItems: "center", gap: 8, transition: "background .12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1f36", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cat.name}>{cat.name}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cat.description}>{cat.description || <span style={{ color: "#d1d5db" }}>—</span>}</div>

                  {/* Actions */}
                  {confirmDel === cat.name ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => { onRemove(cat.name); setConfirmDel(null); }}
                        style={{ padding: "3px 8px", fontSize: 11, fontWeight: 700, color: "#fff", background: "#e8472a", border: "none", borderRadius: 5, cursor: "pointer" }}>Yes</button>
                      <button onClick={() => setConfirmDel(null)}
                        style={{ padding: "3px 7px", fontSize: 11, color: "#6b7280", background: "#f0f2f5", border: "none", borderRadius: 5, cursor: "pointer" }}>No</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                      <button onClick={() => startEdit(cat)} title="Edit"
                        style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7", border: "none", borderRadius: 5, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e8f0fe"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f4f5f7"}>
                        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ display: "block", minWidth: 12 }}><path d="M8.5 1.5a1.414 1.414 0 012 2L3.5 10.5l-3 .5.5-3 7.5-6.5z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => { setConfirmDel(cat.name); setEditingCat(null); }} title="Delete"
                        style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7", border: "none", borderRadius: 5, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fde8e4"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f4f5f7"}>
                        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ display: "block", minWidth: 12 }}><path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer count ── */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid #f0f0f0", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {search ? `${filtered.length} of ${categories.length} categories` : `${categories.length} ${categories.length === 1 ? "category" : "categories"} total`}
          </span>
          {search && (
            <button onClick={() => setSearch("")} style={{ fontSize: 12, color: "#e8472a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Clear search</button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── CATEGORY SELECT ─────────────────────────────────────────────────────────
// Clean selection-only dropdown. Gear icon opens the manager drawer.
function CategorySelect({ label, value, onChange, categories, onOpenManager }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, position: "relative" }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}
        <button
          onClick={e => { e.stopPropagation(); setOpen(false); onOpenManager(); }}
          title="Manage categories"
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", border: "1px solid #e5e7eb", borderRadius: 5, background: "#f9fafb", cursor: "pointer", fontSize: 11.5, fontWeight: 600, color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f0"; e.currentTarget.style.color = "#e8472a"; e.currentTarget.style.borderColor = "#e8472a"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
        >
          <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ display: "block" }}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
          Manage
        </button>
      </div>

      {/* Trigger */}
      <div
        onClick={() => { setOpen(o => !o); setQuery(""); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: value ? "#1a1f36" : "#9ca3af", background: "#fff", cursor: "pointer", userSelect: "none" }}
      >
        <span>{value || "Select category"}</span>
        <span style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>{Ico.chevron}</span>
      </div>

      {/* Dropdown — selection only */}
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 300, overflow: "hidden" }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}>{Ico.search}</span>
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search categories..."
                style={{ width: "100%", padding: "7px 10px 7px 28px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            </div>
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 && <div style={{ padding: "12px 14px", fontSize: 13, color: "#9ca3af", textAlign: "center" }}>No categories found</div>}
            {filtered.map(cat => (
              <div key={cat.name} onClick={() => { onChange(cat.name); setOpen(false); setQuery(""); }}
                style={{ padding: "10px 14px", fontSize: 13.5, color: cat.name === value ? "#e8472a" : "#374151", fontWeight: cat.name === value ? 600 : 400, background: cat.name === value ? "#fef2f0" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { if (cat.name !== value) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { if (cat.name !== value) e.currentTarget.style.background = "transparent"; }}
              >
                {cat.name === value && <svg width={13} height={13} fill="none" stroke="#e8472a" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                <div>
                  <div>{cat.name}</div>
                  {cat.description && <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{cat.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ITEM TYPE TOGGLE ────────────────────────────────────────────────────────
function ItemTypeToggle({ value, onChange }) {
  return (
    <div style={{ display: "flex", background: "#f4f5f7", borderRadius: 8, padding: 3, gap: 2 }}>
      {["Product", "Service"].map(t => (
        <button key={t} onClick={() => onChange(t)}
          style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: value === t ? "#fff" : "transparent",
            color: value === t ? "#e8472a" : "#6b7280",
            boxShadow: value === t ? "0 1px 4px rgba(0,0,0,.1)" : "none", transition: "all .15s" }}>
          {t}
        </button>
      ))}
    </div>
  );
}

// ─── INVENTORY LOG PANEL ──────────────────────────────────────────────────────
const LOG_TYPES = ["Stock In", "Sale", "Return", "Write-off", "Correction"];
const LOG_COLORS = {
  "Stock In":   { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Return":     { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Sale":       { text: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  "Write-off":  { text: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  "Correction": { text: "#6b7280", bg: "#f4f5f7", border: "#e5e7eb" },
};
const isPositive = t => t === "Stock In" || t === "Return";

function InventoryLogPanel({ item, onClose, onAddLog }) {
  const [search, setSearch]   = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ type: "Stock In", qty: "", reference: "", note: "" });
  const [openType, setOpenType] = useState(false);

  const stock = (item.stockLogs || []).reduce((s, l) => s + l.qty, 0);
  const logs  = [...(item.stockLogs || [])].reverse().filter(l =>
    (!typeFilter || l.type === typeFilter) &&
    (!search || l.reference?.toLowerCase().includes(search.toLowerCase()) || l.note?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    const qty = parseInt(form.qty);
    if (!qty || qty === 0) return;
    const signed = isPositive(form.type) ? Math.abs(qty) : -Math.abs(qty);
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: form.type,
      qty: signed,
      reference: form.reference.trim(),
      note: form.note.trim(),
      balanceAfter: stock + signed,
    };
    onAddLog(item.id, newLog);
    setForm({ type: "Stock In", qty: "", reference: "", note: "" });
    setShowAdd(false);
  };

  const inp = { padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, color: "#1a1f36", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.12)", zIndex: 210 }} />
      <div style={{ position: "fixed", top: 0, right: 560, bottom: 0, width: 420, background: "#fff", zIndex: 211, display: "flex", flexDirection: "column", boxShadow: "-6px 0 24px rgba(0,0,0,.1)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}>

        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 32, height: 32, background: "#fef2f0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={15} height={15} fill="none" stroke="#e8472a" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1f36" }}>Inventory Log</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{item.name}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          {/* Stock summary */}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <div style={{ flex: 1, background: stock <= item.lowStockThreshold && stock > 0 ? "#fffbeb" : stock === 0 ? "#fef2f2" : "#f0fdf4", border: `1px solid ${stock <= item.lowStockThreshold && stock > 0 ? "#fde68a" : stock === 0 ? "#fecaca" : "#bbf7d0"}`, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Current Stock</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stock === 0 ? "#dc2626" : stock <= item.lowStockThreshold ? "#b45309" : "#16a34a", marginTop: 2 }}>{stock} <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>units</span></div>
            </div>
            <div style={{ flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Low Stock At</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#374151", marginTop: 2 }}>{item.lowStockThreshold} <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>units</span></div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 8, flexShrink: 0 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width={13} height={13} fill="none" stroke="#9ca3af" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reference or note..."
              style={{ ...inp, paddingLeft: 28, fontSize: 12.5 }} />
          </div>
          {/* Type filter */}
          <div style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <div onClick={() => setOpenType(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#f9fafb", cursor: "pointer", fontSize: 12.5, color: typeFilter ? "#1a1f36" : "#6b7280", fontWeight: typeFilter ? 600 : 400, whiteSpace: "nowrap" }}>
              {typeFilter || "All types"}
              <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ transform: openType ? "rotate(180deg)" : "none", transition: "transform .15s" }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>
            {openType && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, width: 140, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,.1)", zIndex: 10, overflow: "hidden" }}>
                {["", ...LOG_TYPES].map(t => (
                  <div key={t} onClick={() => { setTypeFilter(t); setOpenType(false); }}
                    style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", color: typeFilter === t ? "#e8472a" : "#374151", fontWeight: typeFilter === t ? 600 : 400, background: typeFilter === t ? "#fef2f0" : "transparent" }}
                    onMouseEnter={e => { if (typeFilter !== t) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (typeFilter !== t) e.currentTarget.style.background = "transparent"; }}>
                    {t || "All types"}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowAdd(true)}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "none", borderRadius: 7, background: "#e8472a", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.background = "#d03d22"}
            onMouseLeave={e => e.currentTarget.style.background = "#e8472a"}>
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            Adjust
          </button>
        </div>

        {/* Add adjustment form */}
        {showAdd && (
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafbfc", flexShrink: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>New Adjustment</div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 8, marginBottom: 8 }}>
              {/* Type select */}
              <div style={{ position: "relative" }}>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  style={{ ...inp, appearance: "none", paddingRight: 28, cursor: "pointer" }}>
                  {LOG_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                  <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
              <input value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                placeholder="Quantity *" type="number" min="1" style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                placeholder="Reference (e.g. INV-001)" style={inp} />
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Note (optional)" style={inp} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowAdd(false); setForm({ type: "Stock In", qty: "", reference: "", note: "" }); }}
                style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAdd} disabled={!form.qty}
                style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: form.qty ? "#e8472a" : "#f0b4a8", fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: form.qty ? "pointer" : "not-allowed" }}>Save</button>
            </div>
          </div>
        )}

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "90px 80px 70px 1fr 60px", padding: "8px 20px", background: "#f8f9fb", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
          {["Date","Type","Qty","Reference / Note","Balance"].map(h => (
            <div key={h} style={{ fontSize: 10.5, fontWeight: 700, color: "#b0b7c3", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>

        {/* Log rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {logs.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              {search || typeFilter ? "No matching log entries." : "No adjustments recorded yet."}
            </div>
          )}
          {logs.map((log, idx) => {
            const c = LOG_COLORS[log.type] || LOG_COLORS["Correction"];
            return (
              <div key={log.id} style={{ display: "grid", gridTemplateColumns: "90px 80px 70px 1fr 60px", padding: "10px 20px", borderBottom: idx < logs.length - 1 ? "1px solid #f5f5f7" : "none", alignItems: "center", gap: 4 }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{log.date}</div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: "2px 7px", whiteSpace: "nowrap" }}>{log.type}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: log.qty > 0 ? "#16a34a" : "#dc2626" }}>{log.qty > 0 ? `+${log.qty}` : log.qty}</div>
                <div style={{ fontSize: 12, color: "#374151", overflow: "hidden" }}>
                  {log.reference && <span style={{ fontWeight: 600 }}>{log.reference}</span>}
                  {log.reference && log.note && <span style={{ color: "#9ca3af" }}> · </span>}
                  {log.note && <span style={{ color: "#6b7280" }}>{log.note}</span>}
                  {!log.reference && !log.note && <span style={{ color: "#d1d5db" }}>—</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{log.balanceAfter}</div>
              </div>
            );
          })}
        </div>

        {/* Footer count */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid #f0f0f0", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{logs.length} {logs.length === 1 ? "entry" : "entries"}{search || typeFilter ? " (filtered)" : ""}</span>
        </div>
      </div>
    </>
  );
}

// ─── DRAWER ───────────────────────────────────────────────────────────────────
function Drawer({ item, isNew, onClose, onSave, onViewLog, categories, onAddCategory, onRemoveCategory, onEditCategory }) {
  const blank = { itemType: "Product", sku: "", name: "", description: "", category: "", unitPrice: "", hsnCode: "", priceUnit: "NGN per item", taxCategory: "Standard Value-Added Tax", taxRate: "7.5", lowStockThreshold: "10", stockLogs: [] };
  const [form, setForm]             = useState(item ? { ...item, description: item.description || "", hsnCode: item.hsnCode || "", priceUnit: item.priceUnit || "NGN per item", taxCategory: item.taxCategory || "Standard Value-Added Tax", taxRate: String(item.taxRate ?? "7.5"), lowStockThreshold: String(item.lowStockThreshold ?? "10") } : blank);
  const [catManager, setCatManager] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const stock = (form.stockLogs || []).reduce((s, l) => s + l.qty, 0);
  const isProduct = form.itemType === "Product";

  return (
    <>
      <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 560, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-6px 0 32px rgba(0,0,0,.1)", animation: "drawerIn .25s cubic-bezier(.22,1,.36,1)" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, background: "#fef2f0", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8472a" }}>{Ico.box}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1f36" }}>{isNew ? "Create Sales Item" : "View/Edit Sales Item"}</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{isNew ? "Add a new product or service" : "View or edit sale item information"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}>{Ico.close}</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Item type toggle */}
          <ItemTypeToggle value={form.itemType} onChange={v => set("itemType", v)} />

          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>Sales Item Information</div>
          <FieldInput label="Item Name" value={form.name} onChange={v => set("name", v)} placeholder={isProduct ? "e.g. Standing Desk" : "e.g. IT Consulting"} />
          <FieldInput label="Description" value={form.description} onChange={v => set("description", v)} multiline placeholder="Describe this item..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <CustomSelect searchable label="HSN Code" value={form.hsnCode || ""} onChange={v => set("hsnCode", v)} placeholder="Select HSN Code"
              options={["", "HSN-001 — Animals & animal products", "HSN-002 — Vegetable products", "HSN-003 — Fats & oils", "HSN-004 — Food & beverages", "HSN-005 — Mineral products", "HSN-006 — Chemical products", "HSN-007 — Plastics & rubber", "HSN-008 — Raw hides & leather", "HSN-009 — Wood & wood products", "HSN-010 — Paper & paperboard", "HSN-011 — Textiles", "HSN-012 — Footwear", "HSN-013 — Machinery & equipment", "HSN-014 — Electrical equipment", "HSN-015 — Vehicles", "HSN-016 — Medical instruments"]} />
            <CategorySelect label="Category" value={form.category} onChange={v => set("category", v)} categories={categories} onOpenManager={() => setCatManager(true)} />
          </div>
          <FieldInput label="Sellers Item Identification" value={form.sku} onChange={v => set("sku", v)} placeholder="e.g. SKU-001" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FieldInput label="Price Rate" value={String(form.unitPrice)} onChange={v => set("unitPrice", v)} placeholder="0" />
            <CustomSelect label="Price Unit" value={form.priceUnit} onChange={v => set("priceUnit", v)} options={["NGN per item", "USD per item", "EUR per item", "GBP per item"]} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <CustomSelect searchable label="Tax Category" value={form.taxCategory} onChange={v => set("taxCategory", v)}
              options={["Standard Value-Added Tax", "Zero Rated", "Exempt", "Reverse Charge", "Non-Taxable Supply", "Out of Scope"]} />
            <FieldInput label="Tax Rate" value={form.taxRate} onChange={v => set("taxRate", v)} placeholder="0" />
          </div>

          {/* ── Inventory section (Products only) ── */}
          {isProduct && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", borderBottom: "1px solid #f0f0f0", paddingBottom: 10, marginTop: 4 }}>Inventory</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Current stock — read only */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Current Stock</label>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: stock === 0 ? "#dc2626" : stock <= Number(form.lowStockThreshold) ? "#b45309" : "#16a34a" }}>{stock} units</span>
                    {!isNew && (
                      <button onClick={() => onViewLog(form)}
                        style={{ fontSize: 12, fontWeight: 700, color: "#e8472a", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 5 }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fef2f0"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        View Log →
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Adjust stock via the inventory log.</div>
                </div>
                {/* Low stock threshold */}
                <FieldInput label="Low Stock Threshold" value={String(form.lowStockThreshold)} onChange={v => set("lowStockThreshold", v)} placeholder="e.g. 10" />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ padding: "10px 26px", borderRadius: 8, border: "none", background: "#e8472a", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(232,71,42,.3)" }}>{isNew ? "Create" : "Update"}</button>
        </div>
      </div>

      {catManager && (
        <CategoryManagerDrawer categories={categories} onAdd={onAddCategory} onEdit={onEditCategory} onRemove={onRemoveCategory} onClose={() => setCatManager(false)} />
      )}
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FetchProducts({ navigate }) {
  const [items, setItems]           = useState(INITIAL_ITEMS);
  const [search, setSearch]         = useState("");
  const [drawer, setDrawer]         = useState(null);
  const [logItem, setLogItem]       = useState(null); // item whose log panel is open
  const [categories, setCategories] = useState([
    { name: "Office",              description: "Office furniture and equipment" },
    { name: "New Office Category", description: "" },
    { name: "Animals",             description: "Live animals and related products" },
    { name: "Electronics",         description: "Electronic devices and accessories" },
  ]);
  const PER_PAGE = 10;

  const addCategory    = data => setCategories(prev => prev.some(c => c.name === data.name) ? prev : [...prev, data]);
  const removeCategory = name => setCategories(prev => prev.filter(c => c.name !== name));
  const editCategory   = (oldName, data) => setCategories(prev => prev.map(c => c.name === oldName ? data : c));

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = form => {
    if (drawer.isNew) {
      setItems(p => [...p, { ...form, id: Date.now(), dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), status: false, unitPrice: Number(form.unitPrice) || 0, taxRate: Number(form.taxRate) || 0, lowStockThreshold: Number(form.lowStockThreshold) || 0, stockLogs: [] }]);
    } else {
      setItems(p => p.map(i => i.id === form.id ? { ...i, ...form, unitPrice: Number(form.unitPrice) || i.unitPrice, lowStockThreshold: Number(form.lowStockThreshold) ?? i.lowStockThreshold } : i));
    }
    setDrawer(null);
  };

  // Append a new log entry to an item and recalculate stock
  const handleAddLog = (itemId, newLog) => {
    setItems(p => p.map(i => {
      if (i.id !== itemId) return i;
      const logs = [...(i.stockLogs || []), newLog];
      return { ...i, stockLogs: logs };
    }));
    // Keep logItem in sync so panel reflects new entry immediately
    setLogItem(prev => prev ? { ...prev, stockLogs: [...(prev.stockLogs || []), newLog] } : prev);
  };

  const handleDelete   = id => setItems(p => p.filter(i => i.id !== id));
  const toggleStatus   = id => setItems(p => p.map(i => i.id === id ? { ...i, status: !i.status } : i));

  const ItemTag = ({ type }) => (
    <span style={{ fontSize: 10.5, fontWeight: 700, color: type === "Product" ? "#3b82f6" : "#8b5cf6", background: type === "Product" ? "#eff6ff" : "#f5f3ff", border: `1px solid ${type === "Product" ? "#bfdbfe" : "#ddd6fe"}`, borderRadius: 4, padding: "1px 6px", marginLeft: 6, letterSpacing: 0.3, verticalAlign: "middle" }}>
      {type === "Product" ? "PRD" : "SVC"}
    </span>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f4f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`*, *::before, *::after{box-sizing:border-box;margin:0;padding:0}html,body,#root{width:100%;min-height:100vh}`}</style>

      <Sidebar activePage="products" navigate={navigate} />

      <div style={{ marginLeft: 224, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* ── TOPBAR ── */}
        <header style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af" }}>
            <span style={{ color: "#6b7280", cursor: "pointer", fontWeight: 500 }}>Home</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#1a1f36", fontWeight: 600 }}>Product &amp; Services</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer", color: "#6b7280" }}>{Ico.bell}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36", lineHeight: 1 }}>Jonathan</div>
                <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: 0.5, textTransform: "uppercase", marginTop: 1 }}>Admin</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e8472a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>JO</div>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main style={{ flex: 1, padding: "28px 32px 32px", display: "flex", flexDirection: "column" }}>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1f36", marginBottom: 5, letterSpacing: -0.3 }}>Product &amp; Services</h1>
              <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>Manage and track your inventory and service offerings.</p>
            </div>
            <button onClick={() => setDrawer({ item: null, isNew: true })}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 24px", background: "#e8472a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(232,71,42,.35)", whiteSpace: "nowrap" }}>
              + Create New
            </button>
          </div>

          <FilterBar
            search={search}
            onSearch={v => setSearch(v)}
            onRefresh={() => setSearch("")}
            filters={[
              { type: "date" },
              { type: "select", placeholder: "Type",       options: ["Product", "Service"] },
              { type: "select", placeholder: "Price Range", options: ["0 – 10,000", "10,000 – 100,000", "100,000+"] },
            ]}
          />

          <DataTable
            columns={[
              { key: "name", label: "Item Name", width: "1.6fr", render: (v, row) => (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1f36" }}>{v}</span>
                  <ItemTag type={row.itemType || "Product"} />
                </span>
              )},
              { key: "category",  label: "Category",   width: "1fr" },
              { key: "unitPrice", label: "Unit Price",  width: "110px", render: v => <span style={{ fontSize: 13, color: "#374151" }}>₦{Number(v).toLocaleString()}</span> },
              { key: "taxRate",   label: "Tax Rate",   width: "90px",  render: v => <span style={{ fontSize: 13, color: "#374151" }}>{v ?? "7.5"}%</span> },
              { key: "__stock",   label: "Stock",       width: "100px", render: (_, row) => {
                if (row.itemType === "Service") return <span style={{ fontSize: 13, color: "#d1d5db" }}>—</span>;
                const stock = (row.stockLogs || []).reduce((s, l) => s + l.qty, 0);
                const low   = stock > 0 && stock <= (row.lowStockThreshold || 0);
                const out   = stock === 0;
                return (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700,
                    color: out ? "#dc2626" : low ? "#b45309" : "#16a34a",
                    background: out ? "#fef2f2" : low ? "#fffbeb" : "#f0fdf4",
                    border: `1px solid ${out ? "#fecaca" : low ? "#fde68a" : "#bbf7d0"}`,
                    borderRadius: 20, padding: "2px 9px" }}>
                    {out
                      ? <><svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> Out</>
                      : low
                      ? <><svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> {stock}</>
                      : stock}
                  </span>
                );
              }},
              { key: "dateAdded", label: "Date Added", width: "120px", muted: true },
              { key: "status",    label: "Status",     width: "70px",  render: (v, row) => <Toggle on={v} onChange={() => toggleStatus(row.id)} /> },
              { key: "__action",  label: "Action",     width: "60px"  },
            ]}
            rows={filtered}
            rowActions={[
              { label: "Edit",      action: row => setDrawer({ item: row, isNew: false }) },
              { label: "View Log",  action: row => { if (row.itemType !== "Service") setLogItem(row); }, hidden: row => row.itemType === "Service" },
              { label: "Delete",    action: row => handleDelete(row.id), danger: true },
            ]}
            rowStyle={row => {
              const stock = (row.stockLogs || []).reduce((s, l) => s + l.qty, 0);
              const low = row.itemType === "Product" && stock > 0 && stock <= (row.lowStockThreshold || 0);
              const out = row.itemType === "Product" && stock === 0;
              return out ? { background: "#fff5f5" } : low ? { background: "#fffdf0" } : {};
            }}
            emptyTitle="No records found"
            emptySubtitle="Try adjusting your filters or create a new product to get started."
            onClearFilter={() => setSearch("")}
            itemLabel="products"
            pageSize={PER_PAGE}
          />
        </main>
      </div>

      {drawer && (
        <Drawer
          item={drawer.item} isNew={drawer.isNew}
          onClose={() => setDrawer(null)}
          onSave={handleSave}
          onViewLog={item => { setLogItem(item); }}
          categories={categories}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          onEditCategory={editCategory}
        />
      )}

      {logItem && (
        <InventoryLogPanel
          item={logItem}
          onClose={() => setLogItem(null)}
          onAddLog={handleAddLog}
        />
      )}
    </div>
  );
}

