/* const bcrypt = require("bcrypt"); */
const { User } = require("../models");
const { getToken, getTokenData } = require("../config/jwt.config");

const usersController = {
  register: async (req, res) => {
    try {
      const { body } = req;
      const avatar = req.files["avatar"] ? req.files["avatar"][0] : false;
      const coverImage = req.files["image"] ? req.files["image"][0] : false;
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
        const token = getToken({
          username: body.username,
          password: body.password,
        });
        await newUser.setProfileImage(avatar, body.username);
        coverImage && (await newUser.setCoverImage(coverImage, body.username));
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

  getNetwork: async (req, res) => {
    try {
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
      const page = req.params.page;
      const keyword = req.query.keyword || null;
      const filter = {
        username: {
          $regex: keyword,
          $options: "i",
        },
      };
      const pageNumber = parseInt(page);
      const limit = 20;
      const skip = (pageNumber - 1) * limit;
      const totalDocuments = await User.count();
      const totalPages = Math.ceil(totalDocuments / limit);
      const data = await User.find({
        $and: [{ _id: { $ne: user._id } }, keyword ? filter : {}],
      })
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        success: true,
        data,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
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
    try {
      const authorization = req.get("authorization");
      let token = null;
      if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.substring(7);
      }
      const decodedToken = getTokenData(token);
      if (decodedToken) {
        const user = await User.findOne({
          username: decodedToken.data.username,
        });
        if (user) {
          res.status(200).send({ success: true, user });
        } else {
          res.status(404).send({ succes: false, auth: "no auth, no user" });
        }
      } else {
        res.status(400).send({ succes: false, auth: "no auth" });
      }
    } catch (error) {
      res.status(400).send({ succes: false, auth: "no token" });
    }
  },

  getProfileInfo: async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({
        username: username,
      });
      if (user) {
        res.status(200).send({ success: true, user });
      } else {
        res.status(404).send({ succes: false, auth: "no auth, no user" });
      }
    } catch (error) {
      res.status(400).send({ succes: false, auth: "no token" });
    }
  },

  seedNetwork: async (req, res) => {
    try {
      const authorization = req.get("authorization");
      let token = null;
      if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.substring(7);
      }
      const decodedToken = getTokenData(token);
      if (decodedToken) {
        for (let index = 1; index < 42; index++) {
          let charUrl = `https://rickandmortyapi.com/api/character?page=${index}`;
          try {
            let datos = await fetch(charUrl);
            let response = await datos.json();
            let avatar = null;
            await Promise.all(
              response.results.forEach((element) => {
                const formData = new FormData();
                let name = element.name.replace(/ /g, "");
                let pass = name;
                let address =
                  element.location && element.location.name
                    ? element.location.name
                    : "unknown";
                let email = `${name}Account@mail.com`;
                avatar = element.image ? element.image : null;
                let account = {
                  username: name,
                  password: pass,
                  email: email,
                  address: address,
                  ...element,
                };
                for (const key in account) {
                  if (account.hasOwnProperty(key)) {
                    formData.append(key, account[key]);
                  }
                }
                if (avatar)
                  fetch(avatar)
                    .then((response) => response.blob())
                    .then((imageBlob) => {
                      const file = new File([imageBlob], "avatar.jpg", {
                        type: "image/jpeg",
                      });
                      formData.append("avatar", file);
                    })
                    .then(async () => {
                      const res = await register(formData);
                      console.log(res);
                    });
              })
            );
          } catch (error) {
            console.error(error);
          }
        }
        res.status(200).send({
          success: true,
          msg: "Usuarios Registrados!",
        });
      } else {
        res.status(400).send({ succes: false, auth: "Falta autorización" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({ succes: false, auth: "error en función" });
    }
  },
};

module.exports = usersController;
