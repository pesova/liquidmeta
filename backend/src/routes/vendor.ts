import { Router } from 'express';
import {
  onboardVendor,
  getProfile,
  updateProfile,
  getProducts,
  getOrders,
  getBalance,
  getPublicVendor,
  onboardExistingVendor
} from '../controllers/vendorController';
import { authenticateToken, isVendor } from '../middleware/auth';

const router = Router();

// Onboard – only authentication
router.post('/onboard', onboardVendor);

// With auth — for existing users onboarding as vendor
router.post('/onboard/existing', authenticateToken, onboardExistingVendor);

// Protected vendor routes – require vendor profile
router.get('/profile', authenticateToken, isVendor, getProfile);
router.put('/profile', authenticateToken, isVendor, updateProfile);
router.get('/products', authenticateToken, isVendor, getProducts);
router.get('/orders', authenticateToken, isVendor, getOrders);
router.get('/balance', authenticateToken, isVendor, getBalance);

// Public vendor profile
router.get('/:id', getPublicVendor);

export default router;
