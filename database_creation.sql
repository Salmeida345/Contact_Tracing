-- Sebastian Almeida
-- 9/1/2021
-- Password is same as c0P!4331C
-- Database Creation
create database ContactTracing;
use ContactTracing;
SELECT * FROM Users;
SELECT * FROM Contacts;
-- Table Creation
-- User Table
CREATE TABLE `ContactTracing`.`Users` (
  `UserID` INT NOT NULL AUTO_INCREMENT ,
  `DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
  `LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
  `Login` VARCHAR(50) NOT NULL DEFAULT '' ,
  `Password` VARCHAR(50) NOT NULL DEFAULT '' ,
  PRIMARY KEY (`UserID`)) ENGINE = InnoDB;
-- Contacts Table
CREATE TABLE `ContactTracing`.`Contacts` (
  `ContactID` INT NOT NULL AUTO_INCREMENT ,
  `DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
  `LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
  `PhoneNumber` VARCHAR(50) NOT NULL DEFAULT '' ,
  `EmailAddress` VARCHAR(50) NOT NULL DEFAULT '' ,
  `UserID` INT NOT NULL DEFAULT '0' ,
  PRIMARY KEY (`ContactID`),
  FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`)) ENGINE = InnoDB;
-- Code To Add User
create user 'ChiefHenny' identified by 'WeLoveCOP4331';
grant all privileges on ContactTracing.* to 'ChiefHenny'@'%';
