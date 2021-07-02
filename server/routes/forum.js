const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

router.post("/", authorisation, async (req, res) => {
  try {
    // destructure the req.body (OUID, subject)
    const { OUID, subject } = req.body;

    // insert into forums table
    if (req.user.type === "Tutor") {
      await pool.query(
        "INSERT INTO forums (tutor_id, student_id) VALUES ($1, $2)",
        [req.user.id, OUID]
      );
    } else if (req.user.type === "Student") {
      await pool.query(
        "INSERT INTO forums (tutor_id, student_id) VALUES ($1, $2)",
        [OUID, req.user.id]
      );
    }

    res.json("Tuition successfully engaged!");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
