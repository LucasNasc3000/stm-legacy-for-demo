/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('mfaphrases', 'email');
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('inputs', 'totalweight');
  },
};
