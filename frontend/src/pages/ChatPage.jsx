import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css";
import ProductDetailModal from "./ProductDetailModal";
import { useAIChat } from "./useAIChat";

/* ── Icons ── */
const IconSend     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const IconBot      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="3"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/><circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/><path d="M9 18h6"/></svg>);
const IconSearch   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconCart     = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>);
const IconPackage  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>);
const IconStar     = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const IconExpand   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>);
const IconRefresh  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>);
const IconTrash    = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>);
const IconX        = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconMic      = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>);
const IconAttach   = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>);

/* ── Mock Products ── */
const MOCK_PRODUCTS = [
  { id:1,  name:"Samsung Galaxy A55",    category:"Phones & Accessories", price:285000, vendor:"TechZone Lagos",  rating:4.7, reviews:128, stock:5,  description:"6.6\" AMOLED, 50MP camera, 5000mAh battery. Brand new." },
  { id:2,  name:"Ankara Midi Dress",     category:"Fashion & Clothing",   price:12500,  vendor:"Adaeze Styles",  rating:4.9, reviews:87,  stock:12, description:"Hand-crafted Ankara fabric. Available in multiple prints." },
  { id:3,  name:"Wireless Earbuds Pro",  category:"Electronics",          price:18000,  vendor:"GadgetHub NG",   rating:4.5, reviews:203, stock:8,  description:"ANC, 30hr battery, fast charging included." },
  { id:4,  name:"Shea Butter Set",       category:"Beauty & Health",      price:4500,   vendor:"NaturalGlow",    rating:5.0, reviews:64,  stock:20, description:"100% pure unrefined shea butter." },
  { id:5,  name:"Ergonomic Chair",       category:"Home & Furniture",     price:65000,  vendor:"FurnishPro",     rating:4.3, reviews:41,  stock:3,  description:"Lumbar support, adjustable height." },
  { id:6,  name:"iPhone 14 Pro",         category:"Phones & Accessories", price:850000, vendor:"iStore Abuja",   rating:4.8, reviews:312, stock:2,  description:"48MP, A16 Bionic, Dynamic Island. UK used." },
  { id:7,  name:"Fresh Tomatoes (5kg)",  category:"Food & Groceries",     price:3200,   vendor:"FarmDirect",     rating:4.6, reviews:55,  stock:50, description:"Fresh from Plateau State. Next-day delivery." },
  { id:8,  name:"HP Laptop 14\"",        category:"Electronics",          price:320000, vendor:"LaptopWorld",    rating:4.4, reviews:91,  stock:6,  description:"i5, 8GB RAM, 256GB SSD." },
  { id:9,  name:"Baby Feeding Set",      category:"Baby & Kids",          price:8500,   vendor:"TinyTots",       rating:4.8, reviews:76,  stock:15, description:"BPA-free bottles, spoons, bowls." },
  { id:10, name:"Car Engine Oil 5L",     category:"Automobile Parts",     price:22000,  vendor:"AutoParts NG",   rating:4.5, reviews:38,  stock:25, description:"Full synthetic 5W-30. Universal fit." },
];

const SUGGESTIONS = [
  "I need a phone under ₦50,000",
  "Show me Ankara fashion",
  "Laptop for school under ₦300k",
  "Skin care products",
  "Fresh food delivery",
  "Baby items",
];

/* ── Product card inline in chat ── */
const ChatProduct = ({ p, onView }) => {
  const colors = ["#d4a017","#4ade80","#60a5fa","#f472b6","#a78bfa","#34d399"];
  const color  = colors[p.id % colors.length];
  return (
    <div className="cp-inline-card" onClick={() => onView(p)}>
      <div className="cp-inline-card__img" style={{ background:`${color}18` }}>
        <span style={{ color }}><IconPackage /></span>
      </div>
      <div className="cp-inline-card__info">
        <div className="cp-inline-card__name">{p.name}</div>
        <div className="cp-inline-card__price">₦{p.price.toLocaleString()}</div>
        <div className="cp-inline-card__vendor">{p.vendor}</div>
      </div>
      <div className="cp-inline-card__arrow">→</div>
    </div>
  );
};

/* ── Network Background ── */
const NetworkBg = () => (
  <svg className="cp-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
    <g stroke="#4ade80" strokeWidth="0.5" opacity="0.15">
      <line x1="200" y1="150" x2="450" y2="200"/><line x1="450" y1="200" x2="680" y2="160"/>
      <line x1="680" y1="160" x2="900" y2="220"/><line x1="900" y1="220" x2="1150" y2="180"/>
      <line x1="200" y1="150" x2="180" y2="380"/><line x1="450" y1="200" x2="420" y2="400"/>
      <line x1="700" y1="380" x2="920" y2="420"/><line x1="920" y1="420" x2="1180" y2="400"/>
      <line x1="300" y1="550" x2="600" y2="520"/><line x1="600" y1="520" x2="850" y2="560"/>
    </g>
    <g fill="#4ade80" opacity="0.3">
      {[[200,150],[450,200],[680,160],[900,220],[1150,180],[420,400],[700,380],[920,420],[300,550],[600,520],[850,560]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2"/>
      ))}
    </g>
  </svg>
);

/* ── Bot Avatar small ── */
const BotAvatarSm = () => (
  <div className="cp-bot-avatar">
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#1e2530"/>
      <circle cx="20" cy="16" r="8" fill="#2a3140"/>
      <path d="M8 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#2a3140"/>
      <circle cx="16" cy="15" r="1.8" fill="#e5e7eb"/>
      <circle cx="24" cy="15" r="1.8" fill="#e5e7eb"/>
      <path d="M16 19 Q20 22 24 19" stroke="#e5e7eb" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
    <div className="cp-bot-avatar__dot"/>
  </div>
);

export default function ChatPage() {
  const navigate = useNavigate();
  const { messages, isTyping, error, sendMessage: aiSend, clearChat } = useAIChat();
  const [input, setInput]           = useState("");
  const [selected, setSelected]     = useState(null);
  const [cartCount, setCartCount]   = useState(0);
  const [toastMsg, setToastMsg]     = useState("");
  const [expanded, setExpanded]     = useState(false);
  const messagesEndRef              = useRef(null);
  const inputRef                    = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    aiSend(text, MOCK_PRODUCTS);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const addToCart = (product) => {
    setCartCount(c => c + 1);
    setToastMsg(`${product.name} added to cart`);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="cp-root">
      <NetworkBg />

      {/* ── TOPBAR ── */}
      <header className="cp-topbar">
        <button className="cp-topbar__logo" onClick={() => navigate("/")}>
          <span className="cp-logo-ai">AI</span>
          <span className="cp-logo-name">MarketLink</span>
        </button>
        <div className="cp-topbar__right">
          <button className="cp-cart-btn" onClick={() => navigate("/checkout")}>
            <IconCart />
            {cartCount > 0 && <span className="cp-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ── CHAT PANEL (Centered, like Niko) ── */}
      <main className="cp-main">
        <div className={`cp-panel${expanded?" expanded":""}`}>

          {/* Panel Header */}
          <div className="cp-panel__header">
            <BotAvatarSm />
            <div className="cp-panel__info">
              <div className="cp-panel__name">MarketLink AI</div>
              <div className="cp-panel__sub">Offshore Shopping Expert</div>
            </div>
            <div className="cp-panel__actions">
              <button className="cp-hdr-btn" title="Expand" onClick={() => setExpanded(e => !e)}>
                <IconExpand />
                <span>Expand</span>
              </button>
              <button className="cp-hdr-btn" title="Clear chat" onClick={clearChat}>
                <IconTrash />
                <span>Clear</span>
              </button>
              <button className="cp-hdr-btn" title="Restart" onClick={clearChat}>
                <IconRefresh />
                <span>Restart</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cp-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`cp-msg cp-msg--${msg.from}`}>
                {msg.from === "ai" && <BotAvatarSm />}
                <div className="cp-msg__content">
                  <div className="cp-msg__bubble">{msg.text}</div>

                  {/* Inline product cards */}
                  {msg.from==="ai" && msg.products?.length > 0 && (
                    <div className="cp-msg__products">
                      {msg.products.slice(0,4).map(p => (
                        <ChatProduct key={p.id} p={p} onView={setSelected} />
                      ))}
                      {msg.products.length > 4 && (
                        <div className="cp-msg__more">+{msg.products.length-4} more products found</div>
                      )}
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.from==="ai" && msg.suggestions?.length > 0 && (
                    <div className="cp-msg__chips">
                      {msg.suggestions.map((s,i) => (
                        <button key={i} className="cp-chip"
                          onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="cp-msg cp-msg--ai">
                <BotAvatarSm />
                <div className="cp-msg__content">
                  <div className="cp-msg__bubble cp-msg__bubble--typing">
                    <span/><span/><span/>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="cp-error">{error}</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (first load) */}
          {messages.length <= 1 && (
            <div className="cp-suggestions">
              {SUGGESTIONS.map((s,i) => (
                <button key={i} className="cp-suggestion"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cp-input-area">
            <button className="cp-input-btn" title="Attach"><IconAttach /></button>
            <input
              ref={inputRef}
              className="cp-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button className="cp-input-btn" title="Voice"><IconMic /></button>
            <button
              className={`cp-send-btn${input.trim() && !isTyping?" active":""}`}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <IconSend />
            </button>
          </div>
          <p className="cp-disclaimer">
            MarketLink AI is an AI assistant. Responses are informational — not financial or legal advice.
          </p>
        </div>
      </main>

      {/* Toast */}
      {toastMsg && <div className="cp-toast"><IconCart />{toastMsg}</div>}

      {/* Product Detail */}
      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
        onAddToCart={(p) => { addToCart(p); setSelected(null); }}
        onBuyNow={(p) => { addToCart(p); setSelected(null); navigate("/checkout"); }}
      />
    </div>
  );
}