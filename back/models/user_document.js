'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class User_document extends Model {
    static associate(models) {

      User_document.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User_document.init({
    type: {
      type: DataTypes.ENUM('licence', 'insurance', 'id_card'),
      allowNull: false
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User_document',
    tableName: 'User_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return User_document;
};