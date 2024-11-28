import express from 'express'
import { allowUser, createUser, deleteUser, getAllUser, getSingleUser, refuseUser, updatePassword, updateUser } from '../controllers/UserController.js'
import { getAllRequest, getAllRequestApproved, registerTour, updateTourRequest } from '../controllers/TourRequestsController.js'
import { verifyToken } from '../utils/verifyToken.js'
import  multer from "multer"

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/users/'); 
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
    const imageUrl = `http://localhost:4000/images/users/${file.filename}`;
    res.status(200).json({
        uploaded: true,
        url: imageUrl
    });
});

// create new user
router.post('/',  createUser)

// update user
router.put('/:id', upload.array('user_image', 10), updateUser)

router.put('/updatePassword/:id', updatePassword)
// delete user
router.delete('/:id', deleteUser)

// get single user 
router.get('/:id', getSingleUser)

// get all user
router.get('/', getAllUser)

router.put('/allow/:id', allowUser)

router.delete('/refuse/:id', refuseUser)

router.post('/request/registerTour', registerTour)

router.put('/request/updateStatus/:requestId', updateTourRequest)

router.get('/request/getAll', getAllRequest)

router.get('/request/getAllApproved', verifyToken, getAllRequestApproved)
export default router