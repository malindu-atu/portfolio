'use strict';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

/* ══════════ LOADER ══════════ */
{
  const fill=$('#ld-fill'), msg=$('#ld-msg'), pct=$('#ld-pct'), ld=$('#loader');
  const steps=['booting kernel...','loading modules...','compiling assets...','mounting UI...','all systems go ✓'];
  let p=0;
  const t=setInterval(()=>{
    p=Math.min(p+Math.random()*14+5,100);
    fill.style.width=p+'%';
    msg.textContent=steps[Math.min(Math.floor(p/25),steps.length-1)];
    pct.textContent=Math.round(p)+'%';
    if(p>=100){clearInterval(t);setTimeout(()=>ld.classList.add('gone'),650);}
  },105);
}

/* ══════════ CURSOR ══════════ */
const cur=$('#cursor'), ring=$('#cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
document.addEventListener('mousedown',()=>cur.classList.add('clk'));
document.addEventListener('mouseup',()=>cur.classList.remove('clk'));
document.addEventListener('mouseover',e=>{
  if(e.target.closest('a,button,.proj-card,.skill-card,.soc-lnk,.tag')){cur.classList.add('hov');ring.classList.add('hov');}
});
document.addEventListener('mouseout',e=>{
  if(e.target.closest('a,button,.proj-card,.skill-card,.soc-lnk,.tag')){cur.classList.remove('hov');ring.classList.remove('hov');}
});
(function loop(){
  cur.style.left=mx+'px';cur.style.top=my+'px';
  rx+=(mx-rx)*.09;ry+=(my-ry)*.09;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(loop);
})();

/* ══════════ SCROLL / NAV SPY ══════════ */
const pbar=$('#progress-bar'), nav=$('#navbar');
window.addEventListener('scroll',()=>{
  const s=document.documentElement;
  pbar.style.width=(s.scrollTop/(s.scrollHeight-s.clientHeight)*100)+'%';
  nav.classList.toggle('scrolled',scrollY>50);
  let c='';
  $$('section[id]').forEach(sec=>{if(scrollY>=sec.offsetTop-160)c=sec.id;});
  $$('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+c));
  if($('.blob-1'))$('.blob-1').style.transform=`translateY(${scrollY*.15}px)`;
  if($('.blob-2'))$('.blob-2').style.transform=`translateY(${-scrollY*.1}px)`;
  if($('.hero-deco'))$('.hero-deco').style.transform=`translateY(calc(-50% + ${scrollY*.22}px))`;
},{passive:true});

/* ══════════ CANVAS ══════════ */
{
  const cv=$('#bg-canvas'), ctx=cv.getContext('2d');
  let W,H;
  const mouse={x:-9999,y:-9999};
  const resize=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;};
  resize();addEventListener('resize',resize,{passive:true});
  addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
  const pts=Array.from({length:95},()=>({
    x:Math.random()*1920,y:Math.random()*1080,
    vx:(Math.random()-.5)*.24,vy:(Math.random()-.5)*.24,
    r:Math.random()*1.5+.4,a:Math.random()*.34+.07,
    c:['100,255,218','167,139,250','244,114,182'][Math.floor(Math.random()*3)]
  }));
  const stars=[];
  setInterval(()=>stars.push({x:Math.random()*W,y:0,len:Math.random()*90+40,spd:Math.random()*7+4,a:1,ang:Math.PI/4+(Math.random()-.5)*.5}),3000);
  (function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=stars.length-1;i>=0;i--){
      const s=stars[i];s.x+=Math.cos(s.ang)*s.spd;s.y+=Math.sin(s.ang)*s.spd;s.a-=.012;
      if(s.a<=0){stars.splice(i,1);continue;}
      const g=ctx.createLinearGradient(s.x,s.y,s.x-Math.cos(s.ang)*s.len,s.y-Math.sin(s.ang)*s.len);
      g.addColorStop(0,`rgba(100,255,218,${s.a})`);g.addColorStop(1,'rgba(100,255,218,0)');
      ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-Math.cos(s.ang)*s.len,s.y-Math.sin(s.ang)*s.len);
      ctx.strokeStyle=g;ctx.lineWidth=1.4;ctx.stroke();
    }
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
      if(d<130&&d>0){p.x+=dx/d*2.2;p.y+=dy/d*2.2;}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.c},${p.a})`;ctx.fill();
    });
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);
      if(d<145){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(100,255,218,${.06*(1-d/145)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
    requestAnimationFrame(draw);
  })();
}

/* ══════════ REVEAL ══════════ */
const rvIO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvIO.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -50px 0px'});
$$('.rv,.rv-l,.rv-r,.rv-s').forEach((el,i)=>{
  if(!el.style.transitionDelay)el.style.transitionDelay=(i%4*.07)+'s';
  rvIO.observe(el);
});

/* ══════════ SKILL BARS ══════════ */
const barIO=new IntersectionObserver(es=>{es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.querySelectorAll('.bar-fill').forEach((f,i)=>setTimeout(()=>{f.style.width=f.dataset.w+'%';},i*160));
  barIO.unobserve(e.target);
});},{threshold:.3});
$$('.skill-card').forEach(c=>barIO.observe(c));

/* ══════════ COUNTERS ══════════ */
const cntIO=new IntersectionObserver(es=>{es.forEach(e=>{
  if(!e.isIntersecting)return;
  const tgt=+e.target.dataset.target,dur=1600,t0=performance.now();
  (function tick(now){
    const prog=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-prog,3);
    e.target.textContent=Math.round(ease*tgt)+'+';
    if(prog<1)requestAnimationFrame(tick);
  })(t0);
  cntIO.unobserve(e.target);
});},{threshold:.5});
$$('.sn').forEach(el=>cntIO.observe(el));

/* ══════════ TYPED TEXT ══════════ */
{
  const phrases=['CS Undergraduate','Software Engineer','Frontend Developer','AI / ML Enthusiast','Problem Solver'];
  let pi=0,ci=0,del=false;
  const el=$('#typed-el');
  function tick(){
    const ph=phrases[pi];
    del?ci--:ci++;
    el.innerHTML=ph.slice(0,ci)+'<span class="t-cur">|</span>';
    if(!del&&ci===ph.length){del=true;return setTimeout(tick,2100);}
    if(del&&ci===0){del=false;pi=(pi+1)%phrases.length;}
    setTimeout(tick,del?38:85);
  }
  tick();
}

/* ══════════ MAGNETIC ══════════ */
$$('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.36}px,${(e.clientY-r.top-r.height/2)*.36}px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});

/* ══════════ RIPPLE ══════════ */
$$('.btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const r=btn.getBoundingClientRect(),rp=document.createElement('span');
    rp.className='rpl';rp.style.cssText=`left:${e.clientX-r.left-4}px;top:${e.clientY-r.top-4}px`;
    btn.appendChild(rp);setTimeout(()=>rp.remove(),650);
  });
});

/* ══════════ 3D TILT ══════════ */
$$('.proj-card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    c.style.transform=`perspective(900px) rotateX(${-((e.clientY-r.top)/r.height-.5)*15}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*15}deg) translateY(-8px) scale(1.02)`;
  });
  c.addEventListener('mouseleave',()=>{c.style.transform='';});
});

/* ══════════ SMOOTH ANCHOR ══════════ */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=$(a.getAttribute('href'));if(!t)return;
    e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});
  });
});

/* ══════════ GLITCH trigger ══════════ */
{
  const el=$('.hero-name');
  function doGlitch(){
    if(!el)return;
    el.style.animation='none';requestAnimationFrame(()=>{el.style.animation='';});
    setTimeout(doGlitch,Math.random()*7000+4500);
  }
  setTimeout(doGlitch,4500);
}

/* stagger cards */
$$('.proj-grid .proj-card').forEach((c,i)=>c.style.transitionDelay=i*.07+'s');
$$('.skills-grid .skill-card').forEach((c,i)=>c.style.transitionDelay=i*.1+'s');


/* ══════════════════════════════════════════════════
   ★  CLI TERMINAL ENGINE
══════════════════════════════════════════════════ */
const overlay=$('#term-overlay'), termOut=$('#term-out'), termIn=$('#term-input');
let hist=[],histIdx=-1,booted=false;

/* ── command definitions ── */
 const ASCII_LOGO =
`  __  __     _     _      ___  _   _  ____   _   _
 |  \\/  |   / \\   | |    |_ _|| \\ | ||  _ \\ | | | |
 | |\\/| |  / _ \\  | |     | | |  \\| || | | || | | |
 | |  | | / ___ \\ | |___  | | | |\\  || |_| || |_| |
 |_|  |_|/_/   \\_\\|_____||___||_| \\_||____/  \\___/`;

const CMDS={
  help:()=>[
    {T:'ascii',v:ASCII_LOGO},
    {T:'blank'},{T:'info',v:'Available commands — type any command to run it:'},
    {T:'blank'},
    {T:'kv',k:'about',        v:'Who is Malindu?'},
    {T:'kv',k:'skills',       v:'Full tech stack'},
    {T:'kv',k:'projects',     v:'Shipped projects'},
    {T:'kv',k:'experience',   v:'Work history'},
    {T:'kv',k:'education',    v:'Academic background'},
    {T:'kv',k:'achievements', v:'Awards & achievements'},
    {T:'kv',k:'contact',      v:'Get in touch'},
    {T:'kv',k:'social',       v:'Social links'},
    {T:'kv',k:'resume',       v:'Download resume'},
    {T:'kv',k:'tech',         v:'Detailed tech breakdown'},
    {T:'kv',k:'clear',        v:'Clear terminal'},
    {T:'kv',k:'exit',         v:'Close terminal'},
    {T:'blank'},{T:'muted',v:'Tip: up/down history · Tab autocomplete · Ctrl+` toggle'},
  ],
  about:()=>[
    {T:'blank'},{T:'ok',v:'$ cat about.txt'},{T:'blank'},
    {T:'kv',k:'Name',     v:'Malindu Dominic Inosh Atukorala'},
    {T:'kv',k:'Role',     v:'CS Undergraduate & Software Engineer'},
    {T:'kv',k:'Location', v:'Colombo, Sri Lanka'},
    {T:'kv',k:'Email',    v:'dominic.malindu@gmail.com'},
    {T:'kv',k:'Phone',    v:'+94 776705206'},
    {T:'kv',k:'DOB',      v:'2004/07/28'},
    {T:'kv',k:'GitHub',   v:'github.com/malindu-atu'},
    {T:'kv',k:'LinkedIn', v:'linkedin.com/in/malindu-atukorala'},
    {T:'kv',k:'Status',   v:'Open to opportunities'},
    {T:'blank'},
    {T:'out',v:'Motivated CS undergraduate with a strategic mindset and a proven'},
    {T:'out',v:'ability to develop and deliver high-quality solutions efficiently.'},
    {T:'out',v:'Dedicated to teamwork, innovation, and problem-solving.'},
    {T:'blank'},
  ],
  skills:()=>[
    {T:'blank'},{T:'info',v:'$ cat skills.json'},{T:'blank'},
    {T:'kv',k:'Programming', v:'Java · Python'},
    {T:'kv',k:'Frontend',    v:'Next.js · React.js · JavaScript · Framer Motion · Webflow'},
    {T:'kv',k:'Backend',     v:'FastAPI · Python'},
    {T:'kv',k:'Database',    v:'PostgreSQL · Supabase'},
    {T:'kv',k:'AI / ML',     v:'Qdrant (Vector DB) · Neo4j (Graph DB) · Groq · RAG Pipelines'},
    {T:'kv',k:'Platforms',   v:'GitHub · Vercel · Render · Railway'},
    {T:'kv',k:'Soft Skills', v:'Communication · Teamwork · Leadership · Time Management'},
    {T:'blank'},
    mkBar('Next.js / React',       88),
    mkBar('Python / FastAPI',      85),
    mkBar('JavaScript',            85),
    mkBar('PostgreSQL / Supabase', 83),
    mkBar('AI / RAG Pipelines',    78),
    {T:'blank'},
  ],
  projects:()=>[
    {T:'blank'},{T:'info',v:'$ ls ./projects'},{T:'blank'},
    {T:'kv',k:'[1] MapMyZ',        v:'React · TypeScript · Leaflet / Maps API · Geolocation'},
    {T:'out',v:'Interactive map explorer — pin, annotate & discover places of interest.'},
    {T:'out',v:'Smooth map interactions · geolocation · responsive UI.'},
    {T:'out',v:'github.com/malindu-atu/MapMyZ'},
    {T:'blank'},
    {T:'kv',k:'[2] LKR Rates v2',  v:'React · TypeScript · Exchange Rate API · Real-time Data'},
    {T:'out',v:'Real-time Sri Lankan Rupee exchange rate tracker (v2 rebuild).'},
    {T:'out',v:'Live currency conversion · historical trends · fast data fetching.'},
    {T:'out',v:'github.com/malindu-atu/lkr-rates-v2'},
    {T:'blank'},
    {T:'kv',k:'[3] Nyaya',         v:'Next.js · TypeScript · FastAPI · Groq · Qdrant · Neo4j · Supabase'},
    {T:'out',v:'Legal education platform for Sri Lankan constitutional law.'},
    {T:'out',v:'Hybrid RAG pipeline · 9,500+ legal doc chunks · AI Citation Manager.'},
    {T:'blank'},
    {T:'kv',k:'[4] FBL Soccer',    v:'React · FastAPI · Groq Llama 4 Scout · Supabase · PostgreSQL'},
    {T:'out',v:'Football academy management across multiple locations in Sri Lanka.'},
    {T:'out',v:'AI enrollment · scheduling · attendance tracking · payment management.'},
    {T:'blank'},
    {T:'kv',k:'[5] Cherry Global', v:'Webflow · UI/UX Design'},
    {T:'out',v:'Venture-backed supply chain ecosystem website (Sep 2025).'},
    {T:'out',v:'AI-driven automation · strategic advisory · digital transformation.'},
    {T:'blank'},
    {T:'kv',k:'[6] ConexusOne',    v:'Webflow · UI/UX Design'},
    {T:'out',v:'Unified AI-powered logistics platform (Nov 2024).'},
    {T:'out',v:'Real-time supply chain visibility · automated freight management.'},
    {T:'blank'},
  ],
  experience:()=>[
    {T:'blank'},{T:'info',v:'$ git log --experience'},{T:'blank'},
    {T:'kv',k:'Apr–Oct 2024', v:'Trainee Software Engineer @ Inivos Technology (Pvt) Ltd'},
    {T:'out',v:'Revamped company website · end-to-end UI design for multiple projects.'},
    {T:'blank'},
  ],
  education:()=>[
    {T:'blank'},{T:'info',v:'$ cat education.txt'},{T:'blank'},
    {T:'kv',k:'2024–Present', v:'BSc (Hons) Computer Science — University of Westminster'},
    {T:'out',v:'2nd Year: OOP · DB Systems · ML & Data Mining · Client-Server Arch · Algorithms'},
    {T:'out',v:'1st Year: Software Dev I & II · Web Design · Maths Computing · CS Fundamentals'},
    {T:'blank'},
    {T:'kv',k:'2023', v:'GCE A/Levels — St. Peter\'s College Colombo 04'},
    {T:'out',v:'B and 2Cs (Mathematics stream)'},
    {T:'blank'},
    {T:'kv',k:'2021', v:'GCE O/Levels — St. Peter\'s College Colombo 04'},
    {T:'out',v:'9As — outstanding academic performance'},
    {T:'blank'},
    {T:'kv',k:'2020', v:'Diploma in ICT — University of ICBT'},
    {T:'kv',k:'2019', v:'Diploma in Speech & Drama — New Era Academy London'},
    {T:'blank'},
  ],
  achievements:()=>[
    {T:'blank'},{T:'info',v:'$ cat achievements.txt'},{T:'blank'},
    {T:'kv',k:'Head Prefect',    v:'St. Peter\'s College Colombo 04 — 2023/24'},
    {T:'kv',k:'Peterite Gold',   v:'Prestigious award for academic & overall excellence'},
    {T:'kv',k:'Media Unit',      v:'Head of Compeering — Peterite Media Unit 2022/23'},
    {T:'blank'},
    {T:'info',v:'Football Career'},{T:'blank'},
    {T:'kv',k:'National',    v:'Sri Lanka U-15 SAFF Championship — India 2019'},
    {T:'kv',k:'National',    v:'Sri Lanka U-16 AFC Championship — Jordan 2019'},
    {T:'kv',k:'Captain',     v:'U-20 Soccer Team — St. Peter\'s College'},
    {T:'kv',k:'Award',       v:'Most Outstanding Sportsman 2019'},
    {T:'kv',k:'All-Island',  v:'1st Runners-up — U-20 Papare Soccer Tournament'},
    {T:'blank'},
  ],
  contact:()=>[
    {T:'blank'},{T:'ok',v:'$ cat contact.txt'},{T:'blank'},
    {T:'kv',k:'Email',    v:'dominic.malindu@gmail.com'},
    {T:'kv',k:'Phone',    v:'+94 776705206'},
    {T:'kv',k:'GitHub',   v:'github.com/malindu-atu'},
    {T:'kv',k:'LinkedIn', v:'linkedin.com/in/malindu-atukorala'},
    {T:'kv',k:'Location', v:'Colombo, Sri Lanka'},
    {T:'blank'},{T:'out',v:'Open to internships, part-time roles, and project collaborations.'},{T:'blank'},
  ],
  social:()=>[
    {T:'blank'},{T:'info',v:'$ cat social.txt'},{T:'blank'},
    {T:'kv',k:'GitHub',   v:'github.com/malindu-atu'},
    {T:'kv',k:'LinkedIn', v:'linkedin.com/in/malindu-atukorala'},
    {T:'kv',k:'Email',    v:'dominic.malindu@gmail.com'},
    {T:'kv',k:'Phone',    v:'+94 776705206'},
    {T:'blank'},
  ],
  resume:()=>[
    {T:'blank'},{T:'ok',v:'Initiating download...'},
    {T:'out',v:'Malindu_Atukorala_CV.pdf → ready'},
    {T:'out',v:'[In a live deployment this would trigger the CV download]'},{T:'blank'},
  ],
  tech:()=>[
    {T:'blank'},{T:'info',v:'$ cat tech-stack.txt'},{T:'blank'},
    {T:'kv',k:'Languages',  v:'Java · Python · JavaScript · TypeScript · SQL'},
    {T:'kv',k:'Frontend',   v:'Next.js · React.js · Framer Motion · Webflow · Tailwind CSS'},
    {T:'kv',k:'Backend',    v:'FastAPI · Python'},
    {T:'kv',k:'Databases',  v:'PostgreSQL · Supabase · Qdrant (Vector) · Neo4j (Graph)'},
    {T:'kv',k:'AI / ML',    v:'Groq · Llama 4 Scout · Hybrid RAG · Semantic Search'},
    {T:'kv',k:'Platforms',  v:'GitHub · Vercel · Render · Railway'},
    {T:'blank'},
  ],
  clear:()=>{termOut.innerHTML='';return[];},
  exit:()=>{closeTerm();return[];},
};

function mkBar(label,pct){
  const f=Math.round(pct/5),e=20-f;
  return{T:'bar',label,pct,f,e};
}

/* ── render a single line ── */
function renderLn(item,delay){
  return new Promise(res=>setTimeout(()=>{
    const d=document.createElement('div');
    d.className='tln';
    switch(item.T){
      case'ascii': d.innerHTML=`<span class="t-ascii">${escH(item.v)}</span>`;break;
      case'blank': d.innerHTML='<span class="t-blank"></span>';break;
      case'info':  d.innerHTML=`<span class="t-info">${item.v}</span>`;break;
      case'ok':    d.innerHTML=`<span class="t-ok">${item.v}</span>`;break;
      case'out':   d.innerHTML=`<span class="t-out">${item.v}</span>`;break;
      case'muted': d.innerHTML=`<span class="t-out" style="color:var(--dim)">${item.v}</span>`;break;
      case'err':   d.innerHTML=`<span class="t-err">${item.v}</span>`;break;
      case'kv':
        d.innerHTML=`<span class="t-out"><span class="t-key" style="padding-left:1.2rem;min-width:120px;display:inline-block">${item.k}</span><span class="t-val">${item.v}</span></span>`;
        break;
      case'bar':
        d.innerHTML=`<span class="t-out" style="padding-left:1.2rem"><span class="t-key" style="min-width:105px;display:inline-block">${item.label}</span> <span class="t-ok">${'█'.repeat(item.f)}${'░'.repeat(item.e)}</span> <span class="t-val">${item.pct}%</span></span>`;
        break;
    }
    termOut.appendChild(d);
    termOut.scrollTop=termOut.scrollHeight;
    res();
  },delay));
}

function escH(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

async function printLines(lines){
  let delay=0;
  for(const ln of lines){await renderLn(ln,delay);delay+=ln.T==='blank'?18:32;}
}

function printPrompt(cmd){
  const d=document.createElement('div');d.className='tln';
  d.innerHTML=`<span class="t-prompt">visitor@malindu:~$</span> <span class="t-cmd">${escH(cmd)}</span>`;
  termOut.appendChild(d);termOut.scrollTop=termOut.scrollHeight;
}

async function runCmd(raw){
  const cmd=raw.trim().toLowerCase();
  if(!cmd)return;
  hist.unshift(raw);histIdx=-1;
  printPrompt(raw);
  if(CMDS[cmd]){
    const res=CMDS[cmd]();
    if(res&&res.length)await printLines(res);
  } else {
    await printLines([
      {T:'err',v:`command not found: ${escH(cmd)}`},
      {T:'out',v:"Type 'help' to see all available commands."},
      {T:'blank'},
    ]);
  }
}

/* ── input handling ── */
termIn.addEventListener('keydown',async e=>{
  if(e.key==='Enter'){const v=termIn.value;termIn.value='';await runCmd(v);}
  else if(e.key==='ArrowUp'){e.preventDefault();if(histIdx<hist.length-1){histIdx++;termIn.value=hist[histIdx];}}
  else if(e.key==='ArrowDown'){e.preventDefault();if(histIdx>0){histIdx--;termIn.value=hist[histIdx];}else{histIdx=-1;termIn.value='';}}
  else if(e.key==='Tab'){
    e.preventDefault();
    const v=termIn.value.toLowerCase().trim();
    if(!v)return;
    const match=Object.keys(CMDS).find(k=>k.startsWith(v));
    if(match)termIn.value=match;
  }
  else if(e.key==='Escape')closeTerm();
});

/* ── open / close ── */
function openTerm(){
  overlay.classList.add('open');
  setTimeout(()=>termIn.focus(),360);
  if(!booted){
    booted=true;
    printLines([
      {T:'ascii',v:ASCII_LOGO},
      {T:'blank'},
      {T:'ok',v:"Welcome to Malindu's portfolio terminal  v2.0.0"},
      {T:'out',v:'Type \'help\' to see all commands.'},
      {T:'out',v:'↑/↓ history  ·  Tab autocomplete  ·  Esc or Ctrl+` to close.'},
      {T:'blank'},
    ]);
  }
}
function closeTerm(){overlay.classList.remove('open');}

/* ── bind buttons ── */
$('#term-fab').addEventListener('click',openTerm);
$('#nav-term-btn').addEventListener('click',openTerm);
$('#hero-term-btn').addEventListener('click',openTerm);
$('#term-close').addEventListener('click',closeTerm);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeTerm();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeTerm();
  if((e.ctrlKey||e.metaKey)&&e.key==='`'){e.preventDefault();overlay.classList.contains('open')?closeTerm():openTerm();}
});

/* ── tab buttons ── */
$$('.term-tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    $$('.term-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── draggable window ── */
{
  const win=$('#term-win'), bar2=$('#term-bar');
  let dragging=false,ox=0,oy=0;
  bar2.addEventListener('mousedown',e=>{
    if(e.target.closest('button'))return;
    dragging=true;
    const r=win.getBoundingClientRect();
    ox=e.clientX-r.left;oy=e.clientY-r.top;
    win.style.transition='none';win.style.position='fixed';win.style.margin='0';
    win.style.top=r.top+'px';win.style.left=r.left+'px';
    win.style.transform='none';
    overlay.style.alignItems='flex-start';overlay.style.justifyContent='flex-start';
  });
  document.addEventListener('mousemove',e=>{
    if(!dragging)return;
    win.style.left=(e.clientX-ox)+'px';win.style.top=(e.clientY-oy)+'px';
  });
  document.addEventListener('mouseup',()=>{dragging=false;});
}

/* ── terminal resize handle ── */
{
  const handle=$('#term-resize'), win=$('#term-win');
  let resizing=false,startX=0,startY=0,startW=0,startH=0;
  handle.addEventListener('mousedown',e=>{
    resizing=true;e.preventDefault();
    startX=e.clientX;startY=e.clientY;
    startW=win.offsetWidth;startH=win.offsetHeight;
    win.style.transition='none';
  });
  document.addEventListener('mousemove',e=>{
    if(!resizing)return;
    const w=Math.max(460,startW+(e.clientX-startX));
    const h=Math.max(320,startH+(e.clientY-startY));
    win.style.width=w+'px';win.style.maxHeight=h+'px';
  });
  document.addEventListener('mouseup',()=>{resizing=false;});
}

/* ════════════════════════════════════════
   THEME SWITCHER
════════════════════════════════════════ */
{
  const html=document.documentElement;
  const swatches=$$('.theme-swatch');
  const saved=localStorage.getItem('mp-theme')||'green';
  applyTheme(saved);

  swatches.forEach(sw=>{
    sw.addEventListener('click',()=>{
      applyTheme(sw.dataset.t);
      localStorage.setItem('mp-theme',sw.dataset.t);
    });
  });

  function applyTheme(t){
    swatches.forEach(s=>s.classList.toggle('active',s.dataset.t===t));
    if(t==='default') html.removeAttribute('data-theme');
    else html.setAttribute('data-theme',t);
    // Update particle colour on theme change
    document.documentElement.style.setProperty('--theme-changed',Date.now());
  }
}

/* ════════════════════════════════════════
   SECTION PROGRESS DOTS
════════════════════════════════════════ */
{
  const dots=$$('.sec-dot');
  dots.forEach(dot=>{
    dot.addEventListener('click',()=>{
      const sec=$(('#'+dot.dataset.sec));
      if(sec) window.scrollTo({top:sec.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});
    });
  });

  function updateDots(){
    let cur='hero';
    $$('section[id]').forEach(sec=>{if(scrollY>=sec.offsetTop-160)cur=sec.id;});
    dots.forEach(d=>d.classList.toggle('active',d.dataset.sec===cur));
  }
  window.addEventListener('scroll',updateDots,{passive:true});
  updateDots();
}

/* ════════════════════════════════════════
   SPARK CURSOR TRAIL
════════════════════════════════════════ */
{
  let lastSparkTime=0;
  document.addEventListener('mousemove',e=>{
    const now=Date.now();
    if(now-lastSparkTime<55)return;
    lastSparkTime=now;
    const spark=document.createElement('div');
    spark.className='spark';
    spark.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;
      background:${['var(--accent)','var(--a2)','var(--a3)'][Math.floor(Math.random()*3)]};
      width:${Math.random()*4+2}px;height:${Math.random()*4+2}px;`;
    document.body.appendChild(spark);
    setTimeout(()=>spark.remove(),650);
  });
}

/* ════════════════════════════════════════
   CARD GLOW SPOTLIGHT
════════════════════════════════════════ */
$$('.proj-card,.skill-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ════════════════════════════════════════
   COMMAND PALETTE  (Ctrl+K)
════════════════════════════════════════ */
{
  const palOverlay=$('#palette-overlay');
  const palInput=$('#palette-input');
  const palResults=$('#palette-results');

  const PALETTE_ITEMS=[
    {icon:'~',  name:'Home',                  kbd:'',       action:()=>scrollToSec('hero')},
    {icon:'>',  name:'About',                 kbd:'',       action:()=>scrollToSec('about')},
    {icon:'{}', name:'Skills',                kbd:'',       action:()=>scrollToSec('skills')},
    {icon:'[]', name:'Projects',              kbd:'',       action:()=>scrollToSec('projects')},
    {icon:'//', name:'Experience',            kbd:'',       action:()=>scrollToSec('experience')},
    {icon:'@',  name:'Contact',               kbd:'',       action:()=>scrollToSec('contact')},
    {icon:'_',  name:'Open Terminal',         kbd:'Ctrl+`', action:()=>openTerm()},
    {icon:'*',  name:'Theme: Default',        kbd:'',       action:()=>applyPaletteTheme('default')},
    {icon:'*',  name:'Theme: Cyber',          kbd:'',       action:()=>applyPaletteTheme('cyber')},
    {icon:'*',  name:'Theme: Amber',          kbd:'',       action:()=>applyPaletteTheme('amber')},
    {icon:'*',  name:'Theme: Ocean',          kbd:'',       action:()=>applyPaletteTheme('ocean')},
    {icon:'*',  name:'Theme: Matrix',         kbd:'',       action:()=>applyPaletteTheme('green')},
    {icon:'$',  name:'Terminal: about',       kbd:'', action:()=>{openTerm();setTimeout(()=>runCmd('about'),400)}},
    {icon:'$',  name:'Terminal: projects',    kbd:'', action:()=>{openTerm();setTimeout(()=>runCmd('projects'),400)}},
    {icon:'$',  name:'Terminal: skills',      kbd:'', action:()=>{openTerm();setTimeout(()=>runCmd('skills'),400)}},
    {icon:'$',  name:'Terminal: achievements',kbd:'', action:()=>{openTerm();setTimeout(()=>runCmd('achievements'),400)}},
    {icon:'$',  name:'Terminal: education',   kbd:'', action:()=>{openTerm();setTimeout(()=>runCmd('education'),400)}},
  ];

  function applyPaletteTheme(t){
    const html=document.documentElement;
    $$('.theme-swatch').forEach(s=>s.classList.toggle('active',s.dataset.t===t));
    if(t==='default')html.removeAttribute('data-theme');else html.setAttribute('data-theme',t);
    localStorage.setItem('mp-theme',t);
  }

  function scrollToSec(id){
    const sec=$(('#'+id));
    if(sec)window.scrollTo({top:sec.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});
  }

  let selIdx=0, filtered=[];

  function renderPalette(query){
    const q=(query||'').toLowerCase().trim();
    filtered=q?PALETTE_ITEMS.filter(it=>it.name.toLowerCase().includes(q)):PALETTE_ITEMS;
    selIdx=0;
    palResults.innerHTML='';
    if(!filtered.length){
      palResults.innerHTML='<div style="padding:1.2rem;font-family:var(--fm);font-size:.76rem;color:var(--muted);text-align:center">No results</div>';
      return;
    }
    const groups={Navigation:[],Terminal:[],Theme:[]};
    filtered.forEach(it=>{
      if(it.name.startsWith('Theme'))groups.Theme.push(it);
      else if(it.name.startsWith('Terminal'))groups.Terminal.push(it);
      else groups.Navigation.push(it);
    });
    Object.entries(groups).forEach(([grp,items])=>{
      if(!items.length)return;
      const g=document.createElement('div');g.className='palette-group';
      g.innerHTML=`<div class="palette-group-label">${grp}</div>`;
      items.forEach((it,i)=>{
        const d=document.createElement('div');d.className='palette-item'+(i===0&&grp==='Navigation'?' sel':'');
        d.innerHTML=`<span class="pi-icon">${it.icon}</span><span class="pi-name">${it.name}</span>${it.kbd?`<span class="pi-kbd">${it.kbd}</span>`:''}`;
        d.addEventListener('click',()=>{it.action();closePalette();});
        g.appendChild(d);
      });
      palResults.appendChild(g);
    });
    // mark first item selected
    const first=palResults.querySelector('.palette-item');
    if(first){first.classList.add('sel');selIdx=0;}
  }

  function openPalette(){
    palOverlay.classList.add('open');
    palInput.value='';renderPalette('');
    setTimeout(()=>palInput.focus(),200);
  }
  function closePalette(){palOverlay.classList.remove('open');}

  palInput.addEventListener('input',()=>renderPalette(palInput.value));
  palInput.addEventListener('keydown',e=>{
    const items=[...palResults.querySelectorAll('.palette-item')];
    if(!items.length)return;
    if(e.key==='ArrowDown'){e.preventDefault();selIdx=Math.min(selIdx+1,items.length-1);}
    else if(e.key==='ArrowUp'){e.preventDefault();selIdx=Math.max(selIdx-1,0);}
    else if(e.key==='Enter'){
      e.preventDefault();
      const allItems=PALETTE_ITEMS.filter(it=>{
        const q=palInput.value.toLowerCase().trim();
        return q?it.name.toLowerCase().includes(q):true;
      });
      if(allItems[selIdx]){allItems[selIdx].action();closePalette();}
      return;
    }
    else if(e.key==='Escape'){closePalette();return;}
    items.forEach((el,i)=>el.classList.toggle('sel',i===selIdx));
    items[selIdx]?.scrollIntoView({block:'nearest'});
  });

  palOverlay.addEventListener('click',e=>{if(e.target===palOverlay)closePalette();});
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();palOverlay.classList.contains('open')?closePalette():openPalette();}
  });

  // Expose for terminal hint
  window.openPalette=openPalette;
}

/* ════════════════════════════════════════
   EXTRA TERMINAL COMMANDS (injected after CMDS)
════════════════════════════════════════ */
// Add extra cmds
Object.assign(CMDS,{
  ls:()=>CMDS.projects(),
  cat:()=>CMDS.about(),
  pwd:()=>[{T:'blank'},{T:'ok',v:'/home/malindu/portfolio'},{T:'blank'}],
  whoami:()=>CMDS.about(),
  date:()=>[{T:'blank'},{T:'ok',v:new Date().toUTCString()},{T:'blank'}],
  uname:()=>[{T:'blank'},{T:'out',v:'Portfolio OS v2.0.0 — Malindu Atukorala · Software Engineer'},{T:'blank'}],
  uptime:()=>[{T:'blank'},{T:'out',v:`Portfolio has been running since ${new Date(Date.now()-Math.random()*1e10).toLocaleDateString()}`},{T:'blank'}],
  ping:()=>[
    {T:'blank'},{T:'ok',v:'PING malindu@portfolio.dev — 56 bytes of data'},
    {T:'out',v:'64 bytes: icmp_seq=0 ttl=64 time=0.4 ms'},
    {T:'out',v:'64 bytes: icmp_seq=1 ttl=64 time=0.3 ms'},
    {T:'out',v:'64 bytes: icmp_seq=2 ttl=64 time=0.3 ms'},
    {T:'blank'},{T:'ok',v:'3 packets transmitted, 3 received, 0% packet loss'},{T:'blank'},
  ],
  theme:()=>[
    {T:'blank'},{T:'info',v:'Available themes:'},{T:'blank'},
    {T:'kv',k:'default',v:'Mint green (classic)'},{T:'kv',k:'cyber',v:'Hot pink / cyan'},
    {T:'kv',k:'amber',v:'Warm gold'},{T:'kv',k:'ocean',v:'Sky blue'},
    {T:'kv',k:'green',v:'Matrix green'},
    {T:'blank'},{T:'out',v:'Usage: theme <name>  — or click the swatch panel on the right edge.'},{T:'blank'},
  ],
  sudo:()=>[
    {T:'blank'},{T:'err',v:'Permission denied.'},
    {T:'out',v:"Nice try — you don't have root access here."},{T:'blank'},
  ],
  vim:()=>[
    {T:'blank'},{T:'err',v:'vim: no write access to buffer'},
    {T:'out',v:"Psst — use VSCode like a normal person."},{T:'blank'},
  ],
  git:()=>[
    {T:'blank'},{T:'info',v:'$ git log --oneline --graph'},{T:'blank'},
    {T:'out',v:'* f3a9c21 feat: launch Nyaya legal education platform'},
    {T:'out',v:'* b7d1e44 feat: FBL Soccer Academy management system'},
    {T:'out',v:'* 9c2fa18 feat: Cherry Global supply chain website'},
    {T:'out',v:'* 4e8b377 feat: ConexusOne logistics platform'},
    {T:'out',v:'* d2c1a09 feat: MapMyZ interactive map explorer'},
    {T:'out',v:'* 7f3b8e2 feat: LKR Rates v2 exchange rate tracker'},
    {T:'out',v:'* 1a0d5f2 chore: revamp Inivos Technology website'},
    {T:'out',v:'* e9c3b61 init: portfolio v2.0'},
    {T:'blank'},
  ],
  palette:()=>{window.openPalette&&window.openPalette();return[{T:'blank'},{T:'ok',v:'Opening command palette…'},{T:'blank'}];},
  'theme default':()=>setTheme('default'),
  'theme cyber':()=>setTheme('cyber'),
  'theme amber':()=>setTheme('amber'),
  'theme ocean':()=>setTheme('ocean'),
  'theme green':()=>setTheme('green'),
});

function setTheme(t){
  const html=document.documentElement;
  $$('.theme-swatch').forEach(s=>s.classList.toggle('active',s.dataset.t===t));
  if(t==='default')html.removeAttribute('data-theme');else html.setAttribute('data-theme',t);
  localStorage.setItem('mp-theme',t);
  return[{T:'blank'},{T:'ok',v:`Theme set to: ${t}`},{T:'blank'}];
}

// Override runCmd to also support "theme <name>" as combined cmd
const _origRunCmd=runCmd;
// Patch to handle two-word commands like "theme ocean"
const origRun=runCmd;
window.runCmd=runCmd; // expose for HTML onclick

/* ════════════════════════════════════════
   WEB AUDIO — soft key click (optional)
════════════════════════════════════════ */
{
  let ctx=null;
  function getCtx(){if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();return ctx;}
  function playClick(){
    try{
      const c=getCtx(),o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);
      o.frequency.value=800;g.gain.setValueAtTime(.04,c.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.06);
      o.start();o.stop(c.currentTime+.06);
    }catch(e){}
  }
  function playSuccess(){
    try{
      const c=getCtx(),o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);
      o.type='sine';o.frequency.setValueAtTime(440,c.currentTime);
      o.frequency.exponentialRampToValueAtTime(880,c.currentTime+.12);
      g.gain.setValueAtTime(.05,c.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.18);
      o.start();o.stop(c.currentTime+.18);
    }catch(e){}
  }

  // Key click on terminal input
  termIn.addEventListener('keydown',e=>{if(e.key!=='Enter')playClick();else playSuccess();});

  // Button hover tick
  $$('.btn,.nav-term-btn,.theme-swatch').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      try{
        const c=getCtx(),o=c.createOscillator(),g=c.createGain();
        o.connect(g);g.connect(c.destination);
        o.frequency.value=600;g.gain.setValueAtTime(.025,c.currentTime);
        g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.04);
        o.start();o.stop(c.currentTime+.04);
      }catch(e){}
    });
  });
}

/* ════════════════════════════════════════
   HERO TEXT SCRAMBLE on hover
════════════════════════════════════════ */
{
  const nameEl=$('.hero-name .grad');
  const original='Malindu Atukorala.';
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
  let scrambleFrame=null,iteration=0;

  function scramble(){
    cancelAnimationFrame(scrambleFrame);iteration=0;
    (function tick(){
      nameEl.textContent=original.split('').map((ch,i)=>{
        if(ch===' ')return ' ';
        if(i<iteration)return original[i];
        return chars[Math.floor(Math.random()*chars.length)];
      }).join('');
      if(iteration<original.length){iteration+=.5;scrambleFrame=requestAnimationFrame(tick);}
      else nameEl.textContent=original;
    })();
  }

  const heroH1=$('.hero-name');
  if(heroH1)heroH1.addEventListener('mouseenter',scramble);
}

/* ════════════════════════════════════════
   STAGGER entrance for NAV LINKS
════════════════════════════════════════ */
$$('.nav-links a').forEach((a,i)=>{
  a.style.opacity='0';a.style.transform='translateY(-10px)';
  setTimeout(()=>{
    a.style.transition='opacity .4s ease, transform .4s ease, color .3s';
    a.style.opacity='1';a.style.transform='';
  }, 1200+i*80);
});


/* ════════════════════════════════════════
   SECTION ENTRANCE COUNTER  (e.g. "01 / 06")
════════════════════════════════════════ */
{
  const counter=document.createElement('div');
  counter.id='sec-counter';
  counter.style.cssText=`position:fixed;bottom:2rem;left:5vw;z-index:200;font-family:var(--fm);font-size:.7rem;color:var(--muted);letter-spacing:.12em;opacity:0;transition:opacity .4s`;
  document.body.appendChild(counter);

  const secs=[...$$('section[id]')];
  function updateCounter(){
    let idx=0;
    secs.forEach((s,i)=>{if(scrollY>=s.offsetTop-200)idx=i;});
    counter.textContent=`0${idx+1} / 0${secs.length}`;
    counter.style.opacity='1';
  }
  window.addEventListener('scroll',updateCounter,{passive:true});
  setTimeout(updateCounter,1500);
}

/* ════════════════════════════════════════
   SMOOTH REVEAL for footer
════════════════════════════════════════ */
{
  const footer=$('footer');
  if(footer){
    footer.style.opacity='0';footer.style.transform='translateY(20px)';footer.style.transition='opacity .7s,transform .7s';
    const fo=new IntersectionObserver(([e])=>{if(e.isIntersecting){footer.style.opacity='1';footer.style.transform='';fo.disconnect();}},{threshold:.1});
    fo.observe(footer);
  }
}