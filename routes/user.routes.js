const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const upload = require("../middlewares/upload.middleware");

router.post("/login", usersController.login);
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  usersController.register
);
router.post("/seedNetwork", usersController.seedNetwork);

router.get("/users/:page", usersController.getNetwork);
router.get("/info", usersController.info);
router.get("/profileInfo/:username", usersController.getProfileInfo);

module.exports = router;
