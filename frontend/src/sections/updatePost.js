import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePosts } from "../api/post";
import { ArrowLeft, X } from "lucide-react";
import Swal from "sweetalert2";
import { paths } from "../routes/path";
import { Modal } from "react-bootstrap-v5";

function UpdatePost() {
    const navigate = useNavigate();
    const params = useParams();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [fields, setFields] = useState([]);
    const content = useMemo(() =>`
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f4f8; color: #333;">
    <header style="background: linear-gradient(135deg, #0078d7, #00bfff); color: white; padding: 20px 15px; text-align: center; border-bottom: 3px solid #0056b3;">
        <h1 style="margin: 0; font-size: 2.5rem;">Provider Details</h1>
        <p style="margin: 5px 0 0; font-size: 1.2rem;">Emergency Medicine - MD/DO</p>
    </header>

    <main style="padding: 20px; max-width: 900px; margin: 0 auto;">
        <section style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
            <h2 style="color: #0056b3; margin-bottom: 10px; font-size: 1.8rem; display: flex; align-items: center;"> 
                <span style="font-size: 2rem; margin-right: 10px;">👩‍⚕️</span> Dr. ${name || "Unknown"}
            </h2>
            ${fields.map((field) => `
              <p style="margin: 5px 0;"><strong>${field?.fieldName}:</strong> ${field?.fieldValue || "N/A"}</p>`).join('')}
            <div style="width:100%; text-align: center;">
                <a href="tel:${phone}" style="text-decoration: none;">
                  <button style="background-color: #0078d7; color: white; border: none; cursor: pointer; border-radius: 5px; padding:10px 20px; font-size:16px;">Call Now</button>
                </a>
            </div>
        </section>
    </main>

    <footer style="background-color: #f9f9f9; text-align: center; padding: 15px 10px; font-size: 0.9rem; color: #666; border-top: 1px solid #ddd;">
        &copy; 2025 Healthcare Providers Directory. All Rights Reserved.
    </footer>
    </body>`,[fields, name, phone])    
    const { postId } = params;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(postId);
                if (response.data) {
                    setTitle(response.data.title.rendered);
                    setSlug(response.data.slug);
                    setStatus(response.data.status);
                    setFields(JSON.parse(response.data.postData.postFields));
                    setName(response.data.postData.name);
                    setPhone(response.data.postData.phoneNumber);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        if(fields.length === 0){
            window.alert("Please add atleast one field");
            return;
        }
        try {
            const data = {
                postId,
                postTitle: title,
                postSlug: slug,
                status,
                postContent: content,
                name: name,
                phoneNumber: phone,
                postFields : fields
            };

            console.log(data);
            const response = await updatePosts(data); // Send updated data
            if(response.status === 1){
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Post Updated!",
                })
                navigate(paths.posts.list);
            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error occured while updaing post!",
                }) 
            }
        } catch (error) {
            console.error("Error while updating post:", error);
        }
    };

    const addField = () => {
        setFields([...fields, { fieldName: '', fieldValue: '' }]);
      };
    
    const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
    };

    const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
    };

    return (
        <div className="container mt-4">
        <button 
            className="btn btn-primary d-flex justify-content-center align-items-center rounded-circle" 
            style={{ width: "50px", height: "50px" }} 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{display : 'flex', alignItems : 'center', justifyContent : 'space-between'}}>
            <h2 className="mb-4 text-primary fw-bold">Update Post</h2>
            <div style={{display : 'flex', gap: '10px'}}>
            <button className="btn btn-primary d-flex justify-content-start align-items-center" style={{ padding : '5px 10px' }} onClick={() => setVisible(true)}>
                Preview
            </button>
            </div>
        </div>
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
            <div className="row">
                {/* Title Input */}
                <div className="col-md-4 mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Slug Input */}
                <div className="col-md-4 mb-3">
                    <label className="form-label">Slug</label>
                    <input
                        type="text"
                        className="form-control"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                </div>

                {/* Status Input */}
                <div className="col-md-4 mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="draft">Draft</option>
                        <option value="publish">Publish</option>
                    </select>
                </div>
            </div>

            {/* Name, Phone */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-3 my-2">
                <label className="form-label fw-bold my-2">Form Fields</label>
                <button className="btn btn-primary d-flex justify-content-start align-items-center" style={{ padding : '5px 10px' }} type="button" onClick={addField}>
                    Add Field
                </button>
            </div>

            {fields.map((field, index) => (
              <div key={index} className="d-flex gap-2 mb-3 align-items-center">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Field Name"
                  value={field.fieldName}
                  onChange={(e) => updateField(index, 'fieldName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Field Value"
                  value={field.fieldValue}
                  onChange={(e) => updateField(index, 'fieldValue', e.target.value)}
                />
                <button type="button" className="btn btn-danger" onClick={() => removeField(index)}>
                  Remove
                </button>
              </div>
            ))}
            {/* Submit Button */}
            <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                    type="submit"
                    className="btn btn-primary d-flex justify-content-center"
                    style={{ width: "120px" }}
                >
                    Update Post
                </button>
            </div>            
          </form>
          <Modal show={visible} onHide={() => setVisible(false)} centered className="modal-lg">
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
                <button 
                className="btn btn-light border-0" 
                onClick={() => setVisible(false)}
                >
                <X size={20} />
                </button>
            </Modal.Header>
            <Modal.Body 
                style={{ 
                overflowY: "auto", 
                maxHeight: "70vh", 
                maxWidth: '80vw'  // Increased width here
                }}
            >
                <div
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ wordWrap: "break-word" }}
                />
            </Modal.Body>
        </Modal>
        </div>
    );
}

export default UpdatePost;
