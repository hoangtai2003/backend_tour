import express from "express";
import Hotel from "../models/Hotel.js"
import Location from "../models/Location.js";
import { createSlug } from "../utils/slug.js";

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
    const { id } = req.params
    const { location_id, hotel_name, hotel_description, hotel_address, hotel_phone, hotel_price, hotel_title } = req.body
    const hotel_image = req.files
    const hotel_slug = createSlug(hotel_name)
    try {
        const hotelToUpdate = await Hotel.findByPk(id)
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