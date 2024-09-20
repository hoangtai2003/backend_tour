import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Booking from "./Booking.js";
const Passenger = sequelize.define('Passenger', {
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
            key: 'id'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    passenger_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passenger_dateOfBirthday: {
        type: DataTypes.DATE,
        allowNull: false,

    },
    passenger_gender: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        timestamps: true,
        tableName: 'passenger'
    }
)

export default Passenger