const Sequelize = require("sequelize");

module.exports = class Place extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        lat: {
          type: Sequelize.DECIMAL(20, 30),
          allowNull: false,
        },
        lng: {
          type: Sequelize.DECIMAL(20, 30),
          allowNull: false,
        },
        creator: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Place",
        tableName: "places",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
};
