'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {

      // ManyToOne: Availability -> Boat
      Availability.belongsTo(models.Boat, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Availability.init({
    boat_id: {
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
    status: {
      type: DataTypes.ENUM('available', 'booked', 'maintenance'),
      defaultValue: 'available',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Availability',
    tableName: 'Availabilities',
    timestamps: true
  });

  return Availability;
};