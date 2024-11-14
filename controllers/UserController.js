import User from '../models/User.js'
import bcrypt from 'bcrypt'
export const createUser = async (req, res) => {
    try {
        const { username, email, password, phone, status, role_id } = req.body;

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
            role_id
        });

        res.status(200).json({ success: true, message: 'Successfully created', data: newUser });
    } catch (err) {
        console.log(errror)
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
        const users = await User.findAll()
        
        res.status(200).json({success:true, message: "Successfully", data: users})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}