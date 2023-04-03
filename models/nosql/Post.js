const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const APP_HOST = process.env.APP_HOST;
/* const PORT = process.env.PORT; */

const PostScheme = new mongoose.Schema(
  {
    usernameId: {
      type: mongoose.ObjectId,
      ref: "Users",
      required: true,
      unique: false,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    likes: [
      {
        type: mongoose.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
PostScheme.methods.setPostImage = function (filename) {
  console.log("host:",APP_HOST)
  if (filename) {
    this.image = `${APP_HOST}${PORT && `:${PORT}`}/storage/posts/${filename.filename}`;
  }
};
module.exports = mongoose.model("Post", PostScheme);
