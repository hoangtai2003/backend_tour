import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import User from './User.js';
import TourChild from "./TourChild.js";

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tour_child_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TourChild,  
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
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    number_of_adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    number_of_children: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    number_of_toddler: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    number_of_baby: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.ENUM('Tiếp nhận', 'Đã xác nhận', 'Đã thanh toán', 'Hoàn thành', 'Hủy bỏ'),
        allowNull: false,
        defaultValue: 'pending',
    },
    booking_note: {
        type: DataTypes.STRING
    },
    full_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'booking',
    timestamps: true,
});

export default Booking
