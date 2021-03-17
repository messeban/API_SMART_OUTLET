const { Op } = require("sequelize");
const Outlet = require('../models/outlet');
const User = require("../models/User");
const Location = require("../models/location");

module.exports = {
    getUsers: (req, res, next) => {
        User.findAll()
            .then(users => {
                res.status(200).json({
                    users
                });
            })
            .catch(err => console.log(err));

    },
    getUser: (req, res, next) => {
        const id = req.params.id;
        User.findByPk(id)
            .then(user => {
                res.status(200).json({
                    user
                });
            })
            .catch(err => console.log(err));

    },
    getOutlets: (req, res, next) => {
        const id = req.params.id;
        Outlet.findAll({
            where: {
                userId: id
            }
        })
            .then(users => {
                res.status(200).json({
                    users
                });
            })
            .catch(err => console.log(err));
    },
    createAccount: (req, res, next) => {
        User.create({ firstName: req.body.firstName, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country });
        res.status(200).end();
    },
    addLocation: (req, res, next) => {
        Location.create({ street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country })
        res.status(200).end();
    }
}