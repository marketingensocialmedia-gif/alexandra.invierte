/* ============================================================
   El Círculo — interacciones
   ============================================================ */
(function(){
  'use strict';

  /* ---------- TICKER ---------- */
  const TICK = [
    {s:'ORO',     v:'3.412', c:+1.24}, {s:'S&P 500', v:'6.412', c:+0.84},
    {s:'NASDAQ',  v:'23.118',c:+1.02}, {s:'IBEX 35', v:'12.087',c:+0.63},
    {s:'EUR/USD', v:'1.0921',c:-0.12}, {s:'BTC/USD', v:'104.330',c:+2.41},
    {s:'PETRÓLEO',v:'71.84', c:-0.55}, {s:'DAX',     v:'21.540',c:+0.52},
    {s:'NIKKEI',  v:'42.330',c:-0.18}, {s:'PLATA',   v:'38.21', c:+0.94},
    {s:'US10Y',   v:'4.18%', c:-0.03}, {s:'IBOVESPA',v:'139.204',c:-0.22},
  ];
  const tickEl = document.getElementById('tickerTrack');
  if(tickEl){
    const unit = TICK.map(t=>{
      const up = t.c>=0; const sign=up?'+':''; const arr=up?'▲':'▼';
      return `<span class="tk"><span class="sym">${t.s}</span><span class="val">${t.v}</span><span class="chg ${up?'up':'dn'}">${arr} ${sign}${t.c.toFixed(2)}%</span></span>`;
    }).join('');
    tickEl.innerHTML = unit + unit;
  }

  /* ---------- NAV scrolled ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => { if(nav) nav.classList.toggle('scrolled', window.scrollY>20); };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------- helpers ---------- */
  // smooth path through points [{x,y}]
  function smoothPath(pts){
    if(pts.length<2) return '';
    let d=`M${pts[0].x},${pts[0].y}`;
    for(let i=0;i<pts.length-1;i++){
      const p0=pts[i], p1=pts[i+1];
      const mx=(p0.x+p1.x)/2;
      d+=` Q${p0.x},${p0.y} ${mx},${(p0.y+p1.y)/2}`;
      d+=` Q${p1.x},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }
  function genSeries(n, seed, vol, trend){
    let v=50; const out=[];
    let s=seed;
    const rnd=()=>{ s=(s*9301+49297)%233280; return s/233280; };
    for(let i=0;i<n;i++){
      v += (rnd()-0.5)*vol + trend;
      out.push(v);
    }
    const min=Math.min(...out), max=Math.max(...out);
    return out.map(x=>(x-min)/(max-min||1));
  }

  // build an area/line chart inside an <svg> element
  function drawChart(svg, opts){
    const W=svg.viewBox.baseVal.width||320, H=svg.viewBox.baseVal.height||120;
    const pad=opts.pad||{t:8,r:4,b:8,l:4};
    const data=opts.data;
    const n=data.length;
    const pts=data.map((d,i)=>({
      x: pad.l + i/(n-1)*(W-pad.l-pad.r),
      y: pad.t + (1-d)*(H-pad.t-pad.b)
    }));
    const line=smoothPath(pts);
    const ns='http://www.w3.org/2000/svg';
    const stroke=opts.stroke||'#d8b367';
    // gradient fill
    const gid='g'+Math.random().toString(36).slice(2,7);
    const defs=document.createElementNS(ns,'defs');
    const lg=document.createElementNS(ns,'linearGradient');
    lg.setAttribute('id',gid); lg.setAttribute('x1','0');lg.setAttribute('y1','0');lg.setAttribute('x2','0');lg.setAttribute('y2','1');
    lg.innerHTML=`<stop offset="0" stop-color="${stroke}" stop-opacity="0.28"/><stop offset="1" stop-color="${stroke}" stop-opacity="0"/>`;
    defs.appendChild(lg); svg.appendChild(defs);

    if(opts.fill!==false){
      const area=document.createElementNS(ns,'path');
      area.setAttribute('d', line+` L${pts[n-1].x},${H} L${pts[0].x},${H} Z`);
      area.setAttribute('fill',`url(#${gid})`);
      area.style.opacity='0'; area.style.transition='opacity 1s .5s ease';
      svg.appendChild(area);
      requestAnimationFrame(()=>{ area.style.opacity='1'; });
    }
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',line); path.setAttribute('fill','none');
    path.setAttribute('stroke',stroke); path.setAttribute('stroke-width',opts.sw||2);
    path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round');
    svg.appendChild(path);
    const len=path.getTotalLength();
    path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
    path.style.transition=`stroke-dashoffset ${opts.dur||1.6}s var(--ease)`;
    requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ path.style.strokeDashoffset='0'; }); });
    // safety: ensure final state even if transitions are frozen
    setTimeout(()=>{ path.style.transition='none'; path.style.strokeDashoffset='0'; }, ((opts.dur||1.6)*1000)+200);

    // endpoint dot
    if(opts.dot!==false){
      const c=document.createElementNS(ns,'circle');
      c.setAttribute('cx',pts[n-1].x);c.setAttribute('cy',pts[n-1].y);c.setAttribute('r',3);
      c.setAttribute('fill',stroke); c.style.opacity='0'; c.style.transition='opacity .4s 1.4s';
      svg.appendChild(c); requestAnimationFrame(()=>{ c.style.opacity='1'; });
    }
  }

  /* ---------- count up ---------- */
  function countUp(elm){
    const target=parseFloat(elm.dataset.count);
    const dec=parseInt(elm.dataset.dec||'0');
    const suf=elm.dataset.suf||''; const pre=elm.dataset.pre||'';
    const dur=1200; const t0=performance.now();
    function step(t){
      const p=Math.min((t-t0)/dur,1);
      const e=1-Math.pow(1-p,3);
      const val=target*e;
      elm.textContent=pre+val.toLocaleString('es-ES',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- scroll-based reveals + charts + counts (IO-free, robust) ---------- */
  function activate(el){
    if(el.dataset.done) return; el.dataset.done='1';
    el.classList.add('in');
    if(el.dataset.count!==undefined) countUp(el);
    if(el.dataset.pct!==undefined) el.style.width=el.dataset.pct+'%';
    if(el.dataset.chart!==undefined){
      const cfg=JSON.parse(el.dataset.chart||'{}');
      const data=genSeries(cfg.n||28, cfg.seed||7, cfg.vol||9, cfg.trend|| (cfg.up===false? -0.6 : 1.4));
      drawChart(el, {data, stroke:cfg.stroke, sw:cfg.sw, dur:cfg.dur, fill:cfg.fill, dot:cfg.dot, pad:cfg.pad});
    }
    // safety commit: if transitions are throttled/frozen (background tab),
    // hard-set the resting state so content is never stuck invisible.
    if(el.classList.contains('reveal')){
      setTimeout(()=>{ el.style.transition='none'; el.style.opacity='1'; el.style.transform='none'; }, 1300);
    }
  }
  let pending=[...document.querySelectorAll('.reveal,[data-count],[data-chart],.scarcity .fill')];
  function sweep(){
    const vh=window.innerHeight||document.documentElement.clientHeight;
    pending=pending.filter(el=>{
      const r=el.getBoundingClientRect();
      if(r.top < vh-60 && r.bottom > 0){ activate(el); return false; }
      return true;
    });
  }
  let ticking=false;
  function onScrollSweep(){ if(ticking) return; ticking=true; requestAnimationFrame(()=>{ sweep(); ticking=false; }); }
  window.addEventListener('scroll', onScrollSweep, {passive:true});
  window.addEventListener('resize', onScrollSweep, {passive:true});
  // initial passes (cover late layout / font load)
  sweep(); setTimeout(sweep,120); setTimeout(sweep,600);

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item=btn.parentElement;
      const ans=item.querySelector('.ans');
      const open=item.classList.contains('open');
      document.querySelectorAll('.faq.open').forEach(f=>{ f.classList.remove('open'); f.querySelector('.ans').style.maxHeight=null; });
      if(!open){ item.classList.add('open'); ans.style.maxHeight=ans.scrollHeight+'px'; }
    });
  });

  /* ---------- hero spark (immediate) ---------- */
  const heroSpark=document.getElementById('heroSpark');
  if(heroSpark){
    const data=genSeries(24, 31, 8, 1.2);
    drawChart(heroSpark,{data, stroke:'#84d8a4', sw:2, dur:1.8, fill:true, dot:true, pad:{t:6,r:4,b:6,l:4}});
  }

})();
