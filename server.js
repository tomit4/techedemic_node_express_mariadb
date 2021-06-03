// Note that this file contains a lot of the default settings for a small NodeJS/ExpressJS project

const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: '.env-local'}); // configures the process.env to reference the input path.

const PORT = process.env.PORT || '3001'; // process.env returns an object containing the user environment, here we are adding another KEY called PORT, which refernces the local area PORT, which is defined in our .env-local file.
// Note that this particular syntax IS native to NodeJS, but the external package 'dotenv' is required in order to configure the path to a definition of PORT's value.
// As we have seen in other tutorials, this can by our above definition be defined as either the PORT number specified in .env-local OR it will be '3001' if the .env-local returns undefined for PORT.
// see: https://nodejs.org/api/all.html#process_process_env for more on NodeJS's process.env object.

const app = express();

// Middleware

app.use(express.json()); //  establishes that this will be a JSON API
app.use(express.urlencoded({extended:false})); // allows the use of the urls within the project.


// Routes

app.get('/', (request, response) => { // A standard get request, whenever visiting our home directory '/' we will see whatever we put within this function
    
    // response.status(200).json({name:'Hendri', doing:'Coding'})
    response.status(200).send("This is not why you're here. Head to /user/:id and replace :id with your user id");
    // from here we create our routes directory, and create a user.js file in it..
})

const userRouter = require('./routes/user');
app.use('/user', userRouter); // simply references user route defined above. and invokes all functions when the correct path is referenced by the browser.

// Start Listening
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`)
})