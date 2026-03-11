import React from 'react';
import { motion } from 'framer-motion';

/* SkeletonCard — CSS shimmer via .shimmer class in index.css */
export function SkeletonCard() {
  return (
    <div style={skeletonStyles.card}>
      <div style={{ ...skeletonStyles.line, width: '60%', height: '18px', marginBottom: '0.75rem' }} className="shimmer" />
      <div style={{ ...skeletonStyles.line, width: '100%', height: '12px', marginBottom: '0.4rem' }} className="shimmer" />
      <div style={{ ...skeletonStyles.line, width: '85%', height: '12px', marginBottom: '0.4rem' }} className="shimmer" />
      <div style={{ ...skeletonStyles.line, width: '70%', height: '12px', marginBottom: '1rem' }} className="shimmer" />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ ...skeletonStyles.line, width: '60px', height: '28px', borderRadius: '6px' }} className="shimmer" />
        <div style={{ ...skeletonStyles.line, width: '60px', height: '28px', borderRadius: '6px' }} className="shimmer" />
      </div>
    </div>
  );
}

const skeletonStyles = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid var(--border)',
  },
  line: {
    borderRadius: '4px',
    background: 'var(--skeleton-base)',
  },
};

/* Spinner — rotating circle via Framer Motion */
export function Spinner({ size = 20, color = 'var(--accent)' }) {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid var(--border)`,
        borderTopColor: color,
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  );
}

/* DotsLoader — three staggered dots */
const dotVariants = {
  start: { scale: 0.6, opacity: 0.4 },
  end: { scale: 1, opacity: 1 },
};

const dotsContainerVariants = {
  start: { transition: { staggerChildren: 0.2 } },
  end: { transition: { staggerChildren: 0.2 } },
};

export function DotsLoader({ label = 'Processing document' }) {
  return (
    <div style={dotsStyles.wrapper}>
      <span style={dotsStyles.label}>{label}</span>
      <motion.div
        style={dotsStyles.dots}
        variants={dotsContainerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
            style={dotsStyles.dot}
          />
        ))}
      </motion.div>
    </div>
  );
}

const dotsStyles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    color: 'var(--text-secondary)',
  },
  label: { fontSize: '0.9rem' },
  dots: { display: 'flex', gap: '4px', alignItems: 'center' },
  dot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--accent)',
  },
};
