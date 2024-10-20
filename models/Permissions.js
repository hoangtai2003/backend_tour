import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Permissions = sequelize.define("Permissions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
       type: DataTypes.STRING,
       allowNull: false
    },
    slug: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "permissions",
    timestamps: true
})

export default Permissions