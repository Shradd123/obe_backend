-- =========================
-- DATABASE
-- =========================
CREATE DATABASE obe;
USE obe;

-- =========================
-- ADMIN
-- =========================
CREATE TABLE admin (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  password TEXT
);

-- =========================
-- DEPARTMENT
-- =========================
CREATE TABLE dept (
  dept_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  code VARCHAR(10),
  admin_id INT,
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE CASCADE
);

-- =========================
-- PROGRAM
-- =========================
CREATE TABLE program (
  program_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  code VARCHAR(100),
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id) ON DELETE CASCADE
);

-- =========================
-- VISION & MISSION
-- =========================
CREATE TABLE vision_dept (
  vision_id INT PRIMARY KEY AUTO_INCREMENT,
  dept_id INT UNIQUE,
  statement VARCHAR(1000),
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id) ON DELETE CASCADE
);

CREATE TABLE mission_dept (
  mission_id INT PRIMARY KEY AUTO_INCREMENT,
  dept_id INT,
  statement VARCHAR(1000),
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id) ON DELETE CASCADE
);

-- =========================
-- PEO / PSO
-- =========================
CREATE TABLE peo (
  peo_id INT PRIMARY KEY AUTO_INCREMENT,
  dept_id INT,
  title VARCHAR(200),
  description VARCHAR(1000),
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id) ON DELETE CASCADE
);

CREATE TABLE pso (
  pso_id INT PRIMARY KEY AUTO_INCREMENT,
  dept_id INT,
  title VARCHAR(200),
  description VARCHAR(1000),
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id) ON DELETE CASCADE
);

-- =========================
-- FACULTY
-- =========================
CREATE TABLE faculty (
  faculty_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  password VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  dept_id INT,
  role VARCHAR(50),
  FOREIGN KEY (dept_id) REFERENCES dept(dept_id) ON DELETE CASCADE
);

-- =========================
-- COURSE & COURSE TYPE
-- =========================
CREATE TABLE course_type (
  course_type_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE course (
  course_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  credits INT NOT NULL,
  code VARCHAR(10) NOT NULL,
  nba VARCHAR(10),
  course_type_id INT,
  FOREIGN KEY (course_type_id) REFERENCES course_type(course_type_id) ON DELETE SET NULL
);

-- =========================
-- SCHEMA & SCHEMA_COURSE
-- =========================
CREATE TABLE schema_table (
  schema_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  program_id INT NOT NULL,
  FOREIGN KEY (program_id) REFERENCES program(program_id) ON DELETE CASCADE
);

CREATE TABLE schema_course (
  schema_course_id INT PRIMARY KEY AUTO_INCREMENT,
  schema_id INT NOT NULL,
  course_id INT NOT NULL,
  sem INT NOT NULL,
  FOREIGN KEY (schema_id) REFERENCES schema_table(schema_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
  UNIQUE (schema_id, course_id)
);

-- =========================
-- BATCH & SEM
-- =========================
CREATE TABLE batch (
  batch_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  program_id INT NOT NULL,
  schema_id INT,
  FOREIGN KEY (program_id) REFERENCES program(program_id) ON DELETE CASCADE,
  FOREIGN KEY (schema_id) REFERENCES schema_table(schema_id) ON DELETE SET NULL
);

CREATE TABLE sem (
  sem_id INT PRIMARY KEY AUTO_INCREMENT,
  sem INT NOT NULL
);


CREATE TABLE batchsem (
  batch_sem_id INT PRIMARY KEY AUTO_INCREMENT,
  batch_id INT NOT NULL,
  sem_id INT NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES batch(batch_id) ON DELETE CASCADE,
  FOREIGN KEY (sem_id) REFERENCES sem(sem_id) ON DELETE CASCADE,
  UNIQUE (batch_id, sem_id)
);
-- =========================
-- SECTION & STUDENT
-- =========================
CREATE TABLE section (
  section_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  program_id INT NOT NULL,
  batch_id INT NOT NULL,
  FOREIGN KEY (program_id) REFERENCES program(program_id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batch(batch_id) ON DELETE CASCADE
);

CREATE TABLE student (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  section_id INT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  usn VARCHAR(20),
  FOREIGN KEY (section_id) REFERENCES section(section_id) ON DELETE CASCADE
);

-- =========================
-- COURSE OFFERING & TEACHING ASSIGNMENT
-- =========================
CREATE TABLE course_offering (
  offering_id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  sem_id INT NOT NULL,
  batch_id INT NOT NULL,
  FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batch(batch_id) ON DELETE CASCADE,
  FOREIGN KEY (sem_id) REFERENCES sem(sem_id) ON DELETE CASCADE,
  UNIQUE (course_id, sem_id, batch_id)
);

CREATE TABLE course_teaching_assignment (
  assignment_id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  offering_id INT NOT NULL,
  section_id INT NOT NULL,
  role VARCHAR(20) NOT NULL, -- e.g., instructor, coordinator
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
  FOREIGN KEY (offering_id) REFERENCES course_offering(offering_id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES section(section_id) ON DELETE CASCADE
);

SELECT * FROM SEM;
insert into sem values 1;
INSERT INTO sem (sem) 
VALUES 
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8);


