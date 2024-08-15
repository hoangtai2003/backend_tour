import express from 'express'
import { createLocation, deleteLocation, getAllLocation, getSingleLocation, updateLocation } from '../controllers/LocationController.js'


const router = express.Router()

// create location
router.post('/', createLocation)

// update location
router.put('/:id', updateLocation)

// delete location
router.delete('/:id', deleteLocation)

// get single location
router.get('/:id', getSingleLocation)

// get all location
router.get('/', getAllLocation)

export default router