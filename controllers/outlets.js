const axios = require("axios");
const { QueryTypes } = require("sequelize");
const Outlet = require("../models/outlet");
const User = require("../models/user");
const Location = require("../models/location");
const Room = require("../models/room");
const sequelize = require('../util/database');

const Measurement = require("../models/measurement");
var mqtt = require("mqtt");
const { values } = require("mysql2/lib/constants/charset_encodings");
var client = mqtt.connect("mqtt://test.mosquitto.org");

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
    const id = req.params.id;
    Outlet.findByPk(id)
      .then((outlet) => {
        outlet.isConnected = req.body.isConnected;
        outlet.save();
        client.publish('OUTLET_NR_'+id, JSON.stringify(req.body));
      })
      .catch((err) => console.log(err));
    res.status(200).end();
  },
  newOutlet: async (req, res, next) => {
    const id = req.user.id;
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
    console.log(outletId);
    const V = req.body.V;
    const I = req.body.I;
    const W = V*I;
    console.log(req.body.state);
    await Outlet.update({ state: req.body.state }, {
      where: {
          outletId: outletId
      }
    });
      await Measurement.create({
        t:(Date.now()+(2*60*60*1000)),
        V,
        I,
        W,
        outletId: outletId
      }).catch((err) => console.log(err));
    res.sendStatus(200);
  },
  getHourlyAverage: async (req, res, next) => {
    const outletId = req.params.id;
    const outlets = await sequelize.query( `SELECT AVG(W) as y, HOUR(t) as x FROM measurements WHERE outletId = ${outletId} GROUP BY HOUR( t ) LIMIT 24`, { type: QueryTypes.SELECT });
    console.log(outlets);
    res.json({"outlets": outlets}).status(200);
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
});
