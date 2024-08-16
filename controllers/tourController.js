import Tour from '../models/Tour.js'
import { v4 as uuidv4 } from 'uuid';
//create new tour 
export const createTour = async (req, res) => {
    const { name, description, duration, departure_city, total_seats, price, start_date, end_date } = req.body;

    const tourCodePrefix = "NDSGN";
    const uniqueId = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); 
    const formattedDate = new Date(start_date).toISOString().slice(0, 10).split('-').reverse().join('').slice(0, 6);
    const tourCodeSuffix = uuidv4().slice(0, 2).toUpperCase(); 

    const tour_code = `${tourCodePrefix}${uniqueId}-${formattedDate}${tourCodeSuffix}-H`;
    try {
        const newTour = await Tour.create({
            name,
            description,
            tour_code,
            duration, 
            departure_city, 
            total_seats,
            price,
            start_date,
            end_date
        });
        res.status(200).json({success:true, message:'Tour successfully created', data: newTour});
    } catch (err) {
        res.status(500).json({success:false, message:'Failed to create tour. Try again'});
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
    // Lấy số trang từ yêu cầu truy vấn trong HTTP
    const page = parseInt(req.query.page)
    try {
        // .skip() là một phương thức của MongoDB để bỏ qua một số lượng tài liệu nhất định.
        // page * 8 tính toán số tài liệu cần bỏ qua. Ví dụ, nếu page là 1 (tức là trang thứ hai), nó bỏ qua 1 * 8 = 8 tài liệu
        // limit() được sử dụng để giới hạn số tài liệu trả về bởi truy vấn
        const allTour = await Tour.find({}).skip(page*8).limit(8).populate('reviews')
        res.status(200).json({success:true, count: allTour.length, message: "Successfully", data: allTour})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

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
