const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const upload = require("../middlewares/upload.middleware");

router.get("/", postsController.getPosts);
router.post("/create", upload.single("image"), postsController.create);

module.exports = router;
