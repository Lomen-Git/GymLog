'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('forum_posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('forum_posts');
  },
};
