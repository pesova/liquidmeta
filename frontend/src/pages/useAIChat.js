// useAIChat.js — AI MarketLink
import { useState, useCallback, useRef } from "react";

const SYSTEM_PROMPT = `You are Markie — the AI shopping assistant for AI MarketLink, a trusted African marketplace with built-in escrow payment protection.

YOUR PERSONALITY:
- Warm, friendly, conversational — like a knowledgeable friend helping you shop
- Ask ONE question at a time — never multiple questions
- Build context gradually through natural conversation
- Culturally aware of African commerce and Nigerian slang
- Respond in the SAME LANGUAGE the user writes in (English, Pidgin, Yoruba, Igbo, Hausa, French)

YOUR CONVERSATION FLOW:
1. Greet and ask what they want
2. Once you know the product → ask budget
3. Once you know budget → ask preferences (optional)
4. Then show products
5. After showing → offer to refine

CRITICAL: Ask ONLY ONE question per message. Never show products until you know BOTH what they want AND their budget. If user gives all info at once (e.g. "phone under 50k"), skip questions and show products immediately.

NIGERIAN PRICES: "5k"=5000, "50k"=50000, "100k"=100000, "1m"=1000000

PRODUCT CATEGORIES: Electronics, Fashion & Clothing, Phones & Accessories, Food & Groceries, Beauty & Health, Home & Furniture, Agro & Farm Produce, Baby & Kids, Automobile Parts, Books & Stationery

RESPONSE — Return ONLY valid JSON:
{
  "message": "conversational response",
  "intent": "greeting|clarify_product|clarify_budget|clarify_preference|show_products|negotiate|info",
  "readyToShow": true or false,
  "filters": {
    "category": "exact category name or null",
    "maxPrice": number or null,
    "minPrice": number or null,
    "query": "keyword or null"
  },
  "suggestions": ["short reply 1", "short reply 2", "short reply 3", "short reply 4"]
}`;

const detectCategory = (text) => {
  const t = (text || "").toLowerCase();
  if (t.match(/phone|samsung|iphone|tecno|infinix|mobile|handset/)) return "Phones & Accessories";
  if (t.match(/dress|cloth|ankara|fashion|wear|shirt|trouser|blouse|skirt/)) return "Fashion & Clothing";
  if (t.match(/laptop|computer|earbuds|speaker|tv|television/)) return "Electronics";
  if (t.match(/food|tomato|groceries|rice|vegetable|pepper|yam/)) return "Food & Groceries";
  if (t.match(/beauty|skin|cream|shea|lotion|makeup|hair/)) return "Beauty & Health";
  if (t.match(/baby|kid|child|infant|diaper|toy/)) return "Baby & Kids";
  if (t.match(/car|auto|vehicle|engine|tyre|motor/)) return "Automobile Parts";
  if (t.match(/chair|furniture|sofa|bed|table|shelf/)) return "Home & Furniture";
  if (t.match(/book|stationery|pen|notebook|school/)) return "Books & Stationery";
  if (t.match(/farm|agro|seed|fertilizer|crop/)) return "Agro & Farm Produce";
  return null;
};

const extractPrice = (text) => {
  const t = (text || "").toLowerCase();
  const kMatch = t.match(/(\d+)\s*k\b/);
  if (kMatch) return parseInt(kMatch[1]) * 1000;
  const mMatch = t.match(/(\d+)\s*m\b/);
  if (mMatch) return parseInt(mMatch[1]) * 1000000;
  const underMatch = t.match(/under\s*[₦#]?\s*(\d[\d,]+)/);
  if (underMatch) return parseInt(underMatch[1].replace(/,/g, ""));
  const nairaMatch = t.match(/[₦#]\s*(\d[\d,]+)/);
  if (nairaMatch) return parseInt(nairaMatch[1].replace(/,/g, ""));
  return null;
};

const mockFallback = (userText, allMessages) => {
  const lower = (userText || "").toLowerCase().trim();

  // Greeting
  if (allMessages.filter(m => m.from === "user").length === 0 ||
      ["hi","hello","hey","good morning","good afternoon","howdy","yo","sup"].includes(lower)) {
    return {
      message: "Hey! 👋 Welcome to AI MarketLink. I'm Markie, your shopping assistant. What are you looking to buy today?",
      intent: "greeting", readyToShow: false,
      filters: {},
      suggestions: ["I need a phone", "Show me fashion", "Food & groceries", "Something for my home"],
    };
  }

  // Build full context from ALL messages so far
  const allText = allMessages.map(m => m.text || "").join(" ") + " " + userText;

  // Scan all AI messages for stored filters (most recent first)
  let ctxCategory = null;
  let ctxPrice = null;
  for (const msg of [...allMessages].reverse()) {
    if (msg.from === "ai" && msg.filters) {
      if (!ctxCategory && msg.filters.category) ctxCategory = msg.filters.category;
      if (!ctxPrice && msg.filters.maxPrice) ctxPrice = msg.filters.maxPrice;
    }
    if (ctxCategory && ctxPrice) break;
  }

  // Also try to detect from all text combined
  const category = detectCategory(userText) || ctxCategory || detectCategory(allText);
  const maxPrice  = extractPrice(userText) || ctxPrice || extractPrice(allText);

  if (category && !maxPrice) {
    return {
      message: `What's your budget for ${category.toLowerCase()}?`,
      intent: "clarify_budget", readyToShow: false,
      filters: { category },
      suggestions: ["Under ₦10,000", "Under ₦50,000", "Under ₦100,000", "Above ₦100,000"],
    };
  }

  if (category && maxPrice) {
    return {
      message: `Here are the best ${category.toLowerCase()} under ₦${maxPrice.toLocaleString()} from verified vendors. All purchases are escrow-protected — your money is safe until delivery! 🛡️`,
      intent: "show_products", readyToShow: true,
      filters: { category, maxPrice },
      suggestions: ["Show me cheaper", "Different category?", "How does escrow work?", "Add to cart"],
    };
  }

  return {
    message: "What are you looking to buy today?",
    intent: "clarify_product", readyToShow: false,
    filters: {},
    suggestions: ["Phones & Accessories", "Fashion & Clothing", "Electronics", "Food & Groceries"],
  };
};

const parseResponse = (text) => {
  try {
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(clean);
    if (!parsed.message) throw new Error("No message");
    return parsed;
  } catch { return null; }
};

const filterProducts = (parsed, userText, allProducts) => {
  if (!parsed.readyToShow || !allProducts.length) return [];
  const f = parsed.filters || {};

  let results = allProducts.filter(p => {
    if (f.category && p.category !== f.category) return false;
    if (f.maxPrice  && p.price > f.maxPrice)      return false;
    if (f.minPrice  && p.price < f.minPrice)      return false;
    if (f.query && !p.name.toLowerCase().includes(f.query.toLowerCase()) &&
                   !p.category.toLowerCase().includes(f.query.toLowerCase())) return false;
    return true;
  });

  // Keyword fallback
  if (!results.length) {
    const words = userText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    results = allProducts.filter(p =>
      words.some(w => p.name.toLowerCase().includes(w) || p.category.toLowerCase().includes(w))
    );
  }

  return results;
};

export function useAIChat() {
  const [messages, setMessages] = useState([{
    id: 1, from: "ai",
    text: "Hey! 👋 Welcome to AI MarketLink. I'm Markie, your shopping assistant. What are you looking to buy today?",
    suggestions: ["I need a phone", "Show me fashion", "Food & groceries", "Something for my home"],
    products: [], filters: {},
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError]       = useState(null);
  const messagesRef             = useRef(messages); // Keep ref in sync to avoid stale closures
  messagesRef.current           = messages;

  const sendMessage = useCallback(async (userText, allProducts = []) => {
    if (!userText.trim() || isTyping) return;

    // Add user message immediately
    const userMsg = {
      id: Date.now(), from: "user",
      text: userText, products: [], suggestions: [], filters: {},
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    // Get current messages including the new user message
    const currentMessages = [...messagesRef.current, userMsg];

    let parsed = null;

    try {
      const history = currentMessages
        .filter(m => m.id !== 1)
        .slice(-12)
        .map(m => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.from === "user" ? m.text : (m.rawResponse || m.text),
        }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        parsed = parseResponse(data.content?.[0]?.text || "");
        if (parsed) parsed._raw = data.content?.[0]?.text;
      }
    } catch { /* use fallback */ }

    if (!parsed) parsed = mockFallback(userText, currentMessages);

    const matchedProducts = filterProducts(parsed, userText, allProducts);

    const aiMsg = {
      id: Date.now() + 1,
      from: "ai",
      text: parsed.message,
      rawResponse: parsed._raw || parsed.message,
      suggestions: parsed.suggestions || [],
      products: matchedProducts,
      filters: parsed.filters || {},
      intent: parsed.intent,
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }, [isTyping]);

  const clearChat = () => {
    const initial = {
      id: 1, from: "ai",
      text: "Hey! 👋 Chat cleared. What are you looking to buy today?",
      suggestions: ["I need a phone", "Show me fashion", "Food & groceries", "Something for my home"],
      products: [], filters: {},
    };
    setMessages([initial]);
    setError(null);
  };

  return { messages, isTyping, error, sendMessage, clearChat };
}