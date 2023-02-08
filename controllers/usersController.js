/* const bcrypt = require("bcrypt"); */
const { User } = require("../models");

const usersController = {
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
