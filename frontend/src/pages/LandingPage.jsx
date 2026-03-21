import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import AuthModal from "./AuthModal";

/* ── Icons ── */
const IconBot = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="13" rx="3"/>
    <path d="M8 8V6a4 4 0 0 1 8 0v2"/>
    <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/>
    <path d="M9 18h6"/><path d="M12 2v2"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconStore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h14l1 5H4L5 4z"/>
    <path d="M3 9h18v1a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3V9z"/>
    <path d="M5 13v7h14v-7"/>
    <rect x="9" y="16" width="6" height="4" rx="1"/>
  </svg>
);
const IconPackage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

/* ── Data ── */
const NAV_LINKS = ["How It Works", "For Vendors", "Features"];

const FEATURES = [
  { Icon: IconBot,      title: "AI-Powered Discovery",    desc: "Describe what you need in plain language and our AI instantly surfaces matching products from verified vendors." },
  { Icon: IconShield,   title: "Built-In Escrow",          desc: "Every payment is held securely on the platform until you confirm delivery. Zero fraud risk on both sides." },
  { Icon: IconStore,    title: "Vendor Storefronts",       desc: "Small businesses get a structured, professional digital presence in minutes — no technical expertise required." },
  { Icon: IconPackage,  title: "Full Order Tracking",      desc: "From payment to doorstep, every stage of the order lifecycle is logged, tracked, and transparent." },
  { Icon: IconChat,     title: "WhatsApp Access",          desc: "Buyers can shop directly through WhatsApp — no app download needed. Commerce meets customers where they are." },
  { Icon: IconTrendUp,  title: "Automatic Vendor Payouts", desc: "Funds are released to vendors automatically the moment a buyer confirms successful delivery." },
];

const STEPS = [
  { num: "01", Icon: IconSearch,  title: "Describe What You Need",  desc: "Tell the AI what you want in plain language. No forms, no filters — just conversation." },
  { num: "02", Icon: IconStore,   title: "Browse Matched Listings", desc: "Curated results from verified vendors with prices, stock levels, and seller info clearly displayed." },
  { num: "03", Icon: IconLock,    title: "Pay Into Escrow",         desc: "Funds are held securely on the platform — protected until your order arrives safely." },
  { num: "04", Icon: IconDollar,  title: "Confirm and Release",     desc: "Received your order? Confirm delivery and the vendor receives their payout instantly." },
];

const CHAT_MESSAGES = [
  { from: "user", text: "I want to buy a black leather bag under ₦25,000" },
  { from: "ai",   text: "Found 4 matching products from verified vendors." },
  { from: "ai",   text: "Top match: Premium Leather Tote — ₦22,500 · In Stock" },
  { from: "user", text: "Looks good. Proceed to checkout." },
  { from: "ai",   text: "Initiating secure escrow checkout. Your funds are protected until delivery." },
];

const VENDOR_ORDERS = [
  { label: "Leather Tote Bag",     status: "Shipped",   color: "blue"  },
  { label: "Black Sneakers",       status: "Delivered", color: "green" },
  { label: "Gold Chain Bracelet",  status: "In Escrow", color: "gold"  },
];

const TRUST_PILLS = [
  { Icon: IconShield, label: "Escrow Protected"  },
  { Icon: IconCheck,  label: "Verified Vendors"  },
  { Icon: IconZap,    label: "Instant AI Search" },
];

/* ── Component ── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [menuOpen, setMenuOpen]               = useState(false);
  const [scrolled, setScrolled]               = useState(false);
  const [authOpen, setAuthOpen]               = useState(false);
  const [authTab, setAuthTab]                 = useState("login");

  const openLogin  = () => { setMenuOpen(false); setAuthTab("login");  setAuthOpen(true); };
  const openSignup = () => { setMenuOpen(false); setAuthTab("signup"); setAuthOpen(true); };
  const goToChat   = () => navigate("/chat");

  useEffect(() => {
    if (visibleMessages < CHAT_MESSAGES.length) {
      const t = setTimeout(() => setVisibleMessages(v => v + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [visibleMessages]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="aml-root">

      {/* ── NAVBAR ── */}
      <nav className={`aml-nav${scrolled ? " aml-nav--scrolled" : ""}`}>
        <div className="aml-nav__inner">
          <a href="/" className="aml-logo">
            <span className="aml-logo__mark">AI</span>
            <span className="aml-logo__text">MarketLink</span>
          </a>

          {/* Desktop nav links */}
          <ul className="aml-nav__links">
            {NAV_LINKS.map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}>{l}</a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="aml-nav__cta">
            <button onClick={openLogin}  className="aml-btn aml-btn--ghost">Log In</button>
            <button onClick={openSignup} className="aml-btn aml-btn--gold">Get Started</button>
          </div>

          {/* Hamburger */}
          <button
            className={`aml-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`aml-mobile-menu${menuOpen ? " open" : ""}`}>
        <ul className="aml-mobile-menu__links">
          {NAV_LINKS.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)}>{l}</a>
            </li>
          ))}
        </ul>
        <div className="aml-mobile-menu__cta">
          <button onClick={openLogin}  className="aml-btn aml-btn--ghost aml-btn--full">Log In</button>
          <button onClick={openSignup} className="aml-btn aml-btn--gold aml-btn--full">Get Started Free</button>
        </div>
      </div>
      {menuOpen && <div className="aml-overlay" onClick={() => setMenuOpen(false)} />}

      {/* ── HERO ── */}
      <section className="aml-hero">
        <div className="aml-hero__bg">
          <div className="aml-hero__blob aml-hero__blob--1" />
          <div className="aml-hero__blob aml-hero__blob--2" />
          <div className="aml-hero__grid" />
        </div>
        <div className="aml-hero__inner">
          <div className="aml-hero__copy">
            <div className="aml-badge">
              <span className="aml-badge__icon"><IconGlobe /></span>
              Built for African Commerce
            </div>
            <h1 className="aml-hero__h1">
              Shop Smarter.<br />
              <span className="aml-hero__accent">Pay Safer.</span><br />
              Trade with Trust.
            </h1>
            <p className="aml-hero__sub">
              AI MarketLink combines conversational product discovery with
              built-in escrow payments — eliminating fraud and building
              confidence in African digital commerce.
            </p>
            <div className="aml-hero__actions">
              <button onClick={goToChat}   className="aml-btn aml-btn--gold aml-btn--lg">Start Shopping Free</button>
              <button onClick={openSignup} className="aml-btn aml-btn--outline aml-btn--lg">
                Sell on MarketLink
                <span className="aml-btn__arrow"><IconArrowRight /></span>
              </button>
            </div>
            <div className="aml-hero__trust">
              {TRUST_PILLS.map(({ Icon, label }) => (
                <span className="aml-trust-pill" key={label}>
                  <span className="aml-trust-pill__icon"><Icon /></span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Chat Demo */}
          <div className="aml-chat">
            <div className="aml-chat__header">
              <div className="aml-chat__avatar"><IconBot /></div>
              <div>
                <div className="aml-chat__name">MarketLink AI Assistant</div>
                <div className="aml-chat__status">
                  <span className="aml-chat__dot" />Online — ready to help
                </div>
              </div>
            </div>
            <div className="aml-chat__body">
              {CHAT_MESSAGES.slice(0, visibleMessages).map((m, i) => (
                <div key={i} className={`aml-chat__msg aml-chat__msg--${m.from}`}>{m.text}</div>
              ))}
              {visibleMessages < CHAT_MESSAGES.length && (
                <div className="aml-chat__typing"><span /><span /><span /></div>
              )}
            </div>
            <div className="aml-chat__input">
              <input placeholder="Describe what you are looking for..." readOnly />
              <button onClick={goToChat} aria-label="Go to chat"><IconSend /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="aml-steps" id="how-it-works">
        <div className="aml-container">
          <div className="aml-section-label">How It Works</div>
          <h2 className="aml-section-h2">From Conversation to Doorstep in 4 Steps</h2>
          <div className="aml-steps__grid">
            {STEPS.map((s, i) => (
              <div className="aml-step" key={i}>
                <div className="aml-step__icon-wrap"><s.Icon /></div>
                <div className="aml-step__num">{s.num}</div>
                <h3 className="aml-step__title">{s.title}</h3>
                <p className="aml-step__desc">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="aml-step__arrow"><IconArrowRight /></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="aml-features" id="features">
        <div className="aml-container">
          <div className="aml-section-label">Platform Features</div>
          <h2 className="aml-section-h2">Everything You Need to Trade with Confidence</h2>
          <div className="aml-features__grid">
            {FEATURES.map((f, i) => (
              <div className="aml-feature-card" key={i}>
                <div className="aml-feature-card__icon"><f.Icon /></div>
                <h3 className="aml-feature-card__title">{f.title}</h3>
                <p className="aml-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR VENDORS ── */}
      <section className="aml-vendors" id="for-vendors">
        <div className="aml-container aml-vendors__inner">
          <div className="aml-vendors__copy">
            <div className="aml-section-label aml-section-label--light">For Vendors</div>
            <h2 className="aml-vendors__h2">Turn Your Informal Business Into a Verified Digital Storefront</h2>
            <p className="aml-vendors__desc">
              List products, manage orders, and receive secure payments —
              all from one clean dashboard. No technical expertise required.
            </p>
            <ul className="aml-vendors__list">
              {[
                "Free storefront setup — live in minutes",
                "Full orders and inventory management",
                "Escrow-backed payments — no fake alerts",
                "Automatic payout on delivery confirmation",
              ].map((item, i) => (
                <li key={i}>
                  <span className="aml-vendors__check"><IconCheck /></span>{item}
                </li>
              ))}
            </ul>
            <button onClick={openSignup} className="aml-btn aml-btn--gold aml-btn--lg">Become a Vendor</button>
          </div>

          <div className="aml-vendors__visual">
            <div className="aml-dashboard-mock">
              <div className="aml-dashboard-mock__bar">
                <span className="aml-dashboard-mock__dot" />
                <span className="aml-dashboard-mock__dot" />
                <span className="aml-dashboard-mock__dot" />
                <span className="aml-dashboard-mock__title">Vendor Dashboard</span>
              </div>
              <div className="aml-dashboard-mock__stats">
                {[
                  { Icon: IconLock,    val: "₦142,500", label: "In Escrow" },
                  { Icon: IconDollar,  val: "₦380,000", label: "Available" },
                  { Icon: IconPackage, val: "24",        label: "Orders" },
                ].map((s, i) => (
                  <div className="aml-stat" key={i}>
                    <div className="aml-stat__icon"><s.Icon /></div>
                    <div className="aml-stat__val">{s.val}</div>
                    <div className="aml-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="aml-dashboard-mock__orders">
                <div className="aml-dashboard-mock__orders-title">Recent Orders</div>
                {VENDOR_ORDERS.map((o, i) => (
                  <div className="aml-order-row" key={i}>
                    <span className="aml-order-row__label">{o.label}</span>
                    <span className={`aml-order-row__status aml-order-row__status--${o.color}`}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="aml-cta">
        <div className="aml-cta__blob" />
        <div className="aml-container aml-cta__inner">
          <h2 className="aml-cta__h2">Ready to Trade Without Fear?</h2>
          <p className="aml-cta__sub">Join buyers and vendors building a new standard of trust in African digital commerce.</p>
          <div className="aml-cta__actions">
            <button onClick={goToChat}   className="aml-btn aml-btn--gold aml-btn--lg">Start Shopping Free</button>
            <button onClick={openSignup} className="aml-btn aml-btn--outline-dark aml-btn--lg">List Your Products</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="aml-footer">
        <div className="aml-container aml-footer__inner">
          <a href="/" className="aml-logo">
            <span className="aml-logo__mark">AI</span>
            <span className="aml-logo__text">MarketLink</span>
          </a>
          <p className="aml-footer__tagline">Secure. Conversational. African Commerce.</p>
          <div className="aml-footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
          <p className="aml-footer__copy">© 2026 AI MarketLink. All rights reserved.</p>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </div>
  );
}