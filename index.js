import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sequelize from './sequelize.js';
import './relationship/associations.js';

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
    origin: true, 
    credentials: true 
}

//database connection
sequelize.authenticate()
    .then(() => console.log('MySQL database connected'))
    .catch(err => console.log('MySQL database connection failed:', err));


// middleware
app.use(express.json()) 
app.use(cors(corsOption)) 
app.use(cookieParser()) 
app.use('/images/tours', express.static('images/tours'));


app.use('/api/v1/auth', authRoute)
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/booking', bookingRoute)
app.use('/api/v1/location', locationRoute)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
