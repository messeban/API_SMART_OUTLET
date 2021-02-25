const Outlet = require('../models/outlet');
const axios = require('axios');
const { Op } = require("sequelize");

module.exports = {
    getOutlets: (req, res, next) => {
        Outlet.findAll()
        .then(outlets =>{
          res.status(200).json({
            outlets
        });        })
        .catch(err => console.log(err));

    }
}