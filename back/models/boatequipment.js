'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class BoatEquipment extends Model {
    static associate(models) {

      // ManyToOne: BoatEquipment -> Boat
      BoatEquipment.belongsTo(models.Boat, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  BoatEquipment.init({
    boat_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    equipment_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BoatEquipment',
    tableName: 'BoatEquipments',
    timestamps: true
  });

  return BoatEquipment;
};