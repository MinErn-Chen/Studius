const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.header("token");

    if (token === undefined) {
      return res.status(403).json("Not authorized");
    }

    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not authorized");
  }
};
