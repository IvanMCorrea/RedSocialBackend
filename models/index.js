const { model } = require("mongoose");

const models = {
  User: require("./nosql/User"),
  Post: require("./nosql/Post"),
};

module.exports = models;
