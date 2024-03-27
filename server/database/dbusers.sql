-- IF NOT EXISTS (
--     SELECT name
-- FROM sys.databases
-- WHERE name = 'usersdb'
-- )
-- CREATE DATABASE usersdb;

-- USE usersdb;

-- CREATE TABLE users
-- (
--     id INT IDENTITY(1,1) PRIMARY KEY,
--     username VARCHAR(100) NOT NULL,
--     lastname VARCHAR(100) NOT NULL,
--     email VARCHAR(100) NOT NULL,
--     phone VARCHAR(100),
--     password VARCHAR(100) NOT NULL,
--     gender VARCHAR(100) NOT NULL,
--     created_at DATETIME DEFAULT GETDATE()
-- );

