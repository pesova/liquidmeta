import { useState } from "react";
import { ordersAPI, paymentsAPI, isLoggedIn, getUser } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

/* ── Icons ── */
const IconArrowLeft  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
const IconShield     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>);
const IconCheck      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconPackage    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>);
const IconMapPin     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const IconTag        = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>);
const IconCreditCard = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>);
const IconLock       = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>);
const IconTruck      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>);
const IconStar       = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const IconX          = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconLoader     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ck-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);
const IconConfetti   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7.5 10.5c.828 0 1.5-.672 1.5-1.5S8.328 7.5 7.5 7.5 6 8.172 6 9s.672 1.5 1.5 1.5z" fill="currentColor" stroke="none"/><path d="M16.5 13.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" fill="currentColor" stroke="none"/><path d="M12 17c2.21 0 4-1.343 4-3H8c0 1.657 1.79 3 4 3z"/></svg>);

/* ── Mock product (in production comes from cart/router state) ── */
const DEMO_PRODUCT = {
  id: 2, name: "Ankara Midi Dress", category: "Fashion & Clothing",
  price: 12500, qty: 1, vendor: "Adaeze Fashion Hub",
  rating: 4.9, reviews: 87, stock: 12,
  description: "Beautiful hand-crafted Ankara fabric.",
};

/* ── Step indicator ── */
const Steps = ({ current }) => {
  const steps = ["Delivery", "Payment", "Confirm"];
  return (
    <div className="ck-steps">
      {steps.map((s, i) => (
        <div key={s} className={`ck-step${i < current ? " done" : ""}${i === current ? " active" : ""}`}>
          <div className="ck-step__dot">
            {i < current ? <IconCheck /> : <span>{i + 1}</span>}
          </div>
          <span className="ck-step__label">{s}</span>
          {i < steps.length - 1 && <div className="ck-step__line" />}
        </div>
      ))}
    </div>
  );
};

/* ── Order Summary Card ── */
const OrderSummary = ({ product, qty, promo, promoValid, total, fee }) => {
  const colors = ["#1a6b3c","#d4a017","#2d9e5f","#b8860b"];
  const color  = colors[product.id % colors.length];
  const initials = product.vendor.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="ck-summary">
      <h3 className="ck-summary__title">Order Summary</h3>

      {/* Product */}
      <div className="ck-summary__product">
        <div className="ck-summary__img" style={{ background:`${color}18` }}>
          <span style={{ color }}><IconPackage /></span>
        </div>
        <div className="ck-summary__info">
          <div className="ck-summary__name">{product.name}</div>
          <div className="ck-summary__cat">{product.category}</div>
          <div className="ck-summary__vendor">
            <span className="ck-vendor-dot" style={{ background:color }}>{initials}</span>
            {product.vendor}
          </div>
          <div className="ck-summary__rating">
            <IconStar />{product.rating} <span>({product.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="ck-summary__breakdown">
        <div className="ck-breakdown-row">
          <span>Price × {qty}</span>
          <span>₦{(product.price * qty).toLocaleString()}</span>
        </div>
        <div className="ck-breakdown-row">
          <span>Delivery fee</span>
          <span>₦{fee.toLocaleString()}</span>
        </div>
        {promoValid && (
          <div className="ck-breakdown-row ck-breakdown-row--promo">
            <span>Promo discount</span>
            <span>−₦{Math.round(product.price * qty * 0.1).toLocaleString()}</span>
          </div>
        )}
        <div className="ck-breakdown-row ck-breakdown-row--total">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Escrow protection */}
      <div className="ck-escrow-box">
        <div className="ck-escrow-box__header">
          <IconShield />
          <span>Escrow Payment Protection</span>
        </div>
        <div className="ck-escrow-steps">
          {[
            "You pay — funds held securely",
            "Vendor ships your order",
            "You confirm delivery",
            "Vendor receives payment",
          ].map((s, i) => (
            <div key={i} className="ck-escrow-step">
              <span className="ck-escrow-step__num">{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Checkout Page ── */
export default function CheckoutPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // In production: const product = location.state?.product || DEMO_PRODUCT
  const product   = DEMO_PRODUCT;

  const [step, setStep]           = useState(0); // 0=delivery, 1=payment, 2=confirm
  const [loading, setLoading]     = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId]                 = useState(`ORD-${Math.floor(Math.random()*90000)+10000}`);

  /* Delivery form */
  const [address, setAddress] = useState({
    fullName:"", phone:"", street:"", city:"", state:"", landmark:"",
  });

  /* Payment */
  const [payMethod, setPayMethod] = useState("");

  /* Promo */
  const [promoCode, setPromoCode]   = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [qty]                       = useState(1);

  const deliveryFee = 1500;
  const discount    = promoValid ? Math.round(product.price * qty * 0.1) : 0;
  const total       = product.price * qty + deliveryFee - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "MARKETLINK10") {
      setPromoValid(true); setPromoError("");
    } else {
      setPromoValid(false); setPromoError("Invalid promo code");
    }
  };

  const handleDeliveryNext = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();
    if (!payMethod) return;
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      if (isLoggedIn()) {
        // Step 1 — Create order
        const user = getUser();
        const orderRes = await ordersAPI.create({
          productId: product.id || product._id,
          quantity: qty,
          deliveryAddress: {
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            landmark: address.landmark,
          },
        });

        const createdOrder = orderRes.data?.order || orderRes.data;
        const createdOrderId = createdOrder?._id || createdOrder?.id;

        // Step 2 — Initiate payment, get Interswitch URL
        const payRes = await paymentsAPI.initiate(createdOrderId);
        const paymentUrl = payRes.data?.paymentUrl || payRes.data?.checkoutUrl || payRes.data?.url;

        if (paymentUrl) {
          // Redirect buyer to Interswitch checkout
          window.location.href = paymentUrl;
          return;
        }
      }
      // Fallback — show success (for demo/mock)
      setLoading(false);
      setConfirmed(true);
    } catch (err) {
      console.error("Payment error:", err);
      // Fallback to demo confirmation
      setLoading(false);
      setConfirmed(true);
    }
  };

  const PAY_METHODS = [
    {
      id: "interswitch",
      name: "Interswitch",
      desc: "Pay securely via Interswitch Quickteller",
      badge: "Recommended",
      badgeColor: "gold",
    },
    {
      id: "paystack",
      name: "Paystack",
      desc: "Pay with card, bank transfer or USSD via Paystack",
      badge: "Popular",
      badgeColor: "green",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      desc: "Direct bank transfer to our escrow account",
      badge: null,
    },
  ];

  /* ── ORDER CONFIRMED SCREEN ── */
  if (confirmed) {
    return (
      <div className="ck-root">
        <div className="ck-confirmed">
          <div className="ck-confirmed__particles">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="ck-particle" style={{ "--i": i }} />
            ))}
          </div>
          <div className="ck-confirmed__icon">
            <IconCheck />
          </div>
          <h1 className="ck-confirmed__title">Order Placed!</h1>
          <p className="ck-confirmed__order">{orderId}</p>
          <p className="ck-confirmed__msg">
            Your payment of <strong>₦{total.toLocaleString()}</strong> is now held safely in escrow.
            The vendor has been notified and will ship your order soon.
          </p>

          <div className="ck-confirmed__steps">
            {[
              { label:"Payment secured in escrow", done:true  },
              { label:"Vendor notified",           done:true  },
              { label:"Vendor ships order",        done:false },
              { label:"You confirm delivery",      done:false },
              { label:"Funds released to vendor",  done:false },
            ].map((s, i) => (
              <div key={i} className={`ck-confirmed__step${s.done?" done":""}`}>
                <span className="ck-confirmed__step-dot">
                  {s.done ? <IconCheck /> : <span>{i + 1}</span>}
                </span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="ck-confirmed__actions">
            <button className="ck-btn ck-btn--gold" onClick={() => navigate("/chat")}>
              Continue Shopping
            </button>
            <button className="ck-btn ck-btn--ghost" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>

          <p className="ck-confirmed__note">
            <IconShield /> Your money is safe until you confirm delivery
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ck-root">

      {/* ── TOPBAR ── */}
      <header className="ck-topbar">
        <button className="ck-back-btn" onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}>
          <IconArrowLeft />
        </button>
        <div className="ck-logo">
          <span className="ck-logo__mark">AI</span>
          <span className="ck-logo__text">MarketLink</span>
        </div>
        <div className="ck-topbar__secure">
          <IconLock /> Secure Checkout
        </div>
      </header>

      {/* ── STEPS ── */}
      <div className="ck-steps-wrap">
        <Steps current={step} />
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="ck-layout">

        {/* ── LEFT: FORMS ── */}
        <div className="ck-forms">

          {/* ── STEP 0: DELIVERY ── */}
          {step === 0 && (
            <div className="ck-card">
              <div className="ck-card__header">
                <IconMapPin />
                <h2 className="ck-card__title">Delivery Address</h2>
              </div>
              <form onSubmit={handleDeliveryNext} className="ck-form">
                <div className="ck-form-row">
                  <div className="ck-form-field">
                    <label className="ck-label">Full Name <span>*</span></label>
                    <input className="ck-input" placeholder="Your full name" value={address.fullName} onChange={e => setAddress(a => ({...a, fullName:e.target.value}))} required />
                  </div>
                  <div className="ck-form-field">
                    <label className="ck-label">Phone Number <span>*</span></label>
                    <input className="ck-input" placeholder="+234 800 000 0000" value={address.phone} onChange={e => setAddress(a => ({...a, phone:e.target.value}))} required />
                  </div>
                </div>
                <div className="ck-form-field">
                  <label className="ck-label">Street Address <span>*</span></label>
                  <input className="ck-input" placeholder="House number, street name" value={address.street} onChange={e => setAddress(a => ({...a, street:e.target.value}))} required />
                </div>
                <div className="ck-form-row">
                  <div className="ck-form-field">
                    <label className="ck-label">City <span>*</span></label>
                    <input className="ck-input" placeholder="e.g. Lagos" value={address.city} onChange={e => setAddress(a => ({...a, city:e.target.value}))} required />
                  </div>
                  <div className="ck-form-field">
                    <label className="ck-label">State <span>*</span></label>
                    <select className="ck-input ck-select" value={address.state} onChange={e => setAddress(a => ({...a, state:e.target.value}))} required>
                      <option value="">Select state</option>
                      {["Lagos","Abuja","Rivers","Kano","Oyo","Delta","Enugu","Kaduna","Anambra","Imo","Ogun","Kwara","Edo","Cross River","Abia","Akwa Ibom","Bauchi","Benue","Borno","Ebonyi","Ekiti","Gombe","Jigawa","Kebbi","Kogi","Nasarawa","Niger","Ondo","Osun","Plateau","Sokoto","Taraba","Yobe","Zamfara"].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="ck-form-field">
                  <label className="ck-label">Landmark <span className="ck-optional">(optional)</span></label>
                  <input className="ck-input" placeholder="Nearest bus stop, church, school..." value={address.landmark} onChange={e => setAddress(a => ({...a, landmark:e.target.value}))} />
                </div>

                {/* Promo code */}
                <div className="ck-promo">
                  <div className="ck-promo__label"><IconTag /> Promo Code</div>
                  <div className="ck-promo__row">
                    <input
                      className={`ck-input ck-promo__input${promoValid?" valid":""}${promoError?" error":""}`}
                      placeholder="Enter promo code (try MARKETLINK10)"
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value); setPromoError(""); setPromoValid(false); }}
                    />
                    <button type="button" className="ck-btn ck-btn--outline ck-promo__btn" onClick={applyPromo}>
                      Apply
                    </button>
                  </div>
                  {promoValid && <p className="ck-promo__success"><IconCheck /> 10% discount applied!</p>}
                  {promoError && <p className="ck-promo__error"><IconX /> {promoError}</p>}
                </div>

                {/* Delivery info */}
                <div className="ck-delivery-note">
                  <IconTruck />
                  <div>
                    <div className="ck-delivery-note__title">Standard Delivery — ₦1,500</div>
                    <div className="ck-delivery-note__sub">3–5 business days · Lagos, Abuja & Port Harcourt</div>
                  </div>
                </div>

                <button type="submit" className="ck-btn ck-btn--gold ck-btn--full">
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 1: PAYMENT ── */}
          {step === 1 && (
            <div className="ck-card">
              <div className="ck-card__header">
                <IconCreditCard />
                <h2 className="ck-card__title">Select Payment Method</h2>
              </div>
              <form onSubmit={handlePaymentNext} className="ck-form">
                <div className="ck-pay-methods">
                  {PAY_METHODS.map(m => (
                    <label key={m.id} className={`ck-pay-method${payMethod===m.id?" active":""}`}>
                      <input
                        type="radio" name="payMethod" value={m.id}
                        checked={payMethod === m.id}
                        onChange={() => setPayMethod(m.id)}
                        className="ck-pay-method__radio"
                      />
                      <div className="ck-pay-method__icon">
                        {m.id === "interswitch" && (
                          <svg viewBox="0 0 40 20" fill="none"><rect width="40" height="20" rx="4" fill="#e63946"/><text x="4" y="14" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">INTER</text><text x="22" y="14" fill="#f4d03f" fontSize="7" fontWeight="bold" fontFamily="sans-serif">SWITCH</text></svg>
                        )}
                        {m.id === "paystack" && (
                          <svg viewBox="0 0 40 20" fill="none"><rect width="40" height="20" rx="4" fill="#0ba4db"/><text x="6" y="14" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Paystack</text></svg>
                        )}
                        {m.id === "bank" && (
                          <div className="ck-bank-icon"><IconCreditCard /></div>
                        )}
                      </div>
                      <div className="ck-pay-method__body">
                        <div className="ck-pay-method__name">
                          {m.name}
                          {m.badge && (
                            <span className={`ck-pay-badge ck-pay-badge--${m.badgeColor}`}>{m.badge}</span>
                          )}
                        </div>
                        <div className="ck-pay-method__desc">{m.desc}</div>
                        {m.id === "bank" && payMethod === "bank" && (
                          <div className="ck-bank-details">
                            <div className="ck-bank-row"><span>Bank</span><strong>Wema Bank</strong></div>
                            <div className="ck-bank-row"><span>Account Name</span><strong>AI MarketLink Escrow</strong></div>
                            <div className="ck-bank-row"><span>Account Number</span><strong>0123456789</strong></div>
                            <div className="ck-bank-row"><span>Amount</span><strong>₦{total.toLocaleString()}</strong></div>
                            <p className="ck-bank-note">Use your order ID <strong>{orderId}</strong> as payment reference</p>
                          </div>
                        )}
                      </div>
                      <div className={`ck-pay-method__check${payMethod===m.id?" active":""}`}>
                        {payMethod === m.id && <IconCheck />}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="ck-escrow-reminder">
                  <IconShield />
                  <p>Your payment goes into <strong>escrow</strong> — not directly to the vendor. Funds are released only after you confirm delivery.</p>
                </div>

                <button type="submit" className="ck-btn ck-btn--gold ck-btn--full" disabled={!payMethod}>
                  Review Order
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: CONFIRM ── */}
          {step === 2 && (
            <div className="ck-card">
              <div className="ck-card__header">
                <IconCheck />
                <h2 className="ck-card__title">Review & Confirm</h2>
              </div>
              <div className="ck-review">

                {/* Delivery review */}
                <div className="ck-review-section">
                  <div className="ck-review-section__head">
                    <span><IconMapPin /> Delivery Address</span>
                    <button className="ck-review-edit" onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <div className="ck-review-section__body">
                    <strong>{address.fullName}</strong> · {address.phone}<br />
                    {address.street}, {address.city}, {address.state}
                    {address.landmark && <><br /><span className="ck-review-muted">Near: {address.landmark}</span></>}
                  </div>
                </div>

                {/* Payment review */}
                <div className="ck-review-section">
                  <div className="ck-review-section__head">
                    <span><IconCreditCard /> Payment Method</span>
                    <button className="ck-review-edit" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className="ck-review-section__body">
                    {PAY_METHODS.find(m => m.id === payMethod)?.name}
                  </div>
                </div>

                {/* Price review */}
                <div className="ck-review-section">
                  <div className="ck-review-section__head">
                    <span><IconPackage /> Order Total</span>
                  </div>
                  <div className="ck-review-total">₦{total.toLocaleString()}</div>
                  <p className="ck-review-escrow-note">
                    <IconShield /> This amount will be held in escrow until you confirm delivery
                  </p>
                </div>

                <button
                  className="ck-btn ck-btn--gold ck-btn--full ck-btn--lg"
                  onClick={handleConfirmPayment}
                  disabled={loading}
                >
                  {loading
                    ? <><IconLoader /> Processing payment...</>
                    : <><IconLock /> Pay ₦{total.toLocaleString()} Securely</>
                  }
                </button>

                <p className="ck-confirm-note">
                  By confirming, you agree to our escrow payment terms. Your funds are protected until delivery.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div className="ck-sidebar">
          <OrderSummary
            product={product}
            qty={qty}
            promo={promoCode}
            promoValid={promoValid}
            total={total}
            fee={deliveryFee}
          />
        </div>
      </div>
    </div>
  );
}