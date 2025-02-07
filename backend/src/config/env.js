require('dotenv').config();

module.exports = {
  siteUrl: process.env.SITE_URL,
  wpUsername: process.env.WP_USERNAME,
  wpPassword: process.env.WP_PASSWORD,
  dbHOST:process.env.DB_HOST,
  dbDatabase:process.env.DB_DATABASE,
  dbUser:process.env.DB_USER,
  dbPassword:process.env.DB_PASSWORD
};
