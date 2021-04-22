const User = require('./user');
const Credential = require('./credential');
const Location = require('./location');
const Room = require("./room");
const Outlet = require('./outlet');
const Measurement = require('./measurement');

User.hasOne(Credential,{as: "credentials",foreignKey: 'userId', sourceKey: 'id'});
Credential.belongsTo(User,{foreignKey: 'userId', targetKey: 'id'});

User.belongsToMany(Outlet, { through: 'UsersOutlets' });
Outlet.belongsToMany(User, { through: 'UsersOutlets' });

Location.hasMany(Outlet,{as: "Outlets",foreignKey: 'locationId', sourceKey: 'id'});
Outlet.belongsTo(Location,{foreignKey: 'locationId', targetKey: 'id'});

Outlet.hasMany(Measurement,{as: "Measurements",foreignKey: 'outletId', sourceKey: 'id'});
Measurement.belongsTo(Outlet,{foreignKey: 'outletId', targetKey: 'id'});

Location.hasMany(Room,{as: "Room", foreignKey:"locationId", sourceKey:"id"});
Room.belongsTo(Location,{foreignKey: 'locationId', targetKey: 'id'});

Room.hasMany(Outlet,{as: "Outlets",foreignKey: 'roomId', sourceKey: 'id'});
Outlet.belongsTo(Room,{foreignKey: 'roomId', targetKey: 'id'});