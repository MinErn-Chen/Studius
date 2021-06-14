const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const validProfile = require("../middleware/validProfile");

// get user information
router.get("/", authorisation, async (req, res) => {
  try {
    const user =
      req.user.type === "Tutor"
        ? await pool.query(
            "SELECT subjects, rate, times, education, description, ispublic FROM tutors WHERE id = $1",
            [req.user.id]
          )
        : req.user.type === "Student"
        ? await pool.query(
            "SELECT subjects, rate, times, description FROM students WHERE id = $1",
            [req.user.id]
          )
        : null;

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// update user information
router.put("/", [authorisation, validProfile], async (req, res) => {
  try {
    const { subjects, rate, times, education, description, ispublic } =
      req.body;

    if (req.user.type === "Tutor") {
      await pool.query(
        "UPDATE tutors SET subjects = $1, rate = $2, times = $3, education = $4, description = $5, ispublic = $6 WHERE id = $7",
        [subjects, rate, times, education, description, ispublic, req.user.id]
      );
    } else if (req.user.type === "Student") {
      await pool.query(
        "UPDATE students SET subjects = $1, rate = $2, times = $3, description = $4, ispublic = $5 WHERE id = $6",
        [subjects, rate, times, description, ispublic, req.user.id]
      );
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
