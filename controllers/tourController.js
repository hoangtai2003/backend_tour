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
