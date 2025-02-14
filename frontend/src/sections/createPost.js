import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, X } from "lucide-react";
import { bulkCreatePosts, createPost } from "../api/post";
import { paths } from "../routes/path";
import { Modal } from "react-bootstrap-v5";
import * as XLSX from 'xlsx';

// ----------------------------------------------------------------------------------------------------------------
export default function CreatePost() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState('draft');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState([]);
  const content = `
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
  </body>
  `

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!slug.trim()) newErrors.slug = "Slug is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!phone.trim()) newErrors.phone = "Phone is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit function...
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(fields.length === 0){
        window.alert("Please add atleast one field");
        return;
    }

    if (!validateForm()) return; // Stop if validation fails

    try {
      const data = {
        postTitle : title, 
        postSlug : slug, 
        status : status, 
        postContent : content,
        postFields : fields,
        name : name,
        phoneNumber : phone
      }
      const response = await createPost(data);
      if(response.status === 1){
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Post Created!",
        })
        navigate(paths.posts.list);
        handleReset();
      }else{
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Post Creation failed!",
        })
      }
    } catch (error) {
      console.error("error while creating post : ", error);
    }
  };

  const handleReset = () => {
    setTitle('');
    setSlug('');
    setStatus('draft');
    setName('Enter Name...');
    setPhone('Enter Phone...');
    setErrors([]); // Clear errors
    setFields([]);
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
  
      const processedData = data.map((item) => {
        const title = `${item.First_Name || ''} ${item.Middle || ''} ${item.Last_Name || ''} ${item.Id || ''}`.trim();
        const slug = title.toLowerCase().replace(/\s+/g, '-');
        const name = `${item.First_Name || ''} ${item.Middle || ''} ${item.Last_Name || ''}`.trim();
        const phone = item.Phone1 || item.Phone2 || item.Phone3 || item.Phone4 || item.Phone5 || '';
  
        const address = [
          `${item.Address1_line1 || ''} ${item.Address1_line2 || ''}`.trim(),
          `${item.Address2_line1 || ''} ${item.Address2_line2 || ''}`.trim(),
          `${item.Address3_line1 || ''} ${item.Address3_line2 || ''}`.trim(),
          `${item.Address4_line1 || ''} ${item.Address4_line2 || ''}`.trim(),
          `${item.Address5_line1 || ''} ${item.Address5_line2 || ''}`.trim(),
        ].filter((addr) => addr.length > 0);
  
        const fields = {
          Address: address.join(', '),
          County: item.Address1_county || '',
          City: item.City_Keyword || '',
          State: item.State_Keyword || '',
          Zip: item.Zip_Keyword || '',
          Specialty: item.Specialty || '',
          Website: item.Website || '',
          NPI: item.NPI || '',
          Fax: item.Fax1 || item.Fax2 || item.Fax3 || item.Fax4 || item.Fax5 || '',
          "Practice Name": item.Practice_Name || ''  // Add quotes here
        };
        
  
        return {
          postTitle : title,
          postSlug : slug,
          status: 'publish',
          name,
          phoneNumber : phone,
          postFields : fields,
          postContent :`
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
                   ${Object.entries(fields).map(([key, value]) => `
                  <p><strong>${key}:</strong> ${value || 'N/A'}</p>`).join('')}
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
      </body>
      `
        };
      });
      bulkCreatePosts(processedData);
    };
  
    reader.readAsBinaryString(file);
  };  
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-4 p-4">
          {/* <div className="col-md-6 p-4"> */}
          <button 
            className="btn btn-primary d-flex justify-content-center align-items-center rounded-circle" 
            style={{ width: "50px", height: "50px" }} 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
          </button>
            <div style={{display : 'flex', alignItems : 'center', justifyContent : 'space-between'}}>
              <h2 className="mb-4 text-primary fw-bold">Create Post</h2>
              <div style={{display : 'flex', gap: '10px'}}>
              <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  id="excel-upload"
                  className="hidden"
                />
                <label htmlFor="excel-upload">
                  <button>Import Excel</button>
                </label>
                <button className="btn btn-primary d-flex justify-content-start align-items-center" style={{ padding : '5px 10px' }} onClick={() => setVisible(true)}>
                  Preview
                </button>
              </div>
            </div>

            {/* Title, Slug, and Status */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                {errors.title && <p className="text-danger">{errors.title}</p>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                {errors.slug && <p className="text-danger">{errors.slug}</p>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="publish">Publish</option>
                </select>
                {errors.status && <p className="text-danger">{errors.status}</p>}
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
                {errors.name && <p className="text-danger">{errors.name}</p>}
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
                {errors.phone && <p className="text-danger">{errors.phone}</p>}
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

            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary d-flex justify-content-center"
                style={{ width: "120px" }}
              >
                Create Post
              </button>

              <button
                type="button"
                className="btn btn-secondary d-flex justify-content-center"
                style={{ width: "120px" }}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          {/* </div> */}
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
  </>
  );
}