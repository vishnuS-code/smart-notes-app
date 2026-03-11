import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUpload({ accept, onUpload, label, uploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <motion.div
      animate={{
        borderColor: dragging ? 'var(--accent-btn)' : 'var(--border)',
        background: dragging ? 'rgba(59,130,246,0.07)' : 'var(--bg)',
        boxShadow: dragging
          ? '0 0 0 4px rgba(59,130,246,0.18), 0 0 20px rgba(59,130,246,0.12)'
          : '0 0 0 0px rgba(59,130,246,0)',
      }}
      transition={{ duration: 0.2 }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={styles.dropzone}
    >
      <AnimatePresence mode="wait">
        {uploadSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={styles.checkmark}
          >
            ✓
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
          >
            <p style={styles.labelText}>{dragging ? 'Drop it here!' : label}</p>
            <label style={styles.button}>
              Browse
              <input
                type="file"
                accept={accept}
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fileName && !uploadSuccess && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.fileName}
          >
            {fileName}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const styles = {
  dropzone: {
    border: '2px dashed var(--border)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'default',
    minHeight: '130px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  labelText: { color: 'var(--text-secondary)' },
  button: {
    display: 'inline-block',
    padding: '0.4rem 1.2rem',
    background: 'var(--accent-btn)',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  fileName: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
  checkmark: {
    width: '60px',
    height: '60px',
    background: 'var(--success)',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: 700,
  },
};
