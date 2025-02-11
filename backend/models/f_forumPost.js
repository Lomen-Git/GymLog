const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class ForumPost extends Model {}

ForumPost.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize,
  modelName: 'forumPost',
  tableName: 'forum_posts',
  timestamps: true,
  underscored: true,
})

module.exports = ForumPost
