const mysql = require('mysql2'); // Use mysql2 for better async support
const {dbUser, dbDatabase, dbHOST, dbPassword} = require("./env");

const db = mysql.createConnection({
    host: dbHOST,
    database: dbDatabase,
    user: dbUser,
    password: dbPassword,
});

const connectDB = () => {
  db.connect(err => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1); // Exit process if DB connection fails
    }
    console.log('✅ Database connected successfully');
  });
};

module.exports = { db, connectDB };
