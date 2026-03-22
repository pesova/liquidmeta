// useAIChat.js — AI MarketLink
// Claude-powered chat with safe mock fallback
import { useState, useCallback } from "react";

const SYSTEM_PROMPT = `You are the AI shopping assistant for AI MarketLink — a trusted African e-commerce marketplace with built-in escrow payment protection.

YOUR CAPABILITIES:
- Help buyers discover products through natural conversation
- Understand requests in English, Nigerian Pidgin, Yoruba, Igbo, Hausa, and French
- Always respond in the SAME LANGUAGE the user writes in
- Extract structured product filters from natural language
- Handle price negotiation and budget discussions
- Remember conversation context within this session
- Suggest follow-up questions to refine searches

YOUR PERSONALITY:
- Friendly, warm, and culturally aware of African commerce
- Confident about escrow payment protection benefits
- Honest about what you can and cannot find

PRODUCT CATEGORIES AVAILABLE:
Electronics, Fashion & Clothing, Phones & Accessories, Food & Groceries, Beauty & Health, Home & Furniture, Agro & Farm Produce, Baby & Kids, Automobile Parts, Books & Stationery

ESCROW SYSTEM:
All payments are held in escrow until buyer confirms delivery. Always mention this when discussing payment.

PRICE EXPRESSIONS (Nigerian):
"5k" = 5000, "50k" = 50000, "100k" = 100000, "1m" = 1000000

RESPONSE FORMAT — Always return ONLY valid JSON, no extra text:
{
  "message": "Your conversational response",
  "language": "english|pidgin|yoruba|igbo|hausa|french",
  "intent": "search|negotiate|info|greeting|complaint|unclear",
  "filters": {
    "query": "search term or null",
    "category": "category or null",
    "maxPrice": number or null,
    "minPrice": number or null
  },
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "showProducts": true or false
}`;

/* ── Mock fallback when API unavailable ── */
const mockResponse = (text) => {
  const lower = text.toLowerCase();
  let query = null, category = null, maxPrice = null, showProducts = false;

  if (lower.includes("phone") || lower.includes("samsung") || lower.includes("iphone")) {
    category = "Phones & Accessories"; showProducts = true;
  } else if (lower.includes("dress") || lower.includes("ankara") || lower.includes("fashion")) {
    category = "Fashion & Clothing"; showProducts = true;
  } else if (lower.includes("laptop") || lower.includes("electronic")) {
    category = "Electronics"; showProducts = true;
  } else if (lower.includes("food") || lower.includes("tomato")) {
    category = "Food & Groceries"; showProducts = true;
  } else if (lower.includes("beauty") || lower.includes("skin")) {
    category = "Beauty & Health"; showProducts = true;
  } else if (lower.includes("baby") || lower.includes("kid")) {
    category = "Baby & Kids"; showProducts = true;
  } else {
    showProducts = true;
    query = text.split(" ").filter(w => w.length > 3)[0] || null;
  }

  const priceMatch = lower.match(/(\d[\d,]*)\s*k\b/);
  if (priceMatch) maxPrice = parseInt(priceMatch[1]) * 1000;
  else {
    const naira = lower.match(/[₦#]?\s*(\d[\d,]+)/);
    if (naira) maxPrice = parseInt(naira[1].replace(/,/g, ""));
  }

  return {
    message: showProducts
      ? `I found some great options for you${maxPrice ? ` under ₦${maxPrice.toLocaleString()}` : ""}! All purchases are escrow-protected — your money is safe until delivery.`
      : "I'm here to help you find products! Try describing what you need — for example: 'I need a phone under ₦50,000'.",
    language: "english",
    intent: showProducts ? "search" : "greeting",
    filters: { query, category, maxPrice, minPrice: null },
    suggestions: [
      "Show me something cheaper",
      "What other categories do you have?",
      "How does escrow payment work?",
    ],
    showProducts,
  };
};

const parseAIResponse = (text) => {
  try {
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(clean);
    // Validate required fields exist
    if (!parsed.message || !parsed.filters) throw new Error("Invalid structure");
    return parsed;
  } catch {
    return null;
  }
};

export function useAIChat() {
  const [messages, setMessages] = useState([{
    id: 1, from: "ai",
    text: "Hello! I'm your AI shopping assistant for AI MarketLink. I can help you find products in English, Pidgin, Yoruba, Igbo, Hausa, or French. What are you looking for today?",
    suggestions: [
      "I need a phone under ₦50,000",
      "Show me Ankara fashion",
      "How does escrow payment work?",
      "I wan buy something for my house",
    ],
    products: [], filters: null,
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError]       = useState(null);

  const buildHistory = (msgs) =>
    msgs
      .filter(m => m.id !== 1)
      .slice(-10) // Keep last 10 messages for context
      .map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.from === "user" ? m.text : m.rawResponse || m.text,
      }));

  const sendMessage = useCallback(async (userText, allProducts = []) => {
    if (!userText.trim()) return;

    const userMsg = { id: Date.now(), from: "user", text: userText, products: [], suggestions: [] };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    let parsed = null;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...buildHistory(messages),
            { role: "user", content: userText },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.content?.[0]?.text || "";
        parsed = parseAIResponse(rawText);
        if (parsed) parsed._raw = rawText;
      }
    } catch {
      // Network error — will use mock fallback below
    }

    // Use mock fallback if API failed or returned bad data
    if (!parsed) {
      parsed = mockResponse(userText);
      setError(null); // Don't show error — just silently use fallback
    }

    // Filter products
    let matchedProducts = [];
    if (parsed.showProducts && allProducts.length > 0) {
      matchedProducts = allProducts.filter(p => {
        let ok = true;
        if (parsed.filters?.category && p.category !== parsed.filters.category) ok = false;
        if (parsed.filters?.maxPrice && p.price > parsed.filters.maxPrice) ok = false;
        if (parsed.filters?.minPrice && p.price < parsed.filters.minPrice) ok = false;
        if (parsed.filters?.query) {
          const q = parsed.filters.query.toLowerCase();
          if (!p.name.toLowerCase().includes(q) &&
              !p.category.toLowerCase().includes(q) &&
              !p.description?.toLowerCase().includes(q)) ok = false;
        }
        return ok;
      });

      // Broad keyword fallback
      if (matchedProducts.length === 0) {
        const words = userText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        matchedProducts = allProducts.filter(p =>
          words.some(w =>
            p.name.toLowerCase().includes(w) ||
            p.category.toLowerCase().includes(w)
          )
        );
      }

      // Last resort — show all
      if (matchedProducts.length === 0) matchedProducts = allProducts.slice(0, 6);
    }

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      from: "ai",
      text: parsed.message,
      rawResponse: parsed._raw || parsed.message,
      suggestions: parsed.suggestions || [],
      products: matchedProducts,
      filters: parsed.filters,
      language: parsed.language,
      intent: parsed.intent,
    }]);

    setIsTyping(false);
  }, [messages]);

  const clearChat = () => {
    setMessages([{
      id: 1, from: "ai",
      text: "Chat cleared! What would you like to find today?",
      suggestions: ["Browse all products", "I need something under ₦10,000", "Show me latest arrivals"],
      products: [], filters: null,
    }]);
    setError(null);
  };

  return { messages, isTyping, error, sendMessage, clearChat };
}