'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class UserDocument extends Model {
    static associate(models) {

      UserDocument.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  UserDocument.init({
    type: {
      type: DataTypes.ENUM('licence', 'insurance', 'id_card', 'cv','proof_of_address'),
      allowNull: false
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_approved: {
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
    modelName: 'UserDocument',
    tableName: 'UserDocuments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return UserDocument;
};