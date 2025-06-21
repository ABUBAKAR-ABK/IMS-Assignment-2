const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const createUsersTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table checked/created.');

    // Check if company_name column exists, and add if not
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'company_name'
    `, [process.env.DB_NAME]);

    if (columns.length === 0) {
      await pool.execute(`
        ALTER TABLE users
        ADD COLUMN company_name VARCHAR(255)
      `);
      console.log('company_name column added to users table.');
    } else {
      console.log('company_name column already exists in users table.');
    }

  } catch (error) {
    console.error(`Error ensuring users table and columns: ${error.message}`);
    process.exit(1);
  }
};

const connectDB = async () => {
  try {
    await pool.getConnection();
    console.log('MySQL DB Connected!');
    await createUsersTable(); // Call function to create users table
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
