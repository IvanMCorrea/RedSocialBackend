const { Post } = require("../models");
const { getToken, getTokenData } = require("../config/jwt.config");

const postsController = {
  getPosts: async (req, res) => {
    try {
      let data = {};
      let totalPages = 0;
      res.status(200).send({
        success: true,
        msg: "Post created!",
        data,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      res.status(409).send({
        success: false,
        msg: "Error getting posts",
        error: error,
      });
    }
  },
  create: async (req, res) => {
    try {
      res.status(200).send({
        success: true,
        msg: "Post created!",
      });
    } catch (error) {
      console.log(error);
      res.status(409).send({
        success: false,
        msg: "Error creating post",
        error: error,
      });
    }
  },
};

module.exports = postsController;
