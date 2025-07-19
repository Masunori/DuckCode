'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('submission', {
      submissionid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questionid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'question',
          key: 'questionid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'userid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      codeText: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('submission');
  }
};