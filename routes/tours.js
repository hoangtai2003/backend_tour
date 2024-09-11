import express from 'express'
import { createTour, updateTour, deleteTour, getSingleTour, getAllTour, getTourBySearch, getFeaturedTour, getTourCount }  from '../controllers/TourController.js'
import multer from 'multer'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/tours/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

const router = express.Router();
router.post('/upload', upload.single('upload'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  

    const imageUrl = `http://localhost:4000/images/tours/${file.filename}`;
    res.status(200).json({
      uploaded: true,
      url: imageUrl
    });
});

router.post('/', upload.array('tour_image', 10), createTour);


router.put('/:id', updateTour);
router.delete('/:id', deleteTour);
router.get('/:id', getSingleTour);
router.get('/', getAllTour);
router.get('/search/getTourBySearch', getTourBySearch);
router.get('/search/getFeaturedTours', getFeaturedTour);
router.get('/search/getTourCount', getTourCount);

export default router;
