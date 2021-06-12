const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const bcrypt = require("bcrypt");

// update first name
router.put("/firstname", authorisation, async (req, res) => {
  try {
    // destructure the req.body (firstname)
    const { firstname } = req.body;

    // update user first name and handle if user or attribute does not exist
    const updateAttributes = await pool.query(
      "UPDATE users SET firstname = $1 where id = $2 RETURNING *",
      [firstname, req.user.id]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    // return update success
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// update last name
router.put("/lastname", authorisation, async (req, res) => {
  try {
    // destructure the req.body (lastname)
    const { lastname } = req.body;

    // update user last name and handle if user or attribute does not exist
    const updateAttributes = await pool.query(
      "UPDATE users SET lastname = $1 where id = $2 RETURNING *",
      [lastname, req.user.id]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    // return update success
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// update email address
router.put("/email", authorisation, async (req, res) => {
  try {
    // destructure the req.body (email)
    const { email } = req.body;

    // confirm whether input email is valid and handle accordingly
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (!validEmail(email)) {
      return res.status(401).json("Invalid email address");
    }

    // update user email address and handle if user or attribute does not exist
    const updateAttributes = await pool.query(
      "UPDATE users SET email = $1 where id = $2 RETURNING *",
      [email, req.user.id]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    // return update success
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// update password
router.put("/password", authorisation, async (req, res) => {
  try {
    // destructure req.body (password)
    const { password } = req.body;

    // bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // update user password and handle if user or attribute does not exist
    const updateAttributes = await pool.query(
      "UPDATE users SET password = $1 where id = $2 RETURNING *",
      [bcryptPassword, req.user.id]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    // return update success
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// delete user
router.delete("/", authorisation, async (req, res) => {
  try {
    // delete user and handle if user does not exist
    const updateAttributes = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [req.user.id]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Delete failed!");
    }

    // return update success
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// display user credentials
router.get("/", authorisation, async (req, res) => {
  try {
    // retrieve user information from database
    const user = await pool.query(
      "SELECT firstname, lastname, email FROM users WHERE id = $1",
      [req.user.id]
    );

    // return user credentials
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
