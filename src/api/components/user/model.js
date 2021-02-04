const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const sequelize = new Sequelize("postgres");

const User = sequelize.define(
  "User",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    role:{
      type: DataTypes.ENUM('administrator','author','reader'),
      defaultValue: 'reader',
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Non è stato indicato un indirizzo e-mail valido",
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    link: {
      blogpost:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: function(){
          return "api/blogposts?user=" + this._id
        },
      },
      comments:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: function(){
          return "api/comments?user=" + this._id
        },
      }
    }
  },
  {
    instanceMethods: {
      generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      validPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  }
);

module.exports = User;
