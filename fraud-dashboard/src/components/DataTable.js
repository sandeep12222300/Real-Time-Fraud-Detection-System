import React, { useMemo, useState } from 'react';

// Lightweight DataTable without external deps
// Props:
// - columns: [{ Header, accessor | id, Cell? }]
// - data: array of rows
// - pageSizeOptions: [10,25,50]
export default function DataTable({ columns = [], data = [], pageSizeOptions = [10, 25, 50] }) {
  const [sortBy, setSortBy] = useState({ id: null, desc: false });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);

  const cols = useMemo(() => columns.map((col, idx) => ({ ...col, id: col.id || (typeof col.accessor === 'string' ? col.accessor : `col_${idx}`) })), [columns]);

  const getCellValue = (row, col) => {
    if (typeof col.accessor === 'function') return col.accessor(row);
    if (typeof col.accessor === 'string') return row[col.accessor];
    // fallback to undefined
    return row[col.id];
  };

  const sortedData = useMemo(() => {
    if (!sortBy.id) return data;
    const col = cols.find(c => c.id === sortBy.id);
    if (!col) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const va = getCellValue(a, col);
      const vb = getCellValue(b, col);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return va - vb;
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return -1;
      if (sa > sb) return 1;
      return 0;
    });
    if (sortBy.desc) copy.reverse();
    return copy;
  }, [data, sortBy, cols]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.max(0, Math.min(pageIndex, pageCount - 1));
  const pageData = sortedData.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const toggleSort = (colId) => {
    setPageIndex(0);
    setSortBy(prev => {
      if (prev.id !== colId) return { id: colId, desc: false };
      return { id: colId, desc: !prev.desc };
    });
  };

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map(col => (
              <th
                key={col.id}
                onClick={() => toggleSort(col.id)}
                style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd', cursor: 'pointer', userSelect: 'none' }}
              >
                {col.Header}
                <span style={{ marginLeft: 8 }}>{sortBy.id === col.id ? (sortBy.desc ? ' 🔽' : ' 🔼') : ''}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 && (
            <tr>
              <td colSpan={cols.length} style={{ padding: 12, textAlign: 'center' }}>No data</td>
            </tr>
          )}
          {pageData.map((row, rIdx) => (
            <tr key={rIdx} style={{ borderBottom: '1px solid #f0f0f0' }}>
              {cols.map(col => {
                const value = getCellValue(row, col);
                return (
                  <td key={col.id} style={{ padding: 8 }}>
                    {col.Cell ? col.Cell({ value, row }) : (value != null ? String(value) : '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
        <div>
          <button onClick={() => { setPageIndex(0); }} disabled={currentPage === 0}>First</button>{' '}
          <button onClick={() => { setPageIndex(p => Math.max(0, p - 1)); }} disabled={currentPage === 0}>Prev</button>{' '}
          <button onClick={() => { setPageIndex(p => Math.min(pageCount - 1, p + 1)); }} disabled={currentPage >= pageCount - 1}>Next</button>{' '}
          <button onClick={() => { setPageIndex(pageCount - 1); }} disabled={currentPage >= pageCount - 1}>Last</button>
        </div>

        <div>
          Page <strong>{currentPage + 1} of {pageCount}</strong>
          {' '}| Go to:{' '}
          <input
            type="number"
            value={currentPage + 1}
            onChange={e => {
              const v = Number(e.target.value);
              if (!Number.isFinite(v)) return;
              const p = Math.max(1, Math.min(pageCount, v));
              setPageIndex(p - 1);
            }}
            style={{ width: 60 }}
          />
        </div>

        <div>
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPageIndex(0); }}>
            {pageSizeOptions.map(ps => (
              <option key={ps} value={ps}>{ps} / page</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
