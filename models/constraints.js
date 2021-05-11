const User = require('./user');
const PersonalInfo = require('./personalInfo');
const Location = require('./location');
const Room = require("./room");
const Outlet = require('./outlet');
const Measurement = require('./measurement');


PersonalInfo.hasOne(User,{as: "Users",foreignKey: 'personalInfoId', sourceKey: 'id'});
User.belongsTo(PersonalInfo,{foreignKey: 'personalInfoId', targetKey: 'id'});

User.belongsToMany(Outlet, { through: 'UsersOutlets' });
Outlet.belongsToMany(User, { through: 'UsersOutlets' });

Location.hasMany(Outlet,{as: "Outlets",foreignKey: 'locationId', sourceKey: 'id'});
Outlet.belongsTo(Location,{foreignKey: 'locationId', targetKey: 'id'});

Outlet.hasMany(Measurement,{as: "Measurements",foreignKey: 'outletId', sourceKey: 'outletId'});
Measurement.belongsTo(Outlet,{foreignKey: 'outletId', targetKey: 'outletId'});

User.hasMany(Location, {as: "Locations", foreignKey: "userId", sourceKey:"id"});
Location.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'})

Location.hasMany(Room,{as: "Rooms", foreignKey:"locationId", sourceKey:"id"});
Room.belongsTo(Location,{foreignKey: 'locationId', targetKey: 'id'});

Room.hasMany(Outlet,{as: "Outlets",foreignKey: 'roomId', sourceKey: 'id'});
Outlet.belongsTo(Room,{foreignKey: 'roomId', targetKey: 'id'});