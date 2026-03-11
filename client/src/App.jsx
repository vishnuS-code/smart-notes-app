import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import NotesDashboard from './pages/NotesDashboard';
import TranslatePage from './pages/TranslatePage';
import PDFExtractor from './pages/PDFExtractor';
import WordExtractor from './pages/WordExtractor';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path="/" element={<PageTransition><NotesDashboard /></PageTransition>} />
        <Route path="/translate" element={<PageTransition><TranslatePage /></PageTransition>} />
        <Route path="/pdf" element={<PageTransition><PDFExtractor /></PageTransition>} />
        <Route path="/docx" element={<PageTransition><WordExtractor /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <main style={styles.main}>
        <AnimatedRoutes />
      </main>
    </Router>
  );
}

const styles = {
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
};
