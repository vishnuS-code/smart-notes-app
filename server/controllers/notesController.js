const noteService = require('../services/noteService');

const getAllNotes = (req, res) => {
  try {
    const notes = noteService.getAllNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

const searchNotes = (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
    const results = noteService.searchNotes(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search notes' });
  }
};

const createNote = (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const note = noteService.createNote({ title, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

const updateNote = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const updated = noteService.updateNote(id, { title, content });
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

const deleteNote = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = noteService.deleteNote(id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

module.exports = { getAllNotes, searchNotes, createNote, updateNote, deleteNote };
