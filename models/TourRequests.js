import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import TourChild from "./TourChild.js";

const TourRequests = sequelize.define("TourRequests", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    guideId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    tour_child_id: {
        type: DataTypes.INTEGER,
        references: {
            model: TourChild,
            key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    status: {
        type: DataTypes.ENUM("Đang chờ", "Phê duyệt", "Từ chối")
    }
}, {
    timestamps: true,
    tableName: "tour_requests"
})

export default TourRequests