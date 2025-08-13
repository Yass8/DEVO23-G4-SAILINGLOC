'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Boat_type extends Model {
    static associate(models) {

      // OneToMany : Boat_type -> Boats
      Boat_type.hasMany(models.Boat, {
        foreignKey: 'type_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  Boat_type.init({
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
    modelName: 'Boat_type',
    tableName: 'Boat_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Boat_type;
};