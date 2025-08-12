'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class BoatPhoto extends Model {
    static associate(models) {

      // ManyToOne : BoatPhoto -> Boat
      BoatPhoto.belongsTo(models.Boat, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  BoatPhoto.init({
    boat_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'BoatPhoto',
    tableName: 'BoatPhotos',
    timestamps: true
  });

  return BoatPhoto;
};