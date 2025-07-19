'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      exp: {
        type: Sequelize.INTEGER
      },
      rankPoint: {
        type: Sequelize.INTEGER
      },
      provider: {
        type: Sequelize.STRING
      },
      providerId: {
        type: Sequelize.STRING
      },
      isAuthenticated: {
        type: Sequelize.BOOLEAN
      },
      bio: {
        type: Sequelize.TEXT
      },
      isTwoFactored: {
        type: Sequelize.BOOLEAN
      },
      profilePicture: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};