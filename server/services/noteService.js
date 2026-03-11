const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '../data/notes.json');

function readNotes() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, '[]', 'utf8');
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeNotes(notes) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(notes, null, 2), 'utf8');
}

function getAllNotes() {
  return readNotes();
}

function getNoteById(id) {
  return readNotes().find((n) => n.id === id) || null;
}

function createNote({ title, content }) {
  const notes = readNotes();
  const note = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  notes.push(note);
  writeNotes(notes);
  return note;
}

function updateNote(id, { title, content }) {
  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  notes[index] = { ...notes[index], title, content };
  writeNotes(notes);
  return notes[index];
}

function deleteNote(id) {
  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notes.splice(index, 1);
  writeNotes(notes);
  return true;
}

function searchNotes(keyword) {
  const lower = keyword.toLowerCase();
  return readNotes().filter(
    (n) =>
      n.title.toLowerCase().includes(lower) ||
      n.content.toLowerCase().includes(lower)
  );
}

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote, searchNotes };
