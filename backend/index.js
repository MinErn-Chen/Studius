const { response } = require('express');
const express = require('express')
const app = express()
const port = 3001

const query_model = require('./query_model')

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// retrieves user from table 
app.get('/', (req, res) => {
  query_model.getUser()
  .then(response => {
    res.status(200).send(response) // status(200) == success
  })
  .catch(error => {
    res.status(500).send(error)   // status(200) == fail
  })
})

// inserts user into table 
app.post('/User', (req, res) => {
  query_model.createUser(req.body)
  .then(response => {
    res.status(200).send(response) 
  })
  .catch(error => {
    res.status(500).send(error)
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})