const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { validateRequest } = require("../middlewares");

router.post('/upload', fileController.uploadFile);
router.get('/get-file/:fileId', fileController.getFile);
router.delete('/delete/:fileId', fileController.deleteFile);

module.exports = router;
