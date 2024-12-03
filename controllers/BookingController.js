import Booking from "../models/Booking.js"
import Passenger from "../models/Passenger.js";
import TourChild from "../models/TourChild.js";
import Tour from "../models/Tour.js";
import nodemailer from 'nodemailer'
import TourImage from "../models/TourImage.js";
import { createVNPayPaymentUrl } from "./PaymentController.js";
import { generateBookingCode } from "../utils/generateCode.js";
import Reviews from "../models/Review.js";
export const createBooking = async (req, res) => {
    const {
        tour_child_id,
        user_id,
        full_name,
        email,
        phone_number,
        address,
        booking_note,
        booking_passenger,
        status,
        payment_method
    } = req.body;
    const passengers = JSON.parse(booking_passenger || '[]')
    const bookingCode = generateBookingCode()
    try {

        const tourChild  = await TourChild.findByPk(tour_child_id, {
            attributes: ['start_date'],
            include: [
                {
                    model: Tour,
                    as: 'tour',
                    attributes: ['name']
                }
            ]
        })
        const number_of_adults = parseInt(req.body.number_of_adults, 10);
        const number_of_children = parseInt(req.body.number_of_children, 10);
        const number_of_toddler = parseInt(req.body.number_of_toddler, 10);
        const number_of_baby = parseInt(req.body.number_of_baby, 10);
        const total_price = parseInt(req.body.total_price, 10);

        const totalPassenger = number_of_adults + number_of_children + number_of_toddler + number_of_baby
        if (!tourChild) {
            return res.status(404).json({
                success: false,
                message: 'TourChild  not found',
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
            booking_note,
            status,
            booking_code: bookingCode,
            payment_method
        })
        const bookingDetails = {
            full_name: newBooking.full_name,
            bookingCode: newBooking.booking_code,
            status: newBooking.status,
            email: newBooking.email,
            totalPrice: newBooking.total_price,
            totalPassenger: totalPassenger,
            totalPrice: newBooking.total_price,
            tourName: tourChild.tour.name,
            startDate: tourChild.start_date
        }

        if (passengers && Array.isArray(passengers)){
            const bookingPassengerPromises = passengers.map(passenger => {
                return Passenger.create({
                    booking_id: newBooking.id,
                    ...passenger
                });
            });
            await Promise.all(bookingPassengerPromises)
        }
        if (payment_method === 'vnpay'){
            await sendEmailHandleBooking(bookingDetails.email, bookingDetails.status, bookingDetails)
            const vnpUrl = createVNPayPaymentUrl(newBooking.booking_code, total_price, req)
            return res.status(200).json({ success: true, url: vnpUrl});
        } else {
            await sendEmailHandleBooking(bookingDetails.email, bookingDetails.status, bookingDetails)
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: newBooking
    
            });
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message,
        });
    }
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
export const sendEmailHandleBooking = async (email, status, bookingDetails) => {
    const tourName = bookingDetails.tourName;
    const bookingCode = bookingDetails.bookingCode
    const full_name = bookingDetails.full_name
    const totalPassenger = bookingDetails.totalPassenger
    const totalPrice = bookingDetails.totalPrice
    const startDate = bookingDetails.startDate
    let subject, html
    switch (status) {
        case 'Chờ xác nhận':
            subject = 'Tiếp nhận thông tin đặt Tour'
            html = `
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <header style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Tiếp nhận thông tin đặt tour</h1>
                </header>
                
                <main style="padding: 20px;">
                    <p style="font-size: 16px;">Kính gửi ${full_name},</p>
                    
                    <p style="font-size: 16px;">Cảm ơn bạn đã quan tâm đến dịch vụ tour du lịch của Du lịch Việt. Chúng tôi xin xác nhận đã nhận được yêu cầu đặt tour của bạn.</p>
                    
                    <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Thông tin đặt tour:</h2>
                    <ul style="list-style-type: none; padding-left: 0;">
                        <li style="margin-bottom: 10px;"><strong>Mã đặt tour: ${bookingCode}</strong> </li>
                        <li style="margin-bottom: 10px;"><strong>Tên tour: ${tourName}</strong> </li>
                        <li style="margin-bottom: 10px;"><strong>Ngày khởi hành dự kiến: ${startDate}</strong></li>
                        <li style="margin-bottom: 10px;"><strong>Số lượng người: ${totalPassenger}</strong> </li>
                        <li style="margin-bottom: 10px;"><strong>Tổng chi phí dự kiến:</strong>  ${totalPrice.toLocaleString('vi-VN')} VND</li>
                    </ul>
                    
                    <div style="background-color: #f0f0f0; border-left: 4px solid #003366; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #003366; margin-top: 0;">Trạng thái đơn đặt tour: Đang chờ xử lý</h3>
                        <p style="margin-bottom: 0;">Yêu cầu đặt tour của bạn hiện đang được xem xét và xử lý. Chúng tôi đang kiểm tra tình trạng còn chỗ và các yêu cầu đặc biệt (nếu có) của bạn.</p>
                    </div>
                    
                    <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Các bước tiếp theo:</h2>
                    <ol style="padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Chúng tôi sẽ xem xét yêu cầu của bạn trong thời gian làm việc.</li>
                        <li style="margin-bottom: 10px;">Sau khi xác nhận tình trạng còn chỗ, chúng tôi sẽ gửi cho bạn một email xác nhận kèm theo hướng dẫn thanh toán.</li>
                        <li style="margin-bottom: 10px;">Để đảm bảo giữ chỗ, vui lòng chờ email xác nhận từ chúng tôi trước khi thực hiện bất kỳ khoản thanh toán nào.</li>
                        <li style="margin-bottom: 10px;">Nếu bạn có bất kỳ thay đổi hoặc câu hỏi nào trong thời gian chờ đợi, xin đừng ngần ngại liên hệ với chúng tôi.</li>
                    </ol>
                    
                    <p style="font-size: 16px;">Chúng tôi đánh giá cao sự kiên nhẫn của bạn trong quá trình này và sẽ cố gắng xử lý yêu cầu của bạn một cách nhanh chóng nhất có thể.</p>
                    
                    <div style="background-color: #e6f3ff; border: 1px solid #003366; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #003366; margin-top: 0;">Thông tin liên hệ:</h3>
                        <p style="margin-bottom: 5px;">Điện thoại: (+84) 886 008 377</p>
                        <p style="margin-bottom: 0;">Email: Hdt13102k3@gmail.com</p>
                    </div>
                </main>
                
                <footer style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center; font-size: 14px;">
                    <p style="margin: 0;">Trân trọng,</p>
                    <p style="margin: 5px 0 0;">Hoàng Đức Tài</p>
                </footer>
            </body>
        `
        break
        case "Đã thanh toán": 
        subject = "Đặt tour thành công"
        html = `
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <header style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Đặt tour thành công</h1>
                </header>
                
                <main style="padding: 20px;">
                    <p style="font-size: 16px;">Kính gửi ${full_name},</p>
                    
                    <p style="font-size: 16px;">
                        Chúng tôi xin gửi lời cảm ơn chân thành vì bạn đã chọn Du lịch Việt cho chuyến đi sắp tới của mình. 
                        Chúng tôi vui mừng thông báo rằng chúng tôi đã nhận được khoản thanh toán của bạn và xác nhận đặt chỗ của bạn đã được hoàn tất.
                    </p>
                    
                    <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Thông tin đặt tour:</h2>
                    <ul style="list-style-type: none; padding-left: 0;">
                        <li style="margin-bottom: 10px;"><strong>Mã đặt tour: ${bookingCode}</strong> </li>
                        <li style="margin-bottom: 10px;"><strong>Tên tour: ${tourName}</strong> </li>
                        <li style="margin-bottom: 10px;"><strong>Ngày khởi hành: ${startDate}</strong></li>
                        <li style="margin-bottom: 10px;"><strong>Số lượng người: ${totalPassenger}</strong> </li>
                        <li style="margin-bottom: 10px;"><strong>Tổng số tiền đã thanh toán:</strong>  ${totalPrice.toLocaleString('vi-VN')} VND</li>
                        <li style="margin-bottom: 10px;"><strong>Phương thức thanh toán:</strong>  ${totalPrice.toLocaleString('vi-VN')} VND</li>
                        <li style="margin-bottom: 10px;"><strong>Ngày thanh toán:</strong>  ${totalPrice.toLocaleString('vi-VN')} VND</li>
                    </ul>
                    
                    <div style="background-color: #f0f0f0; border-left: 4px solid #003366; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #003366; margin-top: 0;">Trạng thái đơn đặt tour: Đã thanh toán</h3>
                        <p style="margin-bottom: 0;">Cảm ơn bạn đã hoàn tất thanh toán. Tour của bạn đã được xác nhận.</p>
                    </div>
                    
                    <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Các bước tiếp theo:</h2>
                    <ol style="padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Chúng tôi sẽ gửi cho bạn một email khác chứa thông tin chi tiết về lịch trình và hướng dẫn cho chuyến đi trong vòng [X] ngày tới.</li>
                        <li style="margin-bottom: 10px;">Vui lòng kiểm tra kỹ thông tin cá nhân và yêu cầu đặc biệt (nếu có) trong email xác nhận đặt tour trước đó.</li>
                        <li style="margin-bottom: 10px;">Nếu bạn cần thay đổi bất kỳ thông tin nào, vui lòng liên hệ với chúng tôi ít nhất [X] ngày trước ngày khởi hành.</li>
                    </ol>
                        
                    <div style="background-color: #e6f3ff; border: 1px solid #003366; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #003366; margin-top: 0;">Thông tin liên hệ:</h3>
                        <p style="margin-bottom: 5px;">Điện thoại: (+84) 886 008 377</p>
                        <p style="margin-bottom: 0;">Email: Hdt13102k3@gmail.com</p>
                    </div>
                </main>
                
                <footer style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center; font-size: 14px;">
                    <p style="margin: 0;">Trân trọng,</p>
                    <p style="margin: 5px 0 0;">Hoàng Đức Tài</p>
                </footer>
            </body>
        `
        break
    }
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html
    })
}
export const sendStatusEmail = async (email, status, booking) => {
    const bookingCode = booking.booking_code;
    const tourName = booking.bookingTourChild.tour.name
    const startDate = booking.bookingTourChild.start_date;
    const totalPrice = booking.total_price;
    const full_name = booking.full_name
    const totalPassenger = booking.number_of_adults + booking.number_of_children + booking.number_of_toddler + booking.number_of_baby
    let subject, html;
    switch (status) {
        case 'Chờ thanh toán': 
            subject = 'Xác nhận đặt tour';
            html = `
               <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <header style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center;">
                        <h1 style="margin: 0;">Xác nhận đặt tour</h1>
                    </header>
                    
                    <main style="padding: 20px;">
                        <p style="font-size: 16px;">Kính gửi, ${full_name}</p>
                        
                        <p style="font-size: 16px;">Chúc mừng bạn! Đơn đặt tour của bạn đã được xác nhận thành công. Cảm ơn bạn đã tin tưởng lựa chọn dịch vụ của Du lịch Việt.</p>
                        
                        <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Thông tin đặt tour:</h2>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 10px;"><strong>Mã đặt tour:</strong> ${bookingCode}</li>
                            <li style="margin-bottom: 10px;"><strong>Tên tour: ${tourName}</strong> </li>
                            <li style="margin-bottom: 10px;"><strong>Ngày khởi hành dự kiến:</strong> ${startDate}</li>
                            <li style="margin-bottom: 10px;"><strong>Số lượng người:</strong> ${totalPassenger}</li>
                            <li style="margin-bottom: 10px;"><strong>Tổng chi phí:</strong> ${totalPrice.toLocaleString('vi-VN')} VND</li>
                             <li style="margin-bottom: 10px;"><strong>Số tiền cần phải thanh toán:</strong> ${totalPrice.toLocaleString('vi-VN')} VND</li>
                        </ul>
                        <p style="font-size: 16px;"></p>
                        <div style="background-color: #f0f0f0; border-left: 4px solid #003366; padding: 15px; margin: 20px 0;">
                            <h3 style="color: #003366; margin-top: 0;">Trạng thái đơn đặt tour: Đã xác nhận</h3>
                            <p style="font-size: 16px;">Dưới đây là thông tin tài khoản của chúng tôi:</p>
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li style="margin-bottom: 10px;"><strong>Ngân hàng: </strong> MBBANK: MB NGÂN HÀNG QUÂN ĐỘI</li>
                                <li style="margin-bottom: 10px;"><strong>Số tài khoản: 0814003469999</strong> </li>
                                <li style="margin-bottom: 10px;"><strong>Chủ tài khoản: HOANG DUC TAI</strong></li>
                            </ul>
                            <p style="font-size: 16px; color: red;">Lưu ý *: Vui lòng thanh toán trước ngày ... để đảm bảo giữ chỗ của bạn.</p>
                        </div>
                        
                        <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Các bước tiếp theo:</h2>
                        <ol style="padding-left: 20px;">
                            <li style="margin-bottom: 10px;">Chúng tôi sẽ xem xét yêu cầu của bạn trong thời gian làm việc.</li>
                            <li style="margin-bottom: 10px;">Sau khi xác nhận thanh toán, chúng tôi sẽ gửi cho bạn một email xác nhận kèm theo hướng dẫn chi tiết về chuyến đi này.</li>
                            <li style="margin-bottom: 10px;">Nếu bạn có bất kỳ thay đổi hoặc câu hỏi nào trong thời gian chờ đợi, xin đừng ngần ngại liên hệ với chúng tôi.</li>
                        </ol>
                        
                        <p style="font-size: 16px;">Chúng tôi đánh giá cao sự kiên nhẫn của bạn trong quá trình này và sẽ cố gắng xử lý yêu cầu của bạn một cách nhanh chóng nhất có thể.</p>
                        
                        <div style="background-color: #e6f3ff; border: 1px solid #003366; padding: 15px; margin: 20px 0;">
                            <h3 style="color: #003366; margin-top: 0;">Thông tin liên hệ:</h3>
                        <p style="margin-bottom: 5px;">Điện thoại: (+84) 886 008 377</p>
                        <p style="margin-bottom: 0;">Email: Hdt13102k3@gmail.com</p>
                        </div>
                    </main>
                        
                    <footer style="background-color: #003366; color: #ffffff; padding: 20px; text-align: center; font-size: 14px;">
                        <p style="margin: 0;">Trân trọng,</p>
                        <p style="margin: 5px 0 0;">Hoàng Đức Tài</p>
                    </footer>   
                </body>

            `
            break;
        case 'Đã thanh toán': 
            subject = 'Xác nhận thanh toán';
            html = 'Chúng tôi đã nhận được thanh toán của bạn. Xin cảm ơn!';
            break;
        case 'Hủy bỏ':
            subject = 'Hủy bỏ đặt tour';
            html = 'Tour của bạn đã bị hủy bỏ. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.';
            break;
        default: 
            subject = 'Cập nhật trạng thái tour';
            html = `Trạng thái tour của bạn đã được cập nhật thành: ${status}`;
            break;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html
    })
}
export const updateStatusBooking = async (req, res) => {
    const { id } = req.params;  
    const { status } = req.body; 
    try {
        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    attributes: ['start_date', 'end_date'],
                    include: [
                        {
                            model: Tour,
                            as : "tour",
                            attributes: ['name']
                        }
                    ]
                },
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await booking.update({ status });
        
        await sendStatusEmail(booking.email, status, booking)

        res.status(200).json({ success: true, message: 'Update status successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error, message: 'Failed to update status. Try again' });
    }
};
export const getAllBooking = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 8
    const offset = (page - 1) * limit
    try {
        const { count, rows } = await Booking.findAndCountAll({
            limit, 
            offset,
            distinct: true,
            order: [['id', 'DESC']], 
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    attributes: ['tour_id', 'tour_code', 'price_adult', 'price_child', 'price_toddler', 'price_baby', 'price_sale'],
                    include: [
                        {
                            model: Tour,
                            as : "tour",
                            attributes: ['name', 'departure_city', 'duration'],
                            include: [
                                {
                                    model: TourImage,
                                    as: 'tourImage',
                                    attributes: ['image_url']
                                }
                            ]
                        },
                    ]
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
export const getBooking = async(req, res) => {
    const userId = req.user.id;
    try {
        const booking = await Booking.findAll({
            where: { user_id: userId },
            order: [['id', 'DESC']], 
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    attributes: ['tour_id', 'tour_code', 'price_adult', 'price_child', 'price_toddler', 'price_baby', 'end_date'],
                    include: [
                        {
                            model: Tour,
                            as : "tour",
                            attributes: ['name', 'departure_city', 'duration', 'id'],
                            include: [
                                {
                                    model: TourImage,
                                    as: 'tourImage',
                                    attributes: ['image_url']
                                }
                            ]

                        }
                    ]
                }, 
                {
                    model: Passenger,
                    as: 'bookingPassenger',
                    attributes: ['booking_id', 'passenger_name', 'passenger_dateOfBirthday', 'passenger_gender']
                },
                {
                    model: Reviews,
                    as: 'bookingReview',
                    attributes: ['review_status']
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: "Successfully", data: booking });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getBookingByBookingCode = async(req, res) => {
    const { bookingCode } = req.params;
    try {
        const bookingDetails = await Booking.findOne({
            where: { booking_code: bookingCode },
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    attributes: ['tour_code'],
                    include: [
                        {
                            model: Tour,
                            as: 'tour',
                            attributes: ['name'],
                            include: [
                                {
                                    model: TourImage,
                                    as: 'tourImage',
                                    attributes: ['image_url']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Passenger,
                    as: 'bookingPassenger',
                    attributes: ['passenger_name', 'passenger_dateOfBirthday', 'passenger_gender']
                }
            ]
        })
        if (!bookingDetails){
            return res.status(404).json({
                success: false,
                message: "Booking detail not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Successfully retrieved booking detail",
            data: bookingDetails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve booking detail",
        });
    }
   
}
