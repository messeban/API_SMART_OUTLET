const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const sequelize = require('./util/database');
const schedule = require('node-schedule');
const path = require('path');
const cors = require('cors');

const outletsRoutes = require('./routes/outlets');
const usersRoutes = require('./routes/users');
const constraints = require('./models/constraints');

const app = express();
app.use(cors());

app.use(express.urlencoded({extended: true })); 
app.use(express.json()); 

app.use('/outlets', outletsRoutes);
app.use('/users', usersRoutes);

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