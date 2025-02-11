const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Like extends Model {}

Like.init({
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ForumPosts',
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Like',
  timestamps: false,
  underscored: true,
})

module.exports = Like
