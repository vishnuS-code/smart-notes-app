import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import { DotsLoader } from '../components/Loader';
import { extractDOCX, createNote } from '../services/api';

export default function WordExtractor() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    setError('');
    setText('');
    setDone(false);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await extractDOCX(formData);
      setText(res.data.text);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'DOCX extraction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsNote = async () => {
    if (!text) return;
    setSavingNote(true);
    try {
      await createNote({
        title: `Extracted from ${fileName || 'document.docx'}`,
        content: text,
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
      setDone(false);
      setText('');
    } catch {
      setError('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Word Document Extractor</h1>

      <FileUpload
        accept=".docx"
        label="Drag & drop a .docx file here or click Browse"
        onUpload={handleUpload}
        uploadSuccess={done}
      />

      {loading && <DotsLoader label="Processing document" />}
      {error && <p style={styles.error}>{error}</p>}

      <AnimatePresence>
        {text && !loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.result}
          >
            <div style={styles.resultHeader}>
              <span style={styles.successLabel}>Extraction complete</span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveAsNote}
                disabled={savingNote}
                style={{ ...styles.saveBtn, opacity: savingNote ? 0.7 : 1 }}
              >
                {savingNote ? 'Saving...' : 'Save as Note'}
              </motion.button>
            </div>
            <pre style={styles.pre}>{text}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {showToast && <div className="toast">Note saved successfully!</div>}
    </div>
  );
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto' },
  h1: { fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' },
  error: { color: 'var(--danger)', marginTop: '1rem' },
  result: {
    overflow: 'hidden',
    marginTop: '1rem',
    background: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid var(--border)',
    transition: 'background-color 300ms ease',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  successLabel: { color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' },
  saveBtn: {
    padding: '0.4rem 1rem',
    background: 'var(--success)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  pre: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    lineHeight: 1.7,
    maxHeight: '500px',
    overflowY: 'auto',
  },
};
