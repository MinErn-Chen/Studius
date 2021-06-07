// check validity of input user credentials
const validInfo = (req, res, next) => {
  // destructure the req.body (type, firstname, lastname, email, password)
  const { type, firstname, lastname, email, password } = req.body;

  // determine whether the email is valid via regex
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  // confirm validity of input user credentials and handle errors accordingly
  if (req.path === "/register") {
    if (![type, firstname, lastname, email, password].every(Boolean)) {
      return res.status(401).json("Missing credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid email address");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid email address");
    }
  }

  next();
};

module.exports = validInfo;
