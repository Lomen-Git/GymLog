const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class Week extends Model {}

 Week.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'programs',
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
  modelName: 'Week'
 })

 module.exports = Week