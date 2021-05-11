const axios = require("axios");
const { Op } = require("sequelize");
const Outlet = require("../models/outlet");
const User = require("../models/user");
const Location = require("../models/location");
const Room = require("../models/room");
const sequelize = require('../util/database');

const Measurement = require("../models/measurement");
var mqtt = require("mqtt");
const { values } = require("mysql2/lib/constants/charset_encodings");
var client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.subscribe("outletsMeasurements");

module.exports = {
  getOutlets: async (req, res, next) => {
    const id = req.user.id;

    await Outlet.findAll({
      include: [{
        model: User,
        where: {
          id
        }
      }, {
        model: Location,
        where: {
          userId: id
        }
      }, {
        model: Room
      }]
    })

      .then((outlets) => {
        res.status(200).json({
          outlets,
        });
      })
      .catch((err) => console.log(err));
  },
  getOutlet: (req, res, next) => {
    const id = req.params.id;

    Outlet.findAll({ where: { id: id, userId: req.user.id } })
      .then((outlets) => {
        res.status(200).json({
          outlets,
        });
      })
      .catch((err) => console.log(err));
  },
  getUser: (req, res, next) => {
    const id = req.params.id;
    Outlet.findByPk(id)
      .then((outlet) => {
        User.findByPk(outlet.userId)
          .then((user) => {
            res.status(200).json({
              user,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  },
  getLocation: (req, res, next) => {
    const id = req.params.id;
    Outlet.findByPk(id)
      .then((outlet) => {
        Location.findByPk(outlet.locationId)
          .then((location) => {
            res.status(200).json({
              location,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  },
  getRoom: (req, res, next) => {
    const id = req.params.id;
    Outlet.findByPk(id)
      .then((outlet) => {
        Room.findByPk(outlet.roomId)
          .then((room) => {
            res.status(200).json({
              room,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  },
  postConnected: (req, res, next) => {
    console.log(req.body.state);
    const id = req.params.id;
    Outlet.findByPk(id)
      .then((outlet) => {
        outlet.isConnected = req.body.isConnected;
        outlet.save();

      })
      .catch((err) => console.log(err));
    res.status(200).end();
  },
  newOutlet: async (req, res, next) => {
    const id = req.user.id;
    console.log(id);
    nOutlet = await Outlet.create({
      name: req.body.name,
      device: req.body.device,
      locationId: req.body.locationId,
      roomId: req.body.roomId,
      outletId: req.body.outletId
    });
    const u = await User.findByPk(id)
      .then(async (user) => {
        await user.addOutlet(nOutlet);
        res.status(200).end();
      });
  },
  getOutletsFromRoom: async (req, res, next) => {
    const roomId = req.params.id;
    const userId = req.user.id;
    await Outlet.findAll({
      where: {
        roomId,
      },
      include: [
        {
          model: User,
          through: { where: { userId: userId } },
        },
      ],
    })
      .then((outlets) => {
        res.status(200).json({
          outlets,
        });
      })
      .catch((err) => console.log(err));
  },
  receiveData: async (req, res, next) => {
    const outletId = req.body.outletId;
    const t = req.body.t;
    const V = req.body.V;
    const I = req.body.I;
    const W = V*I;
    console.log(req.body);
      await Measurement.create({
        t,
        V,
        I,
        W,
        outletId: outletId
      }).catch((err) => console.log(err));
    res.sendStatus(200);
  },
  getHourlyAverage: async (req, res, next) => {
    const outletId = req.body.outletId;
    const [results, metadata] = await sequelize.query(
      `SELECT AVG(V), AVG(I), AVG(W), HOUR(t) FROM measurements WHERE outletId = ${outletId} GROUP BY HOUR( t )`
    );
    console.log(results);

    res.sendStatus(200);

    /*const outletId = req.body.outletId;
        const measurements = req.body.measurements;
        measurements.map(async (value)=>{
            await Measurement.create({t: value.t, V: value.V, I:value.I, measured:value.measured})
            .catch(err => console.log(err));
        })*/
  },
  getDailyAverage: async (req, res, next) => {
    const [results, metadata] = await query(
      "SELECT AVG(V), AVG(I), AVG(W), DAY(t) as 'Day' FROM hourlyAverages GROUP BY DAY( t )"
    );
    console.log(results);
  },
  getWeeklyAverage: async (req, res, next) => {
    const [results, metadata] = await query(
      "SELECT AVG(V), AVG(I), AVG(W), WEEK(t) as 'Week' FROM dailyAverages GROUP BY WEEK( t )"
    );
    console.log(results);
  },
  getMonthlyAverage: async (req, res, next) => {
    const [results, metadata] = await query(
      "SELECT AVG(V), AVG(I), AVG(W), MONTH(t) as 'Month' FROM weeklyAverages GROUP BY MONTH( t )"
    );
    console.log(results);
  },
};
client.on("message", function (topic, message, payload) {
  // message is Buffer
  const buffer = JSON.stringify(message.toString());
  const buffer2 = JSON.parse(buffer);
  const buffer3 = JSON.parse(buffer2);
  for (var i = 0; i < buffer3.data.length; i++) {
    var obj = buffer3.data[i];
    Measurement.create({
      t: Date.now(),
      V: obj.V,
      I: obj.I,
      outletId: buffer3.id,
    });
  }
  console.log(buffer3);
});
