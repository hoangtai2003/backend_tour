import Roles from '../models/Roles.js';
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateRandomPassword } from '../utils/generateCode.js';
import { transporter } from '../utils/sendEmail.js';

export const createUser = async (req, res) => {
    try {
        const { username, email, password, phone, status, role_id, location_id } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hash,
            phone,
            status,
            role_id,
            location_id
        });

        res.status(200).json({ success: true, message: 'Successfully created', data: newUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again', error: err.message });
    }
};
// update user 
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { username, email, phone, status, role_id, dateBirthday, gender, address } = req.body;

    try {
        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await userToUpdate.update({
            username,
            email,
            phone,
            status,
            role_id,
            dateBirthday,
            gender,
            address,
        });

        res.status(200).json({ success: true, message: 'Thông tin cập nhật thành công', data: userToUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update. Try again' });
    }
};
export const updatePassword = async(req, res) => {
    const id = req.params.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, userToUpdate.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác. Vui lòng thử lại.' });
        }

        // Kiểm tra mật khẩu mới và mật khẩu xác nhận
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({success:false, message:'Vui lòng nhập mật khẩu đủ 8 ký tự chữ hoặc số'})
        }
        // Cập nhật mật khẩu mới
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        userToUpdate.password = hash;

        await userToUpdate.save();

        res.status(200).json({ success: true, message: 'Cập nhật mật khẩu thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update password. Try again.' });
    }
}
// delete user 
export const deleteUser = async(req, res) => {
    const id = req.params.id
    try {
        const result = await User.destroy({ where: { id } });
        if (result === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({success:true, message:'Successfully deleted'})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to delete. Try again'})
    }
}

// get single uer
export const getSingleUser = async(req, res) => {
    const id = req.params.id
    try {
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({success:true, message: "Successfully", data: user})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// get all User 
export const getAllUser = async(req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Roles,
                    as: 'userRole',
                    attributes: ['name']
                }
            ]
        })
        
        res.status(200).json({success:true, message: "Successfully", data: users})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

export const refuseUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Thông báo về trạng thái tài khoản',
            text: `Chào ${user.username},\n\nRất tiếc, tài khoản của bạn đã bị từ chối và xóa khỏi hệ thống. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.\n\nCảm ơn bạn!`,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Gửi email thất bại' });
            }
            await user.destroy();
            res.status(200).json({ success: true, message: 'User has been refused and deleted successfully' });
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to refuse user. Try again' });
    }
};

export const allowUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Tạo mật khẩu ngẫu nhiên
        const newPassword = generateRandomPassword();
        // Mã hóa mật khẩu trước khi lưu vào database (bảo mật)
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        await user.update({ password: hashedPassword });

        //Cập nhật trạng thái
        await user.update({ status: "Hoạt động" });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,      
            subject: 'Trạng thái tài khoản của bạn đã được phê duyệt',
            text: `Chào ${user.username},\n\nTrạng thái tài khoản của bạn đã được cập nhật thành "Hoạt động".\n\nĐây là mật khẩu giúp bạn đăng nhập vào hệ thống <b>${newPassword}</b>, Vui lòng truy cập đường dẫn này để truy cập vào hệ thống http://localhost:3000/changePassword/${user.id}.\n\nCảm ơn bạn đã sử dụng dịch vụ của chúng tôi!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Gửi email thất bại' });
            }
        });

        res.status(200).json({ success: true,  message: 'Cập nhật trạng thái thành công và email đã được gửi!' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    }
};

