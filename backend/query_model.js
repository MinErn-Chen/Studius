// this file will be used to query into the connected psql db

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "my_user",
  host: "localhost",
  database: "db_temp",
  password: "root",
  port: 5432,
});

const getUser = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM user", (error, results) => {
      // figure out how to extract specific users instead of e whole table ltr
      if (error) {
        // no such table || no such user
        reject(error);
      }
      resolve(results.rows);
    });
  });
};

const createUser = (body) => {
  return new Promise(function(resolve, reject) {
    const {username, email, password} = body; // kiv the rest of the attribbutes that goes into the db 
    pool.query('INSERT INTO user (username, email, password) VALUES ($1, $2) RETURNING *', [username, email, password], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(`A new user has been instantiated: ${results.rows[0]}`);
    })
  })
}

// kiv future feature of deleteUser 
 
module.exports = {
  getUser,
  createUser,
}
