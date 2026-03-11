const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text, pages: data.numpages });
  } catch (err) {
    console.error('PDF extraction error:', err.message);
    res.status(500).json({ error: 'Failed to extract text from PDF' });
  }
};

const extractDOCX = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No DOCX file uploaded' });
    }
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    res.json({ text: result.value, messages: result.messages });
  } catch (err) {
    console.error('DOCX extraction error:', err.message);
    res.status(500).json({ error: 'Failed to extract text from DOCX' });
  }
};

module.exports = { extractPDF, extractDOCX };
