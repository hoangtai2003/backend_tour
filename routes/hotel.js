import express from "express";
import { createHotel, destroyHotel, getAllHotel, getHotelRelated, getSingleHotel, updateHotel } from "../controllers/HotelController.js";
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/hotel/'); 
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
    const imageUrl = `http://localhost:4000/images/hotel/${file.filename}`;
    res.status(200).json({
        uploaded: true,
        url: imageUrl
    });
});
router.post('/', upload.array('hotel_image', 10), createHotel)

router.put('/:slug', upload.array('hotel_image', 10), updateHotel)

router.get('/', getAllHotel)

router.get('/:slug', getSingleHotel)

router.get('/related/:slug', getHotelRelated)

router.delete('/:slug', destroyHotel)

export default router