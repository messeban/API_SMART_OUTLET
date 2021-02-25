const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Owner = sequelize.define('owners', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fistName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  dateOfBirth: Sequelize.DATE,
  street: Sequelize.STRING,
  houseNumber: Sequelize.INTEGER,
  zipCode: Sequelize.INTEGER,
  city: Sequelize.STRING,
  country: Sequelize.STRING
},{
  timestamps: false
});

module.exports = Owner;