import express from 'express'
import { allowUser, createUser, deleteUser, getAllUser, getSingleUser, refuseUser, updatePassword, updateUser } from '../controllers/UserController.js'
import { getAllRequest, getAllRequestApproved, registerTour, updateTourRequest } from '../controllers/TourRequestsController.js'
import { verifyToken } from '../utils/verifyToken.js'
const router = express.Router()

// create new user
router.post('/',  createUser)

// update user
router.put('/:id', updateUser)

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