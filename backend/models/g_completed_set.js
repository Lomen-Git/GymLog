const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class CompletedSet extends Model {}

 CompletedSet.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  completedExerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'completed_exercises',    // Taulun nimi tietokannassa
      key: 'id'
    }
  },
  targetReps: {
    type: DataTypes.INTEGER,
  },
  targetValue: {
    type: DataTypes.INTEGER,
  },
  completedReps: {
    type: DataTypes.INTEGER,
  },
  completedValue: {
    type: DataTypes.INTEGER,
  },
  weight: {
    type: DataTypes.INTEGER,
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
  timestamps: false,
  modelName: 'CompletedSet'
 })

 module.exports = CompletedSet