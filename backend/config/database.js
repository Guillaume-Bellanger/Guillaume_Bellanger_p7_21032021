const Sequelize = require("sequelize");
const sequelize = new Sequelize("groupomania", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
