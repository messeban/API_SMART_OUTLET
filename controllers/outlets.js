const axios = require('axios');
const { Op } = require("sequelize");
const Outlet = require('../models/outlet');
const User = require("../models/user");
const Location = require("../models/location");
const Room = require("../models/room");

const Measurement = require("../models/measurement");
var mqtt = require('mqtt');
const { values } = require('mysql2/lib/constants/charset_encodings');
var client  = mqtt.connect('mqtt://broker.hivemq.com:1883')
client.subscribe("outletsMeasurements");

module.exports = {
    getOutlets: async (req, res, next) => {
        const id = req.user.id;
        await User.findAll({
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
    getOutlet: (req, res, next) => {
        const id = req.params.id;

        Outlet.findAll({where:{id: id, userId: req.user.id}})
        .then(outlets =>{
          res.status(200).json({
            outlets
        });
            })
        .catch(err => console.log(err));

    },
    getUser: (req, res, next) => {
        const id = req.params.id;
        Outlet.findByPk(id)
        .then(outlet =>{
            User.findByPk(outlet.userId)
            .then(user=>{
                res.status(200).json({
                    user
                });
            })
            .catch(err => console.log(err));        
    })
        .catch(err => console.log(err));
    },
    getLocation: (req, res, next) => {
        const id = req.params.id;
        Outlet.findByPk(id)
        .then(outlet =>{
            Location.findByPk(outlet.locationId)
            .then(location=>{
                res.status(200).json({
                    location
                });
            })
            .catch(err => console.log(err));        
    })
        .catch(err => console.log(err));
    },
    getRoom: (req, res, next) => {
        const id = req.params.id;
        Outlet.findByPk(id)
        .then(outlet =>{
            Room.findByPk(outlet.roomId)
            .then(room=>{
                res.status(200).json({
                    room
                });
            })
            .catch(err => console.log(err));        
    })
        .catch(err => console.log(err));
    },
    postState: (req, res, next) => {
        console.log(req.body.state);
        const id = req.params.id;
       Outlet.findByPk(id)
        .then(outlet =>{
            outlet.state = req.body.state;
            outlet.save();
            client.publish("outlet"+id, req.body.state)
            //mqtt broker aanroepen
        })
        .catch(err => console.log(err));
        res.status(200).end();
    },
    newOutlet: async (req, res, next) => {
        const id = req.user.id;
        console.log(id);
        nOutlet = await Outlet.create({name: req.body.name, device: req.body.device, state:"OFF", isConnected: false,userId: req.body.userId, locationId: req.body.locationId, roomId: req.body.roomId});
        await User.findByPk(id)
        .then(async (user)=>{
            console.log(user);
            await user.addOutlet(nOutlet);
            res.status(200).end();
        })

    },
    getOutletsFromRoom: async (req, res, next) => {
        const roomId = req.params.id;
        const userId = req.user.id;
        await Outlet.findAll({
            where:{
                roomId
            },
            include: [{
                model: User,
                through: { where: {userId: userId}}
            }]
        })
        .then(outlets =>{
            res.status(200).json({
                outlets
            });
    })
        .catch(err => console.log(err));
    },
    sendData: async (req, res, next) => {
        const outletId = req.body.outletId;
        const measurements = req.body.measurements;
        measurements.map(async (value)=>{
            await Measurement.create({t: value.t, V: value.V, I:value.I, measured:value.measured})
            .catch(err => console.log(err));
        })
       
    }

}
client.on('message', function (topic, message, payload) {
    // message is Buffer
    const buffer = JSON.stringify(message.toString());
    const buffer2 = JSON.parse(buffer);
    const buffer3 = JSON.parse(buffer2);
    for(var i = 0; i < buffer3.data.length; i++) {
        var obj = buffer3.data[i];
        Measurement.create({t: Date.now(), V: obj.V, I: obj.I, outletId: buffer3.id});
    }
    console.log(buffer3);
  })