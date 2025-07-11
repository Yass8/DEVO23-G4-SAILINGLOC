'use strict';
const {
  Model
} = require('sequelize');
export default (sequelize, DataTypes) => {
  class Port extends Model {
    static associate(models) {

      // OneToMany : Port -> Boats
      Port.hasMany(models.Boat, {
        foreignKey: 'port_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
  Port.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Port',
    tableName: 'Ports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Port;
};