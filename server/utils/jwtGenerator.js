const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (user_id) => {
  // intialise the token payload
  const payload = {
    user: user_id,
  };

  // encrypt the token signature with the payload, secret, and expiration time
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
};
