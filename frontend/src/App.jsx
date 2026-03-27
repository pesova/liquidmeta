import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import VendorDashboard from './pages/VendorDashboard'
import VendorProfile from './pages/VendorProfile'
import AdminPanel from './pages/AdminPanel'
import CheckoutPage from './pages/CheckoutPage'
import BuyerOrders from './pages/BuyerOrders'
import OrderDetail from './pages/OrderDetail'
import VerifyEmail from './pages/VerifyEmail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/chat"            element={<ChatPage />} />
        <Route path="/checkout"        element={<CheckoutPage />} />
        <Route path="/orders"          element={<BuyerOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/verify-email"    element={<VerifyEmail />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/profile"   element={<VendorProfile />} />
        <Route path="/admin"            element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App