/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('mfaphrases', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('mfaphrases', 'email');
  },
};
