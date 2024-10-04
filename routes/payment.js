import express from 'express'
import { createVNPayPaymentUrl } from '../controllers/PaymentController.js';
const router = express.Router()

router.post('/create_payment_url', createVNPayPaymentUrl);

export default router