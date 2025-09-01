import bcrypt from "bcrypt";
'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relation avec Boat (un utilisateur peut posséder plusieurs bateaux)
      User.hasMany(models.Boat, {
        foreignKey: 'user_id',
        as: 'boats'
      });

      // Relation avec Review (un utilisateur peut avoir plusieurs avis)
      User.hasMany(models.Review, {
        foreignKey: 'user_id',
        as: 'reviews'
      });
    }
    checkPassword(plainPassword) {
      return bcrypt.compareSync(plainPassword, this.password);
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Le prénom est obligatoire.'
        },
        len: {
          args: [2, 50],
          msg: 'Le prénom doit contenir entre 2 et 50 caractères.'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Le nom est obligatoire.'
        },
        len: {
          args: [2, 50],
          msg: 'Le nom doit contenir entre 2 et 50 caractères.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Cet email est déjà utilisé.'
      },
      validate: {
        isEmail: {
          msg: 'Veuillez entrer une adresse email valide.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const hashed = bcrypt.hashSync(value, bcrypt.genSaltSync(10));
        this.setDataValue('password', hashed);
      },
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ['locataire']
    },
    phone: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    photo: DataTypes.STRING,
    address: DataTypes.STRING,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return User;
};