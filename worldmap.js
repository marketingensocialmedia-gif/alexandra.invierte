/* ============================================================
   Mapa global de mercados — dot-matrix + hubs financieros
   Genera un mapamundi de puntos a partir de elipses de continentes,
   coloca los hubs financieros y dibuja arcos animados entre ellos.
   ============================================================ */
(function(){
  const VB_W = 1000, VB_H = 520;
  // lon -180..180 -> x ; lat 78..-56 -> y
  const LAT_TOP = 78, LAT_BOT = -56;
  const lon2x = lon => (lon + 180) / 360 * VB_W;
  const lat2y = lat => (LAT_TOP - lat) / (LAT_TOP - LAT_BOT) * VB_H;

  // continent blobs as unions of ellipses [lonC, latC, rx(deg), ry(deg)]
  const BLOBS = [
    // North America
    [-100, 52, 34, 17],[-122, 60, 16, 12],[-95, 36, 22, 12],[-88, 22, 12, 8],[-78, 47, 14, 12],
    // Central America
    [-86, 14, 11, 6],
    // South America
    [-62, -8, 15, 16],[-66, -30, 9, 14],[-58, -42, 6, 9],
    // Europe
    [12, 51, 18, 9],[24, 60, 16, 10],[-4, 41, 8, 7],
    // Africa
    [18, 8, 18, 16],[26, -14, 14, 16],[40, 4, 8, 8],
    // Middle East / Asia
    [55, 28, 16, 12],[78, 24, 12, 11],[95, 48, 40, 18],[108, 30, 22, 13],[125, 38, 12, 10],
    // SE Asia / archipelago
    [108, 5, 12, 8],[122, 0, 10, 6],
    // Australia
    [134, -26, 15, 10],
    // Greenland
    [-42, 72, 12, 9],
  ];

  function inLand(lon, lat){
    for(const [cx,cy,rx,ry] of BLOBS){
      const dx=(lon-cx)/rx, dy=(lat-cy)/ry;
      if(dx*dx+dy*dy <= 1) return true;
    }
    return false;
  }

  // financial hubs
  const HUBS = [
    {id:'ny',  name:'Nueva York', lon:-74,  lat:40.7, idx:'S&P 500', val:'6.412', chg:+0.84, color:'#84d8a4', open:true},
    {id:'mex', name:'Ciudad de México', lon:-99, lat:19.4, idx:'IPC BMV', val:'58.910', chg:+0.41, color:'#84d8a4', open:true},
    {id:'sp',  name:'São Paulo', lon:-46.6, lat:-23.5, idx:'IBOVESPA', val:'139.204', chg:-0.22, color:'#e3906f', open:true},
    {id:'mad', name:'Madrid', lon:-3.7, lat:40.4, idx:'IBEX 35', val:'12.087', chg:+0.63, color:'#84d8a4', open:true},
    {id:'lon', name:'Londres', lon:-0.1, lat:51.5, idx:'FTSE 100', val:'8.946', chg:+0.29, color:'#84d8a4', open:true},
    {id:'fra', name:'Fráncfort', lon:8.7, lat:50.1, idx:'DAX', val:'21.540', chg:+0.52, color:'#84d8a4', open:true},
    {id:'hk',  name:'Hong Kong', lon:114.2, lat:22.3, idx:'HANG SENG', val:'24.118', chg:-0.74, color:'#e3906f', open:false},
    {id:'tok', name:'Tokio', lon:139.7, lat:35.7, idx:'NIKKEI 225', val:'42.330', chg:-0.18, color:'#e3906f', open:false},
  ];

  // arcs (great-circle-ish via quadratic with lifted control point)
  const ARCS = [['ny','lon'],['lon','fra'],['lon','mad'],['ny','sp'],['ny','mex'],['lon','hk'],['hk','tok'],['mad','ny']];

  const svgNS='http://www.w3.org/2000/svg';
  function el(tag, attrs){ const e=document.createElementNS(svgNS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); return e; }

  function build(){
    const stage=document.getElementById('mapStage');
    if(!stage) return;
    const svg=el('svg',{class:'map-svg',viewBox:`0 0 ${VB_W} ${VB_H}`,preserveAspectRatio:'xMidYMid meet'});

    // defs: arc gradient
    const defs=el('defs',{});
    const grad=el('linearGradient',{id:'arcGrad',x1:'0',y1:'0',x2:'1',y2:'0'});
    grad.appendChild(el('stop',{offset:'0',  'stop-color':'#d8b367','stop-opacity':'0'}));
    grad.appendChild(el('stop',{offset:'0.5','stop-color':'#f3d496','stop-opacity':'1'}));
    grad.appendChild(el('stop',{offset:'1',  'stop-color':'#d8b367','stop-opacity':'0'}));
    defs.appendChild(grad);
    svg.appendChild(defs);

    // dot field
    const stepX=13, stepY=13;
    const dotsG=el('g',{});
    for(let y=8; y<VB_H-4; y+=stepY){
      for(let x=6; x<VB_W; x+=stepX){
        const lon=x/VB_W*360-180;
        const lat=LAT_TOP-(y/VB_H)*(LAT_TOP-LAT_BOT);
        if(inLand(lon,lat)){
          const jx=(Math.random()-0.5)*2.4, jy=(Math.random()-0.5)*2.4;
          dotsG.appendChild(el('circle',{class:'dot',cx:x+jx,cy:y+jy,r:1.5}));
        }
      }
    }
    svg.appendChild(dotsG);

    // arcs
    const arcsG=el('g',{});
    const hubMap=Object.fromEntries(HUBS.map(h=>[h.id,h]));
    ARCS.forEach((pair,i)=>{
      const a=hubMap[pair[0]], b=hubMap[pair[1]];
      const x1=lon2x(a.lon),y1=lat2y(a.lat),x2=lon2x(b.lon),y2=lat2y(b.lat);
      const mx=(x1+x2)/2, my=(y1+y2)/2;
      const dist=Math.hypot(x2-x1,y2-y1);
      const lift=Math.min(dist*0.32, 150);
      const cx=mx, cy=my-lift;
      const p=el('path',{class:'arc',d:`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`});
      const len=dist+lift;
      p.style.strokeDasharray=`${len}`;
      p.style.strokeDashoffset=`${len}`;
      p.style.animation=`arcDraw 3.2s ${0.3+i*0.25}s var(--ease) forwards, arcPulse 4s ${3.5+i*0.25}s ease-in-out infinite`;
      arcsG.appendChild(p);
    });
    svg.appendChild(arcsG);

    // hubs
    const tip=document.getElementById('mapTip');
    const hubsG=el('g',{});
    HUBS.forEach((h,i)=>{
      const x=lon2x(h.lon), y=lat2y(h.lat);
      const g=el('g',{});
      const ring=el('circle',{class:'hub-ring',cx:x,cy:y,r:7});
      ring.style.animation=`hubPulse 2.6s ${i*0.18}s ease-out infinite`;
      ring.style.stroke=h.color;
      const ring2=el('circle',{class:'hub-ring',cx:x,cy:y,r:7});
      ring2.style.animation=`hubPulse 2.6s ${i*0.18+1.3}s ease-out infinite`;
      ring2.style.stroke=h.color;
      const core=el('circle',{class:'hub-core',cx:x,cy:y,r:3.2});
      core.style.fill=h.color;
      const hit=el('circle',{class:'hub-hit',cx:x,cy:y,r:18});
      g.appendChild(ring);g.appendChild(ring2);g.appendChild(core);g.appendChild(hit);

      const show=()=>{
        const sign=h.chg>=0?'+':'';
        const col=h.chg>=0?'var(--green)':'var(--red)';
        tip.innerHTML=`<div class="city"><span class="dotled" style="background:${h.color}"></span>${h.name}</div>
          <div class="row"><span>${h.idx}</span><span class="pv">${h.val}</span></div>
          <div class="row"><span>Hoy</span><span class="pv" style="color:${col}">${sign}${h.chg.toFixed(2)}%</span></div>
          <div class="row"><span>Sesión</span><span class="pv">${h.open?'● Abierto':'○ Cerrado'}</span></div>`;
        // position relative to stage
        tip.style.left=(x/VB_W*100)+'%';
        tip.style.top=(y/VB_H*100)+'%';
        tip.classList.add('on');
        core.setAttribute('r','4.4');
      };
      const hide=()=>{ tip.classList.remove('on'); core.setAttribute('r','3.2'); };
      hit.addEventListener('mouseenter',show);
      hit.addEventListener('mouseleave',hide);
      hubsG.appendChild(g);
    });
    svg.appendChild(hubsG);
    stage.insertBefore(svg, stage.firstChild);
  }

  if(document.readyState!=='loading') build();
  else document.addEventListener('DOMContentLoaded',build);
})();
