import express from 'express'
import { createCategory, deleteCategory, getSingleCategory, updateCategory } from '../controllers/CategoryController.js'

const router = express.Router()

// Thêm mới category
router.post('/', createCategory)

// Sửa category
router.put('/:id', updateCategory)
// Lấy category theo id
router.get('/:id', getSingleCategory)

// Xóa category
router.delete('/:id', deleteCategory)
export default router