import express from 'express';
import { login, renderLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/login', renderLogin);
export default router; 