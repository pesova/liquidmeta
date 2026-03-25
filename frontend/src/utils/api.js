// api.js — AI MarketLink Frontend API Integration
// Connects to backend at http://localhost:5000

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Token helpers ──
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
};
export const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const removeUser = () => localStorage.removeItem("user");
export const isLoggedIn = () => !!getToken();

// ── Base fetch with auth ──
const request = async (method, path, body = null, isFormData = false) => {
  const token = getToken();
  const headers = {};

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
};

// ════════════════════════════════════════
// AUTH
// ════════════════════════════════════════

export const authAPI = {
  // Register buyer
  register: (body) => request("POST", "/api/auth/register", body),

  // Login
  login: async (email, password) => {
    const data = await request("POST", "/api/auth/login", { email, password });
    if (data.data?.token) {
      setToken(data.data.token);
      setUser(data.data.user);
    }
    return data;
  },

  // Verify email
  verifyEmail: (email, token) =>
    request("POST", "/api/auth/verify-email", { email, token }),

  // Resend verification
  resendVerification: (email) =>
    request("POST", "/api/auth/resend-verification", { email }),

  // Forgot password
  forgotPassword: (email) =>
    request("POST", "/api/auth/forgot-password", { email }),

  // Verify reset token
  verifyResetToken: (email, token) =>
    request("POST", "/api/auth/verify-reset-token", { email, token }),

  // Reset password
  resetPassword: (email, token, newPassword) =>
    request("POST", "/api/auth/reset-password", { email, token, newPassword, confirmPassword: newPassword }),

  // Get profile
  getProfile: () => request("GET", "/api/auth/profile"),

  // Logout
  logout: () => {
    removeToken();
    removeUser();
    return request("POST", "/api/auth/logout");
  },
};

// ════════════════════════════════════════
// VENDOR
// ════════════════════════════════════════

export const vendorAPI = {
  // Onboard new vendor (no auth needed)
  onboard: (body) => request("POST", "/api/vendors/onboard", body),

  // Onboard existing user as vendor
  onboardExisting: (body) => request("POST", "/api/vendors/onboard/existing", body),

  // Get vendor profile
  getProfile: () => request("GET", "/api/vendors/profile"),

  // Update bank details
  updateBankDetails: (body) => request("PATCH", "/api/vendors/bank-details", body),

  // Get vendor products
  getProducts: () => request("GET", "/api/vendors/products"),

  // Get vendor orders
  getOrders: () => request("GET", "/api/vendors/orders"),

  // Get vendor balance
  getBalance: () => request("GET", "/api/vendors/balance"),

  // Get public vendor profile
  getPublicProfile: (id) => request("GET", `/api/vendors/${id}`),
};

// ════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════

export const productsAPI = {
  // Get all products (with filters)
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request("GET", `/api/products${query ? `?${query}` : ""}`);
  },

  // Search products
  search: (q, limit = 10) =>
    request("GET", `/api/products/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  // Get single product
  getById: (id) => request("GET", `/api/products/${id}`),

  // Create product (vendor, with image)
  create: (formData) => request("POST", "/api/products", formData, true),

  // Bulk create products
  bulkCreate: (formData) => request("POST", "/api/products/bulk", formData, true),

  // Update product (vendor)
  update: (id, body) => request("PUT", `/api/products/${id}`, body),

  // Delete product (vendor)
  delete: (id) => request("DELETE", `/api/products/${id}`),

  // Get vendor's own products
  getMyProducts: () => request("GET", "/api/products/vendor/my-products"),
};

// ════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════

export const ordersAPI = {
  // Create order (buyer)
  create: (body) => request("POST", "/api/orders", body),

  // Get buyer orders
  getBuyerOrders: () => request("GET", "/api/orders"),

  // Get single order
  getById: (orderId) => request("GET", `/api/orders/${orderId}`),

  // Confirm delivery (buyer)
  confirmDelivery: (orderId) =>
    request("PATCH", `/api/orders/${orderId}/confirm-delivery`),

  // Cancel order
  cancel: (orderId) => request("PATCH", `/api/orders/${orderId}/cancel`),

  // Mark as shipped (vendor)
  markShipped: (orderId) => request("PATCH", `/api/orders/${orderId}/ship`),
};

// ════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════

export const paymentsAPI = {
  // Initiate payment — returns Interswitch checkout URL
  initiate: (orderId) => request("POST", "/api/payments/initiate", { orderId }),

  // Get escrow record for order
  getEscrow: (orderId) => request("GET", `/api/payments/escrow/${orderId}`),

  // Check transaction status
  checkStatus: (reference, amount) =>
    request("GET", `/api/payments/status?reference=${reference}&amount=${amount}`),
};

// ════════════════════════════════════════
// CHAT
// ════════════════════════════════════════

export const chatAPI = {
  // Send message to backend AI
  sendMessage: (message) => request("POST", "/api/chat", { message }),

  // Get chat history
  getHistory: () => request("GET", "/api/chat"),

  // Clear chat history
  clearHistory: () => request("DELETE", "/api/chat/history"),
};
