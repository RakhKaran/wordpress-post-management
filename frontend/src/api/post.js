import axios from "axios";
import { endpoints } from "../config/apiConfig";

// Fetch all posts
export const fetchAllPosts = async (perPage, currentPage, status, created_after, created_before, search, sort) => {
  try {
    const queryParams = new URLSearchParams({
      per_page: perPage,
      page: currentPage,
      status: status || "any",
      sort: sort || "DESC"
    });

    if (created_after) queryParams.append("modified_after", created_after);
    if (created_before) queryParams.append("modified_before", created_before);
    if (search) queryParams.append("search", search); // Add search parameter

    const response = await axios.get(`${endpoints.posts.list}?${queryParams.toString()}`);
    
    console.log(response);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get post by id
export const getPostById = async (postId) => {
  try{
    const response = await axios.get(`${endpoints.posts.post}/${postId}`);
    return response.data;
  }catch(error){
    console.log("Error while fetching post:", error)
    throw error;  }
}

// Create post
export const createPost = async ({postTitle, postSlug, status, postContent, postFields, name, phoneNumber}) => {
  try{
    const data = {
      postTitle,
      postSlug,
      status,
      postContent,
      postFields,
      name,
      phoneNumber
    }
    const response = await axios.post(`${endpoints.posts.create}`, data);
    return response.data;
  }catch(error){
    console.log("Error while creating post:", error)
    throw error;
  }
}

// Bult Create Posts
export const bulkCreatePosts = async (data) => {
  try{
    const testData = data.slice(91, 120); // Take only the first 10 items
    const response = await axios.post(`${endpoints.posts.createBulk}`, {posts : testData});
    return response.data;
  }catch(error){
    console.log("Error while creating post:", error)
    throw error;
  } 
}

// update posts
export const updatePosts = async ({postId, postTitle, postSlug, status, postContent, name, phoneNumber, postFields}) => {
  try{
    const data = {
    postId,
    postTitle,
    postSlug,
    postContent,
    status,
    name,
    phoneNumber,
    postFields
  };

    const response = await axios.patch(`${endpoints.posts.update}`, data);
    return response.data;
  }catch(error){
    throw error;
  }
}

// Delete post
export const deletePost = async (id) => {
  try {
    await axios.delete(`${endpoints.posts.delete}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
