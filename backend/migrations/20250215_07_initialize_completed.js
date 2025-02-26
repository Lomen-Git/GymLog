'use strict'
const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

module.exports = {
  up: async ({ context: queryInterface }) => {

    await queryInterface.createTable('completed_workouts', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      program_execution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'program_executions',       // Taulun nimi tietokannassa
          key: 'id'
        }
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',      // Taulun nimi tietokannasa
          key: 'id'
        }
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

    await queryInterface.createTable('completed_exercises', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      completed_workout_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'completed_workouts',    // Taulun nimi tietokannassa
          key: 'id'
        }
      },
      exercise_id: {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',      // Taulun nimi tietokannasa
          key: 'id'
        }
      },
    }),

    await queryInterface.createTable('completed_sets', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        completed_exercise_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'completed_exercises',    // Taulun nimi tietokannassa
            key: 'id'
          }
        },
        target_reps: {
          type: DataTypes.INTEGER,
        },
        target_value: {
          type: DataTypes.INTEGER,
        },
        completed_reps: {
          type: DataTypes.INTEGER,
        },
        completed_value: {
          type: DataTypes.INTEGER,
        },
        weight: {
          type: DataTypes.INTEGER,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',      // Taulun nimi tietokannasa
            key: 'id'
          }
        },
    })


  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('completed_workouts')
    await queryInterface.dropTable('completed_exercises')
    await queryInterface.dropTable('completed_sets')
  }
}
}