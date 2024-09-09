import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Tour from "./Tour.js";

const TourChild = sequelize.define('TourChild', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    tour_code: {
        type: DataTypes.STRING,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price_adult: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price_child: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "tour_child"
});


export default TourChild;
