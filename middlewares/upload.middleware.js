const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = req.body.username
      ? `storage/users/${req.body.username}`
      : `storage/posts`;
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, path);
    });
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/").pop();
    cb(null, `${file.fieldname}${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

module.exports = upload;
