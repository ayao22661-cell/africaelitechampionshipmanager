// Test des coups de pied arrêtés : à la fin de l'installation, les joueurs sont-ils en place et marqués ?
// Usage : node tests/setpiece_test.js [chemin/app.js]
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync((process.argv[2]||require('path').join(__dirname,'..','app.js')),'utf8').split(String.fromCharCode(13)).join('');
const fa=src.indexOf('const FORMATIONS_MAP = {'), fb=src.indexOf('\n};\n',fa)+3;
const a=src.indexOf('const MATCHSIM = {'), b=src.indexOf('\n};\n',a)+3;
const ctx={console,Math};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(src.slice(fa,fb)+src.slice(a,b)+'\n;globalThis.MATCHSIM=MATCHSIM;globalThis.FM=FORMATIONS_MAP;',ctx);
const M=ctx.MATCHSIM,FM=ctx.FM; let T=0; M.now=()=>T;
const tac={style:'possession',mentality:'balanced',chan:'mixed',press:'half',line:'normal'};
const out={};
for(const scen of ['realiste','extreme']) for(const kind of ['corner','freekick']){
  let inBox=0, attN=0, unmarked=0, defInBox=0, setup=0, n=0, farFromPlay=0, tot=0, att4=0;
  for(let trial=0;trial<200;trial++){
    M.TICK=2400; M.init({homeForm:FM['4-3-3'],awayForm:FM['4-4-2'],homeTac:tac,awayTac:tac,homeForce:75,awayForce:70,homeNames:[],awayNames:[],homeRoles:null,awayRoles:null});
    // on joue quelques tours, puis on envoie le ballon à l'autre bout (cas qui posait problème)
    const k0=5+Math.floor(Math.random()*30);
    for(let k=0;k<k0;k++){T+=M.TICK;M.tick();T+=M.TICK*0.9;}
    const key=Math.random()<0.5?'H':'A'; const Tm=M.team(key), O=M.team(M.other(key));
    const own=Tm.atkX>50?15:85;                        // ballon vers SON propre but : toute l'équipe est loin du but adverse
    if(scen==='extreme'){
    M.ball.x=own; M.ball.y=50; M.ball.side=key; M.ball.fly=null; M.shotFly=null;
    Tm.p.concat(O.p).forEach(p=>{ if(p.role==='GK')return; p.x=p.tx=p.px=p.cx=own+(Tm.atkX>50?1:-1)*(8+Math.random()*30)*(Tm.p.includes(p)?1:1.2); p.y=p.ty=p.py=p.cy=15+Math.random()*70; });
    }
    const ms=M.setPiece(kind,key,9,-1); setup+=ms; n++;
    T+=400; M.ballNow();   // coupure télé éventuelle : les joueurs sont posés sous le fondu (380 ms)
    const gx=Tm.atkX, dir=Tm.dir;
    const outT=Tm.p.filter(p=>p.role!=='GK'&&p.i!==M.spot.takerIdx);
    const boxA=outT.filter(p=>Math.abs(p.x-gx)<=24&&Math.abs(p.y-50)<=24);
    inBox+=boxA.length; attN+=outT.length;
    att4+= (boxA.length>=4?1:0);
    const outO=O.p.filter(p=>p.role!=='GK');
    const boxD=outO.filter(p=>Math.abs(p.x-gx)<=24&&Math.abs(p.y-50)<=24); defInBox+=boxD.length;
    // marquage : attaquant dans la surface avec un défenseur à moins de 6 unités
    boxA.filter(p=>Math.abs(p.x-gx)<=14).forEach(p=>{ const d=Math.min(...outO.map(q=>Math.hypot(q.x-p.x,(q.y-p.y)*0.65))); if(d>6) unmarked++; tot++; });
  }
  out[scen+' / '+kind]={ 'attaquants en place (moy./10)':(inBox/n).toFixed(1), 'tirs avec ≥4 attaquants dans la zone':(att4/n*100).toFixed(0)+' %', 'défenseurs dans la zone (moy.)':(defInBox/n).toFixed(1), 'attaquants de la surface SANS défenseur à <6':(unmarked/Math.max(1,tot)*100).toFixed(0)+' %', 'installation (ms)':(setup/n).toFixed(0) };
}
console.log(JSON.stringify(out,null,1));
