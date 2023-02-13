/* const bcrypt = require("bcrypt"); */
const { User } = require("../models");
const { getToken, getTokenData } = require("../config/jwt.config");

const usersController = {
  register: async (req, res) => {
    try {
      const { body } = req;
      console.log("body: ", body);

      const filename = req.file ? req.file.filename : false;
      let user = (await User.findOne({ username: body.username })) || null;

      if (user) {
        return res.status(400).send({
          success: false,
          msg: "El usuario ya existe",
        });
      }

      const newUser = await User(body);

      if (!newUser) {
        res.status(404).send({
          success: false,
          msg: "Error al registrar usuario",
        });
      } else {
        const token = getToken({ username: body.username });
        await newUser.setProfileImage(filename);
        const userStored = await newUser.save();
        res.status(200).send({
          success: true,
          msg: "Usuario Registrado!",
          token,
          newUser: userStored,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(409).send({
        success: false,
        msg: "Error al registrar",
        error: error,
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
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        const result = await user.comparePassword(password);
        if (result) {
          let token = getToken({ username: user.username });
          return res.send({
            success: true,
            msg: "Inicio de sesión exitoso!",
            token,
          });
        }
        return res.status(400).send({
          success: false,
          msg: "Contraseña incorrecta!",
        });
      } else {
        res.status(404).send({
          success: false,
          msg: "Usuario no registrado!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: true,
        error,
      });
    }
  },

  info: async (req, res) => {
    const authorization = req.get("authorization");
    let token = null;
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      token = authorization.substring(7);
    }
    const decodedToken = getTokenData(token);
    if (decodedToken) {
      const user = await User.findOne({ username: decodedToken.data.username });
      if (user) {
        res.status(200).send({ success: true, user });
      } else {
        res.status(404).send({ succes: false, auth: "no auth, no user" });
      }
    } else {
      res.status(400).send({ succes: false, auth: "no auth" });
    }
  },
};

module.exports = usersController;
