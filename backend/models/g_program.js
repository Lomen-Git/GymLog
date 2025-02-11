const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class Program extends Model {}

 Program.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  choice: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
 }, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Program'
 })

 module.exports = Program