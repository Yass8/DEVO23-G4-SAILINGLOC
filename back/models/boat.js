'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Boat extends Model {
    static associate(models) {

      // ManyToOne: Boat -> User
      Boat.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // ManyToOne: Boat -> Port
      Boat.belongsTo(models.Port, {
        foreignKey: 'port_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // ManyToOne: Boat -> BoatType
      Boat.belongsTo(models.BoatType, {
        foreignKey: 'type_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // OneToMany: Boat -> BoatPhoto
      Boat.hasMany(models.BoatPhoto, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToMany: Boat -> BoatEquipment
      Boat.hasMany(models.BoatEquipment, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToMany: Boat -> Availability
      Boat.hasMany(models.Availability, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // OneToMany: Boat -> Reservation
      Boat.hasMany(models.Reservation, {
        foreignKey: 'boat_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Boat.init({
    registration_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Ce numéro d\'immatriculation est déjà utilisé.'
      },
      validate: {
        notEmpty: { msg: 'Le numéro d\'immatriculation est obligatoire.' }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom du bateau est obligatoire.' }
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    length: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    engine_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skipper_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    max_passengers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    daily_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    water_draft: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    insurance_url:{
      type: DataTypes.STRING,
      allowNull: true
    },
    registration_url:{
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    port_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Boat',
    tableName: 'Boats',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Boat;
};