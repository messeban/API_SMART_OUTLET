const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Measurement = sequelize.define('measurements', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  t: Sequelize.DATE,
  V: Sequelize.FLOAT,
  I: Sequelize.FLOAT,
  W: Sequelize.FLOAT,
  outletId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }},{
    timestamps: false
  }
);
module.exports = Measurement;