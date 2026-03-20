/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('inputs', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addIndex('inputs', ['name'], {
      unique: true,
      name: 'inputs_name_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('inputs', 'name');
  },
};
