import express from "express"
import { createCategory, deleteCategory, editCategory, getAllCategory, getSingleCategory } from "../controllers/CategoryController.js"
import { checkPermission, verifyToken } from "../utils/verifyToken.js"

const router = express.Router()

router.post('/', verifyToken, checkPermission("add_category"), createCategory);
router.get('/', getAllCategory)
router.put('/:id', editCategory)
router.delete('/:id', deleteCategory)
router.get('/:id', getSingleCategory)
export default router