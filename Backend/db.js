const mysql = require('mysql2');

// Configure your MySQL connection here
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // replace with your MySQL username
  password: 'user@SQL', // replace with your MySQL password
  database: 'internconnect'    // you can create this database in MySQL
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;
