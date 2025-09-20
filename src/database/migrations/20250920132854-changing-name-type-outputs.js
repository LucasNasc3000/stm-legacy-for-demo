/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('outputs', 'type', 'category');
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('outputs', 'type', 'category');
  },
};
