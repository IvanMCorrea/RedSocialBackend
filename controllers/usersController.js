/* const bcrypt = require("bcrypt"); */
const { User } = require("../models");

const usersController = {
  createUser: async (req, res) => {
    try {
      const { body } = req;
      console.log("body: ", body);
      const data = await User.create(body);
      res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: true,
        error,
      });
    }
  },

  getUsers: async (req, res) => {
    try {
      const data = await User.find({});
      console.log("users:", data);
      res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: true,
        error,
      });
    }
  },
  login: async (req, res) => {
    try {
      const users = await User.where({ "role.0": { $eq: 1 } });
      res.status(200).send({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: true,
        error,
      });
    }
  },
};

module.exports = usersController;
