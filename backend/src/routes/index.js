const express = require('express');
const postRoutes = require('./postRoutes');
const fileRoutes = require('./fileRoutes');

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/files', fileRoutes);

module.exports = router;
