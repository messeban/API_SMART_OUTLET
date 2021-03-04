const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const sequelize = require('./util/database');
const schedule = require('node-schedule');
const path = require('path');
const outletsRoutes = require('./routes/outlets');
const ownersRoutes = require('./routes/owners');

const Owner = require('./models/owner');
const Location = require('./models/location');
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
app.use('/owners', ownersRoutes);

/*Owner.hasMany(Outlet,{as: 'Outlets'});
Location.hasMany(Outlet,{as: 'Outlets'});*/
Outlet.hasMany(Measurement,{as: "Measurements",foreignKey: 'outletId', sourceKey: 'id'});
Measurement.belongsTo(Outlet,{foreignKey: 'outletId', targetKey: 'id'});

sequelize
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });
;