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
        introduct_tour, 
        location_ids,
        tour_children // Add this field
    } = req.body;

    try {
        // Validate dates
        const validateDate = (date) => {
            return !isNaN(Date.parse(date));
        };

        if (tour_children && Array.isArray(tour_children)) {
            for (const child of tour_children) {
                if (!validateDate(child.start_date) || !validateDate(child.end_date)) {
                    throw new Error('Invalid date value in tour_children');
                }
            }
        }

        // Generate tour code
        const tourCodePrefix = "NDSGN";
        const uniqueId = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); 
        const startDate = new Date(tour_children && tour_children[0] && tour_children[0].start_date);
        const formattedDate = startDate ? startDate.toISOString().slice(0, 10).split('-').reverse().join('').slice(0, 6) : '000000';
        const tourCodeSuffix = uuidv4().slice(0, 2).toUpperCase(); 
        const tour_code = `${tourCodePrefix}${uniqueId}-${formattedDate}${tourCodeSuffix}-H`;

        // Create tour
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

        // Create tour children
        if (tour_children && Array.isArray(tour_children)) {
            const tourChildPromises = tour_children.map(child => {
                if (!validateDate(child.start_date) || !validateDate(child.end_date)) {
                    throw new Error('Invalid date value in tour_children');
                }
                return TourChild.create({
                    tour_id: newTour.id,
                    tour_code,
                    ...child
                });
            });
            await Promise.all(tourChildPromises);
        }

        // Create tour locations
        if (location_ids && Array.isArray(location_ids)) {
            const tourLocationPromises = location_ids.map(location_id => {
                return TourLocation.create({
                    tour_id: newTour.id,
                    location_id
                });
            });
            await Promise.all(tourLocationPromises);
        }

        res.status(200).json({ 
            success: true, 
            message: 'Tour successfully created', 
            data: {
                tour: newTour,
                tour_children // Include child tours in the response
            }
        });
    } catch (err) {
        console.error('Error creating tour:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create tour. Try again',
            error: err.message
        });
    }
};



// update tour
export const updateTour = async (req, res) => {
    const id = req.params.id; 
    const { 
        name, 
        description_itinerary, 
        price, 
        duration, 
        departure_city, 
        transportations, 
        tour_image, 
        introduct_tour, 
        location_ids,
        tour_children
    } = req.body;

    try {
        const tour = await Tour.findByPk(id);
        if (!tour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }

        const validateDate = (date) => {
            return !isNaN(Date.parse(date));
        };

        // Update the tour details
        await tour.update({
            name, 
            description_itinerary, 
            price, 
            duration, 
            departure_city, 
            transportations, 
            tour_image, 
            introduct_tour
        });

        if (tour_children && Array.isArray(tour_children)) {
            for (const child of tour_children) {
                if (!validateDate(child.start_date) || !validateDate(child.end_date)) {
                    throw new Error('Invalid date value in tour_children');
                }

                // Create or update TourChild
                const [tourChild, created] = await TourChild.findOrCreate({
                    where: { id: child.id || null, tour_id: id },
                    defaults: {
                        start_date: child.start_date,
                        end_date: child.end_date,
                        price_adult: child.price_adult,
                        price_child: child.price_child,
                        total_seats: child.total_seats,
                        tour_code: generateTourCode(child.start_date), // Function to generate tour_code
                    }
                });

                if (!created) {
                    await tourChild.update({
                        start_date: child.start_date,
                        end_date: child.end_date,
                        price_adult: child.price_adult,
                        price_child: child.price_child,
                        total_seats: child.total_seats,
                        tour_code: generateTourCode(child.start_date), // Function to generate tour_code
                    });
                }
            }
        }

        if (location_ids && Array.isArray(location_ids)) {
            await TourLocation.destroy({ where: { tour_id: id } });
            const tourLocationPromises = location_ids.map(location_id => {
                return TourLocation.create({
                    tour_id: id,
                    location_id: location_id
                });
            });
            await Promise.all(tourLocationPromises);
        }

        res.status(200).json({
            success: true,
            message: 'Tour successfully updated',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update tour. Try again',
            error: err.message 
        });
    }
};

// Helper function to generate tour_code
const generateTourCode = (startDate) => {
    const tourCodePrefix = "NDSGN";
    const uniqueId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const formattedDate = new Date(startDate).toISOString().slice(0, 10).split('-').reverse().join('').slice(0, 6);
    const tourCodeSuffix = uuidv4().slice(0, 2).toUpperCase();
    return `${tourCodePrefix}${uniqueId}-${formattedDate}${tourCodeSuffix}-H`;
};



// delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tourToDelete = await Tour.findByPk(id);
        if (!tourToDelete) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }

        // Delete related TourChild records
        await TourChild.destroy({ where: { tour_id: id } });

        // Delete related TourLocation records
        await TourLocation.destroy({ where: { tour_id: id } });

        // Finally, delete the Tour record
        await tourToDelete.destroy();

        res.status(200).json({ success: true, message: 'Tour successfully deleted' });
    } catch (err) {
        console.error('Error deleting tour:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete tour. Try again', 
            error: err.message 
        });
    }
};


// get single tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id
    try {
        const tour = await Tour.findByPk(id, {
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
        })
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
            offset,     // Bỏ qua số lượng tour tương ứng với trang hiện tại
            distinct: true,   // Sử dụng DISTINCT để loại bỏ các bản ghi trùng lặp
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
