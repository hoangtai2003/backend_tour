import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Location = sequelize.define('Location', {
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location_img: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
});
Location.belongsTo(Location, { foreignKey: 'parent_id', as: 'parent' })
Location.hasMany(Location, { foreignKey: 'parent_id', as: 'children'})

export default Location;