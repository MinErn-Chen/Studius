const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// default port
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard routes
app.use("/dashboard", require("./routes/dashboard"));

// profile routes
app.use("/profile", require("./routes/profile"));

// file routes
app.use("/files", require("./routes/fileUpload"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
