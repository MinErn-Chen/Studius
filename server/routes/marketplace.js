const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

// get user profiles
router.get("/", authorisation, async (req, res) => {
  try {
    // retrieve user profiles from database
    const user =
      req.user.type === "Tutor"
        ? await pool.query(
            "SELECT id, firstname, lastname, subjects, rate, times, description FROM students WHERE ispublic = TRUE"
          )
        : req.user.type === "Student"
        ? await pool.query(
            "SELECT id, firstname, lastname, subjects, rate, times, education, description FROM tutors WHERE ispublic = TRUE"
          )
        : null;

    // return user profiles
    res.json(user.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
