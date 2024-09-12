import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//user registration
export const register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo
        })

        await newUser.save()
        res.status(200).json({success:true, message:'Successfully created'})
    } catch (error) {
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}

// user login

export const login = async (req, res) => {
    const email = req.body.email
    try {
        const user = await User.findOne({ where: {email} })

        if (!user) {
            return res.status(404).json({success:false, message:'User not found'})
        }
 
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

        if (!checkCorrectPassword) {
            return res.status(401).json({success:false, message:'Incorrect email or password'})
        }

        // Destructuring assignment (gán phân rã): tách password và role
        // user._doc: truy vấn database và nhận được đối đối tượng user, các trường của user sẽ được lưu trong _doc
        // ... rest: sẽ chứa các giá trị còn lại của đối tượng user
        const {password, role, ...rest} = user.dataValues

        // create jwt token
        // jwt.sign(): Đây là hàm của thư viện jsonwebtoken dùng để tạo ra một token JWT token này sẽ chưa thông tin của id và role
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });
        

        res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            token, 
            role,
            data: { ...rest } 
        });
    } catch (error) {
        return res.status(500).json({success:false, message:'Failed to login'})
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
