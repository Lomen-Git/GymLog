'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

module.exports = {
  up: async ({ context: queryInterface }) => {

    await queryInterface.createTable('programs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      choice: {
        type: DataTypes.INTEGER,
        allowNull: false
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

    await queryInterface.createTable('weeks', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'programs',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }),

    await queryInterface.createTable('workouts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      week_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'weeks',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }),

    await queryInterface.createTable('workout_exercises', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      workout_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workouts',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      exercise_id: {
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
    }),

    await queryInterface.createTable('sets', {
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
      workout_exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workout_exercises',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('programs')
    await queryInterface.dropTable('workouts')
    await queryInterface.dropTable('workout_exercises')
    await queryInterface.dropTable('sets')
  }
}