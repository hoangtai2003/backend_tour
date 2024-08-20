import Tour from '../models/Tour.js'
import { v4 as uuidv4 } from 'uuid';
import TourChild from '../models/TourChild.js';
import TourLocation from '../models/TourLocation.js';
import Location from '../models/Location.js';

export const createTour = async (req, res) => {
    const { 
        name, 
        description_itinerary, 
        price, 
        duration, 
        departure_city, 
        transportations, 
        tour_image, 
        start_date,
        end_date,
        price_adult,
        price_child,
        total_seats,
        introduct_tour, 
        location_ids
    } = req.body;

    try {


        const tourCodePrefix = "NDSGN";
        const uniqueId = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); 
        const formattedDate = new Date(start_date).toISOString().slice(0, 10).split('-').reverse().join('').slice(0, 6);
        const tourCodeSuffix = uuidv4().slice(0, 2).toUpperCase(); 

        const tour_code = `${tourCodePrefix}${uniqueId}-${formattedDate}${tourCodeSuffix}-H`;

        // Create a new tour in the tours table
        const newTour = await Tour.create({
            name, 
            description_itinerary, 
            price, 
            duration, 
            departure_city, 
            transportations, 
            tour_image, 
            introduct_tour
        });

        // Use the tour_id from the newly created tour to create data in the tour_child table
        const newTourChild = await TourChild.create({
            tour_id: newTour.id,
            tour_code,
            start_date,
            end_date,
            price_adult,
            price_child,
            total_seats
        });

        if (location_ids && Array.isArray(location_ids)) {
            // Map through location_ids and create entries in the TourLocation table
            const tourLocationPromises = location_ids.map(location_id => {
                return TourLocation.create({
                    tour_id: newTour.id,
                    location_id: location_id
                });
            });
            await Promise.all(tourLocationPromises);
        }

        res.status(200).json({ 
            success: true, 
            message: 'Tour successfully created', 
            data: {
                tour: newTour,
                tour_child: newTourChild
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create tour. Try again',
            error: err.message
        });
    }
};





// update tour
export const updateTour = async (req, res) => {
    // Đây là cách lấy giá trị của tham số id từ URL
    const id = req.params.id
    const { name, description, duration, departure_city, total_seats, price, start_date, end_date } = req.body;
    try {
        const updateTour = await Tour.findByPk(id)
        if(!updateTour){
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        await updateTour.update({
            name,
            description,
            duration,
            departure_city,
            total_seats,
            price, 
            start_date,
            end_date
        })
        res.status(200).json({success:true, message:'Tour successfully updated', data:updateTour})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to update tour. Try again'})
    }
}

// delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id
    try {
        const tourToDelete = await Tour.findByPk(id)
        if (!tourToDelete) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        await tourToDelete.destroy()
        res.status(200).json({success:true, message:'Tour successfully deleted'})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to delete tour. Try again'})
    }
}

// get single tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id
    try {
        const tour = await Tour.findByPk(id)
        res.status(200).json({success:true, message: "Successfully", data: tour})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// get all tour

export const getAllTour = async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;  // Số trang, mặc định là 1 nếu không có giá trị
    const limit = 8;  // Giới hạn số lượng tour mỗi trang
    const offset = (page - 1) * limit;  // Tính toán số tài liệu cần bỏ qua

    try {
        // Sử dụng Sequelize để tìm tất cả các tour với phân trang và bao gồm TourChild
        const { count, rows } = await Tour.findAndCountAll({
            limit,     // Giới hạn số lượng tour mỗi trang
            offset,    // Bỏ qua số lượng tour tương ứng với trang hiện tại
            include: 
                [
                    {
                        model: TourChild,
                        as: 'tourChildren',
                        attributes: ['id', 'tour_code', 'start_date', 'end_date', 'price_adult', 'price_child', 'total_seats']
                    },
                    {
                        model: TourLocation,
                        as: 'tourLocations',
                        include: {
                            model: Location,
                            as: 'location',
                            attributes: ["name"]
                        }
                    }
                ] 
        });

        // Trả về kết quả cùng với số lượng tour tìm được
        res.status(200).json({
            success: true,
            count: count,  // Tổng số tour có sẵn
            totalPages: Math.ceil(count / limit),  // Tổng số trang
            currentPage: page,  // Trang hiện tại
            message: "Successfully retrieved tours",
            data: rows    // Dữ liệu tour của trang hiện tại
        });
    } catch (err) {
        // Nếu có lỗi xảy ra, trả về phản hồi lỗi
        res.status(500).json({ success: false, err, message: 'Failed to retrieve tours. Try again' });
    }
};



// get tour by search
export const getTourBySearch = async (req, res) => {
    const { city, maxPrice, startDate } = req.query;

    let searchConditions = {};


    if (city) {
        searchConditions.departure_city = { [Op.iLike]: `%${city}%` }; 
    }

    if (maxPrice) {
        searchConditions.price = { [Op.lte]: parseFloat(maxPrice) }; 
    }

    if (startDate) {
        searchConditions.start_date = { [Op.gte]: new Date(startDate) };
    }

    try {
        const tours = await Tour.findAll({
            where: searchConditions
        });

        res.status(200).json({ success: true, message: "Successfully retrieved tours", data: tours });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to retrieve tours' });
    }
};

// get featured tour
export const getFeaturedTour = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).limit(8).populate('reviews')
        res.status(200).json({success:true, message: "Successfully", data: tours })
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// get tour counts 
export const getTourCount = async(req, res) => {
    try{
        const tourCount = await Tour.estimatedDocumentCount();
        res.status(200).json({success:true, message: "Successfully", data: tourCount })
    } catch (err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}
