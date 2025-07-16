'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {

       // ManyToOne: Payment -> Reservation
      Payment.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Payment.init({
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    reservation_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
      allowNull: false
    },
    commission_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: true
  });

  return Payment;
};