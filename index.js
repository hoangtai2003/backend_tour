import express from 'express'
import dotenv from 'dotenv'
import mongoose, { connect } from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// Nạp các biến từ file .env vào process.env 
dotenv.config()
const app = express()
const port = process.env.PORT || 8000

//database connection
mongoose.set('strictQuery', false)
const connection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB database connected')
    } catch(err){
        console.log('MongoDB database connection failed')
    }
}
// middleware
app.use(express.json()) // nếu một yêu cầu POST hoặc PUT gửi dữ liệu JSON, express.json() sẽ phân tích dữ liệu đó và đưa vào req.body để bạn có thể dễ dàng truy cập nó.
app.use(cors()) //Quản lý các yêu cầu từ nguồn gốc khác (CORS).
app.use(cookieParser()) // Phân tích cookie và đưa chúng vào req.cookies

app.listen(port, () => {
    connection();
    console.log(`Server running on port ${port}`);
})
