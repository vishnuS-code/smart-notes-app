import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateText } from '../services/api';
import { Spinner } from '../components/Loader';

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh-cn', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ko', name: 'Korean' },
];

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await translateText(text, targetLanguage);
      setResult(res.data.translatedText);
    } catch (err) {
      setError(err.response?.data?.error || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Translate Text</h1>
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleTranslate}
        style={styles.form}
      >
        <textarea
          style={styles.textarea}
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          required
        />
        <select
          style={styles.select}
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          style={{
            ...styles.btn,
            opacity: loading ? 0.8 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {loading && <Spinner size={16} color="var(--btn-color)" />}
          {loading ? 'Translating...' : 'Translate'}
        </motion.button>
      </motion.form>

      {error && <p style={styles.error}>{error}</p>}

      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.result}
          >
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Translation:</h3>
            <p style={styles.resultText}>{result}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  page: { maxWidth: '700px', margin: '0 auto' },
  h1: { fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'var(--bg-card)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    transition: 'background-color 300ms ease',
  },
  textarea: {
    padding: '0.8rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    transition: 'background-color 300ms ease, border-color 300ms ease',
  },
  select: {
    padding: '0.6rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    transition: 'background-color 300ms ease, border-color 300ms ease',
  },
  btn: {
    padding: '0.7rem 1.5rem',
    background: 'var(--accent-btn)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
  },
  error: { color: 'var(--danger)', marginTop: '1rem' },
  result: {
    marginTop: '1.5rem',
    background: 'var(--bg-card)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    transition: 'background-color 300ms ease',
  },
  resultText: { color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7 },
};
