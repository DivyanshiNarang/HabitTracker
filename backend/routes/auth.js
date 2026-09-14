import { Router } from 'express';
import { login, me, register, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);

export default router;