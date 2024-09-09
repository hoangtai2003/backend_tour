import express from 'express'
import { createTour, updateTour, deleteTour, getSingleTour, getAllTour, getTourBySearch, getFeaturedTour, getTourCount }  from '../controllers/TourController.js'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: "images/tours",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage: storage})
const router = express.Router()

// create new tour
router.post('/', upload.single("image"), createTour)

// update tour
router.put('/:id', updateTour)

// delete tour
router.delete('/:id', deleteTour)

// get single tour
router.get('/:id', getSingleTour)

// get all tour
router.get('/', getAllTour)

// get tour by search
router.get('/search/getTourBySearch', getTourBySearch)
router.get('/search/getFeaturedTours', getFeaturedTour)
router.get('/search/getTourCount', getTourCount)
export default router;  