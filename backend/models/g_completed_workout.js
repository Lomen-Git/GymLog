const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class CompletedWorkout extends Model {}

 CompletedWorkout.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  programExecutionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'program_executions',       // Taulun nimi tietokannassa
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',      // Taulun nimi tietokannasa
      key: 'id'
    }
  },
 }, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'CompletedWorkout'
 })

 module.exports = CompletedWorkout