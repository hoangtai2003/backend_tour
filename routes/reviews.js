import express from 'express'
import { createReview, getReviewBySlugTour } from '../controllers/ReviewController.js'
const router = express.Router()

router.post('/', createReview)

router.get('/:slug', getReviewBySlugTour)
export default router