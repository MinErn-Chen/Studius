const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const authorisation = require("../middleware/authorisation");
const validInfo = require("../middleware/validInfo");

router.put("/", [authorisation, validInfo], async (req, res) => {
  try {
    const { type, firstname, lastname, email, password } = req.body;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const updateAttributes = await pool.query(
      "UPDATE users SET user_type = $1, user_firstname = $2, user_lastname = $3, user_email = $4, user_password = $5 where user_id = $6 returning *",
      [type, firstname, lastname, email, bcryptPassword, req.user]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("This attribute is not yours");
    }

    res.json("Attribute was updated");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

router.get("/", authorisation, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_firstname, user_lastname, user_email FROM users WHERE user_id = $1",
      [req.user]
    );

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
