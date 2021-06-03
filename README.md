This project is the following of a tutorial by youtuber Techedemic.  It is a basic tutorial that covers how to create a basic MariaDB database with NodeJS and ExpressJS.  The link for the tutorial can be found here:

https://www.youtube.com/watch?v=krTbf0O-BCo

While we did use Postman to test basic Get/Post requests on our final version,curl can be used asl well.  Techedemic also makes use of the Dbeaver GUI, but I opted to use the MariaDB CLI instead.  He also goes through the trouble of going over the basics of Git, but I opted not to do so at this time in order to focus on the use of MariaDB with NodeJS.  There is also the introduction to our first used hashing function, bcrypt, as well as a package called dotenv that loads environment variables from a .env file to be utilized in our main server.js file.

You will obviously need to initialize the project:

npm init

And install the necessary packages:

npm install express dotenv mariadb bcrypt
npm install -g nodemon

In order to utilize a starting point in MariaDB, utilize the following commands:

Firstly , we will need to add a user to MariaDB for this tutorial:

sudo mariadb;
USE mysql;
SELECT User, Host, plugin FROM mysql.user; (will show all users)
CREATE USER 'newuser' @ 'localhost' IDENTIFIED by 'password'; (yes, we created a user called demo_user with a password of 'password')
GRANT ALL PRIVILEGES * . * TO 'user'@localhost; (note that in production this would be a terrible idea, as we have granted all privileges to a demo_user...)

To create the database, simply input the following command:

CREATE DATABASE demo_user;

To create the table, more complicated, input:

CREATE TABLE user (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));

You can also see a script in create_table.sql (note that we do not as of writing this know how to use .sql files in MariaDB, which we should explore in the near future).

To create your first row of data, input:

INSERT INTO user (email, password) VALUES ('test_email', 'ourfirstpassword'); (we do this again with a test_email2, and secondpassword, etc.)

And then check to see if it is in our table, by typing:

SELECT * FROM user;

The above SQL code will get us up and running with a very basic MariaDB database with a simple two row table.

After this, techedemic creates a simple express server and establishes routes before connecting the API to MariaDB.  This is done through the ./helpers/databse.js file.  From there references to the pools of data are created using the NodeJS's process.env object and these are passed to mariaDB module's createPool method.  Note that these values are establisehed in .env-local thanks to the dotenv module.  This could, as techedemic points out, be hard coded into the database.js file, but it is not a good practice.

The databse.js file then creates a connection to the pool (the database) and exports that connection to be used in our user.js file, which itself is passed to the server.js file that when spun up, is now able to create a connection to the MariaDB DATABASE demo_user and access the user TABLE.

(Note that in .env-local file, the demarcations are the \n line breaks, not any ',' commas)

How to use:

Once downloaded, please run npm init to download all packages available in the package.json file.

Once that's done, make sure you have established a MariaDB DATABASE named demo_user, password: password, and have created a TABLE called user.

Create some dummy data and then spin up your server by running:

npm run dev

After the server is up and running, open your browser, and go to localhost:3001/user/id: where id: is the id number of the queried data.  You should receive your user data in JSON format.

If you wish to create a new user, or query specific information, you'll need to use Postman.

Enjoy! And thanks for reading.

Summary:

This tutorial was taking a step back from utilizing KnexJS and ObjectionJS with PostgreSQL to try and see how a couple simple node modules would allow the utilization of a NodeJS backend API to interact with a MariaDB database.  I am very much enjoying playing around with basic databases, and while this tutorial was very limited in scope, it was a good introduction to the basics of how a database can be fed raw SQL strings and utilizing npm's mariadb module, can read, write, and (although it wasn't implemented) delete data within our tables.

I can see how utilizing this in conjunction with a front end website or app could be useful for the basic logging of user information such as passwords and other information and creates a basic method for querying and updating the database.  Hopefully we can get to the front end soon, although the backend seems to be where really all the important logging happens.  The front end is just so the user is able to query the data in a pleasing, human readable formatted way.

We'll be moving perhaps onto Sequelize next to get used to dealing with databases more.
