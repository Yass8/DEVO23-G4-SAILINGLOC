'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {

      // OneToOne: Review -> Reservation
      Review.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Review.init({
    reservation_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    timestamps: true
  });

  return Review;
};