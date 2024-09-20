import express from 'express'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'
import { createBooking, getAllBooking, getBooking, updateStatusBooking } from '../controllers/BookingController.js'

const router = express.Router()


router.post('/', createBooking)
router.put('/:id', updateStatusBooking)
router.get('/:id', verifyUser, getBooking)
router.get('/', verifyAdmin, getAllBooking)


export default router
