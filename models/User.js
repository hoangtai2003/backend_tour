import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import Roles from './Roles.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    phone: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('Hoạt động', 'Ngừng hoạt động'),
        defaultValue: "Hoạt động"
    },
    gender: {
        type: DataTypes.ENUM("Nam", "Nữ"),
        defaultValue: "Nam"
    },
    dateBirthday: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: true,
});

export default User;
