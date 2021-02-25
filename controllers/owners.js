const { Op } = require("sequelize");
const Outlet = require('../models/outlet');
const Owner = require("../models/owner");
const Location = require("../models/location");

module.exports = {
    getOwners: (req, res, next) => {
        Owner.findAll()
            .then(owners => {
                res.status(200).json({
                    owners
                });
            })
            .catch(err => console.log(err));

    },
    getOwner: (req, res, next) => {
        const id = req.params.id;
        Owner.findByPk(id)
            .then(owner => {
                res.status(200).json({
                    owner
                });
            })
            .catch(err => console.log(err));

    },
    getOutlets: (req, res, next) => {
        const id = req.params.id;
        Outlet.findAll({
            where: {
                ownerId: id
            }
        })
            .then(owners => {
                res.status(200).json({
                    owners
                });
            })
            .catch(err => console.log(err));
    },
    createAccount: (req, res, next) => {
        Owner.create({ firstName: req.body.firstName, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country });
        res.status(200).end();
    },
    addLocation: (req, res, next) => {
        Location.create({ street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country })
        res.status(200).end();
    }
}