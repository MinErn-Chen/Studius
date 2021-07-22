const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "raspberry",
  host: "localhost",
  port: 5432,
  database: "studius",
});

module.exports = pool;
