const { Post, User } = require("../models");
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
      const { description } = req.body;
      console.log("req.files ", req.file);
      const postImage = req.file ? req.file : false;
      console.log("postImage ", postImage);

      let user = null;
      const authorization = req.get("authorization");
      let token = null;
      if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.substring(7);
      }
      const decodedToken = getTokenData(token);
      if (decodedToken) {
        user = await User.findOne({ username: decodedToken.data.username });
      }

      let post = {
        usernameId: user._id,
        description,
      };

      const newPost = await Post(post);
      postImage && (await newPost.setPostImage(postImage));
      await newPost.save();

      if (newPost) {
        res.status(200).send({
          success: true,
          msg: "Post created!",
        });
      } else {
        res.status(400).send({
          success: true,
          msg: "Error creating post",
        });
      }
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
