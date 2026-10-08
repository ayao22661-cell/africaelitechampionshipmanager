// Pilotage réel d'un match (événements minute par minute, comme _tickLiveMatchInner) : mesure ce qui se VOIT.
// Distance des tirs dans le jeu, tireur de corner/coup franc au ballon, joueurs dans la surface au corner.
// Usage : node tests/match_flow_test.js [chemin/app.js]   (TEMPO=slow|normal|fast, GAMES=n)
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync((process.argv[2]||require("path").join(__dirname,"..","app.js")),"utf8").split(String.fromCharCode(13)).join("");
const fa=src.indexOf('const FORMATIONS_MAP = {'), fb=src.indexOf('\n};\n',fa)+3;
const a=src.indexOf('const MATCHSIM = {'), b=src.indexOf('\n};\n',a)+3;
const ctx={console,Math};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext('function roleById(){return null}\n'+src.slice(fa,fb)+src.slice(a,b)+'\n;globalThis.MATCHSIM=MATCHSIM;globalThis.FM=FORMATIONS_MAP;',ctx);
const M=ctx.MATCHSIM,FM=ctx.FM; let T=0; M.now=()=>T;
const TEMPO={slow:[5600,3800],normal:[3300,2200],fast:[1700,1100]}[process.env.TEMPO||'normal'];
const tac={style:'possession',mentality:'balanced',chan:'mixed',press:'half',line:'normal'};
const tac2={style:'counter',mentality:'balanced',chan:'flanks',press:'area',line:'low'};
const timers=[]; const later=(ms,fn)=>timers.push({at:T+ms,fn});
const st={shots:[],cornerTakerDist:[],cornerAttHalf:[],cornerBox:[],relTakerDist:[],spBallRest:[], fkTaker:[]};
let watch=null; // surveille le départ du ballon d'un CPA
function runTo(t){ while(T<t){ T+=16; for(let i=timers.length-1;i>=0;i--) if(timers[i].at<=T){const f=timers[i].fn;timers.splice(i,1);f();}
  if(T-lastTick>=M.TICK){lastTick=T;M.tick();} M.frame(); probe(); } }
let lastTick=0;
const m2=(x,y)=>Math.hypot(x*1.05,y*0.68);
function probe(){
  // départ d'une frappe
  const s=M.shotFly;
  if(s && s.started && !s._seen){ s._seen=1; const Tm=M.team(s.side); const d=m2(s.fromX-Tm.atkX,s.fromY-50); st.shots.push({d,kind:curShot}); }
  if(watch){ const k=watch.key, Tm=M.team(k); const tk=Tm.p[watch.taker]; 
    const moving = M.ball.fly && !M.ball.fly.rest && T>=M.ball.fly.t0; 
    if(moving && !watch.done){ watch.done=1; const p=M.playerNow(k,tk.i); const dd=m2(p.x-watch.x,p.y-watch.y);
      (watch.release?st.relTakerDist:st.cornerTakerDist).push(dd);
      if(watch.kind==='corner'){ const half=Tm.p.filter(q=>q.role!=='GK'&&(M.playerNow(k,q.i).x-50)*Tm.dir>0).length; st.cornerAttHalf.push(half);
        const box=Tm.p.filter(q=>{const n=M.playerNow(k,q.i);return q.role!=='GK'&&Math.abs(n.x-Tm.atkX)<=17&&Math.abs(n.y-50)<=21}).length; st.cornerBox.push(box);} 
      else st.fkTaker.push(dd);
      watch=null; } }
}
let curShot='open';
function shotIdx(Tm,prox){ let tot=0; const w=Tm.p.map(p=>{ const t=p.role==="ATT"?5:p.role==="GK"?0:2; const d=Math.hypot((p.x-Tm.atkX)*1.05,(p.y-50)*0.68); const v=prox?t*Math.exp(-Math.max(0,d-14)/13):t; tot+=v; return v;}); let r=Math.random()*tot; for(let i=0;i<11;i++){ r-=w[i]; if(r<=0) return i;} return 9; }
function shot(key,kind,pre){ const Tm=M.team(key); const si=pre!=null?pre:shotIdx(Tm,true); curShot=kind||'open';
  M.director(key==='H'?'home_shot':'away_shot',{shooterIdx:si,setPiece:kind}); hold(); M.setShotOutcome(Math.random()<0.1?"goal":Math.random()<0.4?"save":"miss"); M.holdScene(M.shotEta()+1800); }
function hold(dur){ dur=dur||M.TICK; if(!(M.holdUntil&&M.holdUntil>M.now()+dur)) M.hold(dur); lastTick=T+dur-M.TICK; }
function setPiece(kind,key,isShot){ const Tm=M.team(key); const taker=1+Math.floor(Math.random()*10); 
  const ms=M.setPiece(kind,key,taker,-1); M.holdScene(ms+2200);
  watch={key,taker,x:M.spot.x,y:M.spot.y,kind,release:!isShot};
  later(ms+250,()=>{ if(isShot){ let si=shotIdx(Tm); if(kind==='freekick') si=taker; if(si===taker&&kind==='corner') si=(taker%10)+1; shot(key,kind,si);} else M.release(key,kind); }); }
for(let game=0;game<+(process.env.GAMES||6);game++){
  M.TICK=TEMPO[0]; watch=null; const ff=Object.keys(FM);
  M.init({homeForm:FM[ff[game%ff.length]],awayForm:FM['4-4-2'],homeTac:game%2?tac:tac2,awayTac:tac,homeForce:72,awayForce:70,homeNames:[],awayNames:[],homeRoles:null,awayRoles:null});
  lastTick=T; M.director('center'); hold(M.TICK*1.1);
  for(let min=1;min<=90;min++){
    while(M.sceneBusy()) runTo(T+100);
    const r=Math.random(); const key=Math.random()<0.5?'H':'A';
    if(r<0.09){ setPiece('corner',key,Math.random()<0.18); }
    else if(r<0.135){ setPiece('freekick',key,Math.random()<0.14); }
    else if(r<0.30){ M.director(key==='H'?'home_attack':'away_attack'); hold(); if(Math.random()<0.45){ M.holdScene(1200); later(800,()=>shot(key)); } }
    else if(min%2===0){ if(!M.sceneBusy()){ M.director('midfield'); hold(); } }
    runTo(T+TEMPO[1]);
  }
}
const q=(arr,p)=>{const s=arr.slice().sort((x,y)=>x-y);return s.length?s[Math.floor((s.length-1)*p)].toFixed(1):'-';};
const sum=(name,arr)=>console.log(name.padEnd(42),'n='+String(arr.length).padEnd(4),'méd',q(arr,0.5),' p90',q(arr,0.9),' max',q(arr,1));
const open=st.shots.filter(s=>s.kind==='open').map(s=>s.d);
sum('Tirs dans le jeu : distance au but (m)',open);
console.log('   tirs > 30 m :',(open.filter(d=>d>30).length/Math.max(1,open.length)*100).toFixed(0)+'%','  > 40 m :',(open.filter(d=>d>40).length/Math.max(1,open.length)*100).toFixed(0)+'%');
sum('Corner (tir) : tireur ↔ ballon au centre (m)',st.cornerTakerDist);
sum('Corner (sans tir) : tireur ↔ ballon (m)',st.relTakerDist);
sum('Corner : attaquants dans le camp adverse',st.cornerAttHalf);
sum('Corner : attaquants dans la surface',st.cornerBox);
sum('Coup franc : tireur ↔ ballon (m)',st.fkTaker);
