const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "raspberry",
  host: "localhost",
  port: 5432,
  database: "studius",
});

// const pool = new Pool({
//   user: "kdniquunuukruq",
//   password: "7886f6bc28b7b2420d361c7b34454e339e6e9a90cc14b29ad45f085a950c5aa8",
//   host: "ec2-3-233-7-12.compute-1.amazonaws.com",
//   port: 5432,
//   database: "d7dioab7opn3ti",
//   ssl: { rejectUnauthorized: false },
// });

module.exports = pool;
