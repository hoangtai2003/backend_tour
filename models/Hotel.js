import { DataTypes, DATE } from "sequelize";
import sequelize from "../sequelize.js";
import Location from "./Location.js";

const Hotel = sequelize.define("Hotel", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Location,
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    hotel_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hotel_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    hotel_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hotel_phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hotel_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hotel_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hotel_title: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hotel_slug: {
        type: DataTypes.STRING,
        unique: true,
    }
}, {
    timestamps: true,
    tableName: 'hotel'
})

export default Hotel