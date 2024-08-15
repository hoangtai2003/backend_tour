import Category from "../models/Category.js";

// create category
export const createCategory= async(req, res) => {
    const {name, parent_id}  = req.body
    try {
        const newCategory= await Category.create({
            name, 
            parent_id: parent_id || 0 // Nếu không có parent_id thì mặc định là 0
        })

        // Tìm và nạp các mối quan hệ cha con
        const categoryWithRelations = await Category.findByPk(newCategory.id, {
            // include dùng để join các bảng lại với nhau (dữ liệu trong 1 truy vấn)
            include: [
                {
                    model: Category,
                    as: 'parent'
                },
                {
                    model: Category,
                    as: 'children'
                }
            ]
        })
        res.status(200).json({success:true, message:'Category successfully created', data: categoryWithRelations})
    } catch (error) {
        res.status(500).json({success:false, message:'Failed to create category. Try again'})
    }
}

// update category
export const updateCategory = async(req, res) => {
    const id = req.params.id
    const {name, parent_id} = req.body
    try {
        const categoryToUpdate  = await Category.findByPk(id)

        if (!categoryToUpdate) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await categoryToUpdate .update({
            name,
            parent_id: parent_id || categoryToUpdate .parent_id // Giữ nguyên parent_id nếu không có giá trị mới
        })

        const updatedCategory = await Category.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'parent'
                },
                {
                    model: Category,
                    as: 'children'
                }
            ]
        })
        res.status(200).json({
            success: true,
            message: 'Category successfully updated',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update category. Try again later.'
        });
    }
    
}
// delete category
export const deleteCategory = async(req, res) => {
    const id = req.params.id
    try {
        const categoryToDelete = await Category.findByPk(id)

        if (!categoryToDelete) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Xóa tất cả danh mục con cần xóa
        await Category.destroy({
            where: {
                parent_id: id
            }
        });

        // Xóa danh mục chính
        await categoryToDelete.destroy()
        res.status(200).json({
            success: true,
            message: 'Category successfully deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete category. Try again later.'
        });
    } 
}
// get single category
export const getSingleCategory = async (req, res) => {
    const id = req.params.id;

    try {
        // Tìm danh mục theo ID và bao gồm các danh mục con
        const category = await Category.findByPk(id, {
            include: [
                { model: Category, as: 'parent' },
                { model: Category, as: 'children' } 
            ]
        });

        // Kiểm tra nếu danh mục không tồn tại
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully fetched category', data: category });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch category' });
    }
}