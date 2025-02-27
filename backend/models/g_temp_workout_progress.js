const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class TempWorkoutProgress extends Model {}

 TempWorkoutProgress.init({
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
    },
    programExecutionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ProgramExecutions', key: 'id' }
    },
    workoutId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Workouts', key: 'id' }
    },
    progressData: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'JSON string containing the saved progress data'
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    indexes: [
    {
        unique: true,
        fields: ['user_id', 'program_execution_id', 'workout_id']
    }
    ]
});

module.exports = TempWorkoutProgress