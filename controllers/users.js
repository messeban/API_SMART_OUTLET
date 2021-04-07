require('dotenv').config()

const { Op } = require("sequelize");
const Outlet = require('../models/outlet');
const User = require("../models/User");
const Location = require("../models/location");
const Credentials = require("../models/credential");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Room = require('../models/room');
const saltRounds = 10;
let refreshTokens = [];

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
        const id = req.user.id;
        User.findByPk(id)
            .then(user => {
                res.status(200).json({
                    user
                });
            })
            .catch(err => console.log(err));

    },
    getOutlets: (req, res, next) => {
        const id = req.user.id;
        Outlet.findAll({
            where: {
                userId: id
            },
            include: Location
        })
            .then(outlets => {
                res.status(200).json({
                    outlets
                });
            })
            .catch(err => console.log(err));
    },
    addPersonalInfo: async (req, res, next) => {
        const u = await User.create({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country });
        console.log(u.id);
        res.status(200).end();
    },
    addCredentials: async (req, res, next) => {
        const userId = req.params.id;
         bcrypt.hash(req.body.password, saltRounds).then(hash => {
            Credentials.create({ username: req.body.username, password: hash, userId: userId });
            res.status(200).redirect("https://www.google.com/").end();
        });

    },
    addLocation: (req, res, next) => {
        Location.create({ street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country });
        res.status(200).end();
    },
    addRoom: (req, res, next) => {
        const locationId = req.params.locationId;
        Room.create({ name: req.body.name, locationId: locationId });
        res.status(200).end();
    },
    getToken: (req, res) => {
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ id: user.id })
            res.json({ accessToken: accessToken })
        })
    },

    logout: (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204)
    },

    login: (req, res) => {
        // Authenticate User
        const username = req.body.username;
        const password = req.body.password;
        Credentials.findOne({
            attributes: ['password', 'userId'],
            where: { username: username }
        })
            .then(hashedPassword => {
                bcrypt.compare(password, hashedPassword.password).then((result) => {
                    if (!result) {
                        return res.sendStatus(403);
                    }
                    else {
                        User.findOne({ where: { id: hashedPassword.userId } })
                            .then(userResult => {
                                const userId = req.body.id;
                                const user = { id: userResult.id, username: username };

                                const accessToken = generateAccessToken(user)
                                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                                refreshTokens.push(refreshToken)
                                res.json({ accessToken: accessToken, refreshToken: refreshToken })
                            })

                    }

                })
            .catch((err)=>{
                console.log(err);
            })
            })



    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}
