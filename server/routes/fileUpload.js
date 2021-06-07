const router = require("express").Router();
const authorisation = require("../middleware/authorisation");
const multer = require("multer");
const path = require("path");
const pool = require("../db");

// initialise file storage destination
const tutorCredentialsStorage = multer.diskStorage({
  // files to be stored in files/tutor_credentials
  destination: (req, file, cb) => {
    cb(null, "files/tutor_credentials");
  },
  // files to be stored as pdf with name of user id
  filename: (req, file, cb) => {
    cb(null, `${req.user}.pdf`);
  },
});

// initialise multer upload settings
const tutorCredentialsUpload = multer({
  // storage destination
  storage: tutorCredentialsStorage,
  // filter non-pdf files
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      req.fileValidationError = "File type must be PDF!";
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

// upload tutor credentials
router.put(
  "/tutor_credentials",
  [authorisation, tutorCredentialsUpload.single("tutor_credential")],
  async (req, res) => {
    try {
      // check if file type is correct
      if (req.fileValidationError) {
        return res.json(req.fileValidationError);
      }

      // destructure the req.file (mimtype, size, path)
      const { mimetype, size, path } = req.file;

      // determine whether file already exists and insert/update accordingly
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
          "UPDATE tutor_credentials SET filename = $1, filepath = $2, mimetype = $3, size = $4 WHERE id = $5",
          [req.user, path, mimetype, size, req.user]
        );
      }

      res.json("Upload successful!");
    } catch (error) {
      res.status(500).json("Server error");
    }
  }
);

// get tutor credentials
router.get("/tutor_credentials", authorisation, async (req, res) => {
  try {
    // retrieve tutor credentials tied to user id and handle error accordingly
    const fileRetrieve = await pool.query(
      "SELECT * FROM tutor_credentials WHERE id = $1",
      [req.user]
    );

    if (fileRetrieve.rows.length === 0) {
      return res.status(404).json("No file found");
    }

    // return the file stored at the location specified in the database
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, fileRetrieve.rows[0].filepath);

    res.type(fileRetrieve.rows[0].mimetype).sendFile(fullfilepath);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
