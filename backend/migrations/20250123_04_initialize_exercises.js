'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

module.exports = {
  up: async ({ context: queryInterface }) => {

    await queryInterface.createTable('exercises', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }),

    await queryInterface.createTable('user_exercises', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'exercises',
          key: 'id'
        }
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('exercises')
    await queryInterface.dropTable('user_exercises')
  }
}