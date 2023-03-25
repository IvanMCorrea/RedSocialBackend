const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `storage/posts`;
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, path);
    });
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/").pop();
    const date = Date.now();
    cb(null, `${file.fieldname}${date}.${ext}`);
  },
});
const uploadPost = multer({ storage });

module.exports = uploadPost;
