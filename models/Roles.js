import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";


const Roles = sequelize.define('Roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "roles",
    timestamps: true
})

export default Roles