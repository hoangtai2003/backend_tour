import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";


const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});
export default Location;