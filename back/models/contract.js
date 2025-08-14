'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {

      // OneToOne: Contract -> Reservation
      Contract.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Contract.init({
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    reservation_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    contract_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner_signature: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    render_signature: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Contract',
    tableName: 'Contracts',
    timestamps: true
  });

  return Contract;
};