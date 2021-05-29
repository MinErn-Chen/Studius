# Studius

Studius — a portmanteau of "study" and "us" — is a web application that aims to streamline the matching process between students and tutors online. Currently the project employs a number of technologies including PostgreSQL, Express.js, React, and Node.js.

## Setup guide

The following steps detail how to setup the development environment for the web application.

### Installing dependencies

Clone this repository,

    $ git clone https://github.com/MinErn-Chen/Studius.git
    $ cd studius

and install the necessary dependencies for both server and client,

    $ cd server
    $ yarn install
    $ cd ../client
    $ yarn install

### Creating database

Log in to PostgreSQL locally and run all commands in `server/database.sql`, sequentially. Try out the sample user input command to confirm creation of the database and users table.

### Establishing connection from server to database

Edit the user credentials in `server/db.js` to match that of the local PostgreSQL account. Host, port and database should most likely be kept the same.

### Starting server and client

Run `yarn start` in both `/server` and `/client` to boot up server and client (duh). Confirm connection to client via `http://localhost:3000/` in a modern web browser.

## Testing

To be updated :O
