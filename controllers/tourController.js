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

// getSingle tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id
    try {
        const tour = await Tour.findById(id)
        res.status(200).json({success:true, message: "Successfully", data: tour})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// getAll tour
export const getAllTour = async (req, res) => {
    try {
        const allTour = await Tour.find({})
        res.status(200).json({success:true, message: "Successfully", data: allTour})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}
