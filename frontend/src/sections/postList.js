import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap-v5";
import { X, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from "react-datepicker";
import { paths } from "../routes/path";
import { site_url } from "../config/envConfig";
import { deletePost, fetchAllPosts, updatePosts } from "../api/post";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

// ---------------------------------------------------------------------------------------------------------------
function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState('DESC');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [perPage, setPerPage] = useState(10);

  // Filters
  const [status, setStatus] = useState("any");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const loadPosts = async () => {
    try {
      const data = await fetchAllPosts(
          perPage, 
          currentPage,
          status,
          startDate ? startDate.toISOString() : null,
          endDate ? endDate.toISOString() : null,
          searchTerm,
          sort
        );

      setPosts(data.data || []);
      setHasMorePages(currentPage * perPage < data?.total);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [currentPage, perPage, searchTerm, status, startDate, endDate, sort]);

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
          await deletePost(id);
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
          loadPosts();
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

  const handleSiteViewPost = (postSlug) => {
    window.open(`${site_url}/${postSlug}`, "_blank");
  };

  const handleStatusChange = async(post, status) => {
    try{
      const data = {
      postId : post.postId,
      postTitle: `${post.postTitle}`,
      postSlug: post.postSlug,
      postContent: `${post.postContent}`,
      status,
      name: post.name,
      phoneNumber: post.phoneNumber,
      postFields: typeof post.postFields === "string" ? JSON.parse(post.postFields) : post.postFields
    };
    console.log('data', data);
    const response = await updatePosts(data);
    if(response.status === 1){
      Swal.fire("Updated!", `Status has been updated to ${status}`, "success");
      loadPosts();
    }else{
      Swal.fire("Error!", `Error occured while updating status to ${status}`, "error");
    }
    }catch(error){
      console.error("error :",error);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  
  const printData = () => {
    const columnNames = [
      { label: "Title", key: "title" },
      { label: "PostId", key: "postId" },
      { label: "Slug", key: "slug" },
      { label: "Website URL", key: "websiteUrl"},
      { label: "Created At", key: "createdAt" },
      { label: "Status", key: "status" },
    ];
  
    const filteredTableData = posts.map((data) => ({
      title: data.postTitle,
      postId: data.postId,
      slug: data.postSlug ? data.postSlug : "",
      websiteUrl: `${site_url}/${data.postSlug}`,
      createdAt: formatDate(data.createdAt),
      status: data.isActive ? "Active" : "Banned",
    }));
  
    const excelData = [
      columnNames.map((col) => col.label), // Headers
      ...filteredTableData.map((row) => columnNames.map((col) => row[col.key])), // Data rows
    ];
  
    const fileName = "Posts.xlsx";
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Posts Master");
    XLSX.writeFile(wb, fileName);
  };
  

  return (
    <div className="d-flex flex-column align-items-center vh-100" style={{ backgroundColor: "#fafafb" }}>
      <div className="container bg-white rounded shadow p-4" style={{marginTop : isMobile ? '10px' : '30px'}}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            style={{width:'60%'}}
            type="text"
            placeholder="🔍 Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control border-0 shadow-sm"
          />

          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button onClick={() => printData()} className="btn btn-primary fw-bold px-4">Export</button>
            <button onClick={() => navigate(paths.posts.create)} className="btn btn-primary fw-bold px-4">+ Add Post</button>
          </div>
        </div>
        
        <div className="d-flex justify-content-start align-items-center mb-3">
          {/* Status Dropdown */}
          <select
              className="form-select w-25 mx-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="any">All posts</option>
              <option value="draft">Draft</option>
              <option value="publish">Published</option>
          </select>

          {/* sorting modes */}
          <select
              className="form-select w-25 mx-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
          </select>

          {/* Date Range Picker */}
          <div className="d-flex align-items-center my-3">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="form-control"
              placeholderText="Start Date"
            />
            <span className="mx-2">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="form-control"
              placeholderText="End Date"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "35%" }}>Title</th>
                <th style={{ width: "15%" }} className="text-center">Status</th>
                <th style={{ width: "25%" }} className="text-center">Content</th>
                <th style={{ width: "25%" }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? posts.map((post, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f8f9fa" : "white" }}>
                  <td className="fw-bold">{post.postTitle}</td>
                  <td className="text-center">
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post, e.target.value)}
                      className="form-select form-select-sm"
                      style={{
                        width: "120px",
                        color: post.status === "draft" ? "#dc3545" : "#198754",
                        fontWeight: "bold",
                      }}
                    >
                      <option value="draft" style={{ color: "#dc3545" }}>Draft</option>
                      <option value="publish" style={{ color: "#198754" }}>Publish</option>
                    </select>
                  </td>
                  <td className="text-center" style={{ whiteSpace: "nowrap", width: "25%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      <button
                        className="btn btn-info btn-sm text-white mx-1 d-flex align-items-center"
                        onClick={() => handleViewPost(post)}
                      >
                        <Eye size={16} className="me-1" />
                        {isMobile ? '' : 'View'}
                      </button>
                      <button
                        className="btn btn-info btn-sm text-white mx-1 d-flex align-items-center"
                        onClick={() => handleSiteViewPost(post.postSlug)}
                      >
                        {isMobile ? 'Site' : 'Site View'}
                      </button>
                    </div>
                  </td>

                  <td className="text-center" style={{ whiteSpace: "nowrap", width: "25%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      <button onClick={() => {navigate(paths.posts.update(post?.postId))}} className="btn btn-warning btn-sm text-white mx-1 d-flex align-items-center">
                        <Pencil size={16} className="me-1" />
                        {isMobile ? '' : 'Edit'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm d-flex align-items-center"
                        onClick={() => handleDelete(post.postId)}
                      >
                        <Trash2 size={16} className="me-1" />
                        {isMobile ? '' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    <div className="d-flex flex-column align-items-center">
                      <img src="/assets/images/no-post.webp" alt="No Posts" style={{ width: isMobile ? "280px" : "500px"}} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end mt-3">
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="form-select form-select-sm"
            style={{
              width : '70px',
              height : '40px',
              marginRight : '10px'
            }}
          >
            <option value={10} style={{ color: "#dc3545" }}>10</option>
            <option value={20} style={{ color: "#198754" }}>20</option>
            <option value={40} style={{ color: "#198754" }}>40</option>
            <option value={80} style={{ color: "#198754" }}>80</option>
            <option value={100} style={{ color: "#198754" }}>100</option>
          </select>
          <button
            className="btn btn-outline-secondary mx-2 bg-black text-white"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="fw-bold align-self-center">Page {currentPage}</span>
          <button
            className="btn btn-outline-secondary mx-2 bg-black text-white"
            disabled={!hasMorePages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal for Viewing Post */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>{selectedPost?.postTitle}</Modal.Title>
          <button 
            className="btn btn-light border-0" 
            onClick={() => setShowModal(false)}
          >
            <X size={20} />
          </button>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "auto", maxHeight: "70vh" }}>
          <div
            dangerouslySetInnerHTML={{ __html: selectedPost?.postContent }}
            style={{ wordWrap: "break-word" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PostList;
