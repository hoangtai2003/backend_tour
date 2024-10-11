import express from 'express'
import { createVNPayPaymentUrl, handleVNPayReturn } from '../controllers/PaymentController.js';
const router = express.Router()

router.post('/create_payment_url', createVNPayPaymentUrl);
router.get('/vnpay_return', handleVNPayReturn);


export default router