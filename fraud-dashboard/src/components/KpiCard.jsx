import React from 'react';
import styles from './Dashboard.module.css';

function UpIcon({ className }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 5l7 7h-4v7h-6v-7H5l7-7z" fill="currentColor" />
    </svg>
  );
}
function DownIcon({ className }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 19l-7-7h4V5h6v7h4l-7 7z" fill="currentColor" />
    </svg>
  );
}

export default function KpiCard({ title, value, sub, accentColor, delta, deltaPercent }) {
  const positive = typeof delta === 'number' ? delta > 0 : typeof deltaPercent === 'number' ? deltaPercent > 0 : null;

  return (
    <div className={styles.kpiCard} style={{ borderLeft: `4px solid ${accentColor || '#2563EB'}` }}>
      <div className={styles.kpiTop}>
        <div className={styles.kpiTitle}>{title}</div>
        {(typeof delta === 'number' || typeof deltaPercent === 'number') && (
          <div
            className={`${styles.kpiDelta} ${positive === true ? styles.deltaPositive : positive === false ? styles.deltaNegative : ''}`}
            style={{ color: positive === true ? undefined : accentColor }}
          >
            {typeof delta === 'number' && (
              <>
                {delta > 0 ? <UpIcon className={styles.kpiIcon} /> : delta < 0 ? <DownIcon className={styles.kpiIcon} /> : <span className={styles.kpiIcon} />}
                <span>{delta > 0 ? `+${delta}` : delta}</span>
              </>
            )}
            {typeof deltaPercent === 'number' && (
              <>
                {deltaPercent > 0 ? <UpIcon className={styles.kpiIcon} /> : deltaPercent < 0 ? <DownIcon className={styles.kpiIcon} /> : <span className={styles.kpiIcon} />}
                <span>{deltaPercent > 0 ? `+${deltaPercent}` : deltaPercent}%</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.kpiValue}>{value}</div>
      {sub ? <div className={styles.kpiSub}>{sub}</div> : null}
    </div>
  );
}
