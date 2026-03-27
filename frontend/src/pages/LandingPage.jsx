import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import Marketlink from "../assets/Marketlink.jpg";

const S = {
  root: {
    minHeight: "100vh",
    width: "100%",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    color: "#f0f4f8",
    position: "relative",
    overflow: "auto",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(20,25,35,0.85)", //
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  logoAI: {
    fontWeight: 800,
    fontSize: "0.9rem",
    background: "linear-gradient(135deg, #d4a017, #f0bc2e)",
    color: "#0a2e1a",
    padding: "2px 8px",
    borderRadius: "5px",
    fontFamily: "'Syne', sans-serif",
  },
  logoName: {
    fontWeight: 700,
    fontSize: "0.92rem",
    color: "#f0f4f8",
    fontFamily: "'Syne', sans-serif",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  loginBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#9ca3af",
    fontSize: "0.8rem",
    fontWeight: 500,
    padding: "6px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  socials: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  social: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    cursor: "pointer",
    textDecoration: "none",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
  },
  card: {
    background: "rgba(20,25,35,0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "36px 28px",
    width: "100%",
    maxWidth: "440px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    backdropFilter: "blur(16px)",
  },
  avatarWrap: {
    position: "relative",
    width: "80px",
    height: "80px",
    marginBottom: "20px",
  },
  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #1e2530, #252d3a)",
    border: "1.5px solid #343d50",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    overflow: "hidden",
    position: "relative",
  },
  avatarFace: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  avatarEyes: {
    display: "flex",
    gap: "8px",
  },
  avatarEye: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#e5e7eb",
  },
  avatarMouth: {
    width: "14px",
    height: "5px",
    borderRadius: "0 0 8px 8px",
    border: "1.5px solid #e5e7eb",
    borderTop: "none",
  },
  avatarTie: {
    width: "10px",
    height: "12px",
    background: "#d4a017",
    clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 50% 75%, 0% 100%)",
  },
  onlineDot: {
    position: "absolute",
    bottom: "3px",
    right: "3px",
    width: "13px",
    height: "13px",
    borderRadius: "50%",
    background: "#4ade80",
    border: "2px solid #1a1f28",
    boxShadow: "0 0 7px #4ade80",
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.45rem",
    fontWeight: 800,
    color: "#f0f4f8",
    textAlign: "center",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "0.82rem",
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 1.65,
    maxWidth: "320px",
    marginBottom: "20px",
  },
  cardPrompt: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "12px",
    textAlign: "center",
    letterSpacing: "0.03em",
  },
  options: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    width: "100%",
    padding: "13px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "11px",
    textAlign: "left",
    color: "#f0f4f8",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  optionIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    flexShrink: 0,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
  },
  optionTitle: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#f0f4f8",
    marginBottom: "1px",
  },
  optionSub: {
    fontSize: "0.72rem",
    color: "#6b7280",
  },
  optionTag: {
    fontSize: "0.6rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "50px",
    background: "rgba(212,160,23,0.12)",
    color: "#d4a017",
    border: "1px solid rgba(212,160,23,0.2)",
    whiteSpace: "nowrap",
    flexShrink: 0,
    marginLeft: "auto",
  },
  trust: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "0.72rem",
    color: "#6b7280",
    width: "100%",
    background: "rgba(74,222,128,0.04)",
    border: "1px solid rgba(74,222,128,0.1)",
    borderRadius: "8px",
    padding: "8px 11px",
  },
  disclaimer: {
    marginTop: "14px",
    fontSize: "0.68rem",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    maxWidth: "380px",
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${Marketlink})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.4,
    zIndex: -1,
  },
};

const SOCIALS = [
  { label:"Instagram", svg:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { label:"Twitter",   svg:<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label:"YouTube",   svg:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { label:"LinkedIn",  svg:<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab]   = useState("login");

  const open = (tab) => { setAuthTab(tab); setAuthOpen(true); };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={S.root}>
        <div style={S.bgOverlay}></div>

        {/* TOPBAR */}
        <header style={S.topbar}>
          <div style={S.logo}>
            <span style={S.logoAI}>AI</span>
            <span style={S.logoName}>MarketLink</span>
          </div>
          <div style={S.topbarRight}>
            <button style={S.loginBtn} onClick={() => open("login")}
              onMouseEnter={e => { e.target.style.borderColor="#d4a017"; e.target.style.color="#d4a017"; }}
              onMouseLeave={e => { e.target.style.borderColor="rgba(255,255,255,0.2)"; e.target.style.color="#9ca3af"; }}>
              Log in
            </button>
            <div style={S.socials}>
              {SOCIALS.map((s, i) => (
                <a key={i} href="#" style={S.social} aria-label={s.label}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.4)"; e.currentTarget.style.color="#f0f4f8"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; e.currentTarget.style.color="#9ca3af"; }}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main style={S.main}>
          <div style={S.card}>

            {/* Avatar */}
            <div style={S.avatarWrap}>
              <div style={S.avatarCircle}>
                <div style={S.avatarFace}>
                  <div style={S.avatarEyes}>
                    <div style={S.avatarEye} />
                    <div style={S.avatarEye} />
                  </div>
                  <div style={S.avatarMouth} />
                </div>
                <div style={S.avatarTie} />
              </div>
              <div style={S.onlineDot} />
            </div>

            <h1 style={S.cardTitle}>Meet MarketLink AI</h1>
            <p style={S.cardDesc}>
              Your trusted African shopping assistant — discover products via AI,
              buy and sell with escrow-protected payments.
            </p>

            <p style={S.cardPrompt}>I'm here to help. Are you...</p>

            <div style={S.options}>
              <button style={S.option}
                onClick={() => open("signup")}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}>
                <div style={S.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="17" height="17" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <div>
                  <div style={S.optionTitle}>Shopping & Buying</div>
                  <div style={S.optionSub}>Discover products via AI chat</div>
                </div>
              </button>

              <button style={S.option}
                onClick={() => open("signup")}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}>
                <div style={S.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="17" height="17" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 4h14l1 5H4L5 4z"/>
                    <path d="M3 9h18v1a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3V9z"/>
                    <path d="M5 13v7h14v-7"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.optionTitle}>Selling Products</div>
                  <div style={S.optionSub}>List & manage my storefront</div>
                </div>
                <span style={S.optionTag}>Escrow</span>
              </button>
            </div>

            <div style={S.trust}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.6" width="13" height="13" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <span>All payments held in escrow — your money is safe until delivery</span>
            </div>
          </div>

          <p style={S.disclaimer}>
            MarketLink AI is an AI assistant. Responses are informational — not financial or legal advice.
          </p>
        </main>

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
      </div>
    </>
  );
}