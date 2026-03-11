import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -80, transition: { duration: 0.25 } },
};

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(0,0,0,0.15)' }}
      style={styles.card}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{note.title}</h3>
        <span style={styles.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p style={styles.content}>{note.content}</p>
      <div style={styles.actions}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={styles.editBtn}
          onClick={() => onEdit(note)}
        >
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={styles.deleteBtn}
          onClick={() => onDelete(note.id)}
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background-color 300ms ease, border-color 300ms ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  title: { fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' },
  date: { fontSize: '0.75rem', color: 'var(--placeholder)' },
  content: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  actions: { display: 'flex', gap: '0.5rem' },
  editBtn: {
    padding: '0.3rem 0.8rem',
    background: 'var(--accent-btn)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '0.3rem 0.8rem',
    background: 'var(--danger)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
