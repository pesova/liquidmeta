import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css";
import ProductDetailModal from "./ProductDetailModal";
import { useAIChat } from "./useAIChat";

/* ── Icons ── */
const IconSend = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const IconBot = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="3"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/><circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/><path d="M9 18h6"/><path d="M12 2v2"/></svg>);
const IconSearch = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconCart = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>);
const IconFilter = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const IconStar = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const IconShield = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>);
const IconX = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconArrowLeft = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
const IconPackage = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>);
const IconRefresh = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>);
const IconChevronDown = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);
const IconGrid = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>);
const IconList = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>);
const IconMessageSquare = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);

/* ── Constants ── */
const CATEGORIES = [
  "All","Electronics","Fashion & Clothing","Phones & Accessories",
  "Food & Groceries","Beauty & Health","Home & Furniture",
  "Agro & Farm Produce","Baby & Kids","Automobile Parts","Books & Stationery",
];
const PRICE_RANGES = [
  { label:"Any Price",     min:0,      max:Infinity },
  { label:"Under ₦5,000",  min:0,      max:5000     },
  { label:"₦5k – ₦15k",   min:5000,   max:15000    },
  { label:"₦15k – ₦50k",  min:15000,  max:50000    },
  { label:"₦50k – ₦100k", min:50000,  max:100000   },
  { label:"Above ₦100k",  min:100000, max:Infinity  },
];
const SORT_OPTIONS = ["Relevance","Price: Low to High","Price: High to Low","Newest"];

/* ── Mock Products ── */
const MOCK_PRODUCTS = [
  { id:1,  name:"Samsung Galaxy A55",     category:"Phones & Accessories", price:285000, vendor:"TechZone Lagos",  rating:4.7, reviews:128, stock:5,  description:"6.6\" AMOLED display, 50MP camera, 5000mAh battery. Brand new, sealed box." },
  { id:2,  name:"Ankara Midi Dress",      category:"Fashion & Clothing",   price:12500,  vendor:"Adaeze Styles",  rating:4.9, reviews:87,  stock:12, description:"Beautiful hand-crafted Ankara fabric. Available in multiple prints and sizes." },
  { id:3,  name:"Wireless Earbuds Pro",   category:"Electronics",          price:18000,  vendor:"GadgetHub NG",   rating:4.5, reviews:203, stock:8,  description:"Active noise cancellation, 30hr battery life, fast charging case included." },
  { id:4,  name:"Shea Butter Set",        category:"Beauty & Health",      price:4500,   vendor:"NaturalGlow",    rating:5.0, reviews:64,  stock:20, description:"100% pure unrefined shea butter. Deeply moisturizes and nourishes skin." },
  { id:5,  name:"Ergonomic Office Chair", category:"Home & Furniture",     price:65000,  vendor:"FurnishPro",     rating:4.3, reviews:41,  stock:3,  description:"Lumbar support, adjustable height and armrests, breathable mesh back." },
  { id:6,  name:"iPhone 14 Pro",          category:"Phones & Accessories", price:850000, vendor:"iStore Abuja",   rating:4.8, reviews:312, stock:2,  description:"48MP main camera, A16 Bionic chip, Dynamic Island. UK used, excellent condition." },
  { id:7,  name:"Fresh Tomatoes (5kg)",   category:"Food & Groceries",     price:3200,   vendor:"FarmDirect",     rating:4.6, reviews:55,  stock:50, description:"Fresh farm tomatoes from Plateau State. Next-day delivery available." },
  { id:8,  name:"HP Laptop 14\"",         category:"Electronics",          price:320000, vendor:"LaptopWorld",    rating:4.4, reviews:91,  stock:6,  description:"Intel Core i5, 8GB RAM, 256GB SSD. Perfect for work and study." },
  { id:9,  name:"Baby Feeding Set",       category:"Baby & Kids",          price:8500,   vendor:"TinyTots",       rating:4.8, reviews:76,  stock:15, description:"BPA-free bottles, spoons, bowls and bibs. Safe for infants 6months+." },
  { id:10, name:"Car Engine Oil 5L",      category:"Automobile Parts",     price:22000,  vendor:"AutoParts NG",   rating:4.5, reviews:38,  stock:25, description:"Full synthetic 5W-30 engine oil. Compatible with most Japanese and European cars." },
];

const SUGGESTIONS = [
  "I need a phone under ₦50,000",
  "Show me Ankara dresses",
  "Laptop for school",
  "Fresh food items",
  "Skin care products",
  "Baby feeding set",
];

/* ── Inline Chat Product Cards ── */
const ChatProductCards = ({ products, onView }) => (
  <div className="cp-chat-products">
    {products.slice(0,3).map(p => {
      const colors = ["#1a6b3c","#d4a017","#2d9e5f","#b8860b","#0f4a2a","#f0bc2e"];
      const color = colors[p.id % colors.length];
      return (
        <div key={p.id} className="cp-chat-product" onClick={() => onView(p)}>
          <div className="cp-chat-product__img" style={{ background:`${color}18` }}>
            <span style={{ color }}><IconPackage /></span>
          </div>
          <div className="cp-chat-product__info">
            <div className="cp-chat-product__name">{p.name}</div>
            <div className="cp-chat-product__price">₦{p.price.toLocaleString()}</div>
          </div>
        </div>
      );
    })}
    {products.length > 3 && (
      <div className="cp-chat-more">+{products.length - 3} more results on the right panel</div>
    )}
  </div>
);

/* ── Product Card ── */
const ProductCard = ({ product, onView, onAddToCart, view }) => {
  const colors  = ["#1a6b3c","#d4a017","#2d9e5f","#b8860b","#0f4a2a","#f0bc2e"];
  const color   = colors[product.id % colors.length];
  const initials = product.vendor.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  if (view === "list") {
    return (
      <div className="cp-card cp-card--list">
        <div className="cp-card__img cp-card__img--list" style={{ background:`${color}18` }}>
          <span style={{ color }}><IconPackage /></span>
        </div>
        <div className="cp-card__info">
          <span className="cp-card__cat">{product.category}</span>
          <h3 className="cp-card__name">{product.name}</h3>
          <p className="cp-card__desc">{product.description}</p>
          <div className="cp-card__vendor">
            <span className="cp-vendor-dot" style={{ background:color }}>{initials}</span>
            {product.vendor}
            <span className={`cp-card__stock${product.stock <= 3 ? " low" : ""}`}>
              {product.stock <= 3 ? `Only ${product.stock} left` : "In Stock"}
            </span>
          </div>
        </div>
        <div className="cp-card__right">
          <div className="cp-card__rating"><IconStar />{product.rating} <span>({product.reviews})</span></div>
          <div className="cp-card__price">₦{product.price.toLocaleString()}</div>
          <div className="cp-card__btns">
            <button className="cp-btn cp-btn--outline" onClick={() => onView(product)}>Details</button>
            <button className="cp-btn cp-btn--gold" onClick={() => onAddToCart(product)}><IconCart />Add</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-card">
      <div className="cp-card__img" style={{ background:`${color}18` }}>
        <span style={{ color }}><IconPackage /></span>
        <span className={`cp-stock-badge${product.stock <= 3 ? " low" : ""}`}>
          {product.stock <= 3 ? `${product.stock} left` : "In Stock"}
        </span>
      </div>
      <div className="cp-card__body">
        <span className="cp-card__cat">{product.category}</span>
        <h3 className="cp-card__name">{product.name}</h3>
        <div className="cp-card__vendor">
          <span className="cp-vendor-dot" style={{ background:color }}>{initials}</span>
          {product.vendor}
        </div>
        <div className="cp-card__footer">
          <div>
            <div className="cp-card__rating"><IconStar />{product.rating}</div>
            <div className="cp-card__price">₦{product.price.toLocaleString()}</div>
          </div>
          <div className="cp-card__btns">
            <button className="cp-btn cp-btn--ghost-sm" onClick={() => onView(product)} title="Details"><IconSearch /></button>
            <button className="cp-btn cp-btn--gold-sm" onClick={() => onAddToCart(product)} title="Add to cart"><IconCart /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main ── */
export default function ChatPage() {
  const navigate = useNavigate();
  const { messages, isTyping, error, sendMessage: aiSend } = useAIChat();
  const [input, setInput]             = useState("");
  const [allProducts]                 = useState(MOCK_PRODUCTS);
  const [displayProducts, setDisplay] = useState(MOCK_PRODUCTS);
  const [filtered, setFiltered]       = useState(MOCK_PRODUCTS);
  const [category, setCategory]       = useState("All");
  const [priceIdx, setPriceIdx]       = useState(0);
  const [sortBy, setSortBy]           = useState("Relevance");
  const [viewMode, setViewMode]       = useState("grid");
  const [cartCount, setCartCount]     = useState(0);
  const [selected, setSelected]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQ, setSearchQ]         = useState("");
  const [toastMsg, setToastMsg]       = useState("");
  const [mobileTab, setMobileTab]     = useState("chat");
  const messagesEndRef                = useRef(null);
  const inputRef                      = useRef(null);

  /* Auto scroll chat */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isTyping]);

  /* When AI returns products, update results panel */
  useEffect(() => {
    const last = [...messages].reverse().find(m => m.from === "ai" && m.products?.length > 0);
    if (last?.products?.length > 0) {
      setDisplay(last.products);
      setMobileTab("results");
    }
  }, [messages]);

  /* Filter & sort */
  useEffect(() => {
    let result = [...displayProducts];
    if (category !== "All") result = result.filter(p => p.category === category);
    const range = PRICE_RANGES[priceIdx];
    result = result.filter(p => p.price >= range.min && p.price <= range.max);
    if (searchQ) result = result.filter(p =>
      p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.vendor.toLowerCase().includes(searchQ.toLowerCase())
    );
    if (sortBy === "Price: Low to High") result.sort((a,b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result.sort((a,b) => b.price - a.price);
    if (sortBy === "Newest") result.sort((a,b) => b.id - a.id);
    setFiltered(result);
  }, [displayProducts, category, priceIdx, sortBy, searchQ]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    aiSend(text, allProducts);
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

      {/* ── TOPBAR ── */}
      <header className="cp-topbar">
        <div className="cp-topbar__left">
          <button className="cp-back-btn" onClick={() => navigate("/")}><IconArrowLeft /></button>
          <a href="/" className="cp-logo">
            <span className="cp-logo__mark">AI</span>
            <span className="cp-logo__text">MarketLink</span>
          </a>
          <span className="cp-topbar__divider" />
          <span className="cp-topbar__title">AI Shopping Assistant</span>
        </div>
        <div className="cp-topbar__right">
          <div className="cp-status"><span className="cp-status__dot" />AI Online</div>
          <button className="cp-cart-btn">
            <IconCart />
            {cartCount > 0 && <span className="cp-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ── MOBILE TABS ── */}
      <div className="cp-mobile-tabs">
        <button className={`cp-mobile-tab${mobileTab==="chat"?" active":""}`} onClick={() => setMobileTab("chat")}>
          <IconMessageSquare /> Chat with AI
        </button>
        <button className={`cp-mobile-tab${mobileTab==="results"?" active":""}`} onClick={() => setMobileTab("results")}>
          <IconGrid /> Products {filtered.length > 0 && <span className="cp-mobile-tab__count">{filtered.length}</span>}
        </button>
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="cp-main">

        {/* ── CHAT PANEL ── */}
        <aside className={`cp-chat-panel${mobileTab==="chat"?" cp-panel--active":""}`}>
          <div className="cp-chat-header">
            <div className="cp-chat-avatar"><IconBot /></div>
            <div>
              <div className="cp-chat-name">MarketLink AI</div>
              <div className="cp-chat-sub">English · Pidgin · Yoruba · Igbo · Hausa · French</div>
            </div>
          </div>

          <div className="cp-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`cp-msg cp-msg--${msg.from}`}>
                {msg.from === "ai" && <div className="cp-msg__avatar"><IconBot /></div>}
                <div className="cp-msg__bubble">
                  <p>{msg.text}</p>
                  {msg.from === "ai" && msg.suggestions?.length > 0 && (
                    <div className="cp-msg-suggestions">
                      {msg.suggestions.map((s,i) => (
                        <button key={i} className="cp-msg-chip"
                          onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.products?.length > 0 && (
                    <ChatProductCards products={msg.products} onView={setSelected} />
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="cp-msg cp-msg--ai">
                <div className="cp-msg__avatar"><IconBot /></div>
                <div className="cp-msg__bubble cp-msg__typing"><span /><span /><span /></div>
              </div>
            )}
            {error && <div className="cp-error-msg">{error}</div>}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="cp-suggestions">
              <p className="cp-suggestions__label">Try asking:</p>
              <div className="cp-suggestions__chips">
                {SUGGESTIONS.map((s,i) => (
                  <button key={i} className="cp-chip"
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cp-input-area">
            <div className="cp-input-row">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask in English, Pidgin, Yoruba, Igbo, Hausa..."
                className="cp-input"
                disabled={isTyping}
              />
              <button
                className={`cp-send${input.trim() && !isTyping ? " active" : ""}`}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                <IconSend />
              </button>
            </div>
            <p className="cp-input-note">Powered by Claude AI · All purchases escrow-protected</p>
          </div>
        </aside>

        {/* ── RESULTS PANEL ── */}
        <main className={`cp-results-panel${mobileTab==="results"?" cp-panel--active":""}`}>
          <div className="cp-results-header">
            <div className="cp-results-top">
              <div className="cp-search-box">
                <IconSearch />
                <input
                  placeholder="Search products..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="cp-search-input"
                />
                {searchQ && <button className="cp-search-clear" onClick={() => setSearchQ("")}><IconX /></button>}
              </div>
              <div className="cp-results-controls">
                <button className={`cp-filter-btn${showFilters?" active":""}`} onClick={() => setShowFilters(f => !f)}>
                  <IconFilter />Filters
                </button>
                <div className="cp-sort-wrap">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="cp-sort-select">
                    {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <IconChevronDown />
                </div>
                <div className="cp-view-btns">
                  <button className={viewMode==="grid"?"active":""} onClick={() => setViewMode("grid")}><IconGrid /></button>
                  <button className={viewMode==="list"?"active":""} onClick={() => setViewMode("list")}><IconList /></button>
                </div>
              </div>
            </div>

            <div className="cp-cats">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`cp-cat${category===cat?" active":""}`} onClick={() => setCategory(cat)}>{cat}</button>
              ))}
            </div>

            {showFilters && (
              <div className="cp-price-row">
                <span className="cp-price-label">Price:</span>
                {PRICE_RANGES.map((r,i) => (
                  <button key={i} className={`cp-price-btn${priceIdx===i?" active":""}`} onClick={() => setPriceIdx(i)}>{r.label}</button>
                ))}
              </div>
            )}

            <div className="cp-results-meta">
              <span>{filtered.length} product{filtered.length!==1?"s":""} found</span>
              {(category!=="All"||priceIdx!==0||searchQ) && (
                <button className="cp-clear-btn" onClick={() => { setCategory("All"); setPriceIdx(0); setSearchQ(""); }}>
                  <IconRefresh />Clear filters
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="cp-empty">
              <IconSearch />
              <h3>No products found</h3>
              <p>Try adjusting filters or ask the AI for something specific</p>
            </div>
          ) : (
            <div className={`cp-products${viewMode==="list"?" list":""}`}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} view={viewMode} onView={setSelected} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toastMsg && <div className="cp-toast"><IconCart />{toastMsg}</div>}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
        onAddToCart={(p) => { addToCart(p); setSelected(null); }}
        onBuyNow={(p) => { addToCart(p); setSelected(null); }}
      />
    </div>
  );
}   