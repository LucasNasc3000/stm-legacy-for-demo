/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('inputs', 'type', 'category');
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('inputs', 'type', 'category');
  },
};
