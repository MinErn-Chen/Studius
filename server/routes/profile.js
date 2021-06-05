const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

router.put("/firstname", authorisation, async (req, res) => {
  try {
    const { firstname } = req.body;

    const updateAttributes = await pool.query(
      "UPDATE users SET user_firstname = $1 where user_id = $2 RETURNING *",
      [firstname, req.user]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

router.put("/lastname", authorisation, async (req, res) => {
  try {
    const { lastname } = req.body;

    const updateAttributes = await pool.query(
      "UPDATE users SET user_lastname = $1 where user_id = $2 RETURNING *",
      [lastname, req.user]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

router.put("/email", authorisation, async (req, res) => {
  try {
    const { email } = req.body;

    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (!validEmail(email)) {
      return res.status(401).json("Invalid email address");
    }

    const updateAttributes = await pool.query(
      "UPDATE users SET user_email = $1 where user_id = $2 RETURNING *",
      [email, req.user]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Update failed!");
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

router.delete("/", authorisation, async (req, res) => {
  try {
    const updateAttributes = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [req.user]
    );

    if (updateAttributes.rows.length === 0) {
      res.json("Delete failed!");
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

router.get("/", authorisation, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_firstname, user_lastname, user_email  FROM users WHERE user_id = $1",
      [req.user]
    );

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
