const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quan_ly_san_bong',
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool.promise();