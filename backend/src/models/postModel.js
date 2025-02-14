const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Posts = sequelize.define('Posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    postTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postSlug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postFields: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    postContent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isSync: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
    underscored: true, // ✅ Uses snake_case (created_at, updated_at) instead of camelCase
});

module.exports = Posts;
