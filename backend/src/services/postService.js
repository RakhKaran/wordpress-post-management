const axios = require('axios');
const { siteUrl } = require('../config/env'); // Import siteUrl from env.js
const { getWordPressAuthToken } = require('../utils/wordpressAuth'); // Import auth token

const authHeader = {
  Authorization: getWordPressAuthToken(),
  'Content-Type': 'application/json',
};

const getAllWordPressPosts = async (queryParams = {}) => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await axios.get(`${siteUrl}/wp-json/wp/v2/posts?${queryString}`, { headers: authHeader });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getWordPressPost = async postId => {
  try {
    const response = await axios.get(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, { headers: authHeader });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchWordPressPosts = async queryParams => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await axios.get(`${siteUrl}/wp-json/wp/v2/posts?${queryString}`, { headers: authHeader });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createWordPressPost = async postData => {
  try {
    const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, postData, { headers: authHeader });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateWordPressPost = async (postId, updateData) => {
  try {
    const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, updateData, { headers: authHeader });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteWordPressPost = async postId => {
  try {
    const response = await axios.delete(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, { headers: authHeader });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllWordPressPosts,
  getWordPressPost,
  searchWordPressPosts,
  createWordPressPost,
  updateWordPressPost,
  deleteWordPressPost,
};
