import Contact from "../models/Contact.js"
import nodemailer from 'nodemailer'

export const createContact = async(req, res) => {
    const {type_information, contact_name, contact_email, contact_phone, contact_number, contact_address, contact_content, contact_title} = req.body
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_email)) {
            return res.status(400).json({ message: 'Địa chỉ email không hợp lệ.' });
        }
        const newContact  = await Contact.create({
            type_information,
            contact_name,
            contact_address,
            contact_content,
            contact_email,
            contact_name,
            contact_number,
            contact_phone,
            contact_title
        })
        await sendEmailHandleContact(contact_email, contact_name, contact_title)
        return res.status(201).json({
            success: true,
            message: 'Successfully',
            data: newContact 

        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
            error: error.message,
        });
    }
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmailHandleContact = async(contact_email, contact_name, contact_title) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: contact_email,          
            subject: `Xác nhận thông tin liên hệ: ${contact_title}`, 
            text: `Xin chào ${contact_name},\n\nCảm ơn bạn đã liên hệ với chúng tôi về vấn đề "${contact_title}". Chúng tôi sẽ phản hồi sớm nhất có thể.\n\nTrân trọng,\nDu lịch Việt` 
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Không thể gửi email');
    }
}