const fileService = require("../services/fileService");

const uploadFile = async (req, res) => {
  try {
    console.log(req.files); // Debugging: See what Postman is sending

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await fileService.uploadFile(req.files.file);
    res.json({ message: "File uploaded successfully", fileUrl: result.fileUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const getFile = (req, res) => {
  const { fileName } = req.params;
  const filePath = fileService.getFile(fileName);

  if (!filePath) {
    return res.status(404).json({ error: "File not found" });
  }

  res.sendFile(filePath);
};

const deleteFile = async (req, res) => {
  try {
    const { fileName } = req.params;
    const message = await fileService.deleteFile(fileName);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { uploadFile, getFile, deleteFile };
