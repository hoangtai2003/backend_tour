import express from 'express'
import { createReview, editStatus, getAllReview, getReviewBySlugTour } from '../controllers/ReviewController.js'
const router = express.Router()

router.post('/', createReview)

router.get('/:slug', getReviewBySlugTour)

router.get('/', getAllReview)

router.put('/:id', editStatus)

export default router