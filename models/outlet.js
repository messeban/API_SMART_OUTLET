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
  state: Sequelize.STRING,
  isConnected: Sequelize.BOOLEAN,
  userId: Sequelize.INTEGER,
  locationId: Sequelize.INTEGER
},{
  timestamps: false
});


module.exports = Outlet;