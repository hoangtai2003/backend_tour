import express from 'express'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'
import { createBooking, getAllBooking, getBooking, updateStatusBooking } from '../controllers/BookingController.js'

const router = express.Router()


router.post('/', createBooking)
router.post('/:id/status', updateStatusBooking)
router.get('/:id', getBooking)
router.get('/', getAllBooking)


export default router
