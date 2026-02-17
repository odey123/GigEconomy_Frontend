import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authController.register);

// POST /api/v1/auth/login
router.post('/login', authController.login);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// GET /api/v1/auth/me
router.get('/me', authController.getCurrentUser);

export default router;
