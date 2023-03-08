const Sequelize = require("sequelize");
const Place = require("./place");
const User = require("./user");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.Place = Place;
db.User = User;

Place.init(sequelize);
User.init(sequelize);

Place.associate(db);
User.associate(db);

module.exports = db;
