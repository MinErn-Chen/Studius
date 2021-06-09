const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

// get user information
router.get("/", authorisation, async (req, res) => {
  try {
    // retrieve user information from database
    const user = await pool.query(
      "SELECT type, firstname, lastname FROM users WHERE id = $1",
      [req.user]
    );

    // return the user information
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
