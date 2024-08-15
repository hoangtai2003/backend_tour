import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
})
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' }); // Để mỗi danh mục có thể có một danh mục cha
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' }); // Để mỗi danh mục có thể có nhiều danh mục con
export default Category;