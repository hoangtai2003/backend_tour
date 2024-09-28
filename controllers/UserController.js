import User from '../models/User.js'
import bcrypt from 'bcrypt'
export const createUser = async (req, res) => {
    try {
        const { username, email, password, phone, status, role } = req.body;

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
            role
        });

        res.status(200).json({ success: true, message: 'Successfully created', data: newUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again', error: err.message });
    }
};


// update user 
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { username, email, currentPassword, newPassword, confirmPassword, phone, status, role, dateBirthday, gender, address } = req.body;

    try {
        
        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (newPassword || confirmPassword) {
           
            const isMatch = await bcrypt.compare(currentPassword, userToUpdate.password);
            if (!isMatch) {
                return res.json({ success: false, message: 'Mật khẩu cũ không chính xác. Vui lòng thử lại.' });
            }

           
            if (newPassword !== confirmPassword) {
                return res.json({ success: false, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);

            userToUpdate.password = hash;
        }

        await userToUpdate.update({
            username,
            email,
            phone,
            status,
            role,
            dateBirthday,
            gender,
            address
        });

        res.status(200).json({ success: true, message: 'Thông tin cập nhật thành công', data: userToUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update. Try again' });
    }
};



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