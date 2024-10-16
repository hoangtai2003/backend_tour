import express from 'express'
import { createReview, getAllReview, getReviewBySlugTour } from '../controllers/ReviewController.js'
const router = express.Router()

router.post('/', createReview)

router.get('/:slug', getReviewBySlugTour)

router.get('/', getAllReview)
export default router