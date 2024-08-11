import express from 'express'
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser } from '../controllers/userController.js'

const router = express.Router()

// create new user
router.post('/', createUser)

// update user
router.put('/:id', updateUser)

// delete user
router.delete('/:id', deleteUser)

// get single user 
router.get('/:id', getSingleUser)

// get all user
router.get('/', getAllUser)

export default router