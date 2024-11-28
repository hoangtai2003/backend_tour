import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sequelize from './sequelize.js';
import './relationship/associations.js';
import passport from 'passport';
import session from 'express-session'

import tourRoute from './routes/tours.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/booking.js'
import locationRoute from './routes/locations.js'
import paymentRoute from './routes/payment.js'
import categoryRoute from './routes/category.js'
import newsRoute from './routes/news.js'
import dashboardRoute from './routes/dashboard.js'
import roleRoute from './routes/role.js'
import contactRoute from "./routes/contact.js"
import hotelRoute from "./routes/hotel.js"

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
app.use('/images/locations', express.static('images/locations'))
app.use('/images/news', express.static('images/news'))
app.use('/images/hotel', express.static('images/hotel'))
app.use('/images/users', express.static('images/users'))

// Google OAuth
app.use(session({
    secret: 'some secret key',
    resave: false,
    saveUninitialized: true
  }));
  
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/booking', bookingRoute)
app.use('/api/v1/location', locationRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/news', newsRoute)
app.use('/', paymentRoute)
app.use('/api/v1/dashboard', dashboardRoute)
app.use('/api/v1/role', roleRoute)
app.use('/api/v1/contact', contactRoute)
app.use('/api/v1/hotel', hotelRoute)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
