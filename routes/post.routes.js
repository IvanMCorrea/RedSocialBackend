const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const uploadPost = require("../middlewares/uploadPost.middleware");

router.get("/", postsController.getPosts);
router.post("/create", uploadPost.single("image"), postsController.create);
router.get("/:id", postsController.getPostsById);
module.exports = router;
