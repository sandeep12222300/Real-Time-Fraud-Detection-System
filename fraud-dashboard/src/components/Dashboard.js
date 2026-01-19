import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "./Dashboard.module.css";

/* ------------------------------
   Small reusable UI components
   ------------------------------ */
function Icon({ name, className }) {
  // minimal set of inline SVG icons
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 4l9 5.5" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    analytics: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14v-6" />
        <path d="M12 14V8" />
        <path d="M17 14v-4" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.68 0 1.23-.45 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.1 2.3l.06.06c.48.48 1.1.73 1.78.73.22 0 .45-.02.67-.07A1.65 1.65 0 0 0 11 2.3H13a1.65 1.65 0 0 0 .73.06c.22.05.45.07.67.07.68 0 1.3-.25 1.78-.73l.06-.06A2 2 0 1 1 21.7 7.1l-.06.06c-.48.48-.73 1.1-.73 1.78 0 .22.02.45.07.67.05.22.07.45.07.67 0 .68.25 1.3.73 1.78l.06.06A2 2 0 0 1 19.4 15z" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };
  return <span className={className} aria-hidden>{icons[name]}</span>;
}

function TopNav({ isLoading, onRefresh }) {
  return (
    <div className={styles.topNav}>
      <div className={styles.topLeft}>
        <div className={styles.pageTitle}>Real-Time Fraud Dashboard</div>
        <div className={styles.pageSubtitle}>Monitoring transactions and model predictions</div>
      </div>

      <div className={styles.topRight}>
        <div className={styles.search}>
          <Icon name="search" />
          <input className={styles.searchInput} placeholder="Search transactions, ids..." />
        </div>

        <button className={styles.iconBtn} title="Notifications">
          <Icon name="bell" />
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>SD</div>
          <div className={styles.profileName}>Sandeep</div>
          <button className={styles.iconBtn} onClick={onRefresh} title="Refresh" aria-label="Refresh">
            {isLoading ? <div className={styles.spinner} /> : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, delta, deltaPercent, icon }) {
  const showPercent = deltaPercent !== undefined;
  const deltaValue = showPercent ? deltaPercent : delta;
  const isPositive = Number(deltaValue) >= 0;

  return (
    <div className={styles.statCard} style={{ boxShadow: "0 8px 24px rgba(2,6,23,0.6)" }}>
      <div className={styles.statTop}>
        <div className={styles.statIcon} style={{ background: accent, width:32, height:32 }}>
          {icon}
        </div>
        <div>
          <div className={styles.statLabel}>{label}</div>
        </div>
      </div>
      <div className={styles.statValueRow}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statDelta}>
          {deltaValue !== undefined && (
            <div className={`${styles.deltaBadge} ${isPositive ? styles.deltaUp : styles.deltaDown}`}>
              {isPositive ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#052026" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#052026" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v13"/><path d="M19 12l-7 7-7-7"/></svg>
              )}
              <span>{showPercent ? `${isPositive ? '+' : ''}${deltaValue}%` : `${isPositive ? '+' : ''}${deltaValue}`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>{title}</div>
      <div className={styles.chartBody}>{children}</div>
    </div>
  );
}

function DataTable({ rows, error, isLoading, tableWrapRef }) {
  const [measuredH, setMeasuredH] = useState(null);

  useEffect(() => {
    function refresh() {
      if (tableWrapRef && tableWrapRef.current) setMeasuredH(tableWrapRef.current.clientHeight || tableWrapRef.current.offsetHeight);
    }
    refresh();
    window.addEventListener('resize', refresh);
    const t = setInterval(refresh, 500);
    return () => { window.removeEventListener('resize', refresh); clearInterval(t); };
  }, [tableWrapRef]);

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>Recent Predictions</div>
        <div className={styles.tableMeta}>{error ? <span className={styles.errText}>{error.message}</span> : isLoading ? "Loading..." : ""}</div>
      </div>

      <div ref={tableWrapRef} className={`${styles.tableWrap} ${styles.debugOutline}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Transaction</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className={styles.emptyRow} colSpan={5}>No data available</td>
              </tr>
            )}
            {rows.map((row, idx) => {
              const isFraud = !!row.fraud;
              return (
                <tr key={row.id || idx} className={styles.tableRow}>
                  <td>{row.id}</td>
                  <td>{row.transactionId}</td>
                  <td style={{ textAlign: "right" }}>₹{Number(row.amount).toLocaleString()}</td>
                  <td>
                    <span className={`${styles.pill} ${isFraud ? styles.pillDanger : styles.pillSuccess}`}>
                      {isFraud ? "FRAUD" : "SAFE"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>{(Number(row.confidence) || 0).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* debug badge showing computed height */}
      {measuredH !== null && <div className={styles.debugBadge}>{measuredH}px</div>}
    </div>
  );
}

/* Footer sticky bar component */
function Footer({ apiUrl, lastUpdated }) {
  return (
    <div className={styles.footer} role="contentinfo">
      <div className="left">
        <div style={{ color: 'var(--muted)' }}>Status: <strong style={{ color: 'var(--text)', marginLeft:8 }}>Connected</strong></div>
      </div>
      <div className="center">
        <div style={{ fontSize:12, color:'var(--muted)', display:'flex', gap:12, alignItems:'center' }}>
          <div>Backend: <span style={{ color:'var(--text)', marginLeft:6 }}>{apiUrl}</span></div>
          <div>Last updated: <span style={{ color:'var(--text)', marginLeft:6 }}>{lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '-'}</span></div>
        </div>
      </div>
      <div className="right">
        <div style={{ color:'var(--muted)' }}>© {new Date().getFullYear()} Fraud Analytics</div>
      </div>
    </div>
  );
}

/* ------------------------------
   Main Dashboard component
   (keeps all data logic & behavior unchanged)
   ------------------------------ */
export default function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  // layout refs to compute available height for the table scroll area
  const topNavRef = useRef(null);
  const kpiRowRef = useRef(null);
  const chartsRowRef = useRef(null);
  const footerRef = useRef(null);
  const tableWrapRef = useRef(null);

  // compute and set table container height so it scrolls internally
  useEffect(() => {
    function updateTableHeight() {
      const topNavH = topNavRef.current ? topNavRef.current.getBoundingClientRect().height : 0;
      const kpiH = kpiRowRef.current ? kpiRowRef.current.getBoundingClientRect().height : 0;
      const chartsH = chartsRowRef.current ? chartsRowRef.current.getBoundingClientRect().height : 0;
      const footerH = footerRef.current ? footerRef.current.getBoundingClientRect().height : 0;

      // account for page padding/gaps (safe buffer)
      const pagePadding = 32; // sum of vertical paddings/gaps
      const available = Math.max(120, window.innerHeight - topNavH - kpiH - chartsH - footerH - pagePadding);

      // debug output (open browser console to inspect)
      console.debug('layout heights', { topNavH, kpiH, chartsH, footerH, pagePadding, available });

      if (tableWrapRef.current) {
        tableWrapRef.current.style.height = `${available}px`;
        tableWrapRef.current.style.maxHeight = `${available}px`;
        tableWrapRef.current.style.overflowY = 'auto';
      }
    }

    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    // also update after a small delay to capture async chart renders
    const t = setTimeout(updateTableHeight, 500);
    return () => {
      window.removeEventListener('resize', updateTableHeight);
      clearTimeout(t);
    };
  }, []);

  const API_URL = (() => {
    try {
      const host = window?.location?.hostname;
      const port = window?.location?.port;
      if ((host === "localhost" || host === "127.0.0.1") && port === "3000") {
        return "http://localhost:8082/api/fraud/predictions";
      }
    } catch (e) {}
    return "/api/fraud/predictions";
  })();

  const fetchData = async (signal) => {
    try {
      setError(null);
      if (!data || data.length === 0) setIsLoading(true);

      let res;
      try {
        res = await fetch(API_URL, { method: "GET", signal });
      } catch (fetchErr) {
        if (API_URL.startsWith("/api")) {
          try {
            res = await fetch(`http://localhost:8082${API_URL}`, { method: "GET", signal });
          } catch {
            throw fetchErr;
          }
        } else {
          throw fetchErr;
        }
      }

      if (res && res.status === 404 && API_URL.startsWith("/api")) {
        try {
          res = await fetch(`http://localhost:8082${API_URL}`, { method: "GET", signal });
        } catch (e) {}
      }

      if (!res) throw new Error("No response from API");
      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

      const json = await res.json();
      if (!mountedRef.current) return;
      if (!Array.isArray(json)) throw new Error("Invalid API response: expected an array");

      setData(json);
      setLastUpdated(Date.now());
    } catch (err) {
      if (err?.name === "AbortError") return;
      if (!mountedRef.current) return;
      setError(err);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  // initial load + auto-refresh every 5s
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    const interval = setInterval(() => {
      const c = new AbortController();
      fetchData(c.signal).catch(() => {});
    }, 5000);

    return () => {
      clearInterval(interval);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    const c = new AbortController();
    fetchData(c.signal).catch(() => {});
  };

  const rows = useMemo(() => data || [], [data]);
  // debug helper: if ?debugTable=1 is present, seed many rows to force overflow for testing
  const displayRows = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debugTable') === '1') {
        const base = rows && rows.length ? rows : [{ id: 'demo-1', transactionId: 'TX-DEMO-1', amount: 123.45, fraud: false, confidence: 0.12 }];
        const out = [];
        for (let i = 0; i < 60; i++) {
          const src = base[i % base.length];
          out.push({ ...src, id: `${src.id || 'demo'}-${i + 1}`, transactionId: `${src.transactionId || 'TX'}-${i + 1}` });
        }
        return out;
      }
    } catch (e) {}
    return rows;
  }, [rows]);
  const fraudCount = useMemo(() => rows.filter((r) => r.fraud).length, [rows]);
  const safeCount = useMemo(() => rows.length - fraudCount, [rows, fraudCount]);

  const fraudChartData = useMemo(
    () => [
      { name: "Fraud", count: fraudCount },
      { name: "Safe", count: safeCount },
    ],
    [fraudCount, safeCount]
  );

  const confidenceData = useMemo(
    () => rows.map((r, idx) => ({ index: idx + 1, tx: r.transactionId, confidence: Number(r.confidence) || 0 })),
    [rows]
  );


  // KPI deltas: compute change since last poll
  const prevKpiRef = useRef({ total: 0, fraud: 0, safe: 0, fraudRate: 0 });
  const [kpiDeltas, setKpiDeltas] = useState({ tx: 0, fraud: 0, safe: 0, fraudRate: 0 });

  useEffect(() => {
    const total = rows.length;
    const fraud = fraudCount;
    const safe = safeCount;
    const prev = prevKpiRef.current || { total: 0, fraud: 0, safe: 0 };

    const prevRate = prev.total === 0 ? 0 : (prev.fraud / prev.total) * 100;
    const currRate = total === 0 ? 0 : (fraud / total) * 100;

    setKpiDeltas({
      tx: total - (prev.total || 0),
      fraud: fraud - (prev.fraud || 0),
      safe: safe - (prev.safe || 0),
      fraudRate: Number((currRate - prevRate).toFixed(1)),
    });

    // store current as previous for next poll
    prevKpiRef.current = { total, fraud, safe };
    // only run when rows/fraudCount/safeCount change
  }, [rows, fraudCount, safeCount]);

  const theme = {
    backgroundStart: "#071029",
    backgroundEnd: "#0b1220",
    primary: "linear-gradient(90deg,#3b82f6,#7c3aed)",
    fraud: "#ef4444",
    safe: "#22c55e",
    card: "#071426",
    muted: "#97a6b8",
    text: "#E6EEF9",
  };

  const totalTransactions = rows.length;
  const fraudRate = totalTransactions === 0 ? "0%" : `${((fraudCount / totalTransactions) * 100).toFixed(1)}%`;

  return (
    <div className={styles.page} style={{ backgroundImage: `linear-gradient(180deg, ${theme.backgroundStart}, ${theme.backgroundEnd})` }}>
      <div className={styles.main}>
        <div ref={topNavRef}><TopNav isLoading={isLoading} onRefresh={handleRefresh} /></div>

         <div className={styles.content}>
          <div ref={kpiRowRef} className={styles.kpiRow}>
            <StatCard
              label="Total Transactions"
              value={totalTransactions}
              accent="linear-gradient(135deg,#3b82f6, #60a5fa)"
              delta={kpiDeltas.tx}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M6 6h.01M6 18h.01M12 6h.01M12 18h.01M18 6h.01M18 18h.01" /></svg>}
            />
            <StatCard
              label="Fraud Count"
              value={fraudCount}
              accent="#ef4444"
              delta={kpiDeltas.fraud}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" /></svg>}
            />
            <StatCard
              label="Safe Count"
              value={safeCount}
              accent="#16a34a"
              delta={kpiDeltas.safe}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
            />
            <StatCard
              label="Fraud Rate"
              value={fraudRate}
              accent="linear-gradient(135deg,#7c3aed,#06b6d4)"
              deltaPercent={kpiDeltas.fraudRate}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 14l3-3 4 4 6-6" /></svg>}
            />
          </div>

          <div className={styles.grid}>
            <div ref={chartsRowRef} className={styles.chartsRow}>
              <ChartCard title="Fraud vs Safe Transactions">
                <div style={{ width: "100%", height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fraudChartData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                      <defs>
                        <linearGradient id="barSafe" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="barFraud" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fb7185" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis dataKey="name" stroke={theme.muted} tick={{ fill: theme.muted }} />
                      <YAxis allowDecimals={false} stroke={theme.muted} tick={{ fill: theme.muted }} />
                      <Tooltip wrapperStyle={{ outline: "none" }} contentStyle={{ background: theme.card, border: "none", color: theme.text, borderRadius: 8 }} />
                      <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                        {fraudChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.name === "Fraud" ? "url(#barFraud)" : "url(#barSafe)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Confidence Trend">
                <div style={{ width: "100%", height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={confidenceData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                      <defs>
                        <linearGradient id="confGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="confFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis dataKey="index" stroke={theme.muted} tick={{ fill: theme.muted }} />
                      <YAxis domain={[0, 1]} stroke={theme.muted} tick={{ fill: theme.muted }} />
                      <Tooltip
                        formatter={(value, name) => [value, name === "confidence" ? "Confidence" : name]}
                        labelFormatter={(label) => {
                          const p = confidenceData.find((x) => x.index === label);
                          return p ? p.tx : `#${label}`;
                        }}
                        wrapperStyle={{ outline: "none" }}
                        contentStyle={{ background: theme.card, border: "none", color: theme.text, borderRadius: 8 }}
                      />
                      <defs />
                      <Line
                        type="linear"
                        dataKey="confidence"
                        stroke="url(#confGradient)"
                        strokeWidth={1.6}
                        dot={false}
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            <div className={styles.bottomRow}>
              <DataTable rows={displayRows} error={error} isLoading={isLoading} tableWrapRef={tableWrapRef} />
             </div>

            {/* keep infoRow but moved into footer visually; keep in markup for accessibility if needed */}
            <div className={styles.infoRow} style={{ display: 'none' }}>
              <div className={styles.infoCard}>
                <div className={styles.sideTitle}>Status</div>
                <div className={styles.sideValue}>Connected</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.sideTitle}>Backend API</div>
                <div className={styles.sideValue} style={{ wordBreak: "break-all" }}>{API_URL}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.sideTitle}>Last Updated</div>
                <div className={styles.sideValue}>{lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "-"}</div>
              </div>
            </div>
          </div>
        </div>

        <div ref={footerRef}><Footer apiUrl={API_URL} lastUpdated={lastUpdated} /></div>
      </div>
    </div>
  );
}
