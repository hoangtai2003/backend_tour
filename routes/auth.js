import express from 'express'
import { login, register, user } from '../controllers/AuthController.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', verifyToken, user)

export default router;