import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import Roles from "./Roles.js";
import Permissions from "./Permissions.js";

const RolePermissions = sequelize.define("RolePermissions", {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Roles,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permissions,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: "role_permissions",
    timestamps: true
})


export default RolePermissions