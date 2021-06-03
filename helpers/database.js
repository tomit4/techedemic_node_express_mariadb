const mariadb = require('mariadb');

const pool = mariadb.createPool({  // a pool is a definition of a series of connections.
    // Note again the use of NodeJS's native process.env object, we then define a series of Keys within the process.env object
    // That are obviously referncing different values within our database table.  These will be referencing our .env-local file.
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

// Connect and check for errors
pool.getConnection((err, connection) => {
    if(err) { // a series of mySQL error codes, there are many that are worth investigating.
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections');
        }
        if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused');
        }
    }
    // this is what actually creates the connection to the mariadb database, once released/successful, all we have to do is export the pool for our program to recognize our database.
    if(connection) connection.release();

    return; // sonar lint complains as this being unnecessary, but is part of the tutorial so I left it in.
});

module.exports = pool;