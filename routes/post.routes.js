const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const uploadPost = require("../middlewares/uploadPost.middleware");

router.get("/:page", postsController.getPosts);
router.get("/userPosts/:id", postsController.getPostsById);
router.post("/create", uploadPost.single("image"), postsController.create);
router.put("/updateLikes", postsController.updateLikes)

module.exports = router;
