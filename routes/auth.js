import express from 'express'
import { login, register, user } from '../controllers/AuthController.js';
import { verifyToken } from '../utils/verifyToken.js';
import passport from 'passport';
import upload from '../utils/upload.js';
const router = express.Router()

router.post('/register', upload.single("user_profile"), register)
router.post('/login', login)
router.get('/users', verifyToken, user)


// Định tuyến khi người dùng click đăng nhập với Google

router.get ('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
// Định tuyến callback khi Google chuyển hướng người dùng quay lại
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Xử lý khi người dùng đăng nhập thành công
        res.redirect('/home');
    }
);

export default router;