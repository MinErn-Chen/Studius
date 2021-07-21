const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

router.get("/", authorisation, async (req, res) => {
  try {
    // retrieve user information from database
    const user = await pool.query(
      "SELECT type, firstname, lastname FROM users WHERE id = $1",
      [req.user.id]
    );

    // return the user informations
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// get engaged
router.get("/engaged", authorisation, async (req, res) => {
  try {
    let engaged; 
    if (req.user.type === "Tutor") {
      engaged = await pool.query(
        "SELECT engaged FROM tutors WHERE id = $1",
        [req.user.id]
      );
    } else {
      engaged = await pool.query(
        "SELECT engaged FROM students WHERE id = $1",
        [req.user.id]
      );
    }
    
    res.json(engaged.rows[0]); 
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});


module.exports = router;
