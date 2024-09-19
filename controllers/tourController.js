import Tour from '../models/Tour.js'
import { v4 as uuidv4 } from 'uuid';
import TourChild from '../models/TourChild.js';
import TourLocation from '../models/TourLocation.js';
import Location from '../models/Location.js';
import TourImage from "../models/TourImage.js"
import { Op, where } from 'sequelize';
export const createTour = async (req, res) => {
    const { 
        name, 
        description_itinerary, 
        price, 
        duration, 
        departure_city, 
        introduct_tour, 
        location_ids,
        tour_children
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
            introduct_tour
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
                        'time_comes_end'
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
    const limit = 9;  
    const offset = (page - 1) * limit;  

    try {
     
        const { count, rows } = await Tour.findAndCountAll({
            limit,    
            offset,    
            distinct: true,   
            include: 
                [
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
                        model: Location,
                        as: 'locations',
                        through: { attributes: [] },  // Bỏ qua các cột trung gian từ bảng TourLocation
                        attributes: ['name']
                    },
                    {
                        model: TourImage,
                        as:'tourImage',
                        attributes: ['image_url']
                    }
                ] 
        });
        res.status(200).json({
            success: true,
            count: count, 
            totalPages: Math.ceil(count / limit), 
            currentPage: page, 
            message: "Successfully retrieved tours",
            data: rows    
        });
    } catch (err) {
       
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve tour",
        });
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
