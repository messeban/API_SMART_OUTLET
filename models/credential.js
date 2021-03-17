const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Credential = sequelize.define('Credentials', {
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
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},{
  timestamps: false
});

module.exports = Credential;