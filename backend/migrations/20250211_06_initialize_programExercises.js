'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

module.exports = {
  up: async ({ context: queryInterface }) => {

    await queryInterface.createTable('program_executions', {
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
    })

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('program_executions')
  }
}
}