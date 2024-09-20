import Booking from "../models/Booking.js"
import Passenger from "../models/Passenger.js";
import TourChild from "../models/TourChild.js";
import User from "../models/User.js";
import Tour from "../models/Tour.js";
export const createBooking = async (req, res) => {
    const {
        tour_child_id,
        user_id,
        number_of_adults,
        number_of_children,
        number_of_toddler,
        number_of_baby,
        total_price,
        full_name,
        email,
        phone_number,
        address,
        booking_note,
        booking_passenger
    } = req.body;

    try {
        const tourChild  = await TourChild.findByPk(tour_child_id)
        const user = await User.findByPk(user_id)

        if (!tourChild || !user) {
            return res.status(404).json({
                success: false,
                message: 'TourChild or User not found',
            })
        }
        const newBooking = await Booking.create({
            tour_child_id,
            user_id,
            number_of_adults,
            number_of_children,
            number_of_toddler,
            number_of_baby,
            total_price,
            full_name: full_name || user.username,
            email: email || user.email,
            phone_number: phone_number || user.phone,
            address: address || user.address,
            booking_note
        })

       // create passenger
        if (booking_passenger && Array.isArray(booking_passenger)){
            const bookingPassengerPromises = booking_passenger.map(passenger => {
                return Passenger.create({
                    booking_id: newBooking.id,
                    ...passenger
                });
            });
            await Promise.all(bookingPassengerPromises)
        }

        return res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: newBooking,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message,
        });
    }
};
export const updateStatusBooking = async (req, res) => {
    const { id } = req.params;  
    const { status } = req.body; 

    try {
        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await booking.update({ status });
        res.status(200).json({ success: true, message: 'Update status successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error, message: 'Failed to update status. Try again' });
    }
};

export const getBooking = async(req, res) => {
    const { id } = req.params
    try {
        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    attributes: ['tour_id', 'tour_code', 'price_adult', 'price_child', 'price_toddler', 'price_baby'],
                    include: [
                        {
                            model: Tour,
                            as : "tour",
                            attributes: ['name', 'departure_city', 'duration']
                        }
                    ]
                }, 
                {
                    model: User,
                    as: 'bookingUser',
                    attributes: ['username', 'email', 'phone', 'address']
                },
                {
                    model: Passenger,
                    as: 'bookingPassenger',
                    attributes: ['booking_id', 'passenger_name', 'passenger_dateOfBirthday', 'passenger_gender']
                }
            ]
        })
        res.status(200).json({success:true, message: "Successfully", data: booking})
    } catch (error) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

export const getAllBooking = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 8
    const offset = (page - 1) * limit
    try {
        const { count, rows } = await Booking.findAndCountAll({
            limit, 
            offset,
            distinct: true,
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    attributes: ['tour_id', 'tour_code', 'price_adult', 'price_child', 'price_toddler', 'price_baby'],
                    include: [
                        {
                            model: Tour,
                            as : "tour",
                            attributes: ['name', 'departure_city', 'duration']
                        }
                    ]
                }, 
                {
                    model: User,
                    as: 'bookingUser',
                    attributes: ['username', 'email', 'phone', 'address']
                },
                {
                    model: Passenger,
                    as: 'bookingPassenger',
                    attributes: ['booking_id', 'passenger_name', 'passenger_dateOfBirthday', 'passenger_gender']
                }
            ]
        })
        res.status(200).json({
            success: true,
            count: count, 
            totalPages: Math.ceil(count / limit), 
            currentPage: page, 
            message: "Successfully retrieved tours",
            data: rows    
        });
    } catch (error) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}