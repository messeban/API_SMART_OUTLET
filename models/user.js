const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('Users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      isEmail: true
    }
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.STRING,
  access_token: Sequelize.STRING,
  refresh_token: Sequelize.STRING,
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},{
  timestamps: false
});

module.exports = User;
