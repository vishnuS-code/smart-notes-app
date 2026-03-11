const express = require('express');
const router = express.Router();
const {
  getAllNotes,
  searchNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/notesController');

// /search must be defined BEFORE /:id to prevent Express treating "search" as an id
router.get('/search', searchNotes);
router.get('/', getAllNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
