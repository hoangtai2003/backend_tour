import Tour from '../models/Tour.js'
import { v4 as uuidv4 } from 'uuid';
import TourChild from '../models/TourChild.js';
import TourLocation from '../models/TourLocation.js';
import Location from '../models/Location.js';
import TourImage from "../models/TourImage.js"
import { Op, where } from 'sequelize';
import Booking from '../models/Booking.js';
import Sequelize from 'sequelize';
export const createTour = async (req, res) => {
    const { 
        name, 
        description_itinerary, 
        price, 
        duration, 
        departure_city, 
        introduct_tour, 
        location_ids,
        tour_children,
        transportation
    } = req.body;

   
    const tour_images = req.files;

    try {
        
        const locations = JSON.parse(location_ids || '[]');
        const children = JSON.parse(tour_children || '[]');

       
        const validateDate = (date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime()); 
        };

        if (children && Array.isArray(children)) {
            for (const child of children) {
                if (!validateDate(child.start_date) || !validateDate(child.end_date)) {
                    throw new Error('Invalid date value in tour_children');
                }
            }
        }
        // Create tour
        const newTour = await Tour.create({
            name, 
            description_itinerary, 
            price, 
            duration, 
            departure_city, 
            introduct_tour,
            transportation,
            program_code: generateProgramCode()
        });

        // Create tour children
        if (children && Array.isArray(children)) {
            const tourChildPromises = children.map(child => {
                return TourChild.create({
                    tour_id: newTour.id,
                    tour_code: generateTourCode(child.start_date), 
                    ...child
                });
            });
            await Promise.all(tourChildPromises);
        }

        // Create tour images
        if (tour_images && Array.isArray(tour_images)) {
            const tourImagePromises = tour_images.map(tour_image => {
                const imageUrl = `http://localhost:4000/images/tours/${tour_image.filename}`;

                return TourImage.create({
                    tour_id: newTour.id,
                    image_url: imageUrl
                });
            });
            await Promise.all(tourImagePromises);
        }


        // Create tour locations
        if (locations && Array.isArray(locations)) {
            const tourLocationPromises = locations.map(location_id => {
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
                tour_children: children 
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
    const id = req.params.id; 
    const { 
        name, 
        description_itinerary, 
        price, 
        duration, 
        departure_city, 
        introduct_tour,
        transportation, 
        location_ids,
        tour_children
    } = req.body;
    const tour_images = req.files;
    try {
        const locations = JSON.parse(location_ids || '[]');
        const children = JSON.parse(tour_children || '[]');
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
            tour_images, 
            introduct_tour,
            transportation
        });

        if (children && Array.isArray(children)) {
            for (const child of children) {
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
                        price_sale: child.price_sale,
                        price_toddler: child.price_toddler,
                        price_baby: child.price_baby,
                        transportion_start: child.transportion_start,
                        transportion_end: child.transportion_end,
                        time_goes_start: child.time_goes_start,
                        time_comes_start: child.time_comes_start,
                        time_goes_end: child.time_goes_end,
                        time_comes_end: child.time_comes_end,
                        tour_code: generateTourCode(child.start_date), 
                    }
                });

                if (!created) {
                    await tourChild.update({
                        start_date: child.start_date,
                        end_date: child.end_date,
                        price_adult: child.price_adult,
                        price_child: child.price_child,
                        total_seats: child.total_seats,
                        price_sale: child.price_sale,
                        price_toddler: child.price_toddler,
                        price_baby: child.price_baby,
                        transportion_start: child.transportion_start,
                        transportion_end: child.transportion_end,
                        time_goes_start: child.time_goes_start,
                        time_comes_start: child.time_comes_start,
                        time_goes_end: child.time_goes_end,
                        time_comes_end: child.time_comes_end,
                        tour_code: generateTourCode(child.start_date), 
                    });
                }
            }
        }
        if(tour_images && Array.isArray(tour_images)){
            const tourImagePromises = tour_images.map(tour_image => {
                const imageUrl = `http://localhost:4000/images/tours/${tour_image.filename}`;

                return TourImage.create({
                    tour_id: id,
                    image_url: imageUrl
                }); 
            })
            await Promise.all(tourImagePromises)
        }
        if (locations && Array.isArray(locations)) {
            await TourLocation.destroy({ where: { tour_id: id } });
            const tourLocationPromises = locations.map(location_id => {
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
const generateProgramCode = () => {
    const randomNumbers = Array(3).fill().map(() => Math.floor(Math.random() * 10)).join('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array(5).fill().map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    const programCode =randomLetters + randomNumbers;

    return programCode;
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
    const { id } = req.params
    try {
        const tour = await Tour.findByPk(id, {
            include: 
            [
                {
                    model: TourChild,
                    as: 'tourChildren',
                    attributes: 
                    [
                        'id', 
                        "tour_id",
                        'tour_code', 
                        'start_date', 
                        'end_date', 
                        'price_adult', 
                        'price_child', 
                        'total_seats', 
                        'price_sale',
                        'price_toddler',
                        'price_baby',
                        'transportion_start',
                        'transportion_end',
                        'time_goes_start',
                        'time_comes_start',
                        'time_goes_end',
                        'time_comes_end',
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM booking AS b
                                WHERE 
                                    b.tour_child_id = tourChildren.id
                                    AND b.status = 'Đã thanh toán'
                            )`),
                            'confirmedBookingCount' 
                        ]
                    ]
                },
                {
                    model: Location,
                    as: 'locations',
                    through: { attributes: ['location_id'] }, 
                    attributes: ['name']
                },
                {
                    model: TourImage,
                    as:'tourImage',
                    attributes: ['image_url']
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
    const page = parseInt(req.query.page) || 1; 
    const limit = 8;  
    const offset = (page - 1) * limit;  

    try {
        const { count, rows } = await Tour.findAndCountAll({
            limit,
            offset,
            distinct: true,
            include: [
                {
                    model: TourChild,
                    as: 'tourChildren',
                    attributes: [
                        'id', 
                        'tour_code', 
                        'start_date', 
                        'end_date', 
                        'price_adult', 
                        'price_child', 
                        'total_seats', 
                        'price_sale',
                        'price_toddler',
                        'price_baby',
                        'transportion_start',
                        'transportion_end',
                        'time_goes_start',
                        'time_comes_start',
                        'time_goes_end',
                        'time_comes_end',
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM booking AS b
                                WHERE 
                                    b.tour_child_id = tourChildren.id
                                    AND b.status = 'Đã thanh toán'
                            )`),
                            'confirmedBookingCount' 
                        ]
                    ],
                    include: [
                        {
                            model: Booking,
                            as: 'tourChildBooking',
                            attributes: ['status'],
                        }
                    ],
                },
                {
                    model: Location,
                    as: 'locations',
                    through: { attributes: [] },
                    attributes: ['name']
                },
                {
                    model: TourImage,
                    as: 'tourImage',
                    attributes: ['image_url'],
                }
            ] 
        });

        // Send the response
        res.status(200).json({
            success: true,
            count: count, 
            totalPages: Math.ceil(count / limit), 
            currentPage: page, 
            message: "Successfully retrieved tours",
            data: rows,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, err, message: 'Failed to retrieve tours. Try again' });
    }
};

export const getRelatedTours = async (req, res) => {
    const tourId = req.params.id;
    try {
        // Tìm tour hiện tại
        const currentTour = await Tour.findByPk(tourId, {
            include: [
                {
                    model: Location,
                    as: 'locations',  // Lấy các địa điểm của tour hiện tại
                    attributes: ['id', 'name']
                }
            ]
        })
        if (!currentTour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        // Lấy danh sách ID địa điểm từ tour hiện tại
        const currentLocationIds = currentTour.locations.map(location => location.id);
        if (currentLocationIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No locations found for this tour' });
        }

        // Tìm các tour liên quan có cùng địa điểm (loại trừ tour hiện tại)
        const relatedTours = await Tour.findAll({
            include: [
                {
                    model: Location,
                    as: 'locations',
                    where: {
                        id: { [Op.in]: currentLocationIds }  // Lọc các tour có địa điểm chung với tour hiện tại
                    },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }  // Bỏ qua các cột trung gian của bảng TourLocation
                },
                {
                    model: TourChild,
                    as: 'tourChildren',
                    attributes: 
                    [
                        'id', 
                        'tour_code', 
                        'start_date', 
                        'end_date', 
                        'price_adult', 
                        'price_child', 
                        'total_seats', 
                        'price_sale',
                        'price_toddler',
                        'price_baby',
                        'transportion_start',
                        'transportion_end',
                        'time_goes_start',
                        'time_comes_start',
                        'time_goes_end',
                        'time_comes_end'
                    ]
                },
                {
                    model: TourImage,
                    as:'tourImage',
                    attributes: ['image_url']
                }
            ],
            where: {
                id: { [Op.ne]: tourId }  // Loại trừ tour hiện tại
            },
            distinct: true  // Đảm bảo các tour không bị trùng lặp
        });

        res.status(200).json({
            success: true,
            data: relatedTours
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve related tours',
            error: error.message
        });
    }
};

export const getTourByTourCode = async (req, res) => {
    const { tourCode } = req.params;

    try {
        const tourChild = await TourChild.findOne({
            where: { tour_code: tourCode }, 
            include: [
                {
                    model: Tour, 
                    as: 'tour',
                    include: [
                        {
                            model: Location,
                            as: 'locations',
                            through: { attributes: ['location_id'] }, 
                            attributes: ['name']
                        },
                        {
                            model: TourImage, 
                            as: 'tourImage',
                            attributes: ['image_url'], 
                        },
                    ],
                },
            ],
        });

        if (!tourChild) {
            return res.status(404).json({
                success: false,
                message: "Tour not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully retrieved tour",
            data: tourChild,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve tour",
        });
    }
};


export const getCountTourRelated = async (req, res) => {
    const { location_id } = req.params; 

    try {
        const locationTourCount = await TourLocation.findAndCountAll({
            where: {
                location_id: location_id
            },
            attributes: ['tour_id', 'location_id'],
            include: [
                {
                    model: Location,
                    as: 'location',
                    attributes: ['name', 'location_img', 'parent_id', 'description', 'status']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            location_id: location_id,
            tourCount: locationTourCount
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to get tour counts by location',
            error: error.message
        });
    }
};
// Tính tổng số tour theo địa điểm
export const getCountToursByLocation = async (req, res) => {
    try {
        const locationTourCounts = await TourLocation.findAll({
            attributes: [
                'location_id',
                [Sequelize.fn('COUNT', Sequelize.col('tour_id')), 'tour_count'] 
            ],
            group: ['location_id'], 
            include: [
                {
                    model: Location,
                    as: 'location',
                    attributes: ['name', 'location_img', 'status'] 
                }
            ],
        });
        return res.status(200).json({
            success: true,
            data: locationTourCounts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get tour counts by location',
            error: error.message
        });
    }
};

// get tour by filter
export const getTourFilterPrice = async(req, res) => {
    const { price } = req.query

    let priceCondition = {}
    try {
        switch(price) {
            case "under5":
                priceCondition = {
                    price: {
                        [Op.lte]: 5000000
                    }
                };
                break;
            case "5-10":
                priceCondition = {
                    price: {
                        [Op.gte]: 5000000,
                        [Op.lte]: 10000000
                    }
                }
                break;
            case "10-20":
                priceCondition = {
                    price: {
                        [Op.gte]: 10000000,
                        [Op.lte]: 20000000
                    }
                }
                break
            case 'bigger20':
                    priceCondition = {
                        price: {
                            [Op.gt]: 20000000 
                        }
                    };
                    break;
            default: 
                return res.status(400).json({
                    success: false,
                    message: "Khoảng giá không hợp lệ. Vui lòng chọn từ 5-10, 10-20 hoặc 20+"
                });
        }

        const filteredTours = await Tour.findAll({
            where: priceCondition,
            include: [
                {
                    model: TourImage,
                    as: 'tourImage',
                    attributes: ['image_url']
                },
                {
                    model: TourChild,
                    as: 'tourChildren',
                }
            ]
        })
        return res.status(200).json({
            success: true,
            count: filteredTours.length,
            data: filteredTours
        });
    } catch (error) {
        console.error("Lỗi khi lọc tour theo giá:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lọc tour theo giá"
        });
    }
}

export const getFilterSortPrice = async (req, res) => {
    const { sortPrice } = req.query;
    let orderCondition = []; 

    try {
        switch (sortPrice) {
            case "tatca":
                break;
            case "giatucaodenthap":
                orderCondition.push(['price', 'DESC']); 
                break;
            case "giatuthapdencao":
                orderCondition.push(['price', 'ASC']); 
                break;
            case "giatuthapdencao":
                orderCondition.push([{ model: TourChild, as: 'tourChildren' }, 'start_date', 'DESC']); 
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Chọn trường hợp hợp lệ"
                });
        }

       
        const filterTourSort = await Tour.findAll({
            include: [
                {
                    model: TourImage,
                    as: 'tourImage',
                    attributes: ['image_url']
                },
                {
                    model: TourChild,
                    as: 'tourChildren',
                    attributes: ['start_date'], 
                }
            ],
            order: orderCondition 
        });
        return res.status(200).json({
            success: true,
            count: filterTourSort.length,
            data: filterTourSort
        });

    } catch (error) {
        console.error("Lỗi khi lọc tour theo giá:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lọc tour"
        });
    }
}

export const getFilterTour = async (req, res) => {
    const { price, departure_city, name, start_date, transportation } = req.query;
    let priceCondition = {};
    let dateCondition = {};
    let destinationCondition = {};
    try {
        switch (price) {
            case "under5":
                priceCondition = { price: { [Op.lte]: 5000000 } };
                break;
            case "5-10":
                priceCondition = { price: { [Op.gte]: 5000000, [Op.lte]: 10000000 } };
                break;
            case "10-20":
                priceCondition = { price: { [Op.gte]: 10000000, [Op.lte]: 20000000 } };
                break;
            case "bigger20":
                priceCondition = { price: { [Op.gte]: 20000000 } };
                break;
        }

        if (start_date) {
            dateCondition = {
                start_date: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: new Date(new Date(start_date).setHours(23, 59, 59)) 
                }
            };
        }
        if (name) {
            destinationCondition = {
                name: {
                    [Op.eq]: name
                }
            }
        }

        const tours = await Tour.findAll({
            where: {
                ...priceCondition,
                departure_city: departure_city ? { [Op.eq]: departure_city } : undefined,
                transportation: transportation ? { [Op.eq]: transportation } : undefined,
            },
            include: [
                {
                    model: TourChild,
                    as: 'tourChildren',
                    where: dateCondition,
                    required: true 
                },
                {
                    model: TourImage,
                    as: 'tourImage',
                    attributes: ['image_url']
                },
                {
                   model: Location,
                   as: 'locations',
                   attributes: ['id', 'name'],
                   where: destinationCondition
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy dữ liệu tour',
        });
    }
};

export const getSearchTour = async(req, res) => {
    const { price, name, start_date, end_date } = req.query;
    let priceCondition = {};
    let dateCondition = {};
    let destinationCondition = {};
    try {
        switch (price) {
            case "under5":
                priceCondition = { price: { [Op.lte]: 5000000 } };
                break;
            case "5-10":
                priceCondition = { price: { [Op.gte]: 5000000, [Op.lte]: 10000000 } };
                break;
            case "10-20":
                priceCondition = { price: { [Op.gte]: 10000000, [Op.lte]: 20000000 } };
                break;
            case "bigger20":
                priceCondition = { price: { [Op.gte]: 20000000 } };
                break;
        }

        if (start_date) {
            dateCondition = {
                start_date: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: new Date(new Date(start_date).setHours(23, 59, 59)) 
                },
                end_date: {
                    [Op.gte]: new Date(end_date),
                    [Op.lte]: new Date(new Date(end_date).setHours(23, 59, 59)) 
                }
            };
        }
        if (name) {
            destinationCondition = {
                name: {
                    [Op.eq]: name
                }
            }
        }

        const tours = await Tour.findAll({
            where: {
                ...priceCondition,
            },
            include: [
                {
                    model: TourChild,
                    as: 'tourChildren',
                    where: dateCondition,
                    required: true 
                },
                {
                    model: TourImage,
                    as: 'tourImage',
                    attributes: ['image_url']
                },
                {
                   model: Location,
                   as: 'locations',
                   attributes: ['id', 'name', 'description'],
                   where: destinationCondition
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy dữ liệu tour',
        });
    }
}

export const getTourByNameLocation = async(req, res) => {
    const { name } = req.query
    let destinationCondition = {};
    try {
        if (name){
            destinationCondition = {
                name: {
                    [Op.eq]: name
                }
            }
        }
        const tours = await Tour.findAll({
            include: [
                {
                    model: TourChild,
                    as: 'tourChildren',
                },
                {
                    model: TourImage,
                    as: 'tourImage',
                    attributes: ['image_url']
                },
                {
                   model: Location,
                   as: 'locations',
                   attributes: ['id', 'name', 'description'],
                   where: destinationCondition
                }
            ]
        })
        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy dữ liệu tour',
        });
    }
}






