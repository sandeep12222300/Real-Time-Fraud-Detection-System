// charts.js - lightweight SVG bar and line chart renderers
(function(global){
  function clear(el) { while(el.firstChild) el.removeChild(el.firstChild); }

  function numberWithCommas(x){ return x.toLocaleString(); }

  function renderBarChart(container, data, opts={}){
    // data: [{name, count}, ...]
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 260;
    clear(container);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.style.display='block';

    const padding = { left:40, right:20, top:12, bottom:28 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    const max = Math.max(1, ...data.map(d=>d.count));

    // defs for gradients
    const defs = document.createElementNS(svgNS,'defs');
    const gradSafe = document.createElementNS(svgNS,'linearGradient'); gradSafe.id='barSafe'; gradSafe.setAttribute('x1','0'); gradSafe.setAttribute('y1','0'); gradSafe.setAttribute('x2','0'); gradSafe.setAttribute('y2','1');
    const s1 = document.createElementNS(svgNS,'stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','#34d399'); s1.setAttribute('stop-opacity','0.9');
    const s2 = document.createElementNS(svgNS,'stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color','#10b981'); s2.setAttribute('stop-opacity','0.6');
    gradSafe.appendChild(s1); gradSafe.appendChild(s2);

    const gradFraud = document.createElementNS(svgNS,'linearGradient'); gradFraud.id='barFraud'; gradFraud.setAttribute('x1','0'); gradFraud.setAttribute('y1','0'); gradFraud.setAttribute('x2','0'); gradFraud.setAttribute('y2','1');
    const f1 = document.createElementNS(svgNS,'stop'); f1.setAttribute('offset','0%'); f1.setAttribute('stop-color','#fb7185'); f1.setAttribute('stop-opacity','0.95');
    const f2 = document.createElementNS(svgNS,'stop'); f2.setAttribute('offset','100%'); f2.setAttribute('stop-color','#ef4444'); f2.setAttribute('stop-opacity','0.7');
    gradFraud.appendChild(f1); gradFraud.appendChild(f2);

    defs.appendChild(gradSafe); defs.appendChild(gradFraud);
    svg.appendChild(defs);

    // axes lines (y ticks)
    const ticks = 3;
    for(let i=0;i<=ticks;i++){
      const y = padding.top + (plotH*(i/ticks));
      const line = document.createElementNS(svgNS,'line');
      line.setAttribute('x1',padding.left); line.setAttribute('x2',w-padding.right); line.setAttribute('y1',y); line.setAttribute('y2',y);
      line.setAttribute('stroke','rgba(255,255,255,0.03)'); line.setAttribute('stroke-width','1');
      svg.appendChild(line);

      const val = Math.round(max*(1 - i/ticks));
      const txt = document.createElementNS(svgNS,'text'); txt.setAttribute('x', padding.left-8); txt.setAttribute('y', y+4);
      txt.setAttribute('fill', 'rgba(151,166,184,0.9)'); txt.setAttribute('font-size','11'); txt.setAttribute('text-anchor','end'); txt.textContent = val;
      svg.appendChild(txt);
    }

    const barCount = data.length;
    const barGap = 18;
    const barW = Math.max(28, (plotW - barGap*(barCount-1)) / barCount);

    data.forEach((d, i) => {
      const x = padding.left + i*(barW+barGap);
      const hPct = d.count / max;
      const barH = Math.max(4, plotH * hPct);
      const y = padding.top + (plotH - barH);

      const rect = document.createElementNS(svgNS,'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barW);
      rect.setAttribute('height', barH);
      rect.setAttribute('rx','8');
      rect.setAttribute('fill', d.name === 'Fraud' ? 'url(#barFraud)' : 'url(#barSafe)');
      svg.appendChild(rect);

      const lbl = document.createElementNS(svgNS,'text'); lbl.setAttribute('x', x + barW/2); lbl.setAttribute('y', h - 8); lbl.setAttribute('fill','rgba(151,166,184,0.9)'); lbl.setAttribute('font-size','12'); lbl.setAttribute('text-anchor','middle'); lbl.textContent = d.name;
      svg.appendChild(lbl);

      // simple hover tooltip
      rect.addEventListener('mousemove', (ev)=>{
        const tip = document.getElementById('chartTooltip');
        tip.style.display='block';
        tip.innerHTML = `<strong>${d.name}</strong><div>${numberWithCommas(d.count)}</div>`;
        tip.style.left = (ev.clientX + 12) + 'px';
        tip.style.top = (ev.clientY + 12) + 'px';
      });
      rect.addEventListener('mouseleave', ()=>{ const tip=document.getElementById('chartTooltip'); if(tip) tip.style.display='none'; });
    });

    container.appendChild(svg);
  }

  function renderLineChart(container, data, opts={}){
    // data: [{index, tx, confidence}, ...]
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 260;
    clear(container);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('width','100%'); svg.setAttribute('height','100%'); svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.style.display='block';

    const padding = { left:40, right:20, top:12, bottom:28 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    const points = data.map((d, i) => ({ x: padding.left + (i/(Math.max(1,data.length-1)))*plotW, y: padding.top + (1 - d.confidence)*plotH, tx: d.tx, val: d.confidence }));

    const defs = document.createElementNS(svgNS,'defs');
    const grad = document.createElementNS(svgNS,'linearGradient'); grad.id='confGradient'; grad.setAttribute('x1','0'); grad.setAttribute('y1','0'); grad.setAttribute('x2','1'); grad.setAttribute('y2','0');
    const cg1 = document.createElementNS(svgNS,'stop'); cg1.setAttribute('offset','0%'); cg1.setAttribute('stop-color','#60a5fa'); cg1.setAttribute('stop-opacity','1');
    const cg2 = document.createElementNS(svgNS,'stop'); cg2.setAttribute('offset','100%'); cg2.setAttribute('stop-color','#7c3aed'); cg2.setAttribute('stop-opacity','1');
    grad.appendChild(cg1); grad.appendChild(cg2);

    const gradFill = document.createElementNS(svgNS,'linearGradient'); gradFill.id='confFill'; gradFill.setAttribute('x1','0'); gradFill.setAttribute('y1','0'); gradFill.setAttribute('x2','0'); gradFill.setAttribute('y2','1');
    const gf1 = document.createElementNS(svgNS,'stop'); gf1.setAttribute('offset','0%'); gf1.setAttribute('stop-color','#60a5fa'); gf1.setAttribute('stop-opacity','0.12');
    const gf2 = document.createElementNS(svgNS,'stop'); gf2.setAttribute('offset','100%'); gf2.setAttribute('stop-color','#7c3aed'); gf2.setAttribute('stop-opacity','0.02');
    gradFill.appendChild(gf1); gradFill.appendChild(gf2);

    defs.appendChild(grad); defs.appendChild(gradFill); svg.appendChild(defs);

    // grid lines: horizontal
    for(let i=0;i<=4;i++){
      const y = padding.top + (plotH*(i/4));
      const line = document.createElementNS(svgNS,'line'); line.setAttribute('x1',padding.left); line.setAttribute('x2',w-padding.right); line.setAttribute('y1',y); line.setAttribute('y2',y); line.setAttribute('stroke','rgba(255,255,255,0.03)'); svg.appendChild(line);
    }

    // polyline path
    const pathD = points.map((p,i)=> `${i===0? 'M':'L'} ${p.x} ${p.y}`).join(' ');
    const path = document.createElementNS(svgNS,'path'); path.setAttribute('d', pathD); path.setAttribute('fill','none'); path.setAttribute('stroke','url(#confGradient)'); path.setAttribute('stroke-width','1.6'); svg.appendChild(path);

    // area under curve
    if(points.length>0){
      const areaD = points.map((p,i)=> `${i===0? 'M':'L'} ${p.x} ${p.y}`).join(' ') + ` L ${padding.left + plotW} ${padding.top+plotH} L ${padding.left} ${padding.top+plotH} Z`;
      const area = document.createElementNS(svgNS,'path'); area.setAttribute('d', areaD); area.setAttribute('fill','url(#confFill)'); area.setAttribute('opacity','0.9'); svg.appendChild(area);
    }

    // interactive points
    points.forEach((p, idx)=>{
      const circ = document.createElementNS(svgNS,'circle'); circ.setAttribute('cx', p.x); circ.setAttribute('cy', p.y); circ.setAttribute('r','4'); circ.setAttribute('fill','#fff'); circ.setAttribute('fill-opacity','0'); circ.setAttribute('stroke','rgba(255,255,255,0.06)'); circ.setAttribute('stroke-width','1');
      svg.appendChild(circ);
      circ.addEventListener('mousemove',(ev)=>{
        const tip = document.getElementById('chartTooltip'); tip.style.display='block'; tip.innerHTML = `<strong>${p.tx || ('#'+(idx+1))}</strong><div>Confidence: ${(p.val||0).toFixed(2)}</div>`; tip.style.left=(ev.clientX+12)+'px'; tip.style.top=(ev.clientY+12)+'px';
      });
      circ.addEventListener('mouseleave',()=>{ const tip = document.getElementById('chartTooltip'); if(tip) tip.style.display='none'; });
    });

    container.appendChild(svg);
  }

  global.Charts = { renderBarChart, renderLineChart };
})(window);
