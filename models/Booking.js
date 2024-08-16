import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Tour from './Tour.js';
import User from './User.js';

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    payment_status: {
        type: DataTypes.ENUM('paid', 'unpaid'),
        allowNull: false,
        defaultValue: 'unpaid',
    },
}, {
    timestamps: true,
});

// Định nghĩa mối quan hệ với Tour
Booking.belongsTo(User, {foreignKey: 'user_id', as:'category'})

// Định nghĩa mối quan hệ với Location
Booking.belongsTo(Tour, { foreignKey: 'tour_id', as: 'location' })
export default Booking;
