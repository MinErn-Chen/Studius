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
  engaged VARCHAR[][], --[subject, student_id, student_name, forumid]
  rate VARCHAR(255),
  times VARCHAR(255)[],
  education VARCHAR(255),
  description VARCHAR,
  ispublic boolean
) INHERITS (users);

--create student table
CREATE TABLE students(
  subjects VARCHAR(255)[][], --array size and depth ignored during run-time
  engaged VARCHAR[][], --[subject, tutor_id, tutor_name, forumid]
  rate VARCHAR(255),
  times VARCHAR(255)[],
  description VARCHAR,
  ispublic boolean
) INHERITS (users);

--create forum
CREATE TABLE forums(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject VARCHAR(255) NOT NULL,
  tutor_id uuid NOT NULL,
  student_id uuid NOT NULL
);

--create credentials table
CREATE TABLE credentials(
    id uuid PRIMARY KEY,
    filename VARCHAR UNIQUE NOT NULL,
    filepath VARCHAR NOT NULL,
    mimetype VARCHAR NOT NULL,
    size BIGINT NOT NULL
);

CREATE TABLE announcements(
    forumid uuid REFERENCES forums(id), 
    title TEXT, 
    body TEXT, 
    date VARCHAR(500)
);

CREATE TABLE qna(
    forumid uuid REFERENCES forums(id),  
    question TEXT,
    answer TEXT, 
    dateAsked VARCHAR(500), 
    dateResponded VARCHAR(500)
);

-- renamed to match credentials table for consistency 
CREATE TABLE assignments(
    forumid uuid REFERENCES forums(id),
    datePosted VARCHAR(500),
    filename VARCHAR UNIQUE NOT NULL,
    filepath VARCHAR NOT NULL,
    mimetype VARCHAR NOT NULL,
    size BIGINT NOT NULL,
    file BYTEA
);

CREATE TABLE files(
    forumid uuid REFERENCES forums(id),  
    datePosted VARCHAR(500), 
    filename VARCHAR,
    filepath VARCHAR,
    mimetype VARCHAR,
    size BIGINT 
);

--insert sample user
INSERT INTO students (type, firstName, lastName, email, password, subjects) VALUES ('Student', 'John', 'Doe', 'johndoe@email.com', 'password', '{{1, 2, 3}}');
