import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
const Contact = sequelize.define("Contact", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    type_information : {
        type: DataTypes.ENUM("Du lịch", "Chăm sóc khách hàng", "Liên hệ thông tin khác"),
        allowNull: false
    },
    contact_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_number: {
        type: DataTypes.INTEGER
    },
    contact_address: {
        type: DataTypes.STRING,
    },
    contact_content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "contact",
    timestamps: true
})

export default Contact