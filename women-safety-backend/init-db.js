const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create connection without database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Read schema file
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Split schema into individual statements
const statements = schema
  .split(';')
  .filter(statement => statement.trim())
  .map(statement => statement.trim() + ';');

// Execute statements sequentially
async function initDb() {
  try {
    for (const statement of statements) {
      await connection.promise().query(statement);
      console.log('Executed:', statement.slice(0, 50) + '...');
    }
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDb(); 