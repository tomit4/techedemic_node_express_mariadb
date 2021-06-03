// This file is a demcarcation of concerns.  Located within our routes folder, it is meant to define GET and POST request functions
// that when referenced by our browser, will either display or update our MariaDB demo_user TABLE.
// Note that initially in the tutorial, this file is not connected to our database, that is later done by referencing the datal pool...

const express = require('express');
const pool = require('../helpers/database');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/:id', async function(req, res) {
    try {
        const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?'; // Defines a string to be passed to our MariaDB pool which SELECTS the id, email, password, and created_at data rows from the inputted id field.
        const rows = await pool.query(sqlQuery, req.params.id); // and utilizes mariaDB's query method, which takes the string as its first argument, and the req.params.id value/number is the value passed to the '?' above.
        res.status(200).json(rows); // and displays the result, the rows, in JSON format upon succesful resolution of the requested route.
    } catch (error) {
        res.status(400).send(error.message) // otherwise display the error message.
    }

    // res.status(200).json({id:req.params.id})
});

router.post('/register', async function(req, res) { // a classic POST request where... utilize Postman to use in development.
    try {
        const { email, password } = req.body; // the email and password are destructured from the req.body object. 

        // const salt = await bcrypt.salt(10);
        const encryptedPassword = await bcrypt.hash(password,10); // the password is hashed using bcrypt.. 
        // using Postman we created en email called techedemic@youtube.com with a password of 'thisisthepassword', this will be useful in testing our login function below.

        const sqlQuery = 'INSERT INTO user (email, password) VALUES (?,?)'; // another SQL query string is created whree a new row is INSERTED where email, password columns are defined by provided values (?,?)
        const result = await pool.query(sqlQuery, [email, encryptedPassword]); // and we once again use mariadb's query method to pass it the SQL query string, and the array of our destructured email, and our encrypted password are passed to the (?,?) part of our SQL query string.

        // res.status(200).json({result});
        res.status(200).json({userId: result.insertId}); // and upon success of the POST request, a JSON object is returned with a userId key has the value of the returned mariaDB query results's new ly created id value.
        // Note that if just the result is passed as a parameter here, then the successful INSERT response from MariaDB is displayed, in this case in JSON format. (this will not show the finished table, and the reason we request the ID here is simply to tell us what the autoincremented id key reads).

    } catch (error) {
        res.status(400).send(error.message) // otherwise display the error message.
    }
})

router.post('/login', async function (req, res) {
    try {
        const { id, password } = req.body; // destructure the id and password from the requested body

        const sqlGetUser = 'SELECT password FROM user WHERE id=?'; // similar to our sqlQuery strings above, although this is aptly named due to it being more of a command.
        const rows = await pool.query(sqlGetUser, id); // again, we use mariaDB's query method where we pass the sqlGetUser string as the irst argument, and the destructred id as our second parameter.
        if (rows) { // if mariaDB's query to SELECT the queried ID is successful and returns an existing result (ie the queried id exists in the user TABLE)..
            
            // res.status(200).json(rows[0]);

            const isValid = await bcrypt.compare(password,rows[0].password); // then we await for bcrypt to compare the destructured hashed password to the returned
            // value of the query.
            // Note the use of the rows[0] to demarcate we only wish for the first result of our search to be returned to use, this might be worth exploring in a for loop where if there are multiple
            // results, they are returned to us using something like a rows[i] syntax... but this is theoretical at this point in time.
            
            res.status(200).json({valid_password: isValid}) // and return to us upon success a JSON object where valid_password: isValid returns a Boolean value based off of whether the password passed to it was the correct password for that inputted user's email.
        } 
        res.status(200).send(`User with id ${id} was not found`); // otherwise, if (!rows), or if  the returned id was not found, but the post request was still successful, simply let the user know
        // that the id wasn't found.

    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;