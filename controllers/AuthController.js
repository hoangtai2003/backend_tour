import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from "validator";

export const register = async (req, res) => {
    const {username, email, password, phone, address, confirmPassword, role} = req.body
    try {
        const emailExist = await User.findOne({ where: {email} })
        if (!username || !email || !password || !phone || !address || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (password != confirmPassword){
            return res.json({success:false, message:'Mật khẩu và xác nhận mật khẩu không chính xác'})
        }

        if (emailExist){
            return res.json({success:false, message:'Email đã tồn tại trong hệ thống'})
        }
        if (!validator.isEmail(email)){
            return res.json({success:false, message:'Email không hợp lệ'})
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const newUser = await User.create({
            username: username,
            email: email,
            phone: phone,
            address: address,
            password: hash,
            role
        })
        await newUser.save()
        res.status(200).json({success:true, message:'Đăng ký thành công'})
    } catch (error) {
        res.status(500).json({success:false, message:'Đăng ký không thành công. Vui lòng thử lại'})
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Email không hợp lệ.' });
    }
    try {
        const user = await User.findOne({ where: {email} })
        if (!user) {
            return res.status(404).json({success:false, message:'Email không tồn tại'})
        }
 
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

        if (!checkCorrectPassword) {
            return res.status(401).json({success:false, message:'Email hoặc Password không chính xác. Vui lòng thử lại!'})
        }

        const {password, role, ...rest} = user.dataValues

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });
        

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token, 
            role,
            data: { ...rest } 
        });
    } catch (error) {
        return res.status(500).json({success:false, message:'Đăng nhập thất bại. Vui lòng thử lại!'})
    }
}
export const user = async (req, res) => {
    const id  = req.user.id
    try {
        const user = await User.findByPk(id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
}
