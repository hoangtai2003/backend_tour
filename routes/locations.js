import express from 'express'
import { createLocation, deleteLocation, getAllLocation, getAllLocationPagination, getSingleLocation, updateLocation } from '../controllers/LocationController.js'


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
router.get('/', getAllLocationPagination)

router.get('/all/getAllLocation', getAllLocation)
export default router