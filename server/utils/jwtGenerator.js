const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (id) => {
  // intialise the token payload
  const payload = {
    user: id,
  };

  // encrypt the token signature with the payload, secret, and expiration time
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
};
