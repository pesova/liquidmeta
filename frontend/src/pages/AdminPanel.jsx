import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

/* ── Icons ── */
const IconHome     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconUsers    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconShield   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>);
const IconLock     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>);
const IconDollar   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>);
const IconAlert    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const IconCheck    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconX        = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconEdit     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconTrendUp  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>);
const IconArrow    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
const IconRelease  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>);
const IconBan      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>);
const IconRefresh  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>);
const IconSearch   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconLogout   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);

/* ── Mock Data ── */
const MOCK_STATS = {
  totalUsers: 1284, totalVendors: 312, totalTransactions: 847,
  escrowHeld: 4250000, availableBalance: 8940000, totalRevenue: 13190000,
  pendingDisputes: 4, resolvedDisputes: 23,
};

const MOCK_TRANSACTIONS = [
  { id:"TXN-001", buyer:"Chioma A.",   vendor:"Adaeze Fashion", product:"Ankara Midi Dress",   amount:12500,  escrow:12500,  status:"PAID_IN_ESCROW", date:"Mar 21, 2026" },
  { id:"TXN-002", buyer:"Kemi O.",     vendor:"TechZone Lagos", product:"Samsung Galaxy A55",  amount:285000, escrow:0,      status:"COMPLETED",      date:"Mar 20, 2026" },
  { id:"TXN-003", buyer:"Ngozi E.",    vendor:"GadgetHub NG",   product:"Wireless Earbuds",    amount:18000,  escrow:18000,  status:"PAID_IN_ESCROW", date:"Mar 20, 2026" },
  { id:"TXN-004", buyer:"Amaka B.",    vendor:"NaturalGlow",    product:"Shea Butter Set",     amount:4500,   escrow:0,      status:"COMPLETED",      date:"Mar 19, 2026" },
  { id:"TXN-005", buyer:"Fatima I.",   vendor:"FurnishPro",     product:"Office Chair",        amount:65000,  escrow:65000,  status:"DISPUTED",       date:"Mar 19, 2026" },
  { id:"TXN-006", buyer:"Blessing N.", vendor:"iStore Abuja",   product:"iPhone 14 Pro",       amount:850000, escrow:850000, status:"PAID_IN_ESCROW", date:"Mar 18, 2026" },
  { id:"TXN-007", buyer:"Emeka C.",    vendor:"FarmDirect",     product:"Fresh Tomatoes 5kg",  amount:3200,   escrow:0,      status:"CANCELLED",      date:"Mar 18, 2026" },
  { id:"TXN-008", buyer:"Sola A.",     vendor:"LaptopWorld",    product:"HP Laptop 14\"",      amount:320000, escrow:320000, status:"SHIPPED",        date:"Mar 17, 2026" },
];

const MOCK_VENDORS = [
  { id:"V001", name:"Adaeze Okonkwo",  business:"Adaeze Fashion Hub",  email:"adaeze@ng.com",   status:"active",    verified:true,  sales:47,  joinDate:"Jan 2026" },
  { id:"V002", name:"Tunde Balogun",   business:"TechZone Lagos",       email:"tunde@tech.ng",   status:"active",    verified:true,  sales:112, joinDate:"Dec 2025" },
  { id:"V003", name:"Nkechi Obi",      business:"NaturalGlow",          email:"nkechi@glow.ng",  status:"active",    verified:false, sales:28,  joinDate:"Feb 2026" },
  { id:"V004", name:"Emeka Eze",       business:"GadgetHub NG",         email:"emeka@gadget.ng", status:"suspended", verified:true,  sales:89,  joinDate:"Nov 2025" },
  { id:"V005", name:"Fatima Musa",     business:"FarmDirect",           email:"fatima@farm.ng",  status:"active",    verified:true,  sales:156, joinDate:"Oct 2025" },
  { id:"V006", name:"Chidi Nwosu",     business:"LaptopWorld",          email:"chidi@laptop.ng", status:"active",    verified:false, sales:34,  joinDate:"Mar 2026" },
];

const MOCK_DISPUTES = [
  { id:"DSP-001", txn:"TXN-005", buyer:"Fatima I.",   vendor:"FurnishPro",   product:"Office Chair",  amount:65000,  reason:"Item not as described",         status:"open",     date:"Mar 19, 2026" },
  { id:"DSP-002", txn:"TXN-009", buyer:"Chukwu M.",   vendor:"GadgetHub NG", product:"Earphones",     amount:8500,   reason:"Item never delivered",           status:"open",     date:"Mar 17, 2026" },
  { id:"DSP-003", txn:"TXN-003", buyer:"Ngozi E.",    vendor:"GadgetHub NG", product:"Wireless Earbuds",amount:18000, reason:"Wrong item received",           status:"open",     date:"Mar 16, 2026" },
  { id:"DSP-004", txn:"TXN-010", buyer:"Aisha K.",    vendor:"Adaeze Fashion",product:"Kaftan Set",   amount:22000,  reason:"Quality lower than advertised",  status:"resolved", date:"Mar 14, 2026" },
];

const STATUS_MAP = {
  PAID_IN_ESCROW: { label:"In Escrow",  color:"gold"   },
  COMPLETED:      { label:"Completed",  color:"green"  },
  SHIPPED:        { label:"Shipped",    color:"blue"   },
  DISPUTED:       { label:"Disputed",   color:"red"    },
  CANCELLED:      { label:"Cancelled",  color:"gray"   },
  PENDING_PAYMENT:{ label:"Pending",    color:"purple" },
};

/* ── Edit Balance Modal ── */
const EditBalanceModal = ({ item, type, onClose, onSave }) => {
  const [value, setValue] = useState(
    type === "escrow" ? item.escrow : item.amount
  );
  const [note, setNote] = useState("");

  return (
    <div className="ad-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ad-modal">
        <div className="ad-modal__header">
          <h3 className="ad-modal__title">Manual Balance Update</h3>
          <button className="ad-modal__close" onClick={onClose}><IconX /></button>
        </div>
        <div className="ad-modal__body">
          <div className="ad-modal__warning">
            <IconAlert />
            <span>This action directly modifies escrow records. Use only when necessary.</span>
          </div>
          <div className="ad-form-field">
            <label className="ad-form-label">Transaction</label>
            <div className="ad-form-static">{item.id} — {item.product}</div>
          </div>
          <div className="ad-form-field">
            <label className="ad-form-label">
              {type === "escrow" ? "Escrow Amount (₦)" : "Transaction Amount (₦)"}
            </label>
            <input
              className="ad-form-input"
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </div>
          <div className="ad-form-field">
            <label className="ad-form-label">Reason / Admin Note <span>*</span></label>
            <textarea
              className="ad-form-input ad-form-textarea"
              placeholder="Explain why this manual update is needed..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="ad-modal__footer">
          <button className="ad-btn ad-btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="ad-btn ad-btn--gold"
            onClick={() => { onSave(item.id, Number(value), note); onClose(); }}
            disabled={!note.trim()}
          >
            Save Update
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Dispute Modal ── */
const DisputeModal = ({ dispute, onClose, onResolve }) => {
  const [decision, setDecision] = useState("buyer");
  const [note, setNote] = useState("");

  return (
    <div className="ad-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ad-modal">
        <div className="ad-modal__header">
          <h3 className="ad-modal__title">Resolve Dispute — {dispute.id}</h3>
          <button className="ad-modal__close" onClick={onClose}><IconX /></button>
        </div>
        <div className="ad-modal__body">
          <div className="ad-dispute-info">
            <div className="ad-dispute-row"><span>Transaction</span><strong>{dispute.txn}</strong></div>
            <div className="ad-dispute-row"><span>Product</span><strong>{dispute.product}</strong></div>
            <div className="ad-dispute-row"><span>Amount</span><strong>₦{dispute.amount.toLocaleString()}</strong></div>
            <div className="ad-dispute-row"><span>Buyer</span><strong>{dispute.buyer}</strong></div>
            <div className="ad-dispute-row"><span>Vendor</span><strong>{dispute.vendor}</strong></div>
            <div className="ad-dispute-row"><span>Reason</span><strong>{dispute.reason}</strong></div>
          </div>
          <div className="ad-form-field">
            <label className="ad-form-label">Decision</label>
            <div className="ad-decision-btns">
              <button
                className={`ad-decision-btn${decision==="buyer"?" active-buyer":""}`}
                onClick={() => setDecision("buyer")}
              >
                Refund Buyer
              </button>
              <button
                className={`ad-decision-btn${decision==="vendor"?" active-vendor":""}`}
                onClick={() => setDecision("vendor")}
              >
                Release to Vendor
              </button>
              <button
                className={`ad-decision-btn${decision==="split"?" active-split":""}`}
                onClick={() => setDecision("split")}
              >
                Split 50/50
              </button>
            </div>
          </div>
          <div className="ad-form-field">
            <label className="ad-form-label">Admin Resolution Note <span>*</span></label>
            <textarea
              className="ad-form-input ad-form-textarea"
              placeholder="Document your resolution decision..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="ad-modal__footer">
          <button className="ad-btn ad-btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="ad-btn ad-btn--gold"
            onClick={() => { onResolve(dispute.id, decision, note); onClose(); }}
            disabled={!note.trim()}
          >
            Confirm Resolution
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Release Funds Modal ── */
const ReleaseFundsModal = ({ txn, onClose, onConfirm }) => (
  <div className="ad-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="ad-modal ad-modal--sm">
      <div className="ad-modal__header">
        <h3 className="ad-modal__title">Release Escrow Funds</h3>
        <button className="ad-modal__close" onClick={onClose}><IconX /></button>
      </div>
      <div className="ad-modal__body">
        <div className="ad-release-summary">
          <div className="ad-release-icon"><IconRelease /></div>
          <div className="ad-release-amount">₦{txn.escrow.toLocaleString()}</div>
          <div className="ad-release-label">will be released to</div>
          <div className="ad-release-vendor">{txn.vendor}</div>
        </div>
        <div className="ad-modal__warning">
          <IconAlert />
          <span>This action is irreversible. Funds will be transferred immediately.</span>
        </div>
      </div>
      <div className="ad-modal__footer">
        <button className="ad-btn ad-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="ad-btn ad-btn--green" onClick={() => { onConfirm(txn.id); onClose(); }}>
          <IconRelease /> Release Funds
        </button>
      </div>
    </div>
  </div>
);

/* ── Main Admin Panel ── */
export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [transactions, setTransactions]   = useState(MOCK_TRANSACTIONS);
  const [vendors, setVendors]             = useState(MOCK_VENDORS);
  const [disputes, setDisputes]           = useState(MOCK_DISPUTES);
  const [txnSearch, setTxnSearch]         = useState("");
  const [vendorSearch, setVendorSearch]   = useState("");
  const [txnFilter, setTxnFilter]         = useState("ALL");
  const [editModal, setEditModal]         = useState(null);
  const [disputeModal, setDisputeModal]   = useState(null);
  const [releaseModal, setReleaseModal]   = useState(null);
  const [toast, setToast]                 = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* ── Actions ── */
  const handleVerifyVendor = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, verified: true } : v));
    showToast("Vendor verified successfully");
    // TODO: PATCH /api/admin/vendors/:id/verify
  };

  const handleSuspendVendor = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: v.status === "suspended" ? "active" : "suspended" } : v));
    showToast("Vendor status updated");
    // TODO: PATCH /api/admin/vendors/:id/status
  };

  const handleReleaseFunds = (txnId) => {
    setTransactions(ts => ts.map(t => t.id === txnId ? { ...t, status: "COMPLETED", escrow: 0 } : t));
    showToast("Funds released to vendor");
    // TODO: POST /api/admin/escrow/:txnId/release
  };

  const handleResolveDispute = (disputeId, decision, note) => {
    setDisputes(ds => ds.map(d => d.id === disputeId ? { ...d, status: "resolved", decision, note } : d));
    showToast(`Dispute resolved — ${decision === "buyer" ? "Buyer refunded" : decision === "vendor" ? "Funds released to vendor" : "Split 50/50"}`);
    // TODO: POST /api/admin/disputes/:id/resolve
  };

  const handleUpdateBalance = (txnId, newValue, note) => {
    setTransactions(ts => ts.map(t => t.id === txnId ? { ...t, escrow: newValue } : t));
    showToast(`Balance updated for ${txnId}`);
    // TODO: PATCH /api/admin/transactions/:id/balance
  };

  /* ── Filtered data ── */
  const filteredTxns = transactions
    .filter(t => txnFilter === "ALL" || t.status === txnFilter)
    .filter(t => !txnSearch || t.id.toLowerCase().includes(txnSearch.toLowerCase()) || t.buyer.toLowerCase().includes(txnSearch.toLowerCase()) || t.vendor.toLowerCase().includes(txnSearch.toLowerCase()));

  const filteredVendors = vendors.filter(v =>
    !vendorSearch || v.name.toLowerCase().includes(vendorSearch.toLowerCase()) || v.business.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const escrowTotal = transactions.filter(t => t.status === "PAID_IN_ESCROW" || t.status === "SHIPPED").reduce((s,t) => s + t.escrow, 0);
  const openDisputes = disputes.filter(d => d.status === "open").length;

  const NAV = [
    { id:"overview",      label:"Overview",         Icon:IconHome   },
    { id:"transactions",  label:"Transactions",     Icon:IconDollar },
    { id:"escrow",        label:"Escrow",           Icon:IconLock   },
    { id:"vendors",       label:"Vendors",          Icon:IconUsers  },
    { id:"disputes",      label:"Disputes",         Icon:IconAlert  },
  ];

  return (
    <div className="ad-root">

      {/* ── SIDEBAR ── */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar__brand">
          <span className="ad-brand__mark">AI</span>
          <span className="ad-brand__text">MarketLink</span>
          <span className="ad-brand__admin">ADMIN</span>
        </div>

        <nav className="ad-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`ad-nav-btn${activeSection===n.id?" active":""}`}
              onClick={() => setActiveSection(n.id)}
            >
              <n.Icon />
              <span>{n.label}</span>
              {n.id==="disputes" && openDisputes > 0 && (
                <span className="ad-nav-badge">{openDisputes}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar__footer">
          <button className="ad-sidebar__logout" onClick={() => navigate("/")}>
            <IconLogout /> Back to Site
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="ad-main">

        {/* Topbar */}
        <header className="ad-topbar">
          <div className="ad-topbar__title">
            {NAV.find(n => n.id === activeSection)?.label}
          </div>
          <div className="ad-topbar__right">
            <div className="ad-admin-tag">
              <IconShield />
              Super Admin
            </div>
          </div>
        </header>

        <div className="ad-content">

          {/* ════ OVERVIEW ════ */}
          {activeSection === "overview" && (
            <div className="ad-section">
              <div className="ad-stats-grid">
                {[
                  { Icon:IconUsers,   label:"Total Users",        val:MOCK_STATS.totalUsers.toLocaleString(),                  color:"blue",   sub:"Buyers & vendors" },
                  { Icon:IconShield,  label:"Verified Vendors",   val:vendors.filter(v=>v.verified).length,                    color:"green",  sub:`of ${vendors.length} total` },
                  { Icon:IconDollar,  label:"Total Revenue",      val:`₦${(MOCK_STATS.totalRevenue/1000000).toFixed(1)}M`,     color:"gold",   sub:"All time" },
                  { Icon:IconLock,    label:"In Escrow",          val:`₦${(escrowTotal/1000).toFixed(0)}k`,                   color:"purple", sub:"Pending release" },
                  { Icon:IconTrendUp, label:"Transactions",       val:MOCK_STATS.totalTransactions,                            color:"teal",   sub:"All orders" },
                  { Icon:IconAlert,   label:"Open Disputes",      val:openDisputes,                                            color:"red",    sub:"Needs attention" },
                ].map((s,i) => (
                  <div key={i} className={`ad-stat-card ad-stat-card--${s.color}`}>
                    <div className="ad-stat-card__icon"><s.Icon /></div>
                    <div className="ad-stat-card__val">{s.val}</div>
                    <div className="ad-stat-card__label">{s.label}</div>
                    <div className="ad-stat-card__sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent transactions */}
              <div className="ad-card">
                <div className="ad-card__head">
                  <h3 className="ad-card__title">Recent Transactions</h3>
                  <button className="ad-link-btn" onClick={() => setActiveSection("transactions")}>View all</button>
                </div>
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead><tr><th>ID</th><th>Buyer</th><th>Vendor</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {transactions.slice(0,5).map(t => {
                        const s = STATUS_MAP[t.status] || { label:t.status, color:"gray" };
                        return (
                          <tr key={t.id}>
                            <td className="ad-td-id">{t.id}</td>
                            <td>{t.buyer}</td>
                            <td>{t.vendor}</td>
                            <td className="ad-td-amount">₦{t.amount.toLocaleString()}</td>
                            <td><span className={`ad-status ad-status--${s.color}`}>{s.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Open disputes quick view */}
              {openDisputes > 0 && (
                <div className="ad-card ad-card--alert">
                  <div className="ad-card__head">
                    <h3 className="ad-card__title"><IconAlert /> {openDisputes} Open Dispute{openDisputes>1?"s":""} Require Attention</h3>
                    <button className="ad-link-btn" onClick={() => setActiveSection("disputes")}>Resolve</button>
                  </div>
                  <div className="ad-disputes-mini">
                    {disputes.filter(d=>d.status==="open").map(d => (
                      <div key={d.id} className="ad-dispute-mini">
                        <span className="ad-dispute-mini__id">{d.id}</span>
                        <span className="ad-dispute-mini__product">{d.product}</span>
                        <span className="ad-dispute-mini__amount">₦{d.amount.toLocaleString()}</span>
                        <span className="ad-dispute-mini__reason">{d.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ TRANSACTIONS ════ */}
          {activeSection === "transactions" && (
            <div className="ad-section">
              <div className="ad-toolbar">
                <div className="ad-search-box">
                  <IconSearch />
                  <input placeholder="Search by ID, buyer or vendor..." value={txnSearch} onChange={e => setTxnSearch(e.target.value)} className="ad-search-input" />
                </div>
                <div className="ad-filter-tabs">
                  {["ALL","PAID_IN_ESCROW","COMPLETED","SHIPPED","DISPUTED","CANCELLED"].map(f => (
                    <button key={f} className={`ad-filter-tab${txnFilter===f?" active":""}`} onClick={() => setTxnFilter(f)}>
                      {f==="ALL" ? "All" : STATUS_MAP[f]?.label || f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ad-card">
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th>ID</th><th>Buyer</th><th>Vendor</th><th>Product</th><th>Amount</th><th>Escrow</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredTxns.map(t => {
                        const s = STATUS_MAP[t.status] || { label:t.status, color:"gray" };
                        return (
                          <tr key={t.id}>
                            <td className="ad-td-id">{t.id}</td>
                            <td>{t.buyer}</td>
                            <td>{t.vendor}</td>
                            <td className="ad-td-product">{t.product}</td>
                            <td className="ad-td-amount">₦{t.amount.toLocaleString()}</td>
                            <td className="ad-td-escrow">
                              {t.escrow > 0 ? `₦${t.escrow.toLocaleString()}` : "—"}
                            </td>
                            <td><span className={`ad-status ad-status--${s.color}`}>{s.label}</span></td>
                            <td className="ad-td-date">{t.date}</td>
                            <td>
                              <div className="ad-action-group">
                                <button className="ad-icon-btn ad-icon-btn--edit" title="Edit balance" onClick={() => setEditModal({ item:t, type:"escrow" })}>
                                  <IconEdit />
                                </button>
                                {(t.status==="PAID_IN_ESCROW"||t.status==="SHIPPED") && t.escrow > 0 && (
                                  <button className="ad-icon-btn ad-icon-btn--release" title="Release funds" onClick={() => setReleaseModal(t)}>
                                    <IconRelease />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredTxns.length === 0 && <div className="ad-table-empty">No transactions found</div>}
                </div>
              </div>
            </div>
          )}

          {/* ════ ESCROW ════ */}
          {activeSection === "escrow" && (
            <div className="ad-section">
              <div className="ad-escrow-cards">
                {[
                  { label:"Total In Escrow",     val:`₦${escrowTotal.toLocaleString()}`,                       color:"gold",   Icon:IconLock,    sub:"Across all active orders" },
                  { label:"Available to Vendors", val:`₦${MOCK_STATS.availableBalance.toLocaleString()}`,       color:"green",  Icon:IconDollar,  sub:"Released & withdrawable" },
                  { label:"Total Revenue",        val:`₦${MOCK_STATS.totalRevenue.toLocaleString()}`,           color:"blue",   Icon:IconTrendUp, sub:"Platform lifetime" },
                ].map((c,i) => (
                  <div key={i} className={`ad-escrow-card ad-escrow-card--${c.color}`}>
                    <div className="ad-escrow-card__icon"><c.Icon /></div>
                    <div className="ad-escrow-card__val">{c.val}</div>
                    <div className="ad-escrow-card__label">{c.label}</div>
                    <div className="ad-escrow-card__sub">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="ad-card">
                <div className="ad-card__head">
                  <h3 className="ad-card__title">Escrow Balances by Transaction</h3>
                </div>
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th>ID</th><th>Buyer</th><th>Vendor</th><th>Product</th><th>Escrow Amount</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => {
                        const s = STATUS_MAP[t.status] || { label:t.status, color:"gray" };
                        return (
                          <tr key={t.id}>
                            <td className="ad-td-id">{t.id}</td>
                            <td>{t.buyer}</td>
                            <td>{t.vendor}</td>
                            <td className="ad-td-product">{t.product}</td>
                            <td className={`ad-td-escrow${t.escrow>0?" active":""}`}>
                              {t.escrow > 0 ? `₦${t.escrow.toLocaleString()}` : "Released"}
                            </td>
                            <td><span className={`ad-status ad-status--${s.color}`}>{s.label}</span></td>
                            <td>
                              <div className="ad-action-group">
                                <button className="ad-icon-btn ad-icon-btn--edit" title="Update balance" onClick={() => setEditModal({ item:t, type:"escrow" })}>
                                  <IconEdit />
                                </button>
                                {t.escrow > 0 && (t.status==="PAID_IN_ESCROW"||t.status==="SHIPPED") && (
                                  <button className="ad-icon-btn ad-icon-btn--release" title="Release funds" onClick={() => setReleaseModal(t)}>
                                    <IconRelease />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ VENDORS ════ */}
          {activeSection === "vendors" && (
            <div className="ad-section">
              <div className="ad-toolbar">
                <div className="ad-search-box">
                  <IconSearch />
                  <input placeholder="Search vendors..." value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} className="ad-search-input" />
                </div>
                <div className="ad-vendor-summary">
                  <span className="ad-vsumm"><span className="ad-vsumm__dot green"/>Active: {vendors.filter(v=>v.status==="active").length}</span>
                  <span className="ad-vsumm"><span className="ad-vsumm__dot red"/>Suspended: {vendors.filter(v=>v.status==="suspended").length}</span>
                  <span className="ad-vsumm"><span className="ad-vsumm__dot gold"/>Unverified: {vendors.filter(v=>!v.verified).length}</span>
                </div>
              </div>
              <div className="ad-card">
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>Business</th><th>Email</th><th>Sales</th><th>Joined</th><th>Verified</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredVendors.map(v => (
                        <tr key={v.id} className={v.status==="suspended"?"ad-tr--suspended":""}>
                          <td className="ad-td-id">{v.id}</td>
                          <td className="ad-td-name">{v.name}</td>
                          <td>{v.business}</td>
                          <td className="ad-td-email">{v.email}</td>
                          <td className="ad-td-amount">{v.sales}</td>
                          <td className="ad-td-date">{v.joinDate}</td>
                          <td>
                            {v.verified
                              ? <span className="ad-status ad-status--green">Verified</span>
                              : <span className="ad-status ad-status--gold">Pending</span>
                            }
                          </td>
                          <td>
                            <span className={`ad-status ad-status--${v.status==="active"?"green":"red"}`}>
                              {v.status === "active" ? "Active" : "Suspended"}
                            </span>
                          </td>
                          <td>
                            <div className="ad-action-group">
                              {!v.verified && (
                                <button className="ad-icon-btn ad-icon-btn--verify" title="Verify vendor" onClick={() => handleVerifyVendor(v.id)}>
                                  <IconCheck />
                                </button>
                              )}
                              <button
                                className={`ad-icon-btn ${v.status==="active"?"ad-icon-btn--ban":"ad-icon-btn--verify"}`}
                                title={v.status==="active"?"Suspend vendor":"Reinstate vendor"}
                                onClick={() => handleSuspendVendor(v.id)}
                              >
                                {v.status==="active" ? <IconBan /> : <IconRefresh />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ DISPUTES ════ */}
          {activeSection === "disputes" && (
            <div className="ad-section">
              <div className="ad-dispute-cards">
                <div className="ad-dstat ad-dstat--red"><IconAlert /><span className="ad-dstat__val">{disputes.filter(d=>d.status==="open").length}</span><span className="ad-dstat__label">Open</span></div>
                <div className="ad-dstat ad-dstat--green"><IconCheck /><span className="ad-dstat__val">{disputes.filter(d=>d.status==="resolved").length}</span><span className="ad-dstat__label">Resolved</span></div>
                <div className="ad-dstat ad-dstat--gold"><IconDollar /><span className="ad-dstat__val">₦{disputes.filter(d=>d.status==="open").reduce((s,d)=>s+d.amount,0).toLocaleString()}</span><span className="ad-dstat__label">At Risk</span></div>
              </div>

              <div className="ad-disputes-list">
                {disputes.map(d => (
                  <div key={d.id} className={`ad-dispute-card${d.status==="resolved"?" resolved":""}`}>
                    <div className="ad-dispute-card__header">
                      <div className="ad-dispute-card__ids">
                        <span className="ad-dispute-card__id">{d.id}</span>
                        <span className="ad-dispute-card__txn">→ {d.txn}</span>
                      </div>
                      <span className={`ad-status ${d.status==="open"?"ad-status--red":"ad-status--green"}`}>
                        {d.status === "open" ? "Open" : "Resolved"}
                      </span>
                    </div>
                    <div className="ad-dispute-card__body">
                      <div className="ad-dispute-card__product">{d.product}</div>
                      <div className="ad-dispute-card__meta">
                        <span>Buyer: <strong>{d.buyer}</strong></span>
                        <span>Vendor: <strong>{d.vendor}</strong></span>
                        <span>Amount: <strong className="ad-td-amount">₦{d.amount.toLocaleString()}</strong></span>
                        <span>Date: <strong>{d.date}</strong></span>
                      </div>
                      <div className="ad-dispute-card__reason">
                        <IconAlert /> {d.reason}
                      </div>
                      {d.decision && (
                        <div className="ad-dispute-card__resolution">
                          Decision: <strong>{d.decision === "buyer" ? "Buyer Refunded" : d.decision === "vendor" ? "Vendor Paid" : "Split 50/50"}</strong>
                        </div>
                      )}
                    </div>
                    {d.status === "open" && (
                      <div className="ad-dispute-card__actions">
                        <button className="ad-btn ad-btn--gold ad-btn--sm" onClick={() => setDisputeModal(d)}>
                          Resolve Dispute
                        </button>
                        <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setReleaseModal(transactions.find(t=>t.id===d.txn)||transactions[0])}>
                          Release Funds
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {editModal   && <EditBalanceModal  item={editModal.item} type={editModal.type} onClose={() => setEditModal(null)}   onSave={handleUpdateBalance} />}
      {disputeModal&& <DisputeModal      dispute={disputeModal}                       onClose={() => setDisputeModal(null)} onResolve={handleResolveDispute} />}
      {releaseModal&& <ReleaseFundsModal txn={releaseModal}                           onClose={() => setReleaseModal(null)} onConfirm={handleReleaseFunds} />}

      {/* ── TOAST ── */}
      {toast && <div className="ad-toast"><IconCheck />{toast}</div>}
    </div>
  );
}