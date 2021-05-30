--initialize database
CREATE DATABASE studius;

--load extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--create user table
CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type VARCHAR(7) NOT NULL,
  user_firstname VARCHAR(255) NOT NULL,
  user_lastname VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL
);

--insert sample user
INSERT INTO users (user_type, user_firstName, user_lastName, user_email, user_password) VALUES ('Student', 'John', 'Doe', 'johndoe@email.com', 'password');