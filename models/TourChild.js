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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_child: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_sale: {
        type: DataTypes.INTEGER
    },
    price_toddler: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_baby: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transportion_start: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transportion_end: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time_goes_start: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_comes_start: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_goes_end: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_comes_end: {
        type: DataTypes.TIME,
        allowNull: false
    },
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status_guide: {
        type: DataTypes.ENUM("Đã có hướng dẫn viên", "Chưa có hướng dẫn viên"),
        defaultValue: "Chưa có hướng dẫn viên"
    }
}, {
    timestamps: true,
    tableName: "tour_child"
});


export default TourChild;
