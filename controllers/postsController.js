const { Post, User } = require("../models");
const { getToken, getTokenData } = require("../config/jwt.config");

const postsController = {
  getPosts: async (req, res) => {
    try {
      const page = req.params.page;
      const pageNumber = parseInt(page);
      const limit = 20;
      const skip = (pageNumber - 1) * limit;
      const totalDocuments = await Post.count();
      const totalPages = Math.ceil(totalDocuments / limit);
      const data = await Post.find()
        .skip(skip)
        .limit(limit)
        .populate("usernameId");
      res.status(200).send({
        success: true,
        msg: "Posts loaded!",
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
      const { data } = req.body;
      console.log(data);
      const postImage = req.file ? req.file : false;
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
        description: data,
        image: "",
        likes: [],
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
  getPostsById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = Post.find({ usernameId: id });
      let totalPages = 0;
      res.status(200).send({
        success: true,
        msg: "Post loaded!",
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
};

module.exports = postsController;
