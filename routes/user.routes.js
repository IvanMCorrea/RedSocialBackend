const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const upload = require("../middlewares/upload.middleware");

router.post("/login", usersController.login);
router.post(
  "/register",
  upload.single("profileImage"),
  usersController.register
);
router.get("/users", usersController.getUsers);
router.get("/info", usersController.info);

module.exports = router;
