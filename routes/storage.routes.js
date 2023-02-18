const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:username/:file", async (req, res) => {
  try {
    const { username, file } = req.params;
    console.log("username ", username);
    console.log("file ", file);
    res.download(path.join(__dirname, "..", "storage", username, file));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
