const path = require("path");
const fs = require("fs");
const { hosturl } = require("../config/env");

const uploadDir = path.join(__dirname, "../../sandbox"); // Change to sandbox

// Ensure the sandbox directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file provided");
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filePath = path.join(uploadDir, uniqueName);

    file.mv(filePath, (err) => {
      if (err) return reject("File upload failed");

      const fileUrl = `${hosturl}/sandbox/${uniqueName}`; // Change path for serving files
      resolve({ fileName: uniqueName, fileUrl });
    });
  });
};

const getFile = (fileName) => {
  const filePath = path.join(uploadDir, fileName);
  return fs.existsSync(filePath) ? filePath : null;
};

const deleteFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      return reject("File not found");
    }

    fs.unlink(filePath, (err) => {
      if (err) return reject("File deletion failed");
      resolve("File deleted successfully");
    });
  });
};

module.exports = { uploadFile, getFile, deleteFile };
