const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const {Owner} = require('./owner');
const {Location} = require('./location');

const Outlet = sequelize.define('outlets', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  ownerId: Sequelize.INTEGER,
  locationId: Sequelize.INTEGER
},{
  timestamps: false
});


module.exports = Outlet;