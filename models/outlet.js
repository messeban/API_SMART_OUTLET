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
    defaultValue: "OFF"
  },
  isConnected: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  locationId: Sequelize.INTEGER,
  roomId: Sequelize.INTEGER
},{
  timestamps: false
});


module.exports = Outlet;