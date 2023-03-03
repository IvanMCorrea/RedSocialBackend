const mongoose = require("mongoose");

const PostScheme = new mongoose.Schema(
  {
    usernameId: {
      type: String,
      required: true,
      unique: true,
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

module.exports = mongoose.model("Post", PostScheme);
