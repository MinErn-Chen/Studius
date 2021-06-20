const router = require("express").Router();
const authorisation = require("../middleware/authorisation");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db");

// initialise file storage destination
const tutorCredentialsStorage = multer.diskStorage({
  // files to be stored in files/credentials
  destination: (req, file, cb) => {
    cb(null, "files/credentials");
  },
  // files to be stored as pdf with name of user id
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}.pdf`);
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
  "/credentials",
  [authorisation, tutorCredentialsUpload.single("credential")],
  async (req, res) => {
    try {
      // check if file type is correct
      if (req.fileValidationError) {
        return res.json({
          severity: "error",
          message: req.fileValidationError,
        });
      }

      console.log(req.file);

      // destructure the req.file (mimetype, size, path)
      const { mimetype, size, path } = req.file;

      // determine whether file already exists and insert/update accordingly
      const filePresence = await pool.query(
        "SELECT * FROM credentials WHERE id = $1",
        [req.user.id]
      );
      if (filePresence.rows.length === 0) {
        await pool.query(
          "INSERT INTO credentials VALUES ($1, $2, $3, $4, $5)",
          [req.user.id, req.user.id, path, mimetype, size]
        );
      } else {
        await pool.query(
          "UPDATE credentials SET filename = $1, filepath = $2, mimetype = $3, size = $4 WHERE id = $5",
          [req.user.id, path, mimetype, size, req.user.id]
        );
      }

      res.json({ severity: "success", message: "Upload successful!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ severity: "error", message: "Server error" });
    }
  }
);

// get tutor credentials
router.get("/credentials", authorisation, async (req, res) => {
  try {
    // retrieve tutor credentials tied to user id and handle error accordingly
    const fileRetrieve = await pool.query(
      "SELECT * FROM credentials WHERE id = $1",
      [req.user.id]
    );

    if (fileRetrieve.rows.length === 0) {
      return res.status(404).json(false);
    }

    // return the file stored at the location specified in the database
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, fileRetrieve.rows[0].filepath);

    res.type(fileRetrieve.rows[0].mimetype).sendFile(fullfilepath);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

// remove tutor credentials
router.delete("/credentials", authorisation, async (req, res) => {
  try {
    if (req.user.type === "Student") {
      return res.status(403).json("Not authorised");
    }

    const fileDelete = await pool.query(
      "DELETE FROM credentials WHERE id = $1 RETURNING *",
      [req.user.id]
    );

    if (fileDelete.rows.length === 0) {
      return res.status(404).json({
        severity: "error",
        message: "No file to delete!",
      });
    }

    fs.unlink(`./files/credentials/${req.user.id}.pdf`, (error) => {
      if (error) {
        console.error(`Failed to delete credential: ${error}`);
        return res.status(400).json({
          severity: "error",
          message: `Failed to delete credential: ${error}`,
        });
      } else {
        console.log("Successfully deleted credential!");
        return res.json({
          severity: "success",
          message: "Successfully deleted credential!",
        });
      }
    });
  } catch (error) {
    console.error(`Failed to delete credential: ${error}`);
    return res.status(400).json({
      severity: "error",
      message: `Failed to delete credential: ${error}`,
    });
  }
});

module.exports = router;
