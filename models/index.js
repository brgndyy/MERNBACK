const Sequelize = require("sequelize");
const Place = require("./place");

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

Place.init(sequelize);

Place.associate(db);

module.exports = db;
