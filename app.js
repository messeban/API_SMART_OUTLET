const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const sequelize = require('./util/database');
const schedule = require('node-schedule');
const path = require('path');
const outletsRoutes = require('./routes/outlets');
const usersRoutes = require('./routes/users');

const User = require('./models/user');
const Credential = require('./models/credential');

const Location = require('./models/location');
const Room = require("./models/room");
const Outlet = require('./models/outlet');
const Measurement = require('./models/measurement');
const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/outlets', outletsRoutes);
app.use('/users', usersRoutes);

/*Owner.hasMany(Outlet,{as: 'Outlets'});
Location.hasMany(Outlet,{as: 'Outlets'});*/
User.hasOne(Credential,{as: "credentials",foreignKey: 'userId', sourceKey: 'id'});
Credential.belongsTo(User,{foreignKey: 'userId', targetKey: 'id'});
User.hasMany(Outlet,{as: "Outlets",foreignKey: 'userId', sourceKey: 'id'});
Outlet.belongsTo(User,{foreignKey: 'userId', targetKey: 'id'});
Location.hasMany(Outlet,{as: "Outlets",foreignKey: 'locationId', sourceKey: 'id'});
Outlet.belongsTo(Location,{foreignKey: 'locationId', targetKey: 'id'});
Outlet.hasMany(Measurement,{as: "Measurements",foreignKey: 'outletId', sourceKey: 'id'});
Measurement.belongsTo(Outlet,{foreignKey: 'outletId', targetKey: 'id'});
Location.hasMany(Room,{as: "Room", foreignKey:"locationId", sourceKey:"id"});
Room.belongsTo(Location,{foreignKey: 'locationId', targetKey: 'id'});
Room.hasMany(Outlet,{as: "Outlets",foreignKey: 'roomId', sourceKey: 'id'});
Outlet.belongsTo(Room,{foreignKey: 'roomId', targetKey: 'id'});
sequelize
  .sync({ force: true })
  //.sync()
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });
;