import crypto from "crypto";
import querystring from "qs";
import Booking from "../models/Booking.js";
import { sendEmailHandleBooking } from "./BookingController.js";

const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
export const createVNPayPaymentUrl = (booking_code, total_price, req) => {
    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);

    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    const vnp_ReturnUrl = `http://localhost:3000/payment-booking/${booking_code}`;

    const orderId = date.getTime(); 
    const amount = total_price * 100; 
    const orderInfo = `Thanh toán booking ${booking_code}`; 

    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Locale'] = "vn";
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;

    return vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });
};

  
const sortObject = (obj) => {
    const sorted = {};
    const str = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (let key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
  
export const handleVNPayReturn = async (req, res) => {
    const vnpParams = req.query; 
    const secureHash = vnpParams['vnp_SecureHash']; 
    delete vnpParams['vnp_SecureHash']; 

    const sortedParams = sortObject(vnpParams); 
    const secretKey = process.env.VNPAY_SECRET_KEY; 
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        const bookingCode = vnpParams['vnp_TxnRef']; 
        const paymentStatus = vnpParams['vnp_ResponseCode']; 

        if (paymentStatus === '00') {
            await Booking.update({status: "Đã thanh toán"}, {where: {booking_code: bookingCode}})

            const bookingDetails = await Booking.findOne({where: {booking_code: bookingCode}})
            
            await sendEmailHandleBooking(bookingDetails.email, bookingDetails.status, bookingDetails)

            return res.status(200).json({
                success: true,
                message: "Thanh toán thành công, đã gửi email thông báo!",
                data: bookingDetails
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Thanh toán không thành công, vui lòng thử lại."
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Chữ ký không hợp lệ, giao dịch bị từ chối."
        });
    }
};


