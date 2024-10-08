import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    cate_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cate_status: {
        type: DataTypes.ENUM("Hiển thị", "Không hiển thị")
    },
    cate_description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'categories',
    timestamps: true
})

export default Category