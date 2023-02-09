const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
/* const { adminAuth } = require("../middleware/auth"); */

router.get("/login", usersController.login);
router.post("/create", usersController.createUser);
router.get("/users", usersController.getUsers);

module.exports = router;
