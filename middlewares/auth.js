const { User } = require("../models");
const { getTokenData } = require("../config/jwt.config");

const auth = async (req, res, next) => {
  const authorization = req.get("authorization");
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  const decodedToken = getTokenData(token);
  if (decodedToken) {
    const user = await User.findOne({ username: decodedToken.data.username });
    if (user) {
      next();
    } else {
      res.send({ succes: false, auth: "no user" });
    }
  } else {
    res.send({ succes: false, auth: "no auth" });
  }
};

module.exports = {
  auth,
};
