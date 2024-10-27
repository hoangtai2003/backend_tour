import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Tour from "./Tour.js";
import User from "./User.js";
import Booking from "./Booking.js";
const Reviews = sequelize.define("Reviews",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tour,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Booking,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    review_comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    review_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    review_date: {
        type: DataTypes.DATE
    },
    review_status: {
        type: DataTypes.STRING,
        default: 'reviewed'
    },
    status: {
        type: DataTypes.ENUM('Hiển thị', 'Không hiển thị'),
        default: "Hiển thị"
    }
},
{ 
    timestamps: true,
    tableName: 'reviews'
}
);

export default Reviews
