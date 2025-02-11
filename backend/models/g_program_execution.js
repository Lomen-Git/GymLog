const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

 class ProgramExecution extends Model {}

 ProgramExecution.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  weekIndex: {
    type: DataTypes.INTEGER,
  },
  workoutIndex: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.BOOLEAN,
  }
 }, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'ProgramExecution'
 })

 module.exports = ProgramExecution