import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

/* ── Icons ── */
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLoader = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

/* ── Field Component ── */
const Field = ({ icon: Icon, label, type="text", placeholder, value, onChange, name, required }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="auth-field">
      <label className="auth-field__label">{label}{required && <span className="auth-field__req">*</span>}</label>
      <div className="auth-field__wrap">
        {Icon && <span className="auth-field__icon"><Icon /></span>}
        <input
          className="auth-field__input"
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          required={required}
          autoComplete="off"
        />
        {isPassword && (
          <button type="button" className="auth-field__eye" onClick={() => setShow(s => !s)}>
            {show ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Upload Field ── */
const UploadField = ({ label, name, value, onChange, accept, hint }) => {
  const ref = useRef();
  return (
    <div className="auth-field">
      <label className="auth-field__label">{label}<span className="auth-field__req">*</span></label>
      <div className={`auth-upload${value ? " auth-upload--done" : ""}`} onClick={() => ref.current.click()}>
        <input ref={ref} type="file" accept={accept} style={{ display:"none" }} onChange={e => { if(e.target.files[0]) onChange(name, e.target.files[0]); }} />
        <span className="auth-upload__icon">{value ? <IconCheck /> : <IconUpload />}</span>
        <span className="auth-upload__text">{value ? value.name : `Click to upload ${label}`}</span>
        {hint && !value && <span className="auth-upload__hint">{hint}</span>}
      </div>
    </div>
  );
};

/* ── Role Selector ── */
const RoleSelector = ({ value, onChange }) => (
  <div className="auth-field">
    <label className="auth-field__label">I want to<span className="auth-field__req">*</span></label>
    <div className="auth-roles">
      {[
        { val:"buyer",  label:"Shop & Buy",     sub:"Discover products via AI" },
        { val:"vendor", label:"Sell Products",   sub:"List & manage my store"  },
      ].map(r => (
        <button key={r.val} type="button"
          className={`auth-role${value === r.val ? " auth-role--active" : ""}`}
          onClick={() => onChange("role", r.val)}
        >
          <span className="auth-role__label">{r.label}</span>
          <span className="auth-role__sub">{r.sub}</span>
          {value === r.val && <span className="auth-role__check"><IconCheck /></span>}
        </button>
      ))}
    </div>
  </div>
);

/* ── Step Indicator ── */
const StepIndicator = ({ current, total }) => (
  <div className="auth-steps">
    {Array.from({ length: total }).map((_,i) => (
      <div key={i} className={`auth-step-dot${i < current ? " done" : ""}${i === current-1 ? " active" : ""}`} />
    ))}
  </div>
);

/* ── Feedback Popup ── */
const FeedbackPopup = ({ type, title, message, name, role, onContinue }) => (
  <div className={`auth-feedback auth-feedback--${type}`}>
    <div className="auth-feedback__bg" />
    <div className="auth-feedback__particles">
      {type === "success" && Array.from({ length: 12 }).map((_,i) => (
        <span key={i} className="auth-feedback__particle" style={{ "--i": i }} />
      ))}
    </div>
    <div className="auth-feedback__content">
      <div className="auth-feedback__icon-wrap">
        {type === "success" ? (
          <div className="auth-feedback__icon auth-feedback__icon--success">
            <IconCheck />
          </div>
        ) : (
          <div className="auth-feedback__icon auth-feedback__icon--error">
            <IconAlertCircle />
          </div>
        )}
      </div>
      {type === "success" && (
        <div className="auth-feedback__stars">
          {[0,1,2].map(i => <span key={i} className="auth-feedback__star" style={{ "--d": `${i*0.15}s` }}><IconStar /></span>)}
        </div>
      )}
      <h2 className="auth-feedback__title">{title}</h2>
      {name && <p className="auth-feedback__name">{name}</p>}
      <p className="auth-feedback__msg">{message}</p>
      <button className="auth-feedback__btn" onClick={onContinue}>
        {type === "success" ? (
          <><span>{role === "vendor" ? "Go to Vendor Dashboard" : "Continue to Marketplace"}</span><IconArrowRight /></>
        ) : (
          <span>Try Again</span>
        )}
      </button>
    </div>
  </div>
);

/* ── Main Modal ── */
export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const navigate = useNavigate();
  const [tab, setTab]         = useState(defaultTab);
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, title, message, name }

  const [form, setForm] = useState({
    fullName:"", email:"", phone:"", password:"", role:"buyer",
    businessName:"", cacNumber:"", address:"", idType:"",
    cacDocument:null, idDocument:null,
  });

  const set = (name, val) => setForm(f => ({ ...f, [name]: val }));

  useEffect(() => {
    setStep(1); setFeedback(null); setLoading(false);
    setForm(f => ({ ...f, fullName:"", email:"", phone:"", password:"", role:"buyer", businessName:"", cacNumber:"", address:"", idType:"", cacDocument:null, idDocument:null }));
  }, [tab, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Simulate login (replace with real API call) ── */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: replace with → fetch('/api/auth/login', { method:'POST', body: JSON.stringify({ email: form.email, password: form.password }) })
    setTimeout(() => {
      setLoading(false);
      const success = form.email && form.password.length >= 6;
      if (success) {
        setFeedback({
          type: "success",
          title: "Welcome Back!",
          name: form.email,
          role: form.role,
          message: form.role === "vendor"
            ? "Welcome back! Heading to your vendor dashboard now."
            : "You have logged in successfully. Your escrow-protected shopping experience awaits.",
        });
      } else {
        setFeedback({
          type: "error",
          title: "Login Failed",
          name: null,
          message: "Invalid email or password. Please check your credentials and try again.",
        });
      }
    }, 1600);
  };

  /* ── Simulate signup step 1 ── */
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (form.role === "vendor") { setStep(2); return; }
    // Buyer → simulate account creation
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFeedback({
        type: "success",
        title: "Account Created!",
        name: form.fullName,
        role: "buyer",
        message: "Welcome to AI MarketLink! Verify your email to unlock all features. You can start browsing now.",
      });
    }, 1600);
  };

  /* ── Simulate vendor step 2 ── */
  const handleStep2Submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFeedback({
        type: "success",
        title: "Vendor Account Created!",
        name: form.businessName,
        role: "vendor",
        message: "Your business has been registered. We'll review your documents within 24 hours. Check your email to verify your account.",
      });
    }, 1800);
  };

  /* ── After feedback button click ── */
  const handleFeedbackContinue = () => {
    if (feedback.type === "success") {
      onClose();
      navigate(feedback.role === "vendor" ? "/vendor/dashboard" : "/chat");
    } else {
      setFeedback(null);
    }
  };

  const totalSteps = form.role === "vendor" ? 3 : 2;

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && !feedback && onClose()}>
      <div className="auth-modal">

        {/* ── FEEDBACK POPUP (overlays the modal) ── */}
        {feedback && (
          <FeedbackPopup
            type={feedback.type}
            title={feedback.title}
            name={feedback.name}
            role={feedback.role}
            message={feedback.message}
            onContinue={handleFeedbackContinue}
          />
        )}

        {/* Close */}
        <button className="auth-close" onClick={onClose} aria-label="Close"><IconX /></button>

        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand__mark">AI</span>
          <span className="auth-brand__text">MarketLink</span>
        </div>

        {/* ── EMAIL VERIFY SCREEN ── */}
        {tab === "signup" && step === 3 ? (
          <div className="auth-verify">
            <div className="auth-verify__icon"><IconMail /></div>
            <h2 className="auth-verify__title">Check Your Inbox</h2>
            <p className="auth-verify__desc">We sent a verification link to<br /><strong>{form.email}</strong></p>
            <p className="auth-verify__note">Click the link in the email to activate your account. Check your spam folder if you don't see it.</p>
            <button className="auth-verify__resend" type="button">Resend verification email</button>
            <button className="auth-btn auth-btn--gold" type="button" onClick={() => { onClose(); navigate("/chat"); }}>
              Continue to Marketplace
            </button>
          </div>

        /* ── VENDOR STEP 2 ── */
        ) : tab === "signup" && step === 2 ? (
          <div className="auth-body">
            <button className="auth-back" onClick={() => setStep(1)}><IconArrowLeft /> Back</button>
            <StepIndicator current={2} total={totalSteps} />
            <h2 className="auth-title">Business Details</h2>
            <p className="auth-subtitle">Help us verify your business on the platform</p>
            <form onSubmit={handleStep2Submit} className="auth-form">
              <Field icon={IconBuilding}  label="Business Name"    name="businessName" placeholder="e.g. Adaeze Fashion Hub"  value={form.businessName} onChange={set} required />
              <Field icon={IconFileText}  label="CAC Number"       name="cacNumber"    placeholder="e.g. RC-1234567"           value={form.cacNumber}    onChange={set} required />
              <Field icon={IconMapPin}    label="Business Address" name="address"      placeholder="Full business address"     value={form.address}      onChange={set} required />
              <div className="auth-field">
                <label className="auth-field__label">Means of Identification<span className="auth-field__req">*</span></label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><IconShield /></span>
                  <select className="auth-field__input auth-field__select" value={form.idType} onChange={e => set("idType", e.target.value)} required>
                    <option value="">Select ID type</option>
                    <option value="nin">National ID (NIN)</option>
                    <option value="bvn">BVN</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers">Driver's Licence</option>
                    <option value="voters">Voter's Card</option>
                  </select>
                </div>
              </div>
              <UploadField label="CAC Document"  name="cacDocument" value={form.cacDocument} onChange={set} accept=".pdf,.jpg,.jpeg,.png" hint="PDF, JPG or PNG — max 5MB" />
              <UploadField label="ID Document"   name="idDocument"  value={form.idDocument}  onChange={set} accept=".pdf,.jpg,.jpeg,.png" hint="Clear photo or scan of your ID" />
              <button className="auth-btn auth-btn--gold" type="submit" disabled={loading}>
                {loading ? <><IconLoader /> Submitting...</> : "Submit for Verification"}
              </button>
            </form>
          </div>

        /* ── SIGNUP STEP 1 ── */
        ) : tab === "signup" ? (
          <div className="auth-body">
            <StepIndicator current={1} total={totalSteps} />
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join the marketplace built on trust</p>
            <div className="auth-tabs">
              <button className="auth-tab" onClick={() => setTab("login")}>Log In</button>
              <button className="auth-tab auth-tab--active">Sign Up</button>
            </div>
            <form onSubmit={handleStep1Submit} className="auth-form">
              <RoleSelector value={form.role} onChange={set} />
              <Field icon={IconUser}  label="Full Name"     name="fullName" placeholder="Your full name"     value={form.fullName} onChange={set} required />
              <Field icon={IconMail}  label="Email Address" name="email"    placeholder="you@example.com"    value={form.email}    onChange={set} type="email" required />
              <Field icon={IconPhone} label="Phone Number"  name="phone"    placeholder="+234 800 000 0000"  value={form.phone}    onChange={set} required />
              <Field icon={IconLock}  label="Password"      name="password" placeholder="Min. 8 characters"  value={form.password} onChange={set} type="password" required />
              <button className="auth-btn auth-btn--gold" type="submit" disabled={loading}>
                {loading ? <><IconLoader />Processing...</> : form.role === "vendor" ? "Continue — Business Details →" : "Create Account"}
              </button>
            </form>
            <p className="auth-switch">Already have an account? <button type="button" onClick={() => setTab("login")}>Log in</button></p>
          </div>

        /* ── LOGIN ── */
        ) : (
          <div className="auth-body">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Log in to your AI MarketLink account</p>
            <div className="auth-tabs">
              <button className="auth-tab auth-tab--active">Log In</button>
              <button className="auth-tab" onClick={() => setTab("signup")}>Sign Up</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <Field icon={IconMail} label="Email Address" name="email"    placeholder="you@example.com" value={form.email}    onChange={set} type="email" required />
              <Field icon={IconLock} label="Password"      name="password" placeholder="Your password"   value={form.password} onChange={set} type="password" required />
              <div className="auth-forgot"><button type="button">Forgot password?</button></div>
              <button className="auth-btn auth-btn--gold" type="submit" disabled={loading}>
                {loading ? <><IconLoader />Logging in...</> : "Log In to Account"}
              </button>
            </form>
            <p className="auth-switch">Don't have an account? <button type="button" onClick={() => setTab("signup")}>Sign up free</button></p>
          </div>
        )}

        {/* Trust bar */}
        <div className="auth-trust">
          <span><IconShield /> Escrow Protected</span>
          <span><IconLock /> SSL Secured</span>
        </div>
      </div>
    </div>
  );
}