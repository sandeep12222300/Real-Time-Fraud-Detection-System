// app.js - main logic: fetch data, update KPIs, render charts and table
(function(){
  const apiUrlSpan = document.getElementById('apiUrlSpan');
  const lastUpdatedSpan = document.getElementById('lastUpdatedSpan');
  const yearSpan = document.getElementById('yearSpan'); if(yearSpan) yearSpan.textContent = new Date().getFullYear();

  const refreshBtn = document.getElementById('refreshBtn');
  const tableMeta = document.getElementById('tableMeta');
  const tableWrap = document.getElementById('tableWrap');
  const tableBody = document.querySelector('#predictionsTable tbody');

  const kpiEls = {
    total: document.querySelector('.statCard[data-kpi="total"] .statValue'),
    fraud: document.querySelector('.statCard[data-kpi="fraud"] .statValue'),
    safe: document.querySelector('.statCard[data-kpi="safe"] .statValue'),
    fraudRate: document.querySelector('.statCard[data-kpi="fraudRate"] .statValue'),
  };

  apiUrlSpan.textContent = (window.FraudApi && window.FraudApi.API_URL) ? window.FraudApi.API_URL : '/api/fraud/predictions';

  let data = [];
  let isLoading = false;
  let error = null;
  let lastUpdated = null;
  let pollId = null;

  function setLoading(v){ isLoading = !!v; tableMeta.textContent = isLoading ? 'Loading...' : (error ? error.message : ''); }

  async function fetchData(signal){
    setLoading(true); error = null;
    try {
      const json = await window.FraudApi.fetchPredictions({ signal });
      if(!Array.isArray(json)) throw new Error('Invalid API response: expected an array');
      data = json;
      lastUpdated = Date.now();
      lastUpdatedSpan.textContent = new Date(lastUpdated).toLocaleTimeString();
      renderAll();
    } catch (err) {
      if(err.name === 'AbortError') return;
      error = err; tableMeta.textContent = err.message || 'Error fetching data';
      // clear table
      renderTable([]);
    } finally { setLoading(false); }
  }

  function computeKpis(rows){
    const total = rows.length;
    const fraudCount = rows.filter(r=>r.fraud).length;
    const safe = total - fraudCount;
    const fraudRate = total === 0 ? 0 : (fraudCount / total) * 100;
    return { total, fraudCount, safe, fraudRate };
  }

  function renderKpis(rows){
    const k = computeKpis(rows);
    if(kpiEls.total) kpiEls.total.textContent = k.total;
    if(kpiEls.fraud) kpiEls.fraud.textContent = k.fraudCount;
    if(kpiEls.safe) kpiEls.safe.textContent = k.safe;
    if(kpiEls.fraudRate) kpiEls.fraudRate.textContent = (k.total===0? '0%': (k.fraudRate.toFixed(1)+'%'));
  }

  function renderTable(rows){
    while(tableBody.firstChild) tableBody.removeChild(tableBody.firstChild);
    if(rows.length===0){
      const tr = document.createElement('tr');
      const td = document.createElement('td'); td.className='emptyRow'; td.colSpan=5; td.textContent = error ? (error.message || 'Error') : 'No data available';
      tr.appendChild(td); tableBody.appendChild(tr); return; }

    rows.forEach((r, idx)=>{
      const tr = document.createElement('tr');
      const idTd = document.createElement('td'); idTd.textContent = r.id || ('#'+(idx+1)); tr.appendChild(idTd);
      const txTd = document.createElement('td'); txTd.textContent = r.transactionId || '' ; tr.appendChild(txTd);
      const amtTd = document.createElement('td'); amtTd.style.textAlign='right'; amtTd.textContent = '₹' + Number(r.amount || 0).toLocaleString(); tr.appendChild(amtTd);
      const stTd = document.createElement('td'); const pill = document.createElement('span'); pill.className = 'pill ' + ((r.fraud)?'pillDanger':'pillSuccess'); pill.textContent = (r.fraud? 'FRAUD':'SAFE'); stTd.appendChild(pill); tr.appendChild(stTd);
      const confTd = document.createElement('td'); confTd.style.textAlign='right'; confTd.textContent = (Number(r.confidence)||0).toFixed(2); tr.appendChild(confTd);
      tableBody.appendChild(tr);
    });
  }

  function renderCharts(rows){
    const fraudCount = rows.filter(r=>r.fraud).length;
    const safeCount = rows.length - fraudCount;
    Charts.renderBarChart(document.getElementById('barChart'), [{name:'Fraud', count: fraudCount}, {name:'Safe', count: safeCount}]);

    const confidenceData = rows.map((r,idx)=>({ index: idx+1, tx: r.transactionId, confidence: Number(r.confidence)||0 }));
    Charts.renderLineChart(document.getElementById('lineChart'), confidenceData);
  }

  function renderAll(){ renderKpis(data); renderTable(data); renderCharts(data); }

  function measureTableHeight(){
    try{
      const topNavH = document.getElementById('topNav')?.getBoundingClientRect().height || 0;
      const kpiH = document.getElementById('kpiRow')?.getBoundingClientRect().height || 0;
      const chartsH = document.querySelector('.chartsRow')?.getBoundingClientRect().height || 0;
      const footerH = document.getElementById('footer')?.getBoundingClientRect().height || 0;
      const pagePadding = 32;
      const available = Math.max(120, window.innerHeight - topNavH - kpiH - chartsH - footerH - pagePadding);
      if(tableWrap) { tableWrap.style.height = available + 'px'; tableWrap.style.maxHeight = available + 'px'; tableWrap.style.overflowY = 'auto'; }
    } catch(e){}
  }

  // initial load + polling
  function startPoll(){
    if(pollId) clearInterval(pollId);
    const controller = new AbortController();
    fetchData(controller.signal);
    pollId = setInterval(()=>{ const c = new AbortController(); fetchData(c.signal).catch(()=>{}); }, 5000);
  }

  refreshBtn.addEventListener('click', ()=>{ const c = new AbortController(); fetchData(c.signal).catch(()=>{}); });

  window.addEventListener('resize', ()=>{ measureTableHeight(); // debounce
    if(window._resizeTo) clearTimeout(window._resizeTo); window._resizeTo = setTimeout(()=>{ renderCharts(data); }, 200);
  });

  // support debugTable=1
  function applyDebugTable(){ try{ const params = new URLSearchParams(window.location.search); if(params.get('debugTable')==='1'){ const base = (data && data.length)? data:[{ id:'demo-1', transactionId:'TX-DEMO-1', amount:123.45, fraud:false, confidence:0.12 }]; const out=[]; for(let i=0;i<60;i++){ const src = base[i%base.length]; out.push(Object.assign({}, src, { id: (src.id||'demo') + '-' + (i+1), transactionId: (src.transactionId||'TX') + '-' + (i+1) })); } data = out; renderAll(); } }catch(e){} }

  // init
  (function init(){ measureTableHeight(); if(window.FraudApi) startPoll(); else { tableMeta.textContent='API module missing'; }
    // set year done earlier
    setTimeout(()=>{ applyDebugTable(); }, 300);
  })();
})();
