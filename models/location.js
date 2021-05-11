const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Location = sequelize.define('locations', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  street: Sequelize.STRING,
  houseNumber: Sequelize.INTEGER,
  zipCode: Sequelize.INTEGER,
  city: Sequelize.STRING,
  country: Sequelize.STRING,
  userId: Sequelize.INTEGER
},{
  timestamps: false
});

module.exports = Location;