import express from 'express'
import { createReview, editStatus, getAllReview, getAllReviewStatus, getReviewBySlugTour } from '../controllers/ReviewController.js'
const router = express.Router()

router.post('/', createReview)

router.get('/:slug', getReviewBySlugTour)

router.get('/', getAllReview)

router.get('/reviewStatus/status', getAllReviewStatus)

router.put('/:id', editStatus)

export default router