const { Sequelize } = require('sequelize');
const { dbUser, dbDatabase, dbHOST, dbPassword } = require("./env");

const sequelize = new Sequelize(dbDatabase, dbUser, dbPassword, {
  host: dbHOST,
  dialect: 'mysql',
  logging: console.log, // ✅ Logs all SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // await sequelize.sync({ alter: true }); // Automatically syncs models
    // console.log('✅ All models were synchronized successfully.');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
