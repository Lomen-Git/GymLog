'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('likes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'forum_posts',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('likes');
  },
};
