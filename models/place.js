const Sequelize = require("sequelize");

module.exports = class Place extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        place_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING(1234),
          allowNull: false,
        },
        lat: {
          type: Sequelize.DECIMAL(30, 20),
          allowNull: false,
        },
        lng: {
          type: Sequelize.DECIMAL(30, 20),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(100),
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
  static associate(db) {
    db.Place.belongsTo(db.User, { foreignKey: "creator", targetKey: "id" });
  }
};
