import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import { DotsLoader } from '../components/Loader';
import { extractPDF, createNote } from '../services/api';

export default function PDFExtractor() {
  const [text, setText] = useState('');
  const [pages, setPages] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    setError('');
    setText('');
    setPages(null);
    setProgress(0);
    setUploadSuccess(false);
    setFileName(file.name);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85));
    }, 200);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await extractPDF(formData);
      clearInterval(interval);
      setProgress(100);
      setText(res.data.text);
      setPages(res.data.pages);
      setUploadSuccess(true);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'PDF extraction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsNote = async () => {
    if (!text) return;
    setSavingNote(true);
    try {
      await createNote({
        title: `Extracted from ${fileName || 'document.pdf'}`,
        content: text,
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch {
      setError('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>PDF Text Extractor</h1>

      <FileUpload
        accept=".pdf"
        label="Drag & drop a PDF here or click Browse"
        onUpload={handleUpload}
        uploadSuccess={uploadSuccess}
      />

      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <div style={styles.progressTrack}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={styles.progressBar}
            />
          </div>
          <DotsLoader label="Processing document" />
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <AnimatePresence>
        {text && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.result}
          >
            <div style={styles.resultHeader}>
              {pages && (
                <p style={styles.meta}>{pages} page{pages !== 1 ? 's' : ''} extracted</p>
              )}
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
  progressTrack: {
    background: 'var(--border)',
    borderRadius: '999px',
    height: '8px',
    overflow: 'hidden',
  },
  progressBar: { height: '100%', background: 'var(--accent-btn)', borderRadius: '999px' },
  error: { color: 'var(--danger)', marginTop: '1rem' },
  result: {
    marginTop: '1.5rem',
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
  meta: { color: 'var(--text-secondary)', fontSize: '0.85rem' },
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
