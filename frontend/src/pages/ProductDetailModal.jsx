import { useState } from "react";
import "./ProductDetailModal.css";

/* ── Icons ── */
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconPackage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconMinus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ── Gallery placeholder slides ── */
const GALLERY_COLORS = [
  { bg: "#e8f5ee", accent: "#1a6b3c" },
  { bg: "#fef9e7", accent: "#d4a017" },
  { bg: "#e8f0fe", accent: "#3b82f6" },
  { bg: "#fce8e8", accent: "#ef4444" },
];

/* ── Main Component ── */
export default function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow }) {
  const [qty, setQty]           = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const colors      = ["#1a6b3c","#d4a017","#2d9e5f","#b8860b","#0f4a2a","#3b82f6"];
  const accentColor = colors[product.id % colors.length];
  const initials    = product.vendor.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  const gallerySlides = product.images?.length > 0
    ? product.images
    : GALLERY_COLORS.map((c,i) => ({ type:"placeholder", bg:c.bg, accent:c.accent, index:i }));

  const handlePrev = () => setActiveImg(i => (i - 1 + gallerySlides.length) % gallerySlides.length);
  const handleNext = () => setActiveImg(i => (i + 1) % gallerySlides.length);

  const handleAddToCart = () => {
    onAddToCart({ ...product, qty });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow?.({ ...product, qty });
  };

  const deliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en-NG", { weekday:"short", month:"short", day:"numeric" });
  };

  return (
    <div className="pd-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pd-modal">

        {/* ── CLOSE ── */}
        <button className="pd-close" onClick={onClose} aria-label="Close"><IconX /></button>

        {/* ── LEFT: GALLERY ── */}
        <div className="pd-gallery">
          {/* Main image */}
          <div className="pd-gallery__main" style={{ background: gallerySlides[activeImg]?.bg || "#e8f5ee" }}>
            {gallerySlides[activeImg]?.url ? (
              <img src={gallerySlides[activeImg].url} alt={product.name} className="pd-gallery__img" />
            ) : (
              <div className="pd-gallery__placeholder">
                <span style={{ color: gallerySlides[activeImg]?.accent || accentColor }}>
                  <IconPackage />
                </span>
                <span className="pd-gallery__placeholder-label" style={{ color: gallerySlides[activeImg]?.accent || accentColor }}>
                  {product.name}
                </span>
              </div>
            )}

            {/* Nav arrows */}
            {gallerySlides.length > 1 && (
              <>
                <button className="pd-gallery__arrow pd-gallery__arrow--left" onClick={handlePrev}><IconChevronLeft /></button>
                <button className="pd-gallery__arrow pd-gallery__arrow--right" onClick={handleNext}><IconChevronRight /></button>
              </>
            )}

            {/* Stock badge */}
            <div className={`pd-stock-badge${product.stock <= 3 ? " low" : ""}`}>
              {product.stock <= 3 ? `Only ${product.stock} left` : "In Stock"}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="pd-gallery__thumbs">
            {gallerySlides.map((slide, i) => (
              <button
                key={i}
                className={`pd-thumb${activeImg === i ? " active" : ""}`}
                onClick={() => setActiveImg(i)}
                style={{ background: slide.bg || "#e8f5ee" }}
              >
                {slide.url
                  ? <img src={slide.url} alt="" />
                  : <span style={{ color: slide.accent || accentColor }}><IconPackage /></span>
                }
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="pd-gallery__dots">
            {gallerySlides.map((_,i) => (
              <button key={i} className={`pd-dot${activeImg===i?" active":""}`} onClick={() => setActiveImg(i)} />
            ))}
          </div>
        </div>

        {/* ── RIGHT: DETAILS ── */}
        <div className="pd-details">
          <div className="pd-details__scroll">

            {/* Category + title */}
            <span className="pd-cat">{product.category}</span>
            <h1 className="pd-title">{product.name}</h1>

            {/* Rating row */}
            <div className="pd-rating-row">
              <div className="pd-stars">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`pd-star${i <= Math.round(product.rating||4.5) ? " on" : ""}`}>
                    <IconStar />
                  </span>
                ))}
              </div>
              <span className="pd-rating-val">{product.rating || "4.5"}</span>
              <span className="pd-rating-count">({product.reviews || 0} reviews)</span>
            </div>

            {/* Price block */}
            <div className="pd-price-block">
              <div className="pd-price">₦{product.price?.toLocaleString()}</div>
              <div className={`pd-stock-text${product.stock <= 3 ? " low" : ""}`}>
                {product.stock <= 3 ? `⚠ Only ${product.stock} units left` : `${product.stock} units available`}
              </div>
            </div>

            {/* Description */}
            <div className="pd-section">
              <h3 className="pd-section__title">Description</h3>
              <p className="pd-desc">{product.description}</p>
            </div>

            {/* Delivery estimate */}
            <div className="pd-delivery">
              <div className="pd-delivery__icon"><IconTruck /></div>
              <div className="pd-delivery__body">
                <div className="pd-delivery__label">Estimated Delivery</div>
                <div className="pd-delivery__date">By <strong>{deliveryDate()}</strong></div>
                <div className="pd-delivery__note">
                  <IconMapPin /> Lagos, Abuja & Port Harcourt — standard delivery
                </div>
              </div>
            </div>

            {/* Escrow protection */}
            <div className="pd-escrow">
              <div className="pd-escrow__header">
                <span className="pd-escrow__icon"><IconShield /></span>
                <span className="pd-escrow__title">Escrow Payment Protection</span>
              </div>
              <div className="pd-escrow__steps">
                {[
                  "You pay — funds held securely on platform",
                  "Vendor ships your order",
                  "You confirm delivery",
                  "Vendor receives payment instantly",
                ].map((s,i) => (
                  <div key={i} className="pd-escrow__step">
                    <span className="pd-escrow__step-num">{i+1}</span>
                    <span className="pd-escrow__step-text">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Quantity</span>
              <div className="pd-qty">
                <button className="pd-qty__btn" onClick={() => setQty(q => Math.max(1, q-1))} disabled={qty <= 1}><IconMinus /></button>
                <span className="pd-qty__val">{qty}</span>
                <button className="pd-qty__btn" onClick={() => setQty(q => Math.min(product.stock||99, q+1))} disabled={qty >= (product.stock||99)}><IconPlus /></button>
              </div>
              <span className="pd-qty-total">= ₦{(product.price * qty).toLocaleString()}</span>
            </div>

          </div>

          {/* ── STICKY CTA ── */}
          <div className="pd-cta">
            <button
              className={`pd-btn pd-btn--cart${addedToCart ? " added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? <><IconCheck /> Added!</> : <><IconCart /> Add to Cart</>}
            </button>
            <button className="pd-btn pd-btn--buy" onClick={handleBuyNow}>
              <IconZap /> Buy Now
            </button>
          </div>

          {/* Vendor strip */}
          <div className="pd-vendor-strip">
            <div className="pd-vendor-strip__avatar" style={{ background: accentColor }}>{initials}</div>
            <div className="pd-vendor-strip__info">
              <span className="pd-vendor-strip__name">{product.vendor}</span>
              <span className="pd-vendor-strip__badge"><IconShield /> Verified Vendor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}