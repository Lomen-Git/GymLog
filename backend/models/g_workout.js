const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class Workout extends Model {}

 Workout.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weekId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'weeks',
      key: 'id',
      onDelete: 'CASCADE'
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
 }, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'Workout'
 })

 module.exports = Workout