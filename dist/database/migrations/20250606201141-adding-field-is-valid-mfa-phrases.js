"use strict";/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'mfaphrases',
      'is_valid',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mfaphrases');
  },
};
