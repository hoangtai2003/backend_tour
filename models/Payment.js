import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Booking from "./Booking.js";

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Booking,
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    payment_amount: {
        type: DataTypes.INTEGER,
    },
    payment_content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    payment_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
    }
}, {
    timestamps: true,
    tableName: "payment"
})

export default Payment