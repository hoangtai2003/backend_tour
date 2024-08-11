import Tour from '../models/Tour.js'

//create new tour 
// Hàm createTour là một hàm bất đồng bộ (async) được định nghĩa để xử lý yêu cầu tạo mới một tour 
// Nhận 2 tham số req (request) và res (response )
export const createTour = async (req, res) => {
    // Tạo một đối tượng newTour từ mô hình Tour bằng cách truyền dữ liệu từ req.body vào
    // req.body chứa dữ liệu từ yêu cầu POST mà người dùng gửi lên, thường là thông qua một biểu mẫu hoặc yêu cầu API.
    const newTour = new Tour(req.body)
    try {
        // Hàm save() của Mongoose được sử dụng để lưu đối tượng newTour vào cơ sở dữ liệu MongoDB.
        const saveTour = await newTour.save()

        // Nếu tour được lưu thành công, hàm sẽ gửi phản hồi HTTP với mã trạng thái 200 (OK) và trả về một đối tượng JSON. Đối tượng JSON này chứa:
        // success: true: Xác nhận rằng thao tác đã thành công.
        // message: 'Successfully created': Thông báo rằng tour đã được tạo thành công.
        // data: saveTour: Dữ liệu của tour mới được lưu trong cơ sở dữ liệu.
        res.status(200).json({success:true, message:'Successfully created', data:saveTour})
    } catch (err){
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}

// update tour
export const updateTour = async (req, res) => {
    // Đây là cách lấy giá trị của tham số id từ URL
    const id = req.params.id
    try {
        // Tour.findByIdAndUpdate(id, { $set: req.body }, { new: true }): Đây là phương thức của Mongoose được sử dụng để tìm và cập nhật một tài liệu (tour) trong cơ sở dữ liệu.
        // id: ID của tour mà bạn muốn cập nhật.
        // $set: req.body: $set là một toán tử của MongoDB được sử dụng để cập nhật các trường trong tài liệu với các giá trị mới. req.body chứa dữ liệu mà bạn muốn cập nhật.
        // { new: true }: Tùy chọn này được thêm vào để yêu cầu Mongoose trả về tài liệu đã được cập nhật thay vì tài liệu cũ trước khi cập nhật.
        const updateTour = await Tour.findByIdAndUpdate(id, {
           $set: req.body 
        }, {new: true})
        res.status(200).json({success:true, message:'Successfully updated', data:updateTour})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to update. Try again'})
    }
}

// delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id
    try {
        await Tour.findByIdAndDelete(id)
        res.status(200).json({success:true, message:'Successfully deleted'})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to delete. Try again'})
    }
}

// get single tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id
    try {
        const tour = await Tour.findById(id)
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
        const allTour = await Tour.find({}).skip(page*8).limit(8)
        res.status(200).json({success:true, count: allTour.length, message: "Successfully", data: allTour})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// get tour by search
export const getTourBySearch = async (req, res) => {
    // Tham số city từ yêu cầu HTTP chuyển thành biểu thức chính quy RegExp với cờ 'i' để không phân biệt chữ hoa chữ thường
    const city = new RegExp(req.query.city, 'i');
    const distance = parseInt(req.query.distance)
    const maxGroupSize = parseInt(req.query.maxGroupSize)

    try {
        // $gte greater than or equal to
        const tours = await Tour.find({
            city, 
            distance: { $gte: distance }, // 
            maxGroupSize: { $gte: maxGroupSize }
        });
        res.status(200).json({success:true, message: "Successfully", data: tours})
    } catch (err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
} 

// get featured tour
export const getFeaturedTour = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).limit(8)
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
