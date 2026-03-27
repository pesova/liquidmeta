// src/routes/AppRoutes.jsx
import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RoleBasedRoute } from '../components/RoleBasedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';
import LandingPage from '../pages/LandingPage'
import { AuthContext } from '../context/AuthContext';


// Lazy load pages for code splitting
const Chat = lazy(() => import('../pages/ChatPage.jsx'));
const ProductList = lazy(() => import('../pages/ProductList.jsx'));
const ProductDetail = lazy(() => import('../pages/ProductDetail.jsx'));
const Checkout = lazy(() => import('../pages/CheckoutPage.jsx'));
const Orders = lazy(() => import('../pages/Orders.jsx'));
const VendorDashboard = lazy(() => import('../pages/VendorDashboard.jsx'));
const VendorProfile = lazy(() => import('../pages/VendorProfile.jsx'));
const AdminPanel = lazy(() => import('../pages/Adminpanel.jsx'));

const RootRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner />;

  if (user) {
    return <Navigate to={user.role === "vendor" ? "/vendor/dashboard" : "/chat"} replace />;
  }

  return <LandingPage />;
};

export const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RootRoute />}></Route>

        {/* Protected routes (any authenticated user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/products" element={<ProductList />}></Route>
          <Route path="/products/:id" element={<ProductDetail />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}

        </Route>

        {/* Vendor only routes */}
        <Route element={<RoleBasedRoute allowedRoles={["vendor", "admin"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />}></Route>
          <Route path="/vendor/profile" element={<VendorProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);
