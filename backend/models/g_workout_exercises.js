const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class WorkoutExercise extends Model {}

WorkoutExercise.init(
  {
    workoutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workouts',
        key: 'id',
        onDelete: 'CASCADE'
      },
    },
    exerciseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exercises',
        key: 'id',
      },
    },
    choice: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'workout_exercises',
    modelName: 'WorkoutExercises',
    underscored: true, 
  }
)

module.exports = WorkoutExercise