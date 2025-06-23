const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const user = new User(results[0].id, results[0].username, results[0].password, results[0].role);
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  static async create(username, password, role = 'student') {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hash, role],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result.insertId);
              }
            }
          );
        }
      });
    });
  }
}

module.exports = User;
