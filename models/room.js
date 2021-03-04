const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Room = sequelize.define('rooms', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  locationId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},{
  timestamps: false
});

module.exports = Room;