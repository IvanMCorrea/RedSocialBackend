const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const APP_HOST = process.env.APP_HOST;
const PORT = process.env.PORT;

const PostScheme = new mongoose.Schema(
  {
    usernameId: {
      type: mongoose.ObjectId,
      ref: "Users",
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    likes: {
      type: Array,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
PostScheme.methods.setPostImage = function (filename) {
  if (filename) {
    this.image = `${APP_HOST}:${PORT}/storage/posts/${
      filename.filename
    }${Date.now()}`;
  }
};
module.exports = mongoose.model("Post", PostScheme);
