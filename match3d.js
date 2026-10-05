/* =====================================================================
 * AECM — match3d.js
 * Rendu 3D du match (Babylon.js) branché sur MATCHSIM.frame().
 *
 * Principe : le moteur MATCHSIM reste le seul patron (positions, ballon,
 * résultats). Ce module ne fait que LIRE ses données à chaque image et
 * les afficher : 22 joueurs + arbitre + ballon, animés par les clips du
 * pack AECM_personnages_animes.
 *
 *   - Aucun effet sur le score ni sur la simulation.
 *   - Si WebGL ou un fichier manque : la vue 2D d'origine reste affichée.
 *   - Bouton 2D/3D sur le terrain ; choix mémorisé (AECM_3D).
 *
 * API publique (appelée par app.js) :
 *   Match3D.attach()                 monte le canvas dans #pitch-container
 *   Match3D.setTeams(home, away)     noms des clubs -> couleurs de maillot
 *   Match3D.start() / .pause()       démarre / arrête la boucle de rendu
 * ===================================================================== */
(function () {
    'use strict';

    // ---- Réglages -----------------------------------------------------
    const ROOT = '3d/';                          // dossier des GLB (relatif à index.html)
    const VENDOR = 'vendor/';
    const M_X = 1.05, M_Z = 0.68;                // % du terrain -> mètres (105 x 68)
    const PITCH_W = 105, PITCH_H = 68, MARGIN = 7.5;
    const FIELD_W = PITCH_W + MARGIN * 2, FIELD_H = PITCH_H + MARGIN * 2;
    const JOG_SPEED = 2.48;                      // m/s du clip jog_forward
    const CELEBRATIONS = ['cel_bboy_hip_hop_move', 'cel_chapa-giratoria', 'cel_swing_dancing',
        'cel_stepping_backward', 'cel_shuffling', 'cel_capoeira'];   // volontairement sans les 3 clips violents
    const OUTFIELD_MODELS = ['perso_03', 'perso_05', 'perso_07'];
    const GK_MODEL = 'perso_08', REF_MODEL = 'perso_10';
    // Réglage de recoloration : quelle zone du fichier de texture est le maillot.
    const KIT_MASK = {
        perso_03: { kind: 'hue', h: 225 },
        perso_05: { kind: 'hue', h: 150 },
        perso_07: { kind: 'gray', h: 215 },
        perso_08: { kind: 'hue', h: 285 }
    };

    const S = {
        enabled: false, booting: false, ready: false, failed: false, running: false,
        container: null, canvas: null, btn: null,
        B: null, engine: null, scene: null, camera: null,
        containers: {}, glbBytes: {}, clips: new Map(), libs: {},
        players: { H: [], A: [] }, ref: null, ball: null, ballShadow: null, ring: null,
        teams: { home: null, away: null }, matCache: new Map(),
        camMode: 'follow', camX: 0, camZ: 0, lastEvId: 0, lastT: 0, timers: [],
        quality: 'far', lowEnd: false
    };

    // ---- Utilitaires --------------------------------------------------
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const wx = (x) => (x - 50) * M_X;
    const wz = (y) => (50 - y) * M_Z;            // y du jeu vers le bas = vers la caméra (z négatif)
    const angDiff = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };

    function loadScript(src) {
        return new Promise((res, rej) => {
            const s = document.createElement('script');
            s.src = src; s.async = true;
            s.onload = res; s.onerror = () => rej(new Error('script ' + src));
            document.head.appendChild(s);
        });
    }

    function webglOK() {
        try {
            const c = document.createElement('canvas');
            return !!(c.getContext('webgl2') || c.getContext('webgl'));
        } catch (e) { return false; }
    }

    function detectLowEnd() {
        const mem = navigator.deviceMemory || 4, cores = navigator.hardwareConcurrency || 4;
        return mem <= 2 || cores <= 3;
    }

    function prefOn() {
        try {
            const v = localStorage.getItem('AECM_3D');
            if (v === '1') return true;
            if (v === '0') return false;
        } catch (e) {}
        return !detectLowEnd();      // par défaut : 3D sauf téléphone très faible
    }

    // ---- Maillots : recoloration des textures --------------------------
    function parseGLB(buf) {
        const dv = new DataView(buf);
        const jl = dv.getUint32(12, true);
        const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 20, jl)));
        const bo = 20 + jl;
        return { json, bin: bo + 8, buf };
    }

    async function baseColorBitmap(glbBuf) {
        const g = parseGLB(glbBuf), j = g.json;
        const ti = j.materials[0].pbrMetallicRoughness.baseColorTexture.index;
        const tex = j.textures[ti];
        const src = tex.source != null ? tex.source : tex.extensions.EXT_texture_webp.source;
        const img = j.images[src], bv = j.bufferViews[img.bufferView];
        const bytes = new Uint8Array(glbBuf, g.bin + (bv.byteOffset || 0), bv.byteLength);
        return createImageBitmap(new Blob([bytes], { type: img.mimeType || 'image/webp' }));
    }

    function hexToRgb(hex) {
        let h = String(hex || '#888888').replace('#', '');
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    // Remplace la couleur du maillot en gardant l'ombrage (luminance) du fichier.
    function recolor(data, rule, target) {
        const n = data.length / 4, mask = new Uint8Array(n);
        let sum = 0, cnt = 0;
        for (let i = 0, p = 0; i < n; i++, p += 4) {
            const r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255;
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
            if (d < 1e-4 || mx < 0.12) continue;
            const s = d / mx;
            let h = mx === r ? ((g - b) / d) : mx === g ? (2 + (b - r) / d) : (4 + (r - g) / d);
            h = ((h * 60) + 360) % 360;
            let dh = Math.abs(((h - rule.h) + 540) % 360 - 180);
            const ok = rule.kind === 'hue' ? (s > 0.25 && dh < 35) : (s > 0.06 && s < 0.34 && dh < 28 && mx > 0.2);
            if (ok) { mask[i] = 1; sum += 0.299 * r + 0.587 * g + 0.114 * b; cnt++; }
        }
        const mean = cnt ? sum / cnt : 0.4;
        for (let i = 0, p = 0; i < n; i++, p += 4) {
            if (!mask[i]) continue;
            const lum = 0.299 * data[p] / 255 + 0.587 * data[p + 1] / 255 + 0.114 * data[p + 2] / 255;
            const k = Math.min(1.6, lum / mean);
            data[p] = Math.min(255, target[0] * k);
            data[p + 1] = Math.min(255, target[1] * k);
            data[p + 2] = Math.min(255, target[2] * k);
        }
    }

    // Matériau d'un modèle pour une équipe (mis en cache). hex = couleur du maillot.
    function teamMaterial(modelKey, hex) {
        const key = modelKey + '|' + hex;
        if (!S.matCache.has(key)) S.matCache.set(key, buildTeamMaterial(modelKey, hex, key));
        return S.matCache.get(key);       // promesse partagée : un seul calcul par (modèle, couleur)
    }

    async function buildTeamMaterial(modelKey, hex, key) {
        const B = S.B, cont = S.containers[modelKey];
        const base = cont.materials[0];
        const bmp = await baseColorBitmap(S.glbBytes[modelKey]);
        const cv = document.createElement('canvas');
        cv.width = bmp.width; cv.height = bmp.height;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(bmp, 0, 0);
        const im = ctx.getImageData(0, 0, cv.width, cv.height);
        recolor(im.data, KIT_MASK[modelKey], hexToRgb(hex));
        const tex = new B.DynamicTexture('kit_' + key, { width: cv.width, height: cv.height }, S.scene, true, B.Texture.TRILINEAR_SAMPLINGMODE, undefined, false);
        tex.getContext().putImageData(im, 0, 0);
        tex.update(false);
        const mat = base.clone('mat_' + key);
        mat.albedoTexture = tex;
        return { mat, tex };
    }

    // Couleur du maillot d'un club (réutilise les couleurs du reste du jeu).
    function kitHex(name, away, isGK) {
        let base = away ? '#e8edf5' : '#1e3a8a';
        try { if (typeof clubKit === 'function') base = clubKit(name, away).base || base; } catch (e) {}
        if (isGK) return away ? '#f97316' : null;     // gardien visiteur orange, gardien local : violet d'origine
        return base;
    }

    async function applyKits() {
        if (!S.ready || !S.teams.home) return;
        const jobs = [];
        ['H', 'A'].forEach(side => {
            const away = side === 'A';
            const club = away ? S.teams.away : S.teams.home;
            S.players[side].forEach(P => {
                jobs.push((async () => {
                    const hex = kitHex(club, away, P.isGK);
                    let mat = S.containers[P.model].materials[0];
                    if (hex) { try { mat = (await teamMaterial(P.model, hex)).mat; } catch (e) { console.warn('[3D] kit', e); } }
                    P.meshes.forEach(m => { m.material = mat; });
                })());
            });
        });
        await Promise.all(jobs);
    }

    // ---- Décor : terrain, buts, ballon ---------------------------------
    function buildPitch() {
        const B = S.B, scene = S.scene;
        const PXM = S.lowEnd ? 9 : 12.8;
        const cw = Math.round(FIELD_W * PXM), ch = Math.round(FIELD_H * PXM);
        const tex = new B.DynamicTexture('pitchTex', { width: cw, height: ch }, scene, true);
        const c = tex.getContext();
        const X = (m) => (m + FIELD_W / 2) * PXM, Y = (m) => (m + FIELD_H / 2) * PXM;
        c.fillStyle = '#1b5e2f'; c.fillRect(0, 0, cw, ch);                 // pourtour
        const nb = 14, sw = PITCH_W / nb;                                   // bandes de tonte
        for (let i = 0; i < nb; i++) {
            c.fillStyle = i % 2 ? '#2f8f43' : '#2a8340';
            c.fillRect(X(-PITCH_W / 2 + i * sw), Y(-PITCH_H / 2), sw * PXM + 1, PITCH_H * PXM);
        }
        c.strokeStyle = 'rgba(255,255,255,.92)'; c.fillStyle = '#fff';
        c.lineWidth = Math.max(2, 0.22 * PXM);
        const line = (x1, y1, x2, y2) => { c.beginPath(); c.moveTo(X(x1), Y(y1)); c.lineTo(X(x2), Y(y2)); c.stroke(); };
        const rect = (x, y, w, h) => c.strokeRect(X(x), Y(y), w * PXM, h * PXM);
        const circ = (x, y, r, a0, a1) => { c.beginPath(); c.arc(X(x), Y(y), r * PXM, a0 || 0, a1 == null ? Math.PI * 2 : a1); c.stroke(); };
        const dot = (x, y) => { c.beginPath(); c.arc(X(x), Y(y), 0.3 * PXM, 0, Math.PI * 2); c.fill(); };
        rect(-PITCH_W / 2, -PITCH_H / 2, PITCH_W, PITCH_H);
        line(0, -PITCH_H / 2, 0, PITCH_H / 2);
        circ(0, 0, 9.15); dot(0, 0);
        [-1, 1].forEach(s => {
            const gx = s * PITCH_W / 2;
            rect(s > 0 ? gx - 16.5 : gx, -20.16, 16.5, 40.32);              // grande surface
            rect(s > 0 ? gx - 5.5 : gx, -9.16, 5.5, 18.32);                 // petite surface
            dot(gx - s * 11, 0);
            // arc de surface : portion du cercle de 9,15 m hors de la surface
            const a = Math.acos(5.5 / 9.15);
            if (s > 0) circ(gx - 11, 0, 9.15, Math.PI - a, Math.PI + a);
            else circ(gx + 11, 0, 9.15, -a, a);
            [-1, 1].forEach(t => {                                           // corners
                c.beginPath();
                const cx = gx, cy = t * PITCH_H / 2;
                const a0 = s > 0 ? (t > 0 ? Math.PI : Math.PI / 2) : (t > 0 ? Math.PI * 1.5 : 0);
                c.arc(X(cx), Y(cy), 1 * PXM, a0, a0 + Math.PI / 2); c.stroke();
            });
        });
        tex.update();
        const gmat = new B.StandardMaterial('pitchMat', scene);
        gmat.diffuseTexture = tex; gmat.specularColor = new B.Color3(0, 0, 0);
        gmat.emissiveColor = new B.Color3(0.18, 0.18, 0.18);
        const ground = B.CreateGround('pitch', { width: FIELD_W, height: FIELD_H }, scene);
        ground.material = gmat; ground.isPickable = false;
        ground.freezeWorldMatrix();

        // Buts : poteaux, barre, filet filaire
        const wood = new B.StandardMaterial('goalMat', scene);
        wood.emissiveColor = new B.Color3(0.95, 0.95, 0.95); wood.disableLighting = true;
        const net = new B.StandardMaterial('netMat', scene);
        net.emissiveColor = new B.Color3(0.9, 0.9, 0.9); net.wireframe = true; net.alpha = 0.35; net.disableLighting = true;
        [-1, 1].forEach(s => {
            const gx = s * PITCH_W / 2, bar = 0.12, gh = 2.44, gw = 7.32;
            [-1, 1].forEach(t => {
                const p = B.CreateBox('post', { width: bar, height: gh, depth: bar }, scene);
                p.position.set(gx, gh / 2, t * gw / 2); p.material = wood; p.isPickable = false; p.freezeWorldMatrix();
            });
            const cb = B.CreateBox('bar', { width: bar, height: bar, depth: gw + bar }, scene);
            cb.position.set(gx, gh, 0); cb.material = wood; cb.isPickable = false; cb.freezeWorldMatrix();
            const nt = B.CreateBox('net', { width: 2.2, height: gh, depth: gw }, scene);
            nt.position.set(gx + s * 1.1, gh / 2, 0); nt.material = net; nt.isPickable = false; nt.freezeWorldMatrix();
        });
    }

    function buildBall() {
        const B = S.B, scene = S.scene;
        const d = 0.34;                                                      // un peu plus gros que le vrai (0,22 m) pour rester lisible
        const tx = new B.DynamicTexture('ballTex', { width: 128, height: 64 }, scene, true);
        const c = tx.getContext();
        c.fillStyle = '#f8fafc'; c.fillRect(0, 0, 128, 64);
        c.fillStyle = '#1e293b';
        [[16, 16], [48, 44], [80, 16], [112, 44], [64, 8], [0, 44], [96, 56]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 8, 0, Math.PI * 2); c.fill(); });
        tx.update();
        const mat = new B.StandardMaterial('ballMat', scene);
        mat.diffuseTexture = tx; mat.specularColor = new B.Color3(0.25, 0.25, 0.25); mat.emissiveColor = new B.Color3(0.25, 0.25, 0.25);
        S.ball = B.CreateSphere('ball', { diameter: d, segments: 10 }, scene);
        S.ball.material = mat; S.ball.isPickable = false;

        const sm = new B.StandardMaterial('shadowMat', scene);
        sm.disableLighting = true; sm.emissiveColor = new B.Color3(0, 0, 0); sm.alpha = 0.35;
        S.shadowMat = sm;
        S.ballShadow = B.CreateDisc('ballShadow', { radius: 0.22, tessellation: 14 }, scene);
        S.ballShadow.rotation.x = Math.PI / 2; S.ballShadow.material = sm; S.ballShadow.position.y = 0.02; S.ballShadow.isPickable = false;

        // anneau sous le porteur du ballon
        const rt = new B.DynamicTexture('ringTex', { width: 128, height: 128 }, scene, true);
        const rc = rt.getContext();
        rc.clearRect(0, 0, 128, 128); rc.strokeStyle = '#fde047'; rc.lineWidth = 9;
        rc.beginPath(); rc.arc(64, 64, 52, 0, Math.PI * 2); rc.stroke(); rt.update(); rt.hasAlpha = true;
        const rm = new B.StandardMaterial('ringMat', scene);
        rm.diffuseTexture = rt; rm.useAlphaFromDiffuseTexture = true; rm.disableLighting = true; rm.emissiveColor = new B.Color3(1, 0.9, 0.3);
        S.ring = B.CreateDisc('ring', { radius: 1.05, tessellation: 24 }, scene);
        S.ring.rotation.x = Math.PI / 2; S.ring.material = rm; S.ring.position.y = 0.03; S.ring.isPickable = false;
    }

    // ---- Joueurs --------------------------------------------------------
    function makePlayer(tag, modelKey, isGK) {
        const B = S.B, scene = S.scene;
        const cont = S.containers[modelKey];
        const inst = cont.instantiateModelsToScene(n => n, false);
        const root = inst.rootNodes[0];
        const holder = new B.TransformNode('holder_' + tag, scene);
        root.parent = holder;
        const meshes = root.getChildMeshes(false);
        meshes.forEach(m => { m.alwaysSelectAsActiveMesh = true; m.isPickable = false; });
        const bones = new Map(root.getChildTransformNodes(false).map(n => [n.name, n]));
        // Os dans une texture : évite la limite d'uniformes des GPU de téléphone d'entrée de gamme.
        if (S.engine.webGLVersion >= 2) inst.skeletons.forEach(sk => { sk.useTextureToStoreBoneMatrices = true; });
        const shadow = B.CreateDisc('sh_' + tag, { radius: 0.5, tessellation: 12 }, scene);
        shadow.rotation.x = Math.PI / 2; shadow.material = S.shadowMat; shadow.position.y = 0.025; shadow.isPickable = false;
        return {
            tag, model: modelKey, isGK, holder, root, meshes, bones, shadow, groups: new Map(),
            cur: null, prev: null, fade: 1, fadeDur: 0.25, clip: '', once: null,
            x: 0, z: 0, px: 0, pz: 0, lsx: 0, lsz: 0, sx: 0, sz: 0, vx: 0, vz: 0, spd: 0, yaw: 0, off: [0, 0], init: false,
            faceUntil: 0, faceYaw: 0, celeb: null
        };
    }

    function getGroup(P, clip) {
        let g = P.groups.get(clip);
        if (g) return g;
        const src = S.clips.get(clip);
        if (!src) return null;
        g = new S.B.AnimationGroup('a_' + P.tag + '_' + clip, S.scene);
        for (const ta of src.targetedAnimations) {
            const t = P.bones.get(ta.target.name);
            if (t) g.addTargetedAnimation(ta.animation, t);   // os absents ignorés (clone() planterait)
        }
        P.groups.set(clip, g);
        return g;
    }

    function clipSeconds(g) {
        const a = g.targetedAnimations[0] && g.targetedAnimations[0].animation;
        const fps = (a && a.framePerSecond) || 30;
        return (g.to - g.from) / fps;
    }

    // Joue un clip en fondu depuis le clip courant.
    function play(P, clip, loop, speed, fade) {
        const g = getGroup(P, clip);
        if (!g) return null;
        if (P.cur === g) { g.speedRatio = speed; return g; }
        if (P.prev && P.prev !== P.cur) P.prev.stop();
        P.prev = P.cur; P.cur = g; P.clip = clip;
        P.fade = P.prev ? 0 : 1; P.fadeDur = fade || 0.22;
        g.start(loop, speed, g.from, g.to);
        if (loop) g.goToFrame(g.from + Math.random() * (g.to - g.from));          // désynchronise les cycles
        g.setWeightForAllAnimatables(P.prev ? 0 : 1);
        return g;
    }

    function playOnce(P, clip, speed, opts) {
        opts = opts || {};
        const g = getGroup(P, clip);
        if (!g) return false;
        if (P.cur === g) { g.stop(); P.cur = null; }        // permet de rejouer le même geste
        const fresh = play(P, clip, false, speed, opts.fade || 0.1);
        if (!fresh) return false;
        const dur = Math.min(clipSeconds(g) / speed * (opts.frac || 1) * 1000, opts.max || 1e9);
        P.once = { until: now() + dur, freeze: !!opts.freeze, x: P.x, z: P.z };
        return true;
    }

    function stepFade(P, dt) {
        if (P.fade >= 1) return;
        P.fade = Math.min(1, P.fade + dt / P.fadeDur);
        if (P.cur) P.cur.setWeightForAllAnimatables(P.fade);
        if (P.prev) {
            if (P.fade >= 1) { P.prev.stop(); P.prev = null; }
            else P.prev.setWeightForAllAnimatables(1 - P.fade);
        }
    }

    // ---- Événements du moteur (passe, tir, tacle, but, arrêt) -----------
    function schedule(ms, fn) { S.timers.push({ at: now() + ms, fn }); }

    function lookAt(P, tx, tz, ms) {
        P.faceYaw = Math.atan2(tx - P.x, tz - P.z); P.faceUntil = now() + ms;
    }

    function handleEvent(ev) {
        const P = S.players[ev.side] && S.players[ev.side][ev.idx];
        if (ev.type === 'pass' && P) {
            const R = S.players[ev.side][ev.to];
            if (R) lookAt(P, R.x, R.z, 450);
            playOnce(P, 'kick_soccerball', 1.25, { fade: 0.08 });
        } else if (ev.type === 'shot' && P) {
            const gx = ev.side === 'H' ? PITCH_W / 2 : -PITCH_W / 2;
            lookAt(P, gx, 0, 600);
            playOnce(P, Math.random() < 0.5 ? 'kick_soccerball_1' : 'kick_soccerball_2', 1.1, { fade: 0.08 });
        } else if (ev.type === 'tackle' && P) {
            const L = S.players[ev.loserSide] && S.players[ev.loserSide][ev.loser];
            if (L) lookAt(P, L.x, L.z, 500);
            playOnce(P, 'soccer_tackle_2', 2.0, { fade: 0.08 });
        } else if (ev.type === 'save' && P) {
            playOnce(P, Math.random() < 0.5 ? 'gk_diving_save' : 'gk_diving_save_2', 1.5, { fade: 0.1 });
        } else if (ev.type === 'goal') {
            // gardien battu
            const other = ev.side === 'H' ? 'A' : 'H';
            const gk = S.players[other][0];
            if (gk) playOnce(gk, 'gk_miss', 1.3, { fade: 0.1 });
            // célébration du buteur, quand le ballon arrive au but
            const sh = (typeof MATCHSIM !== 'undefined') ? MATCHSIM.shotFly : null;
            const delay = sh ? Math.max(0, sh.t0 + sh.dur - now()) : 0;
            const scorer = P;
            if (scorer) schedule(delay + 80, () => {
                const clip = CELEBRATIONS.find(c => S.clips.has(c) && Math.random() < 0.34) || CELEBRATIONS.find(c => S.clips.has(c));
                if (clip) playOnce(scorer, clip, 1.0, { fade: 0.15, freeze: true, frac: 0.95, max: 2400 });
            });
        }
    }

    // ---- Caméra ---------------------------------------------------------
    function updateCamera(dt, ballX, ballZ) {
        const cam = S.camera, B = S.B;
        const aspect = Math.max(0.5, S.engine.getAspectRatio(cam));
        const wide = S.camMode === 'wide';
        const cw = S.canvas.clientWidth || 360;
        const viewW = wide ? FIELD_W - 2 : clamp(cw / 11, 30, 42);          // largeur de terrain visible au sol (m) : ~11 px par mètre
        const el = (wide ? 52 : 36) * Math.PI / 180;
        const th = Math.tan(cam.fov / 2);
        const dist = (viewW / 2) / (th * aspect);
        const lim = Math.max(0, FIELD_W / 2 - viewW / 2 - 2);
        const tx = wide ? 0 : clamp(ballX, -lim, lim);
        const tz = wide ? 0 : clamp(ballZ * 0.35, -10, 10);
        const k = 1 - Math.exp(-dt * (wide ? 6 : 3.2));
        S.camX += (tx - S.camX) * k; S.camZ += (tz - S.camZ) * k;
        cam.position.set(S.camX, Math.sin(el) * dist, S.camZ - Math.cos(el) * dist);
        (S.tgt || (S.tgt = new B.Vector3())).set(S.camX, 0, S.camZ);
        cam.setTarget(S.tgt);
    }

    // ---- Boucle d'image -------------------------------------------------
    function frame() {
        if (!S.ready || typeof MATCHSIM === 'undefined' || !MATCHSIM.active) return;
        if (!S.canvas.clientWidth || !S.canvas.clientHeight) return;
        const t = now();
        let dt = (t - S.lastT) / 1000;
        if (S.lastT && dt < (S.lowEnd ? 0.030 : 0.0)) return;                // 30 i/s sur téléphone faible
        S.lastT = t; dt = clamp(dt || 0.016, 0.001, 0.1);

        const f = MATCHSIM.frame();

        // minuteries (célébrations différées)
        for (let i = S.timers.length - 1; i >= 0; i--) if (t >= S.timers[i].at) { const fn = S.timers[i].fn; S.timers.splice(i, 1); try { fn(); } catch (e) {} }

        // positions d'abord (les événements ont besoin des positions à jour)
        ['H', 'A'].forEach(side => f[side].forEach((d, i) => {
            const P = S.players[side][i]; if (!P) return;
            const sx = wx(d.x), sz = wz(d.y);
            // saut de la simulation (engagement, remise en jeu) : on suit sans glisser
            if (!P.init || Math.hypot(sx - P.lsx, sz - P.lsz) > 9) { P.init = true; P.off[0] = P.off[1] = 0; P.px = sx; P.pz = sz; P.vx = P.vz = 0; }
            P.lsx = P.sx = sx; P.lsz = P.sz = sz;
        }));
        // ballon
        const bx = wx(f.ball.x), bz = wz(f.ball.y), by = 0.17 + Math.max(0, f.ball.z || 0);
        const pbx = S.ball.position.x, pbz = S.ball.position.z;
        S.ball.position.set(bx, by, bz);
        S.ball.rotation.x += (bz - pbz) / 0.17; S.ball.rotation.z -= (bx - pbx) / 0.17;
        S.ballShadow.position.set(bx, 0.02, bz);
        const ss = 1 / (1 + Math.max(0, f.ball.z || 0) * 0.35); S.ballShadow.scaling.set(ss, ss, ss);

        // nouveaux événements
        (f.ev || []).forEach(ev => { if (ev.id > S.lastEvId) { S.lastEvId = ev.id; try { handleEvent(ev); } catch (e) { console.warn('[3D] ev', e); } } });

        // joueurs
        let carrier = null;
        ['H', 'A'].forEach(side => f[side].forEach((d, i) => {
            const P = S.players[side][i]; if (!P) return;
            // position effective = simulation + décalage résiduel (après un geste figé)
            if (P.once && P.once.freeze && t < P.once.until) {
                P.off[0] = P.once.x - P.sx; P.off[1] = P.once.z - P.sz;
            } else {
                const m = Math.hypot(P.off[0], P.off[1]);
                if (m > 0.02) {
                    const step = Math.min(m, 7 * dt), r = (m - step) / m;
                    P.off[0] *= r; P.off[1] *= r;
                } else { P.off[0] = P.off[1] = 0; }
            }
            const x = P.sx + P.off[0], z = P.sz + P.off[1];
            const ivx = (x - P.px) / dt, ivz = (z - P.pz) / dt;
            const a = 1 - Math.exp(-dt * 6);
            P.vx += (ivx - P.vx) * a; P.vz += (ivz - P.vz) * a;
            P.spd = Math.hypot(P.vx, P.vz);
            P.px = x; P.pz = z; P.x = x; P.z = z;

            // orientation
            let target = P.yaw;
            if (P.faceUntil > t) target = P.faceYaw;
            else if (P.spd > 0.6) target = Math.atan2(P.vx, P.vz);
            else target = Math.atan2(bx - x, bz - z);
            if (P.once && P.once.freeze && t < P.once.until) target = P.yaw;
            P.yaw += angDiff(P.yaw, target) * Math.min(1, dt * (P.spd > 0.6 ? 9 : 6));
            P.holder.position.set(x, 0, z);
            P.holder.rotation.y = P.yaw;
            P.shadow.position.x = x; P.shadow.position.z = z;
            if (d.carrier) carrier = P;

            // choix du clip
            if (P.once && t >= P.once.until) P.once = null;
            if (!P.once) {
                if (P.spd > 0.45) play(P, 'jog_forward', true, clamp(P.spd / JOG_SPEED, 0.6, 2.2), 0.25);
                else play(P, P.isGK ? 'gk_idle' : (d.carrier ? 'offensive_idle' : 'soccer_idle'), true, 1, 0.3);
            }
            stepFade(P, dt);
        }));

        // arbitre : suit le jeu à distance
        const R = S.ref;
        if (R) {
            const tx = clamp(bx * 0.9, -48, 48) - 6, tz = clamp(bz, -30, 30) + (bz > 0 ? -9 : 9);
            if (!R.init) { R.init = true; R.x = tx; R.z = tz; }
            const dx = tx - R.x, dz = tz - R.z, dd = Math.hypot(dx, dz);
            const sp = Math.min(dd * 1.2, 4.2), mx = dd > 0.05 ? dx / dd * sp : 0, mz = dd > 0.05 ? dz / dd * sp : 0;
            R.x += mx * dt; R.z += mz * dt; R.spd = Math.hypot(mx, mz);
            const tyaw = R.spd > 0.6 ? Math.atan2(mx, mz) : Math.atan2(bx - R.x, bz - R.z);
            R.yaw += angDiff(R.yaw, tyaw) * Math.min(1, dt * 6);
            R.holder.position.set(R.x, 0, R.z); R.holder.rotation.y = R.yaw;
            R.shadow.position.x = R.x; R.shadow.position.z = R.z;
            if (R.spd > 0.6) play(R, 'jog_forward', true, clamp(R.spd / JOG_SPEED, 0.6, 1.8), 0.3);
            else play(R, 'soccer_idle', true, 1, 0.35);
            stepFade(R, dt);
        }

        if (carrier) { S.ring.isVisible = true; S.ring.position.x = carrier.x; S.ring.position.z = carrier.z; }
        else S.ring.isVisible = false;

        updateCamera(dt, bx, bz);
        S.scene.render();
        guardFps(t);
    }

    // Filet de sécurité : si le téléphone n'arrive pas à tenir un rythme correct
    // pendant plusieurs secondes, on revient à la vue 2D (choix mémorisé).
    function guardFps(t) {
        if (window.__AECM_NO_FPS_GUARD) return;
        if (!S.guardT0) { S.guardT0 = t; S.guardLast = t; S.slowCount = 0; return; }
        if (t - S.guardT0 < 5000 || t - S.guardLast < 1000) return;      // 5 s de chauffe, puis 1 mesure/s
        S.guardLast = t;
        const fps = S.engine.getFps();
        S.slowCount = fps < (S.lowEnd ? 14 : 20) ? S.slowCount + 1 : 0;
        if (S.slowCount >= 5) {
            console.warn('[Match3D] trop lent (' + fps.toFixed(0) + ' i/s) : retour à la 2D');
            setEnabled(false);
            try { if (window.app && app.showNotification) app.showNotification('Vue 3D désactivée (appareil trop lent). Bouton 2D/3D pour réessayer.', 'info'); } catch (e) {}
        }
    }

    // ---- Chargement -----------------------------------------------------
    async function fetchBytes(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error(url + ' ' + r.status);
        return r.arrayBuffer();
    }

    async function loadContainer(url, key) {
        const buf = await fetchBytes(url);
        if (key) S.glbBytes[key] = buf.slice(0);          // copie : sert à recolorer les textures
        return S.B.LoadAssetContainerAsync(new Uint8Array(buf), S.scene, { pluginExtension: '.glb' });
    }

    async function loadLib(name) {
        if (S.libs[name]) return S.libs[name];
        S.libs[name] = (async () => {
            const c = await loadContainer(ROOT + 'animations/' + name + '.glb');
            c.animationGroups.forEach(g => S.clips.set(g.name, g));
            return c;
        })();
        return S.libs[name];
    }

    function showLayers(on3d) {
        const layer = document.getElementById('match-tokens-layer');
        if (layer) layer.style.visibility = on3d ? 'hidden' : '';
        if (S.container) {
            const svg = S.container.querySelector(':scope > svg');
            if (svg) svg.style.visibility = on3d ? 'hidden' : '';
        }
        if (S.canvas) S.canvas.style.display = on3d ? 'block' : 'none';
        if (on3d && S.engine) S.engine.resize();
        if (S.btn) S.btn.textContent = on3d ? '3D' : '2D';
    }

    async function boot() {
        if (S.booting || S.ready || S.failed) return;
        S.booting = true;
        try {
            if (!webglOK()) throw new Error('WebGL indisponible');
            if (!window.BABYLON_AECM) await loadScript(VENDOR + 'babylon-aecm.js');
            const B = S.B = window.BABYLON_AECM;
            S.lowEnd = detectLowEnd();
            // À 22 px de haut sur un téléphone, 'far' (1 500-2 700 triangles) est quasi identique à 'match' (5 000) et bien moins lourd.
            S.quality = (S.lowEnd || Math.min(screen.width, window.innerWidth) < 700) ? 'far' : 'match';
            B.MeshoptCompression.Configuration = { decoder: { url: VENDOR + 'meshopt_decoder.js' } };

            const dpr = window.devicePixelRatio || 1;
            const engine = S.engine = new B.Engine(S.canvas, !S.lowEnd, { alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false, stencil: false }, false);
            engine.setHardwareScalingLevel(Math.max(1, dpr / (S.lowEnd ? 1 : 1.5)));
            const scene = S.scene = new B.Scene(engine);
            scene.clearColor = new B.Color4(0.04, 0.09, 0.07, 1);
            scene.autoClearDepthAndStencil = true;
            scene.skipPointerMovePicking = true;
            scene.pointerMovePredicate = () => false;

            const cam = S.camera = new B.FreeCamera('cam', new B.Vector3(0, 30, -40), scene);
            cam.fov = 0.62; cam.minZ = 1; cam.maxZ = 400;
            const hemi = new B.HemisphericLight('hemi', new B.Vector3(0.2, 1, -0.3), scene);
            hemi.intensity = 1.05; hemi.groundColor = new B.Color3(0.45, 0.5, 0.45);
            const sun = new B.DirectionalLight('sun', new B.Vector3(-0.4, -1, 0.5), scene);
            sun.intensity = 0.8;

            buildPitch();
            buildBall();

            // Modèles (un fichier par apparence) + bibliothèques d'animations
            const q = S.quality;
            const models = OUTFIELD_MODELS.concat([GK_MODEL, REF_MODEL]);
            await Promise.all(models.map(async k => {
                S.containers[k] = await loadContainer(ROOT + 'personnages/' + (k === REF_MODEL ? 'far' : q) + '/' + k + '.glb', k);
            }));
            await Promise.all([loadLib('anim_football'), loadLib('anim_goalkeeper')]);

            for (const side of ['H', 'A']) {
                for (let i = 0; i < 11; i++) {
                    const gk = i === 0;
                    const P = makePlayer(side + i, gk ? GK_MODEL : OUTFIELD_MODELS[i % OUTFIELD_MODELS.length], gk);
                    S.players[side].push(P);
                }
            }
            S.ref = makePlayer('ref', REF_MODEL, false);
            S.ref.x = 0; S.ref.z = 0;

            S.ready = true;
            await applyKits();
            loadLib('anim_celebration').catch(() => {});       // en arrière-plan : utile seulement au premier but
            S.booting = false;
            if (S.enabled) { showLayers(true); }
            if (S.wantRun) start();
            if (window.ResizeObserver) { new ResizeObserver(() => S.engine && S.engine.resize()).observe(S.container); }
            window.addEventListener('resize', () => S.engine && S.engine.resize());
        } catch (e) {
            console.warn('[Match3D] repli sur la vue 2D :', e);
            S.failed = true; S.booting = false; S.ready = false;
            try { S.engine && S.engine.dispose(); } catch (e2) {}
            S.engine = null;
            showLayers(false);
            if (S.btn) { S.btn.textContent = '2D'; S.btn.disabled = true; S.btn.style.opacity = '.5'; }
        }
    }

    // ---- API publique ---------------------------------------------------
    function setEnabled(on) {
        S.enabled = !!on;
        try { localStorage.setItem('AECM_3D', on ? '1' : '0'); } catch (e) {}
        if (on && !S.ready && !S.failed) { showLayers(false); boot(); }
        else showLayers(on && S.ready);
        if (!on) stopLoop(); else if (S.wantRun) start();
    }

    function attach() {
        const container = document.getElementById('pitch-container');
        if (!container) return;
        if (S.canvas && !S.canvas.isConnected) {             // l'écran de match a été reconstruit
            try { S.engine && S.engine.dispose(); } catch (e) {}
            Object.assign(S, { engine: null, scene: null, camera: null, ready: false, booting: false, running: false,
                containers: {}, glbBytes: {}, clips: new Map(), libs: {}, players: { H: [], A: [] }, ref: null, matCache: new Map(), lastEvId: 0 });
            S.canvas = null; S.btn = null;
        }
        if (!S.canvas) {
            const cv = document.createElement('canvas');
            cv.id = 'match3d-canvas';
            cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:10;display:none;outline:none;touch-action:manipulation';
            cv.addEventListener('click', () => {                // tap : vue suivie <-> vue d'ensemble
                S.camMode = S.camMode === 'follow' ? 'wide' : 'follow';
            });
            container.insertBefore(cv, container.firstChild);
            S.canvas = cv;
            const btn = document.createElement('button');
            btn.type = 'button'; btn.id = 'pitch-3d-btn';
            btn.className = 'absolute top-2 start-2 z-40 bg-black/50 hover:bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 backdrop-blur-sm transition-colors';
            btn.title = 'Vue 3D / 2D';
            btn.onclick = () => setEnabled(!S.enabled);
            container.appendChild(btn);
            S.btn = btn;
        }
        S.container = container;
        S.enabled = prefOn();
        S.btn.textContent = S.enabled && S.ready ? '3D' : '2D';
        if (S.enabled) { if (!S.ready && !S.failed) boot(); else showLayers(S.ready); }
        else showLayers(false);
    }

    function setTeams(home, away) {
        S.teams.home = home; S.teams.away = away;
        S.lastEvId = (typeof MATCHSIM !== 'undefined' && MATCHSIM.evSeq) || 0;
        if (S.ready) {
            const old = Array.from(S.matCache.values());
            S.matCache.clear();
            S.players.H.concat(S.players.A).forEach(P => { P.init = false; P.once = null; });
            applyKits().then(() => old.forEach(pr => pr.then(e => { try { e.tex.dispose(); e.mat.dispose(); } catch (x) {} }).catch(() => {})));
        }
    }

    function start() {
        S.wantRun = true;
        if (!S.ready || !S.enabled || S.running) return;
        S.running = true; S.lastT = 0; S.guardT0 = 0;
        S.engine.runRenderLoop(frame);
    }

    function stopLoop() {
        if (S.engine && S.running) S.engine.stopRenderLoop(frame);
        S.running = false;
    }

    function pause() { S.wantRun = false; stopLoop(); }

    window.Match3D = { attach, setTeams, start, pause, setEnabled, _S: S };
})();
