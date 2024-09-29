import express from 'express'
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js'
import { createBooking, getAllBooking, getBooking, getBookingByBookingCode, updateStatusBooking } from '../controllers/BookingController.js'

const router = express.Router()


router.post('/', createBooking)
router.post('/:id/status', updateStatusBooking)
router.get('/userBooking/:id', verifyToken, getBooking)
router.get('/bookingDetail/:bookingCode', getBookingByBookingCode)
router.get('/', getAllBooking)


export default router
