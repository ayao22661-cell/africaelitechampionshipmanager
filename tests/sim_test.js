const fs = require('fs'), vm = require('vm');
const file = process.argv[2] || require('path').join(__dirname, '..', 'app.js');
const src = fs.readFileSync(file, 'utf8').split(String.fromCharCode(13)).join('');   // app.js en fins de ligne Windows
const a = src.indexOf('const MATCHSIM = {');
const b = src.indexOf('\n};\n', a) + 3;
const code = src.slice(a, b) + '\n;globalThis.MATCHSIM = MATCHSIM;';
let T = 0;
const ctx = { globalThis: {}, console, Math };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(code, ctx);
const M = ctx.MATCHSIM;
M.now = () => T;
const F442 = [[5,50],[20,20],[15,40],[15,60],[20,80],[35,20],[30,40],[30,60],[35,80],[45,40],[45,60]];
const tac = { style: 'possession', mentality: 'balanced', chan: 'mixed', press: 'half', line: 'normal' };
M.TICK = parseInt(process.env.TICK || '3300');
M.init({ homeForm: F442, awayForm: F442, homeTac: tac, awayTac: tac, homeForce: 75, awayForce: 70, homeNames: [], awayNames: [], homeRoles: null, awayRoles: null });

let maxJump = 0, jumpAt = '', lastB = null, label = 'init';
const worstPlayers = { v: 0, w: '' };
let lastPl = null;
let lastEv = 0, cuts = 0;
function sample() {
  const f = M.frame();
  const bb = f.ball;
  // coupure « télé » d'un coup de pied arrêté : le saut a lieu sous un fondu au noir, on ne le compte pas
  (f.ev || []).forEach(e => { if (e.id > lastEv) { lastEv = e.id; if (e.type === 'snap') { cuts++; lastB = null; lastPl = null; } } });
  if (lastB) {
    const d = Math.hypot((bb.x - lastB.x) * 1.05, (bb.y - lastB.y) * 0.68);
    // 16 ms per frame: anything > 0.9 m (= 56 m/s) in one frame is a teleport
    if (d > 0.9) { if (d > maxJump) { maxJump = d; jumpAt = label + ' t=' + T; } if (process.env.DBG && /freekick/.test(label)) console.log('DBG', label, T, d.toFixed(2), 'from', lastB.x.toFixed(1), lastB.y.toFixed(1), 'to', bb.x.toFixed(1), bb.y.toFixed(1), 'fly', JSON.stringify(M.ball.fly && {toX:M.ball.fly.toX, t0:M.ball.fly.t0, dur:M.ball.fly.dur, idx:M.ball.fly.idx}), 'shot', JSON.stringify(M.shotFly && {t0:M.shotFly.t0, dur:M.shotFly.dur, stay:M.shotFly.stay}), 'fixed', M.ball.fixed, M.ball.hard, 'side', M.ball.side, M.ball.idx, 'spot', M.spot && [M.spot.x.toFixed(1), M.spot.y.toFixed(1)]); }
  }
  lastB = { x: bb.x, y: bb.y };
  const cur = ['H', 'A'].flatMap(k => f[k].map(p => ({ x: p.x, y: p.y })));
  if (lastPl) cur.forEach((p, i) => {
    const d = Math.hypot((p.x - lastPl[i].x) * 1.05, (p.y - lastPl[i].y) * 0.68);
    if (d > worstPlayers.v) { worstPlayers.v = d; worstPlayers.w = label + ' t=' + T + ' #' + i; }
  });
  lastPl = cur;
  return f;
}
function run(ms, tickEvery) {
  const end = T + ms;
  while (T < end) {
    T += 16;
    if (!run.lastTick) run.lastTick = T;
    if (T - run.lastTick >= M.TICK) { run.lastTick = T; M.tick(); }
    sample();
  }
}
function defHold(state){ const dur = state === 'center' ? M.TICK * 1.1 : M.TICK; if (!(M.holdUntil && M.holdUntil > M.now() + dur)) M.hold(dur); }
function orderTick(state, opts) { label = state; M.director(state, opts); defHold(state); run.lastTick = T; }

// ---------- 1. long match with random orders every "clock" ----------
const clock = M.TICK * 0.68;
for (let n = 0; n < 150; n++) {
  if (M.sceneBusy()) { run(clock); continue; }
  const r = Math.random();
  if (r < 0.35) orderTick(Math.random() < 0.5 ? 'home_attack' : 'away_attack');
  else if (r < 0.5) orderTick('midfield');
  run(clock);
}
console.log('open play : max ball jump', maxJump.toFixed(2), 'm', jumpAt, '| max player step per frame', worstPlayers.v.toFixed(2), worstPlayers.w);

// ---------- 2. scenarios ----------
function scenario(name, fn) {
  maxJump = 0; jumpAt = ''; worstPlayers.v = 0;
  fn();
  console.log(name.padEnd(34), 'ball jump', maxJump.toFixed(2), 'm', jumpAt, '| player', worstPlayers.v.toFixed(2));
}
function shotScene(side, kind, outcome) {
  label = kind || 'shot';
  let ms = 0;
  if (kind) { ms = M.setPiece(kind, side, 9, 10); run(ms + 250); }
  const spot = M.spot;
  if (process.env.DBG && kind === 'freekick') console.log('PRE-STRIKE ball', M.ball.x.toFixed(1), M.ball.y.toFixed(1), 'spot', spot.x.toFixed(1), spot.y.toFixed(1), 'fly', JSON.stringify(M.ball.fly && {toX:M.ball.fly.toX, toY:M.ball.fly.toY, t0:M.ball.fly.t0, dur:M.ball.fly.dur, then: !!M.ball.fly.then}), 'T', T, 'fixed', M.ball.fixed, M.ball.hard, 'ms', ms);
  label = (kind || 'shot') + '-strike';
  M.director(side === 'H' ? 'home_shot' : 'away_shot', { shooterIdx: 9, setPiece: kind });
  defHold('shot');
  M.setShotOutcome(outcome);
  const eta = M.shotEta();
  run(Math.max(0, eta - 300));
  return { spot, eta };
}
scenario('penalty goal H + celebration', () => {
  const { spot } = shotScene('H', 'penalty', 'goal');
  const bx = M.ball.x;
  M.celebrate('H', M.lastShooter, 3800); run(300);
  run(3800);
  label = 'center'; M.director('center'); defHold('center'); run.lastTick = T; run(M.TICK * 2);
  console.log('   spot', JSON.stringify({ x: +spot.x.toFixed(1), y: spot.y }), 'ball end x', bx.toFixed(1));
});
scenario('penalty save A', () => { const { spot } = shotScene('A', 'penalty', 'save'); run(M.TICK * 2); console.log('   spot', spot.x.toFixed(1), spot.y); });
scenario('free kick goal H', () => { const { spot } = shotScene('H', 'freekick', 'goal'); M.celebrate('H', M.lastShooter, 3800); run(3800); console.log('   spot', spot.x.toFixed(1), spot.y.toFixed(1)); label='center'; M.director('center'); defHold('center'); run.lastTick = T; run(M.TICK*2); });
scenario('free kick miss A', () => { shotScene('A', 'freekick', 'miss'); run(M.TICK * 2); });
scenario('corner save H', () => { shotScene('H', 'corner', 'save'); run(M.TICK * 2.5); });
scenario('corner goal A', () => { shotScene('A', 'corner', 'goal'); M.celebrate('A', M.lastShooter, 3800); run(3800); label='center'; M.director('center'); defHold('center'); run.lastTick = T; run(M.TICK*2); });
scenario('open play shot goal H', () => { shotScene('H', null, 'goal'); M.celebrate('H', M.lastShooter, 3800); run(3800); label='center'; M.director('center'); defHold('center'); run.lastTick = T; run(M.TICK*2); });
scenario('open play shot save A', () => { shotScene('A', null, 'save'); run(M.TICK * 2.5); });
scenario('set piece without shot (corner)', () => { const ms = M.setPiece('corner', 'H', 9, -1); run(ms + 250); M.release('H', 'corner'); run(M.TICK * 2); });
scenario('set piece without shot (free kick)', () => { const ms = M.setPiece('freekick', 'A', 9, -1); run(ms + 250); M.release('A', 'freekick'); run(M.TICK * 2); });

// geometry check for a penalty setup
{
  const ms = M.setPiece('penalty', 'H', 9, 9); run(ms + 100);
  const f = M.frame();
  const taker = f.H[9], gk = f.A[0];
  console.log('penalty geometry: ball', M.ball.x.toFixed(1), M.ball.y.toFixed(1), '| taker', taker.x.toFixed(1), taker.y.toFixed(1), '| GK', gk.x.toFixed(1), gk.y.toFixed(1));
  const inBox = ['H', 'A'].flatMap(k => f[k].map((p, i) => ({ k, i, p }))).filter(o => !(o.k === 'H' && o.i === 9) && !(o.k === 'A' && o.i === 0) && o.p.x > 84 && Math.abs(o.p.y - 50) < 30);
  console.log('players inside the box at the kick:', inBox.length);
  console.log('coupures télé (fondu) pendant le test :', cuts);
}
