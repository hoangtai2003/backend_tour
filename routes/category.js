import express from "express"
import { createCategory, deleteCategory, editCategory, getAllCategory, getSingleCategory } from "../controllers/CategoryController.js"

const router = express.Router()

router.post('/', createCategory)
router.get('/', getAllCategory)
router.put('/:id', editCategory)
router.delete('/:id', deleteCategory)
router.get('/:id', getSingleCategory)
export default router