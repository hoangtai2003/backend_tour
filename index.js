import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sequelize from './sequelize.js';
import './relationship/associations.js';
import multiparty from 'connect-multiparty'

import tourRoute from './routes/tours.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/booking.js'
import locationRoute from './routes/locations.js'



// Nạp các biến từ file .env vào process.env 
dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const corsOption = {
    origin: true, // Cho phép mọi miền truy cập.
    credentials: true // Cho phép gửi thông tin xác thực (cookie, HTTP Authentication) cùng với yêu cầu CORS.
}
const MultipartyMiddleware = multiparty({uploadDir: './images/tours'});
//database connection
sequelize.authenticate()
    .then(() => console.log('MySQL database connected'))
    .catch(err => console.log('MySQL database connection failed:', err));


// middleware
app.use(express.json()) // nếu một yêu cầu POST hoặc PUT gửi dữ liệu JSON, express.json() sẽ phân tích dữ liệu đó và đưa vào req.body để bạn có thể dễ dàng truy cập nó.
app.use(cors(corsOption)) //Quản lý các yêu cầu từ nguồn gốc khác (CORS).
app.use(cookieParser()) // Phân tích cookie và đưa chúng vào req.cookies
app.use('/images/tours', express.static('images/tours'));

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/booking', bookingRoute)
app.use('/api/v1/location', locationRoute)

app.post('/uploads', MultipartyMiddleware, (req, res) => {
    if (!req.files || !req.files.upload) {
        return res.status(400).json({
            uploaded: false,
            error: {
                message: 'No files were uploaded.'
            }
        });
    }

    const file = Array.isArray(req.files.upload) ? req.files.upload[0] : req.files.upload;
    if (!file || !file.path) {
        return res.status(400).json({
            uploaded: false,
            error: {
                message: 'File path is not defined.'
            }
        });
    }

    const filePath = `${req.protocol}://${req.get('host')}/images/tours/${file.path.split('\\').pop()}`;

    res.status(200).json({
        uploaded: true,
        url: filePath
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
