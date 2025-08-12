'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {

      // ManyToOne: Message -> User (sender)
      Message.belongsTo(models.User, {
        foreignKey: 'sender_id',
        as: 'Sender',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // ManyToOne: Message -> User (receiver)
      Message.belongsTo(models.User, {
        foreignKey: 'receiver_id',
        as: 'Receiver',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // ManyToOne: Message -> Reservation
      Message.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  Message.init({
    sender_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    reservation_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: true
  });

  return Message;
};