import Category from "../models/Category.js"
import { createSlug } from "../utils/slug.js"

export const createCategory = async(req, res) => {
    try {
        const {cate_name, cate_status, cate_description} = req.body
        const cate_slug = createSlug(cate_name)
        const newCategory = await Category.create({
            cate_name,
            cate_status,
            cate_description,
            cate_slug
        })
        res.status(200).json({success:true, message:'Tạo danh mục thành công', data: newCategory})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error,  message:'Tạo danh mục không thành công'})
    }
}

export const editCategory = async(req, res) => {
    try {
        const { id } = req.params
        const {cate_name, cate_status, cate_description} = req.body
        const updateCategory = await Category.findByPk(id)
        const cate_slug = createSlug(cate_name)
        updateCategory.update({
            cate_name, 
            cate_status, 
            cate_description,
            cate_slug
        })
        res.status(200).json({success:true, message:'Cập nhật danh mục thành công', data: updateCategory})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Đã có lỗi xảy ra !'})
    }
}
export const deleteCategory = async(req, res) => {
    try {
        const { id } = req.params
        await Category.destroy({ where: { id } })
        res.status(200).json({success:true, message:'Xóa danh mục thành công'})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra !' });
    }
}
export const getSingleCategory = async(req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(404).json({ success: false, message: 'Danh mục không tìm thấy' });
        }
        res.status(200).json({ success: true, message: '', data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra !' });
    }
}
export const getAllCategory = async(req, res) => {
    try {
        const category = await Category.findAll({})
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json({ success: true, message: '', data: category });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra !' });
    }
}