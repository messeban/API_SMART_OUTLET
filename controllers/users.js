require('dotenv').config()

const { Op } = require("sequelize");
const User = require("../models/User");
const Outlet = require('../models/outlet');

const Location = require("../models/location");
const PersonalInfo = require("../models/personalInfo");
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
        User.findAll({
            where:{id:id},
            include: Outlet
        })

            .then(outlets => {
                res.status(200).json({
                    outlets
                });
            })
            .catch(err => console.log(err));

    },
    addPersonalInfo: async (req, res, next) => {
        const u = await PersonalInfo.create({firstName: req.body.firstName, lastName: req.body.lastName, dateOfBirth: req.body.dateOfBirth, street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country });
        res.status(200).json({personalId: u.id}).end();
    },
    addUser: async (req, res, next) => {
        const personalInfoId = req.params.id;
         bcrypt.hash(req.body.password, saltRounds).then(hash => {
            User.create({ email: req.body.email, username: req.body.username, password: hash, personalInfoId });
            res.status(200).end();
        });

    },
    getLocations: (req, res, next) => {
        Location.findAll({where:{userId:req.user.id}})
            .then(locations => {
                res.status(200).json({
                    locations
                });
            })
            .catch(err => console.log(err));

    },
    getRooms: (req, res, next) => {
        const locationId = req.params.id;
        Room.findAll({where:{locationId}})
            .then(rooms => {
                res.status(200).json({
                    rooms
                });
            })
            .catch(err => console.log(err));

    },

    addLocation: async (req, res, next) => {
        const id = req.user.id;
        await Location.create({name:req.body.name ,street: req.body.street, houseNumber: req.body.houseNumber, zipCode: req.body.zipCode, city: req.body.city, country: req.body.country, userId: id })
        .then((result)=>{
            const locationId = result.id;
            res.status(200).json(locationId).end();

        })
    },
    addRoom: async (req, res, next) => {
        const id = req.user.id;

        const locationId = req.params.locationId;
        await Room.create({ name: req.body.name, locationId: locationId })
        .then((result)=>{
            const roomId = result.id;
            res.status(200).json(roomId).end();

        })
    },
    getToken: (req, res) => {
        const refreshToken = req.body.token;
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken(user);
            res.json({ accessToken: accessToken });
        })
    },

    logout: (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204);
    },

    login: (req, res) => {
        // Authenticate User
       // const buffer=JSON.parse(Object.keys(req.body)[0]);
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({
            attributes: ['password', 'id'],
            where: { username: username }
        })
            .then(hashedPassword => {
                if(hashedPassword){
                    bcrypt.compare(password, hashedPassword.password)
                .then((result) => {
                    if (!result) {
                        return res.sendStatus(403);
                    }
                    else {
                        User.findOne({ where: { id: hashedPassword.id } })
                            .then(userResult => {
                                const userId = req.body.id;
                                const user = { id: userResult.id, username: username };

                                const accessToken = generateAccessToken(user);
                                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                                refreshTokens.push(refreshToken);
                                res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
                            })

                    }

                })
                .catch((err)=>{
                    console.log(err);
                })
                }
                else{
                    return res.sendStatus(403);
                }
                

            })



    }
}

function generateAccessToken(user) { 
    const buffer= {
        id:user.id,
        username: user.username
    }
    return jwt.sign(buffer, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}
