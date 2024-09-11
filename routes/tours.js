import express from 'express'
import { createTour, updateTour, deleteTour, getSingleTour, getAllTour, getTourBySearch, getFeaturedTour, getTourCount }  from '../controllers/TourController.js'
import multer from 'multer'

// Configuring multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/tours/'); // Directory to store images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
    }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

const router = express.Router();

// Create new tour with image uploads
router.post('/', upload.array('tour_image', 10), createTour);

// Other routes
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);
router.get('/:id', getSingleTour);
router.get('/', getAllTour);
router.get('/search/getTourBySearch', getTourBySearch);
router.get('/search/getFeaturedTours', getFeaturedTour);
router.get('/search/getTourCount', getTourCount);

export default router;
