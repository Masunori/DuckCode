'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('testcase', {
      testcaseid: {
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
      ispublic: {
        type: Sequelize.BOOLEAN
      },
      input: {
        type: Sequelize.TEXT
      },
      expected_output: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('testcase');
  }
};