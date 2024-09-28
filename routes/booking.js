import express from 'express'
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js'
import { createBooking, getAllBooking, getBooking, updateStatusBooking } from '../controllers/BookingController.js'

const router = express.Router()


router.post('/', createBooking)
router.post('/:id/status', updateStatusBooking)
router.get('/userBooking/:id', verifyToken, getBooking)
router.get('/', getAllBooking)


export default router
