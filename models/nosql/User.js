const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const APP_HOST = process.env.APP_HOST;
const PORT = process.env.PORT;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserScheme = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserScheme.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
      if (err) return next(err);
      this.password = hashedPassword;
      next();
    });
  }
  if (!this.avatar) {
    this.avatar = `${APP_HOST}${PORT && `:${PORT}`}/default/user_default.png`;
  }
});

UserScheme.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is miss can not compare!");
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};

UserScheme.methods.setProfileImage = function (filename, username) {
  if (filename) {
    this.avatar = `${APP_HOST}${PORT && `:${PORT}`}/storage/${username}/${filename.filename}`;
  } else {
    this.avatar = `${APP_HOST}${PORT && `:${PORT}`}/default/user_default.png`;
  }
};

UserScheme.methods.setCoverImage = function (filename, username) {
  if (filename) {
    this.image = `${APP_HOST}${PORT && `:${PORT}`}/storage/${username}/${filename.filename}`;
  } else {
    this.image = `${APP_HOST}${PORT && `:${PORT}`}/default/user_default.png`;
  }
};

module.exports = mongoose.model("Users", UserScheme);
