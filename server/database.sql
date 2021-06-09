--initialize database
CREATE DATABASE studius;

--load extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--create user table
CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

--create tutor table
CREATE TABLE tutors(
  subjects VARCHAR(255)[],
  rate VARCHAR(255),
  times VARCHAR(255),
  education VARCHAR(255),
  description VARCHAR(255)
) INHERITS (users);

--create student table
CREATE TABLE students(
  subjects VARCHAR(255)[][],
  rate VARCHAR(255),
  times VARCHAR(255),
  description VARCHAR(255)
) INHERITS (users);

--create tutor_credentials table
CREATE TABLE tutor_credentials(
    id uuid PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size BIGINT NOT NULL
);

--insert sample user
INSERT INTO students (firstName, lastName, email, password) VALUES ('John', 'Doe', 'johndoe@email.com', 'password');