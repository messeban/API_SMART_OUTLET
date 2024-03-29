const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const {User} = require('./user');
const {Location} = require('./location');

const Outlet = sequelize.define('outlets', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  device: Sequelize.STRING,
  state: {
    type: Sequelize.STRING,
    defaultValue: "NOT IN USE"
  },
  isConnected: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  locationId: Sequelize.INTEGER,
  roomId: Sequelize.INTEGER,
  outletId: {
    type: Sequelize.INTEGER,
    foreignKey:true
  }

},{
  timestamps: false
});


module.exports = Outlet;