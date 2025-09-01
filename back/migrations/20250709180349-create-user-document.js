'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDocuments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      type: {
        type: Sequelize.ENUM('licence', 'insurance', 'id_card','cv','proof_of_address'),
        allowNull: false
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      message: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserDocuments');
  }
};