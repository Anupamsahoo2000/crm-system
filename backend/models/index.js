const { sequelize } = require("../config/db");
const Customer = require("./Customer");
const Visitor = require("./Visitor");

const db = {
  sequelize,
  Customer,
  Visitor,
};

module.exports = db;
