const axios = require('axios');
const { Op } = require("sequelize");
const Outlet = require('../models/outlet');
const Owner = require("../models/owner");
const Location = require("../models/location");
const Measurement = require("../models/measurement");
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com:1883')
client.subscribe("outletsMeasurements");

module.exports = {
    getOutlets: (req, res, next) => {
        Outlet.findAll()
        .then(outlets =>{
          res.status(200).json({
            outlets
        });        })
        .catch(err => console.log(err));

    },
    getOutlet: (req, res, next) => {
        const id = req.params.id;
        Outlet.findByPk(id)
        .then(outlets =>{
          res.status(200).json({
            outlets
        });        })
        .catch(err => console.log(err));

    },
    getOwner: (req, res, next) => {
        const id = req.params.id;
        Outlet.findByPk(id)
        .then(outlet =>{
            Owner.findByPk(outlet.ownerId)
            .then(owner=>{
                res.status(200).json({
                    owner
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
    newOutlet: (req, res, next) => {
        newOutlet = Outlet.create({name: req.body.name, device: req.body.device, state:"OFF", isConnected: false,ownerId: req.body.ownerId, locationId: req.body.locationId});
        res.status(200).end();
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