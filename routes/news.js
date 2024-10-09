import express from 'express';
import multer from 'multer';
import { createNews, editNews, getALlNews, getSingleNews } from '../controllers/NewsController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/news/');
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
    const imageUrl = `http://localhost:4000/images/news/${file.filename}`;
    res.status(200).json({
        uploaded: true,
        url: imageUrl
    });
});

router.post('/', upload.array('news_image', 10), createNews);
router.put('/:id', upload.array('news_image', 10), editNews);
router.get('/', getALlNews)
router.get('/:id', getSingleNews)

export default router;
