--initialize database
CREATE DATABASE studius;

--load extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--create user table
CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

--create tutor table
CREATE TABLE tutors(
  subjects VARCHAR(255)[], --array size and depth ignored during run-time
  rate VARCHAR(255),
  times VARCHAR(255)[],
  education VARCHAR(255),
  description VARCHAR(255),
  ispublic boolean
) INHERITS (users);

--create student table
CREATE TABLE students(
  subjects VARCHAR(255)[][], --array size and depth ignored during run-time
  rate VARCHAR(255),
  times VARCHAR(255)[],
  description VARCHAR(255),
  ispublic boolean
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
INSERT INTO students (type, firstName, lastName, email, password, subjects) VALUES ('Student', 'John', 'Doe', 'johndoe@email.com', 'password', '{{1, 2, 3}}');