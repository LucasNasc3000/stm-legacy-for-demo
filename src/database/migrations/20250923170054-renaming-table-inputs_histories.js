/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameTable('inputs_histories', 'input_histories');
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inputs_histories');
  },
};
