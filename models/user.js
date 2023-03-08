const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            min: 6,
          },
        },
        image: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        places: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  // foreignKey 가 참조하는 다른 테이블의 컬럼은 꼭 Primary Key 여야한다.
  static associate(db) {
    db.User.hasMany(db.Place, { foreignKey: "creator", sourceKey: "id" });
  }
};
