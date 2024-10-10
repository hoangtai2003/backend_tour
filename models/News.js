import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";
import Category from "./Category.js";

const News = sequelize.define("News", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    news_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    news_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    news_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    news_date: {
        type: DataTypes.DATE
    },
    news_status: {
        type: DataTypes.ENUM("Xuất bản", "Không xuất bản")
    },
    slug: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    }
}, {
    tableName: "news",
    timestamps: true
})

export default News