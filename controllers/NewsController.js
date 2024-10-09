import Category from '../models/Category.js'
import News from '../models/News.js'
export const createNews = async(req, res) => {
    const {news_name, news_description, news_date, cate_id} = req.body
    const news_image = req.files
    try {
        const createNews = await News.create({
            news_name,
            news_date,
            news_description,
            news_image: `http://localhost:4000/images/news/${news_image[0].filename}`,
            cate_id
        })
        res.status(200).json({success:true, message:'Tạo mới tin tức thành công', data: createNews})
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Tạo mới tin tức không thành công',
            error: error.message
        });
    }
}

export const editNews = async(req, res) => {
    const { id } = req.params
    const {news_name, news_description, news_date, cate_id, news_status} = req.body
    const news_image = req.files

    try {
        const editNews = await News.findByPk(id)
        if(!editNews){
            return res.status(404).json({ success: false, message: 'Tin tức này không được tìm thấy' });
        }

        const updateData = {
            news_name,
            news_description,
            news_date,
            cate_id,
            news_status,
        }
        if (news_image && news_image.length > 0) {
            updateData.news_image = `http://localhost:4000/images/news/${news_image[0].filename}`;
        }
        await editNews.update(updateData)
        res.status(200).json({success:true, message:'Cập nhật thành công tin tức', data: editNews})
    } catch (error) {
        res.status(500).json({success:false, message:'Đã có lỗi xảy ra !'})
    }
}
export const getSingleNews = async(req, res) => {
    const { id } = req.params
    try {
        const news = await News.findByPk(id)
        if(!news){
            return res.status(404).json({ success: false, message: 'Tin tức này không được tìm thấy' });
        }
        res.status(200).json({success:true, message:'', data: news})
    } catch (error) {
        res.status(500).json({success:false, message:'Đã có lỗi xảy ra !'})
    }
}
export const getALlNews = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 9
    const offset = (page - 1) * limit
    try {
        const {rows, count} = await News.findAndCountAll({
            limit,
            offset,
            distinct: true,
            include: [
                {
                    model: Category,
                    as: 'newsCate',
                    attributes: ['cate_name']

                }
            ]
        })
        res.status(200).json({
            success: true, 
            count: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,  
            message:'', 
            data: rows
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra !',
            error: error.message
        });
    }
}
