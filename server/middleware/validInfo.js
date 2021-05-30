module.exports = (req, res, next) => {
  const { type, firstname, lastname, email, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

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
