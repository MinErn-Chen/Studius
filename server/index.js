const express = require("express");
const app = express();
const cors = require("cors");

// default port
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard routes
app.use("/dashboard", require("./routes/dashboard"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
