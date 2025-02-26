const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class CompletedExercise extends Model {}

 CompletedExercise.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completedWorkoutId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'completed_workouts',    // Taulun nimi tietokannassa
      key: 'id'
    }
  },
  exerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'exercises',           // Taulun nimi tietokannassa
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
  timestamps: false,
  modelName: 'CompletedExercise'
 })

 module.exports = CompletedExercise