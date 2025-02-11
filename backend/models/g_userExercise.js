const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class UserExercise extends Model {}

UserExercise.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
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
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'user_exercises',
    underscored: true, 
  }
);

module.exports = UserExercise;
