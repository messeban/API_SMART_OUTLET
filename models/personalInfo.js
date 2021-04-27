const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const personalInfo = sequelize.define('personalInfos', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  firstName: Sequelize.STRING,
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

module.exports = personalInfo;