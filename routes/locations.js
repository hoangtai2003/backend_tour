import express from 'express'
import { createLocation, deleteLocation, getAllLocation, getAllLocationPagination, getLocationBySlug, getSingleLocation, updateLocation } from '../controllers/LocationController.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/locations/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); 
    }
});
const upload = multer({ storage: storage });
router.post('/upload', upload.single('upload'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:4000/images/locations/${file.filename}`;
    res.status(200).json({
        uploaded: true,
        url: imageUrl
    });
});


// create location
router.post('/', upload.array('location_img', 10), createLocation)

// update location
router.put('/:id', upload.array('location_img', 10), updateLocation)

// delete location
router.delete('/:id', deleteLocation)

// get single location
router.get('/:id', getSingleLocation)

// get all location
router.get('/', getAllLocationPagination)

router.get('/all/getAllLocation', getAllLocation)

router.get('/slug-location/:slug', getLocationBySlug)
export default router