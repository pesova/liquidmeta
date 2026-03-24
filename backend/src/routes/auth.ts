import { Router } from 'express';
import { 
  register,
  login,
  getProfile,
  logout
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Auth endpoints with middleware in routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', logout);

export default router;
