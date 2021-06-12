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

// main route
app.use("/main", require("./routes/main"));

// marketplace route
app.use("/marketplace", require("./routes/marketplace"));

// profile route
app.use("/profile", require("./routes/profile"));

// account route
app.use("/account", require("./routes/account"));

// file route
app.use("/files", require("./routes/fileUpload"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
