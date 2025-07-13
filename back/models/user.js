import bcrypt from 'bcrypt';
'use strict';
const {
  Model
} = require('sequelize');
export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      // define association here
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
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};