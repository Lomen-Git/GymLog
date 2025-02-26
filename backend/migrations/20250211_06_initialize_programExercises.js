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
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'programs',
          key: 'id'
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      week_index: {
        type: DataTypes.INTEGER,
      },
      workout_index: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW
      }
    })

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('program_executions')
  }
}
}