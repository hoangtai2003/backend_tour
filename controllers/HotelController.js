import Hotel from "../models/Hotel.js"
import Location from "../models/Location.js";
import { createSlug } from "../utils/slug.js";
import { Op } from "sequelize";

export const createHotel = async(req, res) => {
    const { location_id, hotel_name, hotel_description, hotel_address, hotel_phone, hotel_price, hotel_title } = req.body
    const hotel_image = req.files;
    const hotel_slug = createSlug(hotel_name)
    try {
        const newHotel = await Hotel.create({
            location_id, 
            hotel_name, 
            hotel_description, 
            hotel_address, 
            hotel_phone,
            hotel_price,
            hotel_title,
            hotel_slug,
            hotel_image:  `http://localhost:4000/images/hotel/${hotel_image[0].filename}`,
        })
        res.status(200).json({success:true, message:'Successfully', data: newHotel})
    } catch (error) {
        res.status(500).json({success:false, error,  message:'Đã có lỗi xảy ra. Vui lòng thử lại'})
    }
}

export const updateHotel = async(req, res) => {
    const { slug } = req.params
    const { location_id, hotel_name, hotel_description, hotel_address, hotel_phone, hotel_price, hotel_title } = req.body
    const hotel_image = req.files
    const hotel_slug = createSlug(hotel_name)
    try {
        const hotelToUpdate = await Hotel.findOne({where: { hotel_slug: slug }})
        if(!hotelToUpdate){
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        const updateData = {
            location_id, 
            hotel_name, 
            hotel_description, 
            hotel_address, 
            hotel_phone,
            hotel_price,
            hotel_title,
            hotel_slug
        }
        if (hotel_image && hotel_image.length > 0) {
            updateData.hotel_image = `http://localhost:4000/images/hotel/${hotel_image[0].filename}`;
        }
        await hotelToUpdate.update(updateData)
        res.status(200).json({success:true, message:'Successfully', data: hotelToUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Đã có lỗi xảy ra. Vui lòng thử lại !'})
    }
}
export const getAllHotel = async(req, res) => {
    try {
        const hotel = await Hotel.findAll({
            include: [
                {
                    model: Location,
                    as: "hotelLocation",
                    attributes: ['name']
                }
            ]
        })
        res.status(200).json({success:true, message:'Successfully', data: hotel})
    } catch (error) {
        res.status(500).json({success:false, error,  message:'Đã có lỗi xảy ra. Vui lòng thử lại'})
    }
}

export const getSingleHotel = async(req, res) => {
    const { slug } = req.params
    try {
        const hotel = await Hotel.findOne({
            where: {
                hotel_slug: slug
            },
            include: [
                {
                    model: Location,
                    as: "hotelLocation",
                    attributes: ['name']
                }
            ]
        })
        res.status(200).json({success:true, message:'Successfully', data: hotel})
    } catch (error) {
        res.status(500).json({success:false, error,  message:'Đã có lỗi xảy ra. Vui lòng thử lại'})
    }
}

export const getHotelRelated = async(req, res) => {
    const { slug } = req.params
    try {
        const currentHotel = await Hotel.findOne({
            where: {
                hotel_slug: slug
            },
            include: [
                {
                    model: Location,
                    as: 'hotelLocation',
                    attributes: ['id', 'name']
                }
            ]
        })
        if (!currentHotel) {
            return res.status(404).json({ success: false, message: 'Khách sạn không được tìm thấy' });
        }

        const currentLocationIds = currentHotel.hotelLocation.id
        if (currentLocationIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy địa điểm của khách sạn' });
        }

        const relatedHotel = await Hotel.findAll({
            include: [
                {
                    model: Location,
                    as: 'hotelLocation',
                    where: {
                        id: currentLocationIds 
                    },
                    attributes: ['name'],
                }
            ],
            where: {
                hotel_slug: { [Op.ne]: slug }  
            },
            distinct: true 
        })
        res.status(200).json({
            success: true,
            data: relatedHotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
            error: error.message
        });
    }
}
export const destroyHotel = async(req, res) => {
    const { slug } = req.params
    try {
        await Hotel.destroy({where: { hotel_slug: slug } })
        res.status(200).json({success:true, message:'Xóa tin tức thành công'})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra !' });
    }
}