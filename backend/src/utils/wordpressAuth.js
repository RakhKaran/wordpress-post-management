require('dotenv').config();

const getWordPressAuthToken = () => {
  const token = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_PASSWORD}`).toString('base64');
  return `Basic ${token}`;
};

module.exports = { getWordPressAuthToken };
