const jwt = require("jsonwebtoken");
require("dotenv").config();

// check if user is authorised to perform an action
const authorisation = (req, res, next) => {
  try {
    // retrieve the token from the request header
    const token = req.header("token");

    // return an error if token is not found
    if (token === undefined) {
      return res.status(403).json("Not authorized");
    }

    // verify the integrity of the token
    const verify = jwt.verify(token, process.env.jwtSecret);

    // initialise the req.user with the user id from the decrypted token
    req.user = verify.user;

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not authorized");
  }
};

module.exports = authorisation;
