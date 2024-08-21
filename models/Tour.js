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
    // Mô tả lịch trình
    description_itinerary: {
        type: DataTypes.TEXT,
        allowNull: true,  
    },
    // Giới thiệu tour
    introduct_tour: {
        type: DataTypes.TEXT,
        allowNull: true,  
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
    // Nơi khởi hành
    departure_city: {
        type: DataTypes.STRING,
        allowNull: false,  
    },
    transportations: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tour_image: {
        type: DataTypes.STRING,
        // allowNull: false
    },
},
  { timestamps: true,
    tableName: "tours"
   }
);


export default Tour;
