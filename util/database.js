const Sequelize = require('sequelize');
//mysql2://bc319c15cbb265:47dac715@us-cdbr-east-06.cleardb.net/heroku_2d1aae413d59cb9?reconnect=true
const sequelize = new Sequelize('smartOutlet', 'root', 'Nevertouch123!', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;