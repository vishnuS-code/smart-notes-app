import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from '../components/NoteCard';
import { SkeletonCard } from '../components/Loader';
import { getNotes, createNote, updateNote, deleteNote, searchNotes } from '../services/api';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function NotesDashboard() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);
    if (!q.trim()) { fetchNotes(); return; }
    try {
      const res = await searchNotes(q);
      setNotes(res.data);
    } catch {
      setError('Search failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const res = await updateNote(editingId, form);
        setNotes((prev) => prev.map((n) => n.id === editingId ? res.data : n));
        setEditingId(null);
      } else {
        const res = await createNote(form);
        setNotes((prev) => [...prev, res.data]);
      }
      setForm({ title: '', content: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setError('Delete failed');
    }
  };

  return (
    <div>
      <h1 style={styles.h1}>Notes Dashboard</h1>

      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <input
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={styles.submitBtn}
          >
            {editingId ? 'Update Note' : 'Add Note'}
          </motion.button>
          {editingId && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={styles.cancelBtn}
              onClick={() => { setEditingId(null); setForm({ title: '', content: '' }); }}
            >
              Cancel
            </motion.button>
          )}
        </div>
      </motion.form>

      {error && <p style={styles.error}>{error}</p>}

      <input
        style={{ ...styles.input, marginBottom: '1.5rem' }}
        placeholder="Search notes..."
        value={search}
        onChange={handleSearch}
      />

      {loading ? (
        <div style={styles.grid}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : notes.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No notes yet. Create your first note above.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={styles.grid}
        >
          <AnimatePresence>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  h1: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: 'var(--text-primary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    background: 'var(--bg-card)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    transition: 'background-color 300ms ease, border-color 300ms ease',
  },
  input: {
    padding: '0.6rem 0.8rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    transition: 'background-color 300ms ease, border-color 300ms ease, color 300ms ease',
  },
  submitBtn: {
    padding: '0.6rem 1.5rem',
    background: 'var(--accent-btn)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  cancelBtn: {
    padding: '0.6rem 1.5rem',
    background: 'var(--border)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: { color: 'var(--danger)', marginBottom: '1rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
};
