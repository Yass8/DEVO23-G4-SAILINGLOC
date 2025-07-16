'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class BoatType extends Model {
    static associate(models) {

      // OneToMany : Boat_type -> Boats
      BoatType.hasMany(models.Boat, {
        foreignKey: 'type_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  BoatType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BoatType',
    tableName: 'Boat_types',
    timestamps: true
  });
  return BoatType;
};