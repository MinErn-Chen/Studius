const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorisation = require("../middleware/authorisation");

// register
router.post("/register", validInfo, async (req, res) => {
  try {
    // destructure the req.body (type, name, email, password)
    const { type, name, email, password } = req.body;

    // check if user email exists then handle error accordingly
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exists");
    }

    // bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter the new user inside the user database
    const newUser = await pool.query(
      "INSERT INTO users (user_type, user_name, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *",
      [type, name, email, bcryptPassword]
    );

    // generate the jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// login
router.post("/login", validInfo, async (req, res) => {
  try {
    // destructure the req.body (email, password)
    const { email, password } = req.body;

    // check if user email doesn't exist then handle error accordingly
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or password is incorrect");
    }

    // check if password matches with that in the user database
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Email or password is incorrect");
    }

    // give the jwt token
    const token = jwtGenerator(user.rows[0].user_id);

    return res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error: " + error.message);
  }
});

router.post("/verify", authorisation, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error: " + error.message);
  }
});

module.exports = router;
