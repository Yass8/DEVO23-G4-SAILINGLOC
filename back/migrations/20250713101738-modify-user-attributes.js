'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      // Corrige "lasttname" -> "lastname"
      queryInterface.removeColumn('Users', 'lasttname'),
      queryInterface.addColumn('Users', 'lastname', {
        type: Sequelize.STRING,
        allowNull: false
      }),

      // Modifie firstname
      queryInterface.changeColumn('Users', 'firstname', {
        type: Sequelize.STRING,
        allowNull: false
      }),

      // Modifie password
      queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false
      }),

      // Modifie phone, payment_method, photo, address
      queryInterface.changeColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Users', 'payment_method', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Users', 'photo', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Users', 'address', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      // Remet les anciens états
      queryInterface.removeColumn('Users', 'lastname'),
      queryInterface.addColumn('Users', 'lasttname', {
        type: Sequelize.STRING
      }),

      queryInterface.changeColumn('Users', 'firstname', {
        type: Sequelize.STRING,
        allowNull: true
      }),

      queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: true
      }),

      queryInterface.changeColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Users', 'payment_method', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Users', 'photo', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Users', 'address', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  }
};
