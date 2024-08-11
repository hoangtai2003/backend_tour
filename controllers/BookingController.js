import Booking from "../models/Booking.js"

export const createBooking = async(req, res) => {
    const newBooking  = new Booking(req.body)
    try {
        const savedBooking = await newBooking.save()
        res.status(200).json({success:true, message:'Your tour is booked', data: savedBooking})
    } catch (error) {
        res.status(500).json({success:false, message:'Internal server error'})
    }
}

export const getBooking = async(req, res) => {
    const id = req.params.id
    try {
        const book = await Booking.findById(id)
        res.status(200).json({success:true, message: "Successfully", data: book})
    } catch (error) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

export const getAllBooking = async(req, res) => {
    try {
        const book = await Booking.find({})
        res.status(200).json({success:true, message: "Successfully", data: book})
    } catch (error) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}