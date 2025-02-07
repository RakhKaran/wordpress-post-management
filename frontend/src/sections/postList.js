import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { endpoints } from "../config/apiConfig";
import { Modal } from "react-bootstrap-v5";
import { X } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";

// ---------------------------------------------------------------------------------------------------------------
function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const perPage = 10;

  // Handle window resizing for responsive layout
  useEffect(() => {
    const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(
        `${endpoints.posts.list}?per_page=${perPage}&page=${currentPage}`
      );
      const { data } = response.data;
      setPosts(data);
      setHasMorePages(data.length === perPage);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const searchPosts = async () => {
    try {
      const response = await axios.post("http://localhost:8099/search", {
        search: searchTerm,
        per_page: perPage,
      });
      setPosts(response.data.data || []);
      setHasMorePages(false);
    } catch (err) {
      console.error("Error searching posts:", err);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      searchPosts();
    } else {
      fetchAllPosts();
    }
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`http://localhost:8099/${id}`);
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
          fetchAllPosts();
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong, please try again.",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && (hasMorePages || newPage < currentPage)) {
      setCurrentPage(newPage);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100" style={{ backgroundColor: "#fafafb" }}>
      <div className="container bg-white rounded shadow p-4" style={{marginTop : isMobile ? '10px' : '30px'}}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control w-50 border-0 shadow-sm"
          />
          <button className="btn btn-primary fw-bold px-4">+ Add Post</button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f8f9fa" : "white" }}>
                  <td className="fw-bold">{post.title.rendered}</td>
                  <td className="text-center" style={{ width: "100px", whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-info btn-sm text-white"
                      onClick={() => handleViewPost(post)}
                    >
                      {isMobile ? '👀 View ' : '👀 View Post'}
                    </button>
                  </td>
                  <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                    <button className="btn btn-warning btn-sm mx-1 text-white">
                      {isMobile ? '✏️' : '✏️ Edit'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      {isMobile ? '🗑' : '🗑 Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-secondary mx-2 bg-black text-white"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ◀ Previous
          </button>
          <span className="fw-bold align-self-center">Page {currentPage}</span>
          <button
            className="btn btn-outline-secondary mx-2 bg-black text-white"
            disabled={!hasMorePages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Modal for Viewing Post */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>{selectedPost?.title.rendered}</Modal.Title>
          <button 
            className="btn btn-light border-0" 
            onClick={() => setShowModal(false)}
          >
            <X size={20} />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div
            dangerouslySetInnerHTML={{ __html: selectedPost?.content.rendered }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PostList;
