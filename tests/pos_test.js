const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync((process.argv[2]||require('path').join(__dirname,'..','app.js')),'utf8');
const fa=src.indexOf('const FORMATIONS_MAP = {'), fb=src.indexOf('\n};\n',fa)+3;
const a=src.indexOf('const MATCHSIM = {'), b=src.indexOf('\n};\n',a)+3;
const ctx={console,Math};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(src.slice(fa,fb)+src.slice(a,b)+'\n;globalThis.MATCHSIM=MATCHSIM;globalThis.FM=FORMATIONS_MAP;',ctx);
const M=ctx.MATCHSIM,FM=ctx.FM; let T=0; M.now=()=>T;
let tot=0, worst=0, rows=[];
for(const fn of Object.keys(FM)){
  const tac={style:'possession',mentality:'balanced',chan:'mixed',press:'half',line:'normal'};
  M.TICK=3300; M.init({homeForm:FM[fn],awayForm:FM['4-4-2'],homeTac:tac,awayTac:tac,homeForce:75,awayForce:70,homeNames:[],awayNames:[],homeRoles:null,awayRoles:null});
  let off=0,n=0,att=0,def=0;
  for(let k=0;k<300;k++){T+=M.TICK;M.tick();T+=M.TICK*0.9;
    const H=M.H,A=M.A;
    const ld=Math.max(...A.p.filter(p=>p.role!=='GK').map(p=>p.x));
    H.p.forEach(p=>{if(p.role!=='GK'&&p.x>ld+0.01&&p.x>M.ball.x+0.01)off++;});
    att+=H.p.filter(p=>p.role==='ATT').reduce((s,p)=>s+p.x,0)/Math.max(1,H.p.filter(p=>p.role==='ATT').length);
    def+=H.p.filter(p=>p.role==='DEF').reduce((s,p)=>s+p.x,0)/H.p.filter(p=>p.role==='DEF').length; n++;}
  rows.push(`${fn.padEnd(10)} DEF ${(def/n).toFixed(0).padStart(2)}  ATT ${(att/n).toFixed(0).padStart(2)}  hors-jeu/tick ${(off/n).toFixed(2)}`);
  tot+=off/n; worst=Math.max(worst,off/n);
}
console.log(rows.join('\n')); console.log('moyenne hors-jeu/tick (équipe H, 15 formations):',(tot/Object.keys(FM).length).toFixed(3),'| pire:',worst.toFixed(2));
