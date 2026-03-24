import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorDashboard.css";

/* ── Icons ── */
const IconHome      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconPackage   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>);
const IconShoppingBag=()=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
const IconLock      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>);
const IconDollar    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>);
const IconBell      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const IconPlus      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconEdit      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconTrash     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const IconX         = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconUpload    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>);
const IconCheck     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconTrendUp   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>);
const IconArrowLeft = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
const IconEye       = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconUser      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconCalendar  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconShield    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>);
const IconStar      = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);

/* ── Mock Data ── */
const MOCK_VENDOR = {
  name: "Adaeze Okonkwo",
  businessName: "Adaeze Fashion Hub",
  email: "adaeze@fashionhub.ng",
  phone: "+234 812 345 6789",
  avatar: null,
  joinDate: "January 2026",
  rating: 4.9,
  totalSales: 47,
  verified: true,
};

const MOCK_PRODUCTS = [
  { id:1, name:"Ankara Midi Dress",     category:"Fashion & Clothing",  price:12500,  qty:15, available:true,  image:null, availFrom:"2026-01-01", availTo:"2026-12-31", description:"Beautiful hand-crafted Ankara fabric." },
  { id:2, name:"Adire Print Blouse",    category:"Fashion & Clothing",  price:8000,   qty:8,  available:true,  image:null, availFrom:"2026-01-01", availTo:"2026-06-30", description:"Traditional hand-dyed Adire blouse." },
  { id:3, name:"Aso-Oke Head Wrap",     category:"Fashion & Clothing",  price:5500,   qty:20, available:false, image:null, availFrom:"2026-03-01", availTo:"2026-09-30", description:"Handwoven Aso-Oke in vibrant colours." },
  { id:4, name:"Boubou Kaftan Set",     category:"Fashion & Clothing",  price:22000,  qty:5,  available:true,  image:null, availFrom:"2026-02-01", availTo:"2026-12-31", description:"Elegant full-length Boubou with matching wrapper." },
];

const MOCK_ORDERS = [
  { id:"ORD-001", product:"Ankara Midi Dress",  buyer:"Chioma A.",   amount:12500,  status:"DELIVERED",              date:"Mar 18, 2026" },
  { id:"ORD-002", product:"Adire Print Blouse", buyer:"Kemi O.",     amount:8000,   status:"SHIPPED",                date:"Mar 17, 2026" },
  { id:"ORD-003", product:"Boubou Kaftan Set",  buyer:"Ngozi E.",    amount:22000,  status:"PAID_IN_ESCROW",         date:"Mar 16, 2026" },
  { id:"ORD-004", product:"Ankara Midi Dress",  buyer:"Amaka B.",    amount:12500,  status:"PENDING_PAYMENT",        date:"Mar 15, 2026" },
  { id:"ORD-005", product:"Aso-Oke Head Wrap",  buyer:"Fatima I.",   amount:5500,   status:"COMPLETED",              date:"Mar 14, 2026" },
  { id:"ORD-006", product:"Boubou Kaftan Set",  buyer:"Blessing N.", amount:22000,  status:"PAID_IN_ESCROW",         date:"Mar 13, 2026" },
];

const MOCK_NOTIFICATIONS = [
  { id:1, type:"order",   title:"New order received",          msg:"Chioma placed an order for Ankara Midi Dress",    time:"2 mins ago",  read:false },
  { id:2, type:"escrow",  title:"Funds released",              msg:"₦22,000 released for ORD-005 — Aso-Oke Head Wrap",time:"1 hr ago",   read:false },
  { id:3, type:"verify",  title:"Document verified",           msg:"Your CAC document has been verified successfully", time:"3 hrs ago",  read:true  },
  { id:4, type:"order",   title:"Order marked as delivered",   msg:"Kemi confirmed delivery of Adire Print Blouse",   time:"Yesterday",  read:true  },
  { id:5, type:"escrow",  title:"Payment held in escrow",      msg:"₦22,000 secured for ORD-003 — Boubou Kaftan Set", time:"2 days ago", read:true  },
];

const CATEGORIES = ["Fashion & Clothing","Electronics","Phones & Accessories","Beauty & Health","Home & Furniture","Food & Groceries","Baby & Kids","Automobile Parts","Books & Stationery","Agro & Farm Produce"];

const STATUS_LABELS = {
  PENDING_PAYMENT:         { label:"Awaiting Payment", color:"gray"   },
  PAID_IN_ESCROW:          { label:"In Escrow",        color:"gold"   },
  SHIPPED:                 { label:"Shipped",          color:"blue"   },
  DELIVERED_PENDING_CONFIRMATION: { label:"Confirming", color:"purple"},
  COMPLETED:               { label:"Completed",        color:"green"  },
  CANCELLED:               { label:"Cancelled",        color:"red"    },
};

/* ── Add Product Modal ── */
const AddProductModal = ({ onClose, onSave, editProduct }) => {
  const imgRef = useRef();
  const [form, setForm] = useState(editProduct || {
    name:"", description:"", price:"", qty:"",
    category:"", available:true, image:null,
    availFrom:"", availTo:"",
  });
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: editProduct?.id || Date.now(), price: Number(form.price), qty: Number(form.qty) });
    onClose();
  };

  return (
    <div className="vd-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="vd-modal">
        <div className="vd-modal__header">
          <h2 className="vd-modal__title">{editProduct ? "Edit Product" : "Add New Product"}</h2>
          <button className="vd-modal__close" onClick={onClose}><IconX /></button>
        </div>
        <form onSubmit={handleSubmit} className="vd-modal__form">

          {/* Image upload */}
          <div className="vd-form-field">
            <label className="vd-form-label">Product Image</label>
            <div className={`vd-img-upload${form.image ? " has-img" : ""}`} onClick={() => imgRef.current.click()}>
              <input ref={imgRef} type="file" accept="image/*" style={{ display:"none" }}
                onChange={e => { if(e.target.files[0]) set("image", e.target.files[0]); }} />
              {form.image ? (
                <div className="vd-img-upload__preview">
                  <img src={URL.createObjectURL(form.image)} alt="preview" />
                  <span className="vd-img-upload__change">Click to change</span>
                </div>
              ) : (
                <>
                  <span className="vd-img-upload__icon"><IconUpload /></span>
                  <span className="vd-img-upload__text">Click to upload product image</span>
                  <span className="vd-img-upload__hint">JPG, PNG — max 5MB</span>
                </>
              )}
            </div>
          </div>

          <div className="vd-form-row">
            <div className="vd-form-field">
              <label className="vd-form-label">Product Name <span>*</span></label>
              <input className="vd-form-input" placeholder="e.g. Ankara Midi Dress" value={form.name} onChange={e => set("name", e.target.value)} required />
            </div>
            <div className="vd-form-field">
              <label className="vd-form-label">Category <span>*</span></label>
              <select className="vd-form-input vd-form-select" value={form.category} onChange={e => set("category", e.target.value)} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="vd-form-field">
            <label className="vd-form-label">Description <span>*</span></label>
            <textarea className="vd-form-input vd-form-textarea" placeholder="Describe your product in detail..." value={form.description} onChange={e => set("description", e.target.value)} required rows={3} />
          </div>

          <div className="vd-form-row">
            <div className="vd-form-field">
              <label className="vd-form-label">Price (₦) <span>*</span></label>
              <input className="vd-form-input" type="number" placeholder="e.g. 12500" value={form.price} onChange={e => set("price", e.target.value)} required min="1" />
            </div>
            <div className="vd-form-field">
              <label className="vd-form-label">Quantity <span>*</span></label>
              <input className="vd-form-input" type="number" placeholder="e.g. 10" value={form.qty} onChange={e => set("qty", e.target.value)} required min="1" />
            </div>
          </div>

          <div className="vd-form-row">
            <div className="vd-form-field">
              <label className="vd-form-label">Available From <span>*</span></label>
              <div className="vd-form-icon-wrap">
                <span className="vd-form-icon"><IconCalendar /></span>
                <input className="vd-form-input vd-form-input--icon" type="date" value={form.availFrom} onChange={e => set("availFrom", e.target.value)} required />
              </div>
            </div>
            <div className="vd-form-field">
              <label className="vd-form-label">Available Until <span>*</span></label>
              <div className="vd-form-icon-wrap">
                <span className="vd-form-icon"><IconCalendar /></span>
                <input className="vd-form-input vd-form-input--icon" type="date" value={form.availTo} onChange={e => set("availTo", e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="vd-form-field">
            <label className="vd-form-label">Stock Availability</label>
            <div className="vd-toggle-wrap">
              <button type="button" className={`vd-toggle${form.available ? " on" : ""}`} onClick={() => set("available", !form.available)}>
                <span className="vd-toggle__thumb" />
              </button>
              <span className={`vd-toggle__label${form.available ? " on" : ""}`}>
                {form.available ? "Available for purchase" : "Out of stock / Hidden"}
              </span>
            </div>
          </div>

          <div className="vd-modal__footer">
            <button type="button" className="vd-btn vd-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="vd-btn vd-btn--gold">
              {editProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Dashboard ── */
export default function VendorDashboard() {
  const navigate = useNavigate();
  const [products, setProducts]         = useState(MOCK_PRODUCTS);
  const [orders, setOrders]             = useState(MOCK_ORDERS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [orderFilter, setOrderFilter]   = useState("ALL");
  const [toast, setToast]               = useState("");
  const [showNotifs, setShowNotifs]     = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* Stats */
  const escrowTotal    = orders.filter(o => o.status === "PAID_IN_ESCROW").reduce((s,o) => s + o.amount, 0);
  const availableTotal = orders.filter(o => o.status === "COMPLETED").reduce((s,o) => s + o.amount, 0);
  const totalRevenue   = orders.filter(o => ["COMPLETED","PAID_IN_ESCROW","SHIPPED"].includes(o.status)).reduce((s,o) => s + o.amount, 0);
  const totalOrders    = orders.length;

  /* Product actions */
  const handleSaveProduct = (product) => {
    if (product.id && products.find(p => p.id === product.id)) {
      setProducts(ps => ps.map(p => p.id === product.id ? product : p));
      showToast("Product updated successfully");
    } else {
      setProducts(ps => [...ps, product]);
      showToast("Product added successfully");
    }
  };
  const handleDeleteProduct = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast("Product deleted");
  };
  const handleToggleAvailable = (id) => {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  /* Order status update */
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} updated to ${STATUS_LABELS[newStatus]?.label}`);
  };

  /* Mark notif read */
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read:true })));

  const filteredOrders = orderFilter === "ALL" ? orders : orders.filter(o => o.status === orderFilter);

  const SECTIONS = [
    { id:"overview",      label:"Overview",      Icon:IconHome },
    { id:"products",      label:"Products",      Icon:IconPackage },
    { id:"orders",        label:"Orders",        Icon:IconShoppingBag },
    { id:"escrow",        label:"Escrow",        Icon:IconLock },
    { id:"notifications", label:"Notifications", Icon:IconBell },
  ];

  return (
    <div className="vd-root">

      {/* ── TOPBAR ── */}
      <header className="vd-topbar">
        <div className="vd-topbar__left">
          <button className="vd-back-btn" onClick={() => navigate("/")}><IconArrowLeft /></button>
          <div className="vd-logo">
            <span className="vd-logo__mark">AI</span>
            <span className="vd-logo__text">MarketLink</span>
          </div>
          <span className="vd-topbar__sep" />
          <span className="vd-topbar__title">Vendor Dashboard</span>
        </div>
        <div className="vd-topbar__right">
          {/* Notification bell */}
          <div className="vd-notif-wrap">
            <button className="vd-icon-btn" onClick={() => setShowNotifs(s => !s)}>
              <IconBell />
              {unreadCount > 0 && <span className="vd-badge">{unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="vd-notif-dropdown">
                <div className="vd-notif-dropdown__header">
                  <span>Notifications</span>
                  <button onClick={markAllRead} className="vd-notif-mark-read">Mark all read</button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`vd-notif-item${n.read ? "" : " unread"}`}
                    onClick={() => setNotifications(ns => ns.map(x => x.id===n.id ? {...x,read:true} : x))}>
                    <div className={`vd-notif-item__dot vd-notif-item__dot--${n.type}`} />
                    <div className="vd-notif-item__body">
                      <div className="vd-notif-item__title">{n.title}</div>
                      <div className="vd-notif-item__msg">{n.msg}</div>
                      <div className="vd-notif-item__time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vendor profile */}
          <button className="vd-profile-btn" onClick={() => navigate("/vendor/profile")}>
            <div className="vd-profile-btn__avatar">
              {MOCK_VENDOR.avatar ? <img src={MOCK_VENDOR.avatar} alt="" /> : <IconUser />}
            </div>
            <div className="vd-profile-btn__info">
              <span className="vd-profile-btn__name">{MOCK_VENDOR.name}</span>
              <span className="vd-profile-btn__biz">{MOCK_VENDOR.businessName}</span>
            </div>
            {MOCK_VENDOR.verified && <span className="vd-verified-badge"><IconShield /></span>}
          </button>
        </div>
      </header>

      {/* ── NAV TABS ── */}
      <nav className="vd-nav">
        {SECTIONS.map(s => (
          <button key={s.id} className={`vd-nav-btn${activeSection===s.id?" active":""}`}
            onClick={() => setActiveSection(s.id)}>
            <s.Icon />
            <span>{s.label}</span>
            {s.id==="notifications" && unreadCount > 0 && <span className="vd-nav-badge">{unreadCount}</span>}
          </button>
        ))}
      </nav>

      {/* ── CONTENT ── */}
      <main className="vd-main">

        {/* ════ OVERVIEW ════ */}
        {activeSection === "overview" && (
          <section className="vd-section">
            <div className="vd-section__head">
              <h2 className="vd-section__title">Overview</h2>
              <p className="vd-section__sub">Welcome back, {MOCK_VENDOR.name.split(" ")[0]}</p>
            </div>

            {/* Stats grid */}
            <div className="vd-stats">
              {[
                { Icon:IconLock,        label:"In Escrow",     val:`₦${escrowTotal.toLocaleString()}`,    color:"gold",   sub:"Awaiting delivery confirmation" },
                { Icon:IconDollar,      label:"Available",     val:`₦${availableTotal.toLocaleString()}`, color:"green",  sub:"Ready for withdrawal" },
                { Icon:IconTrendUp,     label:"Total Revenue", val:`₦${totalRevenue.toLocaleString()}`,   color:"blue",   sub:"All time earnings" },
                { Icon:IconShoppingBag, label:"Total Orders",  val:totalOrders,                            color:"purple", sub:`${products.length} active products` },
              ].map((s,i) => (
                <div className="vd-stat-card" key={i} style={{ "--delay": `${i*0.08}s` }}>
                  <div className={`vd-stat-card__icon vd-stat-card__icon--${s.color}`}><s.Icon /></div>
                  <div className="vd-stat-card__body">
                    <div className="vd-stat-card__val">{s.val}</div>
                    <div className="vd-stat-card__label">{s.label}</div>
                    <div className="vd-stat-card__sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders quick view */}
            <div className="vd-card">
              <div className="vd-card__head">
                <h3 className="vd-card__title">Recent Orders</h3>
                <button className="vd-link-btn" onClick={() => setActiveSection("orders")}>View all</button>
              </div>
              <div className="vd-table-wrap">
                <table className="vd-table">
                  <thead><tr><th>Order ID</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.slice(0,4).map(o => {
                      const s = STATUS_LABELS[o.status] || { label: o.status, color:"gray" };
                      return (
                        <tr key={o.id}>
                          <td className="vd-table__id">{o.id}</td>
                          <td>{o.product}</td>
                          <td>{o.buyer}</td>
                          <td className="vd-table__amount">₦{o.amount.toLocaleString()}</td>
                          <td><span className={`vd-status vd-status--${s.color}`}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick product preview */}
            <div className="vd-card">
              <div className="vd-card__head">
                <h3 className="vd-card__title">Your Products</h3>
                <button className="vd-link-btn" onClick={() => setActiveSection("products")}>Manage</button>
              </div>
              <div className="vd-products-mini">
                {products.map(p => (
                  <div key={p.id} className="vd-product-mini">
                    <div className="vd-product-mini__img"><IconPackage /></div>
                    <div className="vd-product-mini__info">
                      <div className="vd-product-mini__name">{p.name}</div>
                      <div className="vd-product-mini__price">₦{p.price.toLocaleString()}</div>
                    </div>
                    <span className={`vd-avail-dot${p.available?" on":""}`} title={p.available?"Available":"Unavailable"} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════ PRODUCTS ════ */}
        {activeSection === "products" && (
          <section className="vd-section">
            <div className="vd-section__head">
              <div>
                <h2 className="vd-section__title">Products</h2>
                <p className="vd-section__sub">{products.length} products listed</p>
              </div>
              <button className="vd-btn vd-btn--gold" onClick={() => { setEditProduct(null); setShowAddModal(true); }}>
                <IconPlus /> Add Product
              </button>
            </div>
            <div className="vd-products-grid">
              {products.map(p => (
                <div key={p.id} className="vd-product-card">
                  <div className="vd-product-card__img">
                    {p.image
                      ? <img src={URL.createObjectURL(p.image)} alt={p.name} />
                      : <div className="vd-product-card__placeholder"><IconPackage /></div>
                    }
                    <span className={`vd-product-card__avail${p.available?" on":""}`}>
                      {p.available ? "Available" : "Hidden"}
                    </span>
                  </div>
                  <div className="vd-product-card__body">
                    <span className="vd-product-card__cat">{p.category}</span>
                    <h3 className="vd-product-card__name">{p.name}</h3>
                    <p className="vd-product-card__desc">{p.description}</p>
                    <div className="vd-product-card__meta">
                      <div>
                        <div className="vd-product-card__price">₦{p.price.toLocaleString()}</div>
                        <div className="vd-product-card__qty">Qty: {p.qty}</div>
                      </div>
                      <div className="vd-product-card__period">
                        <IconCalendar />
                        <span>{p.availFrom} — {p.availTo}</span>
                      </div>
                    </div>
                    <div className="vd-product-card__actions">
                      <button className="vd-icon-btn-sm" title="Toggle availability" onClick={() => handleToggleAvailable(p.id)}>
                        <IconEye />
                      </button>
                      <button className="vd-icon-btn-sm" title="Edit" onClick={() => { setEditProduct(p); setShowAddModal(true); }}>
                        <IconEdit />
                      </button>
                      <button className="vd-icon-btn-sm vd-icon-btn-sm--danger" title="Delete" onClick={() => setDeleteConfirm(p.id)}>
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {products.length === 0 && (
                <div className="vd-empty">
                  <IconPackage />
                  <h3>No products yet</h3>
                  <p>Add your first product to start selling</p>
                  <button className="vd-btn vd-btn--gold" onClick={() => setShowAddModal(true)}><IconPlus /> Add Product</button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ════ ORDERS ════ */}
        {activeSection === "orders" && (
          <section className="vd-section">
            <div className="vd-section__head">
              <div>
                <h2 className="vd-section__title">Orders</h2>
                <p className="vd-section__sub">{orders.length} total orders</p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="vd-order-filters">
              {["ALL","PENDING_PAYMENT","PAID_IN_ESCROW","SHIPPED","COMPLETED","CANCELLED"].map(f => (
                <button key={f} className={`vd-filter-tab${orderFilter===f?" active":""}`} onClick={() => setOrderFilter(f)}>
                  {f === "ALL" ? "All Orders" : STATUS_LABELS[f]?.label || f}
                  <span className="vd-filter-tab__count">
                    {f === "ALL" ? orders.length : orders.filter(o => o.status===f).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="vd-card">
              <div className="vd-table-wrap">
                <table className="vd-table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Product</th><th>Buyer</th>
                      <th>Amount</th><th>Date</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => {
                      const s = STATUS_LABELS[o.status] || { label:o.status, color:"gray" };
                      return (
                        <tr key={o.id}>
                          <td className="vd-table__id">{o.id}</td>
                          <td>{o.product}</td>
                          <td>{o.buyer}</td>
                          <td className="vd-table__amount">₦{o.amount.toLocaleString()}</td>
                          <td className="vd-table__date">{o.date}</td>
                          <td><span className={`vd-status vd-status--${s.color}`}>{s.label}</span></td>
                          <td>
                            {o.status === "PAID_IN_ESCROW" && (
                              <button className="vd-action-btn" onClick={() => handleStatusUpdate(o.id, "SHIPPED")}>
                                Mark Shipped
                              </button>
                            )}
                            {o.status === "PENDING_PAYMENT" && (
                              <button className="vd-action-btn vd-action-btn--cancel" onClick={() => handleStatusUpdate(o.id, "CANCELLED")}>
                                Cancel
                              </button>
                            )}
                            {["SHIPPED","COMPLETED","CANCELLED"].includes(o.status) && (
                              <span className="vd-table__na">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="vd-table-empty">No orders in this category</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ════ ESCROW ════ */}
        {activeSection === "escrow" && (
          <section className="vd-section">
            <div className="vd-section__head">
              <h2 className="vd-section__title">Escrow Balance</h2>
              <p className="vd-section__sub">Your payment protection overview</p>
            </div>

            {/* Escrow summary cards */}
            <div className="vd-escrow-cards">
              <div className="vd-escrow-card vd-escrow-card--gold">
                <div className="vd-escrow-card__icon"><IconLock /></div>
                <div className="vd-escrow-card__val">₦{escrowTotal.toLocaleString()}</div>
                <div className="vd-escrow-card__label">Held in Escrow</div>
                <div className="vd-escrow-card__note">Released when buyers confirm delivery</div>
              </div>
              <div className="vd-escrow-card vd-escrow-card--green">
                <div className="vd-escrow-card__icon"><IconDollar /></div>
                <div className="vd-escrow-card__val">₦{availableTotal.toLocaleString()}</div>
                <div className="vd-escrow-card__label">Available Balance</div>
                <div className="vd-escrow-card__note">Ready for withdrawal to your bank</div>
              </div>
              <div className="vd-escrow-card vd-escrow-card--blue">
                <div className="vd-escrow-card__icon"><IconTrendUp /></div>
                <div className="vd-escrow-card__val">₦{totalRevenue.toLocaleString()}</div>
                <div className="vd-escrow-card__label">Total Revenue</div>
                <div className="vd-escrow-card__note">Lifetime earnings across all orders</div>
              </div>
            </div>

            {/* Escrow explanation */}
            <div className="vd-escrow-info">
              <div className="vd-escrow-info__icon"><IconShield /></div>
              <div>
                <h3 className="vd-escrow-info__title">How Escrow Protects You</h3>
                <p className="vd-escrow-info__text">When a buyer pays, funds are held securely on the platform. Once you ship and the buyer confirms delivery, funds are instantly released to your account. This eliminates fake payment alerts and guarantees you always get paid.</p>
              </div>
            </div>

            {/* Escrow transactions */}
            <div className="vd-card">
              <div className="vd-card__head">
                <h3 className="vd-card__title">Escrow Transactions</h3>
              </div>
              <div className="vd-table-wrap">
                <table className="vd-table">
                  <thead><tr><th>Order ID</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.map(o => {
                      const s = STATUS_LABELS[o.status] || { label:o.status, color:"gray" };
                      return (
                        <tr key={o.id}>
                          <td className="vd-table__id">{o.id}</td>
                          <td>{o.product}</td>
                          <td className="vd-table__amount">₦{o.amount.toLocaleString()}</td>
                          <td><span className={`vd-status vd-status--${s.color}`}>{s.label}</span></td>
                          <td className="vd-table__date">{o.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ════ NOTIFICATIONS ════ */}
        {activeSection === "notifications" && (
          <section className="vd-section">
            <div className="vd-section__head">
              <div>
                <h2 className="vd-section__title">Notifications</h2>
                <p className="vd-section__sub">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button className="vd-btn vd-btn--ghost" onClick={markAllRead}>Mark all as read</button>
              )}
            </div>
            <div className="vd-notifs-list">
              {notifications.map(n => (
                <div key={n.id} className={`vd-notif-full${n.read ? "" : " unread"}`}
                  onClick={() => setNotifications(ns => ns.map(x => x.id===n.id ? {...x,read:true} : x))}>
                  <div className={`vd-notif-full__dot vd-notif-item__dot--${n.type}`} />
                  <div className="vd-notif-full__body">
                    <div className="vd-notif-full__title">{n.title}</div>
                    <div className="vd-notif-full__msg">{n.msg}</div>
                    <div className="vd-notif-full__time">{n.time}</div>
                  </div>
                  {!n.read && <span className="vd-notif-full__unread-dot" />}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── ADD/EDIT PRODUCT MODAL ── */}
      {showAddModal && (
        <AddProductModal
          onClose={() => { setShowAddModal(false); setEditProduct(null); }}
          onSave={handleSaveProduct}
          editProduct={editProduct}
        />
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div className="vd-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="vd-confirm" onClick={e => e.stopPropagation()}>
            <div className="vd-confirm__icon"><IconTrash /></div>
            <h3 className="vd-confirm__title">Delete Product?</h3>
            <p className="vd-confirm__msg">This action cannot be undone. The product will be permanently removed.</p>
            <div className="vd-confirm__btns">
              <button className="vd-btn vd-btn--ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="vd-btn vd-btn--danger" onClick={() => handleDeleteProduct(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div className="vd-toast"><IconCheck />{toast}</div>}
    </div>
  );
}