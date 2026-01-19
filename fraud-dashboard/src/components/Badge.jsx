import React from 'react';
import styles from './Dashboard.module.css';

export default function Badge({ status, isFraud, children }) {
  // prefer explicit status prop; fall back to children
  const s = (status || children || '').toString().toUpperCase();
  const fraud = typeof isFraud === 'boolean' ? isFraud : s === 'FRAUD';

  return (
    <span className={`${styles.badgeBase} ${fraud ? styles.badgeFraud : styles.badgeSafe}`}>
      {s || 'UNKNOWN'}
    </span>
  );
}

