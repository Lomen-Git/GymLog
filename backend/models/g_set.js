const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class Set extends Model {}

 Set.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  workoutExerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'workout_exercises',
      key: 'id',
      onDelete: 'CASCADE'
    }
  }
 }, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'Set'
 })

 module.exports = Set