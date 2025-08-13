'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {

      // ManyToOne: Reservation -> Boat
      Reservation.belongsTo(models.Boat, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // ManyToOne: Reservation -> User
      Reservation.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToMany: Reservation -> Payment
      Reservation.hasMany(models.Payment, {
        foreignKey: 'reservation_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToOne: Reservation -> Contract
      Reservation.hasOne(models.Contract, {
        foreignKey: 'reservation_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToOne: Reservation -> Review
      Reservation.hasOne(models.Review, {
        foreignKey: 'reservation_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToMany: Reservation -> Message
      Reservation.hasMany(models.Message, {
        foreignKey: 'reservation_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  Reservation.init({
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    boat_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'Reservations',
    timestamps: true
  });

  return Reservation;
};