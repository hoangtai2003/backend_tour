import express from 'express'
import { statisticalChart, statisticalTour } from "../controllers/DashboardController.js"

const router = express.Router()

router.get('/statistical-tour', statisticalTour)
router.get('/bookings', statisticalChart)

export default router