// check validity of input user profile
const validProfile = (req, res, next) => {
  // destructure the req.body (type, firstname, lastname, email, password)
  const { subjects, rate, times, education, description } = req.body;

  // confirm validity of input user profile and handle errors accordingly
  if (req.user.type === "Tutor") {
    if (
      ![
        subjects.reduce((acc, cur) => {
          return acc && cur;
        }, subjects.length !== 0),
        rate,
        times[0],
        times[1],
        education,
        description,
      ].every(Boolean)
    ) {
      return res.status(400).json("Missing information");
    }
  } else if (req.user.type === "Student") {
    if (![subjects, rate, times[0], times[1], description].every(Boolean)) {
      return res.status(501).json("Missing information");
    }
  }

  next();
};

module.exports = validProfile;
