const router = require("express").Router();
const authorisation = require("../middleware/authorisation");
const multer = require("multer");
const path = require("path");
const pool = require("../db");

const tutorCredentialsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/tutor_credentials");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const tutorCredentialsUpload = multer({ storage: tutorCredentialsStorage });

router.put(
  "/tutor_credentials",
  [tutorCredentialsUpload.single("tutor_credential"), authorisation],
  async (req, res) => {
    try {
      const { filename, mimetype, size, path } = req.file;
      console.log(req.file);

      const filePresence = await pool.query(
        "SELECT * FROM tutor_credentials WHERE id = $1",
        [req.user]
      );

      if (filePresence.rows.length === 0) {
        await pool.query(
          "INSERT INTO tutor_credentials VALUES ($1, $2, $3, $4, $5)",
          [req.user, req.user, path, mimetype, size]
        );
      } else {
        await pool.query(
          "UPDATE tutor_credentials SET filename = $1, filepath = $2, mimetype = $3, size = $4",
          [req.user, path, mimetype, size]
        );
      }

      res.json("Upload successful!");
    } catch (error) {
      res.status(500).json("Server error");
    }
  }
);

router.get("/tutor_credentials", authorisation, async (req, res) => {
  try {
    const fileRetrieve = await pool.query(
      "SELECT * FROM tutor_credentials WHERE id = $1",
      [req.user]
    );

    console.log(fileRetrieve.rows);

    if (fileRetrieve.rows.length === 0) {
      return res.status(404).json("No file found");
    }

    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, fileRetrieve.rows[0].filepath);

    res.type(fileRetrieve.rows[0].mimetype).sendFile(fullfilepath);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
