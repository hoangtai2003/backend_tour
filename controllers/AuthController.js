import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from "validator";
import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20'
import Roles from "../models/Roles.js";
import Permissions from "../models/Permissions.js";
import Location from "../models/Location.js";
import Tour from "../models/Tour.js";
import TourChild from "../models/TourChild.js";
import moment from 'moment';
import { Op } from "sequelize";
import TourImage from "../models/TourImage.js";
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Email không hợp lệ.' });
    }
    try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({success:false, message:'Email không tồn tại'})
        }
 
        const checkCorrectPassword = await bcrypt.compare(password, user.password)

        if (!checkCorrectPassword) {
            return res.status(401).json({success:false, message:'Email hoặc Password không chính xác. Vui lòng thử lại!'})
        }
        const token  = createToken(user.id)
        return res.json({success:true, token})
    } catch (error) {
        return res.status(500).json({success:false, message:'Đăng nhập thất bại. Vui lòng thử lại!'})
    }
}
export const register = async (req, res) => {
    const {username, email, password, phone, address, confirmPassword, role_id, location_id, status, dateBirthday, gender, user_experience} = req.body
    try {
        const emailExist = await User.findOne({ where: {email} })
        if (!username || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                return res.status(400).json({ success: false, message: 'Mật khẩu và xác nhận mật khẩu không chính xác' });
            }

            if (password.length < 8) {
                return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu đủ 8 ký tự chữ hoặc số' });
            }
        }
        if (emailExist){
            return res.json({success:false, message:'Email đã tồn tại trong hệ thống'})
        }
        if (!validator.isEmail(email)){
            return res.json({success:false, message:'Email không hợp lệ'})
        }
        let hash = '';
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            hash = bcrypt.hashSync(password, salt);
        }
        let user_profile = null
        if (req.file){
            user_profile = req.file.path
        }
        const newUser = await User.create({
            username: username,
            email: email,
            phone: phone,
            address: address,
            password: hash,
            role_id,
            location_id,
            status,
            user_experience,
            dateBirthday,
            gender,
            user_profile

        })
        await newUser.save()
        res.status(200).json({success:true, message:'Đăng ký thành công'})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, error, message:'Đăng ký không thành công. Vui lòng thử lại'})
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
}
export const user = async (req, res) => {
    const id  = req.user.id
    const currentDate = moment().format('YYYY-MM-DD'); 
    try {
        const user = await User.findByPk(id, {
            attributes: ['username', 'email', 'id', 'phone', 'address', 'dateBirthday', 'user_experience', 'gender', 'user_image'],
            include: [
                {
                    model: Roles,
                    as: 'userRole',
                    attributes: ['name'],
                    include: [
                        {
                            model: Permissions,
                            as: 'rolePermission',
                            through: { attributes: [] },
                            attributes: ['name', 'slug']
                        }
                    ]
                },
                {
                    model: Location,
                    as: 'userLocation',
                    attributes: ['name'],
                    include: [
                        {
                            model: Tour,
                            as: 'tours',
                            attributes: ['name', 'duration'],
                            through: {attributes: [] },
                            include: [
                                {
                                    model: TourChild,
                                    as: 'tourChildren',
                                    attributes: ['tour_code', 'status_guide','start_date', 'id'],
                                    where: {
                                        start_date: {
                                            [Op.gte]: currentDate
                                        }
                                    } 
                                },
                                {
                                    model: TourImage,
                                    as: 'tourImage',
                                    attributes: ['image_url']
                                }
                            ]

                        }
                    ]
                },
            ],
        }); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ data: user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching user data' });
    }
}

// register Google with  Google OAuth

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/v1/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => 
    {
        try {
            
            const existingEmail = await User.findOne({ where: { email: profile.emails[0].value } });
            if (existingEmail) {
                return done(null, existingUser)
            }

            const newUser = await User.create ({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                role_id: 2,
                password: null
            });
            return done(null, newUser)
        } catch (error) {
            return done(error, null)
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id)
        done(null, user);
    } catch (error) {
        done(error, null)
    }
})

