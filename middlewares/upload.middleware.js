const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `storage/${req.body.username}`;
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, path);
    });
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    const ext = file.mimetype.split("/").pop();
    cb(null, `${file.fieldname}.${ext}`);
  },
});
const upload = multer({ storage });

module.exports = upload;
