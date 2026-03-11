const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractPDF, extractDOCX } = require('../controllers/extractController');

// memoryStorage: file never touches disk, buffer available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/pdf', upload.single('file'), extractPDF);
router.post('/docx', upload.single('file'), extractDOCX);

module.exports = router;
