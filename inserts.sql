-- Sebastian Almeida
-- 9/1/2021
-- Use This If In Ubuntu To Access The Database
  -- use ContactTracing;
-- Inserts Into User Table
insert into Users (FirstName,LastName,Login,Password) VALUES ('Sebastian','Almeida','Salmeida','DondaChant');
insert into Users (FirstName,LastName,Login,Password) VALUES ('Junya','Wantanabe','Junyya','KanyeCream');
insert into Users (FirstName,LastName,Login,Password) VALUES ('Lucas','Smith','Luke','BigBeetle');
-- Inserts Into Contacts Table
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Aubrey','Graham', '7809876233', 'certifiedloverboi@ovo.com', 1);
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Da','Baby', '7809876233', 'dababy11@hotmail.com', 1);
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Pusha','Tee', '7809871133', 'hideyokids@goodmusic.com', 1);

insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Henry','Doof', '7809876233', 'henrydoof@hotmail.com', 2);
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Aubrey','Graham', '7809876233', 'certifiedloverboi@ovo.com', 2);
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Kanye','West', '9809556233', 'IMadeThatBFamous@goodmusic.com', 2);

insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Taylor','Swift', '7809876233', 'offthegrid@aol.com', 3);
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Aubrey','Graham', '7809876233', 'certifiedloverboi@ovo.com', 3);
insert into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES ('Soulja','Boy', '7809111111', 'soulja@gmail.com', 3);
