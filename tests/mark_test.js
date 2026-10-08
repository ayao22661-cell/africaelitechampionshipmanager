// Marquage en jeu courant : les attaquants sont-ils « tout seuls » ?
// Usage : node tests/mark_test.js [chemin/app.js]
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync((process.argv[2]||require('path').join(__dirname,'..','app.js')),'utf8').split(String.fromCharCode(13)).join('');
const fa=src.indexOf('const FORMATIONS_MAP = {'), fb=src.indexOf('\n};\n',fa)+3;
const a=src.indexOf('const MATCHSIM = {'), b=src.indexOf('\n};\n',a)+3;
const ctx={console,Math};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(src.slice(fa,fb)+src.slice(a,b)+'\n;globalThis.MATCHSIM=MATCHSIM;globalThis.FM=FORMATIONS_MAP;',ctx);
const M=ctx.MATCHSIM,FM=ctx.FM; let T=0; M.now=()=>T;
const tac={style:'possession',mentality:'balanced',chan:'mixed',press:'half',line:'normal'};
let n=0, alone=0, sumD=0, carrierPress=0, carrierN=0, near=0;
for(const fn of ['4-4-2','4-3-3','3-5-2','4-2-3-1']){ if(!FM[fn]) continue;
  M.TICK=2400; M.init({homeForm:FM[fn],awayForm:FM['4-4-2'],homeTac:tac,awayTac:tac,homeForce:75,awayForce:70,homeNames:[],awayNames:[],homeRoles:null,awayRoles:null});
  for(let k=0;k<400;k++){T+=M.TICK;M.tick();T+=M.TICK*0.95;
    const key=M.ball.side, A=M.team(key), D=M.team(M.other(key));
    const dl=D.p.filter(p=>p.role!=='GK');
    // attaquants proches du ballon (≤ 28 unités) hors porteur : sont-ils marqués ?
    A.p.forEach(p=>{ if(p.role==='GK'||p.i===M.ball.idx) return;
      if(Math.hypot(p.x-M.ball.x,(p.y-M.ball.y)*0.65)>28) return;
      const d=Math.min(...dl.map(q=>Math.hypot(q.x-p.x,(q.y-p.y)*0.65)));
      n++; sumD+=d; if(d>9) alone++; });
    // pression sur le porteur
    const c=A.p[M.ball.idx]; if(c){ const d=Math.min(...dl.map(q=>Math.hypot(q.x-c.x,(q.y-c.y)*0.65))); carrierN++; carrierPress+=d; if(d<5) near++; }
  }
}
console.log(JSON.stringify({
 'attaquants proches du ballon (échantillons)':n,
 'distance moyenne au défenseur le plus proche (unités)':(sumD/n).toFixed(1),
 'part « tout seuls » (aucun défenseur à <9)':(alone/n*100).toFixed(0)+' %',
 'porteur : distance moyenne du plus proche adversaire':(carrierPress/carrierN).toFixed(1),
 'porteur pressé (adversaire à <5)':(near/carrierN*100).toFixed(0)+' %'
},null,1));
