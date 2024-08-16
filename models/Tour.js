import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
const Tour = sequelize.define('Tour',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tour_code: {
        type: DataTypes.STRING,
        unique: true 
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    // Thời gian tour (ví dụ: 3N2Đ - 3 ngày 2 đêm)
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Ngày khởi hành
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    // Ngày kết thúc
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    // Nơi khởi hành
    departure_city: {
        type: DataTypes.STRING,
        allowNull: false,  
    },
    // Tổng số chỗ
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Số chỗ còn nhận
    seats_available: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,  
    },
    
},
  { timestamps: true }
);



export default Tour;
