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
    const BACK_SPEED = 2.0, STRAFE_SPEED = 2.1;  // m/s estimés des clips jog_backward / jog_strafe_*
    const CELEBRATIONS = ['cel_bboy_hip_hop_move', 'cel_chapa-giratoria', 'cel_swing_dancing',
        'cel_stepping_backward', 'cel_shuffling', 'cel_capoeira',
        'cel_breakdance_1990', 'cel_robot_hip_hop_dance', 'cel_thriller_part_3'];   // volontairement sans les 3 clips violents
    const OUTFIELD_MODELS = ['perso_03', 'perso_05', 'perso_07', 'joueur_bleu'];
    const GK_MODEL = 'perso_08', REF_MODEL = 'perso_10';
    // gardiens : chacun garde ses propres couleurs (violet à domicile, vert à l'extérieur)
    const GK_FOR = { H: 'perso_08', A: 'gardien_vert' }, GK_SUB = { H: 'gardien_violet', A: 'gardien_vert' };
    const GK_MODELS = ['perso_08', 'gardien_vert', 'gardien_violet'];
    // Réglage de recoloration : quelle zone du fichier de texture est le maillot.
    const KIT_MASK = {
        perso_03: { kind: 'hue', h: 225 },
        perso_05: { kind: 'hue', h: 150 },
        perso_07: { kind: 'gray', h: 215 },
        perso_08: { kind: 'hue', h: 285 },
        joueur_bleu: { kind: 'hue', h: 225 },
        gardien_vert: { kind: 'hue', h: 140 },
        gardien_violet: { kind: 'hue', h: 290 }
    };

    const S = {
        enabled: false, booting: false, ready: false, failed: false, running: false,
        container: null, canvas: null, btn: null,
        B: null, engine: null, scene: null, camera: null,
        containers: {}, glbBytes: {}, clips: new Map(), libs: {},
        players: { H: [], A: [] }, ref: null, ball: null, ballShadow: null, ring: null,
        teams: { home: null, away: null }, matCache: new Map(),
        camMode: 'follow', camX: 0, camZ: 0, lastEvId: 0, lastT: 0, timers: [],
        quality: 'far', lowEnd: false, decor: {}
    };

    // ---- Utilitaires --------------------------------------------------
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    // horloge : celle de la page, sauf pendant la cinématique (ralentis) qui fournit la sienne
    const now = () => (S.nowFn ? S.nowFn() : (typeof performance !== 'undefined' ? performance.now() : Date.now()));
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

    // Décrit une erreur lisiblement : un échec de chargement arrive souvent sous forme d'« Event »
    // brut (affiché « [object Event] ») — on en tire le type et le fichier concerné.
    function describeErr(e) {
        try {
            if (!e) return 'erreur inconnue';
            if (typeof e === 'string') return e.slice(0, 140);
            if (e.message) return String(e.message).slice(0, 140);
            if (e.type && (e.target || e.srcElement)) {
                const t = e.target || e.srcElement;
                const src = (t && (t.src || t.currentSrc || t.responseURL || t.url)) || S.lastUrl || '';
                return 'échec « ' + e.type + ' »' + (t && t.tagName ? ' (' + t.tagName.toLowerCase() + ')' : '') + (src ? ' sur ' + String(src).split('/').slice(-2).join('/') : '');
            }
            return String(e).slice(0, 140) + (S.lastUrl ? ' — ' + S.lastUrl.split('/').slice(-2).join('/') : '');
        } catch (x) { return 'erreur inconnue'; }
    }

    // Charge le moteur 3D et règle le décodeur des modèles compressés sur la copie LOCALE.
    // Ce décodeur est créé une seule fois pour toute la session : s'il est créé sans ce réglage
    // (cinématique de lancement), Babylon va le chercher sur son serveur Internet ; sans réseau,
    // l'échec restait en mémoire et la 3D des matchs ne démarrait plus (« [object Event] »).
    async function ensureBabylon() {
        if (!window.BABYLON_AECM) await loadScript(VENDOR + 'babylon-aecm.js');
        const B = window.BABYLON_AECM;
        const url = VENDOR + 'meshopt_decoder.js';
        const cfg = B.MeshoptCompression.Configuration;
        if (!cfg || !cfg.decoder || cfg.decoder.url !== url) {
            B.MeshoptCompression.Configuration = { decoder: { url } };
            try { if (B.MeshoptCompression._Default) { B.MeshoptCompression._Default.dispose(); B.MeshoptCompression._Default = null; } } catch (e) {}
        }
        return B;
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
            // un « 0 » ne compte que s'il a été choisi au bouton : les anciennes versions l'écrivaient
            // toutes seules après un démarrage lent, ce qui coupait la 3D pour toujours
            if (v === '0' && localStorage.getItem('AECM_3D_USER') === '1') return false;
        } catch (e) {}
        return true;                 // par défaut : 3D (les téléphones modestes passent en réglages allégés)
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

    // Couleur de tenue lisible en 3D : même teinte, mais une couleur très sombre est relevée (sinon un
    // maillot bleu nuit ou vert sapin se lit comme du gris foncé à 40 m, sous les projecteurs ou la pluie).
    function kitRgb(hex) {
        const [r, g, b] = hexToRgb(hex).map(v => v / 255);
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
        if (l >= 0.3) return [r * 255, g * 255, b * 255];
        let h = 0, sat = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
        if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60; if (h < 0) h += 360;
        const L = sat < 0.12 ? Math.max(l, 0.22) : 0.3, Sa = sat < 0.12 ? sat : Math.max(sat, 0.55);   // noir/gris : à peine relevé
        const C = (1 - Math.abs(2 * L - 1)) * Sa, X = C * (1 - Math.abs((h / 60) % 2 - 1)), m0 = L - C / 2;
        const [a1, b1, c1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
        return [(a1 + m0) * 255, (b1 + m0) * 255, (c1 + m0) * 255];
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

    // Zone du SHORT dans la texture d'un modèle. Les fichiers ne la séparent pas : certains modèles ont le
    // short de la couleur du maillot, un autre l'a noir. On la retrouve sur le corps lui-même : les
    // triangles situés entre le genou et la taille (pose de référence, bras écartés) sont dessinés dans
    // l'espace UV, ce qui donne un masque de la texture. Calculé une fois par modèle.
    const SHORTS_BAND = [0.355, 0.535];          // hauteur relative (0 = pieds, 1 = tête)
    function shortsMask(modelKey, W, H) {
        const ck = modelKey + '|' + W + 'x' + H;
        S.shortsMasks = S.shortsMasks || {};
        if (S.shortsMasks[ck]) return S.shortsMasks[ck];
        const cont = S.containers[modelKey];
        const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const c = cv.getContext('2d', { willReadFrequently: true });
        c.fillStyle = '#fff';
        (cont.meshes || []).forEach(m => {
            if (!m.getTotalVertices || !m.getTotalVertices()) return;
            const pos = m.getVerticesData('position'), uv = m.getVerticesData('uv'), idx = m.getIndices();
            if (!pos || !uv || !idx) return;
            // axe vertical : Y (norme glTF). Pas « la plus grande étendue » : en pose bras écartés,
            // l'envergure de certains modèles dépasse leur taille.
            const up = 1;
            let h0 = 1e9, h1 = -1e9;
            for (let i = up; i < pos.length; i += 3) { const v = pos[i]; if (v < h0) h0 = v; if (v > h1) h1 = v; }
            const hs = (h1 - h0) || 1;
            for (let t = 0; t < idx.length; t += 3) {
                const a = idx[t], b = idx[t + 1], d = idx[t + 2];
                const hc = ((pos[a * 3 + up] + pos[b * 3 + up] + pos[d * 3 + up]) / 3 - h0) / hs;
                if (hc < SHORTS_BAND[0] || hc > SHORTS_BAND[1]) continue;
                c.beginPath();
                c.moveTo(uv[a * 2] * W, uv[a * 2 + 1] * H); c.lineTo(uv[b * 2] * W, uv[b * 2 + 1] * H); c.lineTo(uv[d * 2] * W, uv[d * 2 + 1] * H);
                c.closePath(); c.fill();
            }
        });
        const px = c.getImageData(0, 0, W, H).data, mask = new Uint8Array(W * H);
        for (let i = 0; i < mask.length; i++) mask[i] = px[i * 4 + 3] > 40 ? 1 : 0;
        return (S.shortsMasks[ck] = mask);
    }

    // Peint le short : dans le masque, les pixels « tissu » (couleur du maillot d'origine, ou noir pour
    // le modèle au short noir) prennent la couleur du short du club, en gardant l'ombrage du fichier.
    function recolorShorts(data, mask, rule, target) {
        const n = mask.length;
        let sum = 0, cnt = 0;
        const pick = new Uint8Array(n);
        for (let i = 0, p = 0; i < n; i++, p += 4) {
            if (!mask[i]) continue;
            const r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255;
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, lum = 0.299 * r + 0.587 * g + 0.114 * b;
            let ok = mx < 0.24 && d < 0.09;                       // tissu noir
            if (!ok && d > 1e-4) {                                // ou tissu de la couleur d'origine du maillot
                const s = d / mx;
                let hh = mx === r ? ((g - b) / d) : mx === g ? (2 + (b - r) / d) : (4 + (r - g) / d);
                hh = ((hh * 60) + 360) % 360;
                const dh = Math.abs(((hh - rule.h) + 540) % 360 - 180);
                ok = rule.kind === 'hue' ? (s > 0.25 && dh < 35) : (s > 0.06 && s < 0.34 && dh < 28 && mx > 0.2);
            }
            if (ok) { pick[i] = 1; sum += lum; cnt++; }
        }
        const mean = cnt ? sum / cnt : 0.3;
        for (let i = 0, p = 0; i < n; i++, p += 4) {
            if (!pick[i]) continue;
            const lum = 0.299 * data[p] / 255 + 0.587 * data[p + 1] / 255 + 0.114 * data[p + 2] / 255;
            const k = Math.max(0.55, Math.min(1.45, lum / (mean || 0.3)));
            data[p] = Math.min(255, target[0] * k); data[p + 1] = Math.min(255, target[1] * k); data[p + 2] = Math.min(255, target[2] * k);
        }
    }

    // ── Masques de tenue PAR TRIANGLE ──────────────────────────────────────
    // Les textures des modèles sont découpées en centaines d'îlots. Un tri pixel par pixel (à la teinte)
    // laissait des trous (plis sombres, reflets) et des bords d'îlots à la couleur d'origine : maillot
    // « déchiré », short à moitié repeint. Ici on décide pour CHAQUE TRIANGLE du corps : on dessine son
    // numéro dans l'espace de la texture, on regarde la couleur de ses pixels et sa hauteur sur le
    // corps (pose de référence) ; un triangle de maillot ou de short est repeint EN ENTIER. Les marges
    // entre îlots sont ensuite étendues pour que les coutures ne ressortent pas au filtrage.
        function isKitColor(rule, r, g, b) {
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
        if (d < 1e-4 || mx < 0.06) return false;
        const s = d / mx;
        let h = mx === r ? ((g - b) / d) : mx === g ? (2 + (b - r) / d) : (4 + (r - g) / d);
        h = ((h * 60) + 360) % 360;
        const dh = Math.abs(((h - rule.h) + 540) % 360 - 180);
        return rule.kind === 'hue' ? (s > 0.18 && dh < 40) : (s > 0.04 && s < 0.38 && dh < 34 && mx > 0.14);
    }
    function kitMasks(modelKey, data, W, H) {
        const ck = modelKey + '|' + W + 'x' + H;
        S.kitMasks = S.kitMasks || {};
        if (S.kitMasks[ck]) return S.kitMasks[ck];
        const rule = KIT_MASK[modelKey], cont = S.containers[modelKey];
        const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const c = cv.getContext('2d', { willReadFrequently: true });
        const tris = [];                                  // hauteur relative de chaque triangle
        const tuv = [];                                   // coins du triangle dans la texture (px)
        (cont.meshes || []).forEach(m => {
            if (!m.getTotalVertices || !m.getTotalVertices()) return;
            const pos = m.getVerticesData('position'), uv = m.getVerticesData('uv'), idx = m.getIndices();
            if (!pos || !uv || !idx) return;
            let h0 = 1e9, h1 = -1e9;
            for (let i = 1; i < pos.length; i += 3) { const v = pos[i]; if (v < h0) h0 = v; if (v > h1) h1 = v; }
            const hs = (h1 - h0) || 1;
            for (let t = 0; t < idx.length; t += 3) {
                const a = idx[t], b = idx[t + 1], d = idx[t + 2];
                const id = tris.length + 1;
                tris.push(((pos[a * 3 + 1] + pos[b * 3 + 1] + pos[d * 3 + 1]) / 3 - h0) / hs);
                tuv.push(uv[a * 2] * W, uv[a * 2 + 1] * H, uv[b * 2] * W, uv[b * 2 + 1] * H, uv[d * 2] * W, uv[d * 2 + 1] * H);
                c.fillStyle = 'rgb(' + ((id >> 16) & 255) + ',' + ((id >> 8) & 255) + ',' + (id & 255) + ')';
                c.beginPath();
                c.moveTo(uv[a * 2] * W, uv[a * 2 + 1] * H); c.lineTo(uv[b * 2] * W, uv[b * 2 + 1] * H); c.lineTo(uv[d * 2] * W, uv[d * 2 + 1] * H);
                c.closePath(); c.fill();
            }
        });
        const px = c.getImageData(0, 0, W, H).data, n = W * H, T = tris.length;
        const ids = new Int32Array(n);
        const tot = new Uint32Array(T + 1), kit = new Uint32Array(T + 1), dark = new Uint32Array(T + 1);
        for (let i = 0, p = 0; i < n; i++, p += 4) {
            if (px[p + 3] < 250) continue;                 // bord anti-crénelé : ignoré pour le comptage
            const id = (px[p] << 16) | (px[p + 1] << 8) | px[p + 2];
            if (id < 1 || id > T) continue;
            // sur une arête commune, l'anticrénelage mélange deux numéros et en fabrique un troisième :
            // on ne garde le numéro que si le centre du pixel est bien DANS ce triangle
            {
                const q = (id - 1) * 6, X = (i % W) + 0.5, Y = ((i / W) | 0) + 0.5;
                const x0 = tuv[q], y0 = tuv[q + 1], x1 = tuv[q + 2], y1 = tuv[q + 3], x2 = tuv[q + 4], y2 = tuv[q + 5];
                const den = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
                if (Math.abs(den) < 1e-9) continue;
                const l0 = ((y1 - y2) * (X - x2) + (x2 - x1) * (Y - y2)) / den;
                const l1 = ((y2 - y0) * (X - x2) + (x0 - x2) * (Y - y2)) / den;
                const tol = 1.2 / Math.sqrt(Math.abs(den));       // ≈ un pixel de marge
                if (l0 < -tol || l1 < -tol || 1 - l0 - l1 < -tol) continue;
            }
            ids[i] = id; tot[id]++;
            const r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255;
            if (isKitColor(rule, r, g, b)) kit[id]++;
            else if (Math.max(r, g, b) < 0.24 && Math.max(r, g, b) - Math.min(r, g, b) < 0.09) dark[id]++;
        }
        // classe de chaque triangle : 1 maillot, 2 short
        const cls = new Uint8Array(T + 1);
        for (let id = 1; id <= T; id++) {
            if (!tot[id]) continue;
            const hc = tris[id - 1], fk = kit[id] / tot[id], fd = dark[id] / tot[id];
            const inShorts = hc >= SHORTS_BAND[0] && hc < SHORTS_BAND[1];
            if (inShorts && (fk >= 0.4 || fd >= 0.5)) cls[id] = 2;
            else if (fk >= 0.4) cls[id] = 1;              // manches, col, chaussettes : couleur du maillot
        }
        let m = new Uint8Array(n);
        for (let i = 0; i < n; i++) if (ids[i]) m[i] = cls[ids[i]];
        // petits trous (minuscules triangles, reflets) : un pixel entouré par la tenue en prend la classe
        for (let pass = 0; pass < 2; pass++) {
            const m2 = m.slice();
            for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
                const i = y * W + x;
                if (m[i]) continue;
                const a = m[i - 1], b = m[i + 1], u = m[i - W], d = m[i + W];
                const v = a || b || u || d;
                if (v && (a === v) + (b === v) + (u === v) + (d === v) >= 3) m2[i] = v;
            }
            m = m2;
        }
        return (S.kitMasks[ck] = { zone: m, ids });
    }

    // Bords des îlots : les pixels hors triangle (marges, bords anti-crénelés) prennent la couleur de
    // l'îlot VOISIN, quel qu'il soit (tissu ou peau). Sans cela, le filtrage de la texture mélangeait la
    // couleur d'origine des marges : fines lignes sur le maillot, points clairs sur les bras.
    function padIslands(data, ids, W, H) {
        const n = W * H;
        let ok = new Uint8Array(n);
        for (let i = 0; i < n; i++) ok[i] = ids[i] ? 1 : 0;
        for (let pass = 0; pass < 6; pass++) {
            const ok2 = ok.slice();
            let changed = 0;
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
                const i = y * W + x;
                if (ok[i]) continue;
                let r = 0, g = 0, b = 0, c = 0;
                if (x > 0 && ok[i - 1]) { const q = (i - 1) * 4; r += data[q]; g += data[q + 1]; b += data[q + 2]; c++; }
                if (x < W - 1 && ok[i + 1]) { const q = (i + 1) * 4; r += data[q]; g += data[q + 1]; b += data[q + 2]; c++; }
                if (y > 0 && ok[i - W]) { const q = (i - W) * 4; r += data[q]; g += data[q + 1]; b += data[q + 2]; c++; }
                if (y < H - 1 && ok[i + W]) { const q = (i + W) * 4; r += data[q]; g += data[q + 1]; b += data[q + 2]; c++; }
                if (!c) continue;
                const p = i * 4;
                data[p] = r / c; data[p + 1] = g / c; data[p + 2] = b / c;
                ok2[i] = 1; changed++;
            }
            ok = ok2;
            if (!changed) break;
        }
    }

    // Repeint une zone (1 maillot, 2 short) en gardant un ombrage ADOUCI du fichier : les plis restent
    // lisibles mais ne font plus de taches sombres (surtout sur un maillot clair).
    function paintZone(data, mask, zone, target) {
        let sum = 0, cnt = 0;
        for (let i = 0, p = 0; i < mask.length; i++, p += 4) {
            if (mask[i] !== zone) continue;
            sum += 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]; cnt++;
        }
        const mean = cnt ? sum / cnt : 100;
        const light = (0.299 * target[0] + 0.587 * target[1] + 0.114 * target[2]) / 255;
        const amp = light > 0.7 ? 0.35 : 0.55;           // un maillot blanc supporte moins de contraste
        for (let i = 0, p = 0; i < mask.length; i++, p += 4) {
            if (mask[i] !== zone) continue;
            const lum = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
            const k = Math.max(0.62, Math.min(1.22, 1 + (lum / (mean || 1) - 1) * amp));
            data[p] = Math.min(255, target[0] * k);
            data[p + 1] = Math.min(255, target[1] * k);
            data[p + 2] = Math.min(255, target[2] * k);
        }
    }

    // Matériau d'un modèle pour une équipe (mis en cache). hex = maillot, shorts = short (optionnel).
    function teamMaterial(modelKey, hex, shorts) {
        const key = modelKey + '|' + hex + '|' + (shorts || '');
        if (!S.matCache.has(key)) S.matCache.set(key, buildTeamMaterial(modelKey, hex, key, shorts));
        return S.matCache.get(key);       // promesse partagée : un seul calcul par (modèle, couleurs)
    }

    async function buildTeamMaterial(modelKey, hex, key, shorts) {
        const B = S.B, cont = S.containers[modelKey];
        const base = cont.materials[0];
        const bmp = await baseColorBitmap(S.glbBytes[modelKey]);
        const cv = document.createElement('canvas');
        cv.width = bmp.width; cv.height = bmp.height;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(bmp, 0, 0);
        const im = ctx.getImageData(0, 0, cv.width, cv.height);
        // masques par triangle (calculés sur la texture d'ORIGINE), puis short et maillot
        let masks = null;
        try { masks = kitMasks(modelKey, im.data, cv.width, cv.height); } catch (e) { console.warn('[3D] masque', e); }
        if (masks) {
            paintZone(im.data, masks.zone, 2, kitRgb(shorts || hex));
            paintZone(im.data, masks.zone, 1, kitRgb(hex));
            padIslands(im.data, masks.ids, cv.width, cv.height);
        } else {                                          // repli : ancien tri à la couleur
            if (shorts) { try { recolorShorts(im.data, shortsMask(modelKey, cv.width, cv.height), KIT_MASK[modelKey], kitRgb(shorts)); } catch (e) {} }
            recolor(im.data, KIT_MASK[modelKey], kitRgb(hex));
        }
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
        if (isGK) return null;                         // gardiens : violet (domicile) et vert (extérieur) d'origine
        return base;
    }

    // Couleur du short d'un club (même source que le maillot ; à défaut, celle du maillot).
    function shortsHex(name, away) {
        try { if (typeof clubKit === 'function') { const k = clubKit(name, away); return k.shorts || k.base || null; } } catch (e) {}
        return null;
    }

    async function applyKits() {
        if (!S.ready || !S.teams.home) return;
        const jobs = [];
        ['H', 'A'].forEach(side => {
            const away = side === 'A';
            const club = away ? S.teams.away : S.teams.home;
            const sb = S.bench && S.bench[side] ? S.bench[side].subs.map(b => b.P) : [];
            S.players[side].concat(sb).forEach(P => {
                jobs.push((async () => {
                    const hex = kitHex(club, away, P.isGK);
                    const sh = P.isGK ? null : shortsHex(club, away);
                    let mat = S.containers[P.model].materials[0];
                    if (hex) { try { mat = (await teamMaterial(P.model, hex, sh)).mat; } catch (e) { console.warn('[3D] kit', e); } }
                    P.meshes.forEach(m => { m.material = mat; });
                })());
            });
        });
        await Promise.all(jobs);
        tunePlayerMats();
    }

    // Matériaux PBR des joueurs : sans carte d'environnement, ils ne reçoivent que l'hémisphère et
    // le soleil et paraissent ternes. On renforce la lumière directe et on ajoute un léger fond
    // émissif, réglé par l'ambiance (plus fort en nocturne, sous les projecteurs).
    function tunePlayerMats() {
        const th = S.theme || {}, seen = new Set();
        S.players.H.concat(S.players.A).concat(S.ref ? [S.ref] : []).concat(S.bench ? S.bench.all.map(b => b.P) : []).forEach(P => P.meshes.forEach(m => {
            const mat = m.material; if (!mat || seen.has(mat) || mat.getClassName() !== 'PBRMaterial') return; seen.add(mat);
            // Tissu et peau, pas du métal : les fichiers arrivent avec metallic = 1, ce qui rend un corps gris
            // et délavé (un métal sans reflets d'environnement n'a presque plus de couleur propre).
            mat.metallic = 0; mat.roughness = 0.78;
            mat.transparencyMode = 0; mat.alpha = 1;                // opaque
            mat.directIntensity = th.flood ? 1.7 : 1.35;
            // léger éclairage propre tiré de la texture : maillots et peau gardent leurs vraies couleurs même
            // sous une lumière faible (pluie, nuit), au lieu de virer au gris
            const e = th.flood ? 0.3 : 0.2;
            mat.emissiveTexture = mat.albedoTexture || null; mat.emissiveColor = new S.B.Color3(e, e, e);
        }));
    }

    // ---- Décor : kit de géométrie --------------------------------------
    // Le bundle Babylon embarqué n'expose ni CreateCylinder ni VertexData : les maillages du
    // décor sont fabriqués à la main (sommets + indices + UV) et fusionnés par matériau, ce
    // qui garde le nombre d'appels de dessin très bas (≈ 20 pour tout le stade).
    const Z2 = [0, 0];
    function geo() { return { p: [], uv: [], i: [] }; }
    function gTri(g, a, b, c, ua, ub, uc) {
        const n = g.p.length / 3;
        g.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        g.uv.push(ua[0], ua[1], ub[0], ub[1], uc[0], uc[1]);
        g.i.push(n, n + 1, n + 2);
    }
    function gQuad(g, a, b, c, d, ua, ub, uc, ud) {
        ua = ua || Z2; ub = ub || Z2; uc = uc || Z2; ud = ud || Z2;
        gTri(g, a, b, c, ua, ub, uc); gTri(g, a, c, d, ua, uc, ud);
    }
    function gTube(g, a, b, r, seg) {                       // cylindre plein de a à b
        seg = seg || 8;
        const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]) || 1;
        const n = [d[0] / L, d[1] / L, d[2] / L], h = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        let u = [n[1] * h[2] - n[2] * h[1], n[2] * h[0] - n[0] * h[2], n[0] * h[1] - n[1] * h[0]];
        const ul = Math.hypot(u[0], u[1], u[2]); u = [u[0] / ul, u[1] / ul, u[2] / ul];
        const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
        const ring = (c, k) => { const t = k / seg * Math.PI * 2, co = Math.cos(t) * r, si = Math.sin(t) * r;
            return [c[0] + u[0] * co + v[0] * si, c[1] + u[1] * co + v[1] * si, c[2] + u[2] * co + v[2] * si]; };
        for (let k = 0; k < seg; k++) {
            const a0 = ring(a, k), a1 = ring(a, k + 1), b0 = ring(b, k), b1 = ring(b, k + 1);
            gQuad(g, a0, a1, b1, b0);
            gTri(g, a, a1, a0, Z2, Z2, Z2); gTri(g, b, b0, b1, Z2, Z2, Z2);
        }
    }
    function gBox(g, cx, cy, cz, sx, sy, sz) {
        const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2;
        const q = (a, b, c, d) => gQuad(g, a, b, c, d);
        q([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]); q([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
        q([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]); q([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]);
        q([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]); q([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]);
    }
    function toMesh(name, g, mat, live) {
        if (!g.i.length) return null;
        const m = new S.B.Mesh(name, S.scene);
        m.setVerticesData('position', g.p, false);
        m.setVerticesData('uv', g.uv, false);
        m.setIndices(g.i);
        m.material = mat; m.isPickable = false;
        if (!live) m.freezeWorldMatrix();
        return m;
    }
    function flatMat(name, r, g, b, alpha) {                  // couleur unie, insensible aux lumières
        const B = S.B, m = new B.StandardMaterial(name, S.scene);
        m.diffuseColor = new B.Color3(0, 0, 0); m.specularColor = new B.Color3(0, 0, 0);
        m.emissiveColor = new B.Color3(r, g, b); m.disableLighting = true; m.backFaceCulling = false;
        if (alpha != null) m.alpha = alpha;
        return m;
    }
    function texMat(name, tex, k, useAlpha) {
        const B = S.B, m = new B.StandardMaterial(name, S.scene);
        // Sans lumière, seule la part ÉMISSIVE compte : émissif = k × texture (k règle la luminosité).
        m.diffuseTexture = tex; m.diffuseColor = new B.Color3(0, 0, 0); m.specularColor = new B.Color3(0, 0, 0);
        m.emissiveColor = new B.Color3(k, k, k); m.disableLighting = true; m.backFaceCulling = false;
        if (useAlpha) m.useAlphaFromDiffuseTexture = true;
        return m;
    }
    function rng(seed) {
        let a = seed >>> 0;
        return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    }

    // ---- Buts : poteaux ronds, barre, armature, filet à mailles ----------
    const GOAL_H = 2.44, GOAL_HW = 3.66, NET_TOP_D = 1.0, NET_TOP_H = 2.0, NET_BACK_D = 2.1, NET_CELL = 0.3;
    function buildGoals() {
        const B = S.B, scene = S.scene, seg = S.lowEnd ? 6 : 12;
        const white = flatMat('goalWhite', 0.97, 0.97, 0.97);
        const netTex = new B.DynamicTexture('netTex', { width: 64, height: 64 }, scene, true);
        const nc = netTex.getContext(); nc.clearRect(0, 0, 64, 64);
        nc.strokeStyle = 'rgba(255,255,255,0.95)'; nc.lineWidth = 9;
        nc.beginPath(); nc.moveTo(0, 0); nc.lineTo(64, 0); nc.moveTo(0, 0); nc.lineTo(0, 64); nc.stroke();
        netTex.hasAlpha = true; netTex.wrapU = netTex.wrapV = B.Texture.WRAP_ADDRESSMODE; netTex.anisotropicFilteringLevel = 4; netTex.update();
        const netMat = texMat('netMat', netTex, 1.0, true);
        netMat.emissiveColor = new B.Color3(0.9, 0.92, 0.95);
        const gF = geo();
        S.decor.nets = {};
        [-1, 1].forEach(s => {
            const gx = s * PITCH_W / 2, hw = GOAL_HW, X = (d) => gx + s * d;
            // armature blanche : poteaux Ø 15 cm, barre, rails de filet, arceaux arrière
            [-hw, hw].forEach(z => {
                gTube(gF, [gx, 0, z], [gx, GOAL_H, z], 0.075, seg);
                gTube(gF, [gx, GOAL_H, z], [X(NET_TOP_D), NET_TOP_H, z], 0.035, 6);
                gTube(gF, [X(NET_TOP_D), NET_TOP_H, z], [X(NET_BACK_D), 0.03, z], 0.035, 6);
                gTube(gF, [gx, 0.03, z], [X(NET_BACK_D), 0.03, z], 0.035, 6);
            });
            gTube(gF, [gx, GOAL_H, -hw - 0.075], [gx, GOAL_H, hw + 0.075], 0.075, seg);
            gTube(gF, [X(NET_TOP_D), NET_TOP_H, -hw], [X(NET_TOP_D), NET_TOP_H, hw], 0.035, 6);
            gTube(gF, [X(NET_BACK_D), 0.03, -hw], [X(NET_BACK_D), 0.03, hw], 0.035, 6);
            // filet : 4 pans (dessus, fond, 2 côtés), mailles de 30 cm — origine sur la ligne de but
            const g = geo(), C = NET_CELL, P = (d, y, z) => [s * d, y, z];
            const slope = Math.hypot(NET_BACK_D - NET_TOP_D, NET_TOP_H);
            gQuad(g, P(0, GOAL_H, -hw), P(0, GOAL_H, hw), P(NET_TOP_D, NET_TOP_H, hw), P(NET_TOP_D, NET_TOP_H, -hw),
                [-hw / C, 0], [hw / C, 0], [hw / C, NET_TOP_D / C], [-hw / C, NET_TOP_D / C]);
            gQuad(g, P(NET_TOP_D, NET_TOP_H, -hw), P(NET_TOP_D, NET_TOP_H, hw), P(NET_BACK_D, 0, hw), P(NET_BACK_D, 0, -hw),
                [-hw / C, 0], [hw / C, 0], [hw / C, slope / C], [-hw / C, slope / C]);
            [-hw, hw].forEach(z => {
                const u = (d) => d / C, v = (y) => y / C;
                gQuad(g, P(0, 0, z), P(0, GOAL_H, z), P(NET_TOP_D, NET_TOP_H, z), P(NET_BACK_D, 0, z),
                    [u(0), v(0)], [u(0), v(GOAL_H)], [u(NET_TOP_D), v(NET_TOP_H)], [u(NET_BACK_D), v(0)]);
            });
            const nm = toMesh('net' + s, g, netMat, true);
            if (nm) { nm.position.x = gx; nm.alphaIndex = 5; S.decor.nets[s] = nm; }
        });
        toMesh('goalFrame', gF, white);
    }

    // =====================================================================
    // DÉCOR DU MATCH — reconstruit à chaque rencontre (setConditions)
    // La météo du moteur (MATCH_WEATHER), l'état de la pelouse (PITCH_STATES) et le stade du
    // club qui reçoit (capacité, nom) décident de l'ambiance : nocturne sous les projecteurs,
    // plein soleil, brume d'harmattan, pluie ; petit stade municipal à une tribune couverte,
    // stade omnisports avec piste d'athlétisme, ou grande cuvette à deux anneaux et toit.
    // Le bundle Babylon embarqué n'a ni ombres ni effets : tout est fait avec la géométrie
    // maison, des textures peintes une fois, et le traitement d'image de la scène.
    // =====================================================================
    const THEMES = {
        night:     { sky: ['#01030a', '#071330', '#12244a'], clear: [0.01, 0.02, 0.05], hemi: 0.62, hemiCol: [0.78, 0.85, 1.0], ground: [0.22, 0.27, 0.25],
                     sun: 0.55, sunDir: [0.15, -1, 0.25], flood: true, fog: null, exposure: 1.08, contrast: 1.28, vignette: 2.2, shadows: 'flood', shA: 0.2,
                     crowdK: 0.8, grassK: 0.95, skyline: 'night' },
        clear:     { sky: ['#1f5fa8', '#69a6dc', '#cfe3f2'], clear: [0.45, 0.62, 0.8], hemi: 0.92, hemiCol: [1, 0.98, 0.93], ground: [0.38, 0.42, 0.32],
                     sun: 1.25, sunDir: [-0.5, -1, 0.42], flood: false, fog: null, exposure: 1.0, contrast: 1.18, vignette: 1.4, shadows: 'sun', shA: 0.42,
                     crowdK: 1.08, grassK: 1.0, skyline: 'day' },
        heat:      { sky: ['#2c6db8', '#8cbde6', '#f1ecdc'], clear: [0.55, 0.7, 0.82], hemi: 1.0, hemiCol: [1, 0.95, 0.84], ground: [0.45, 0.42, 0.3],
                     sun: 1.5, sunDir: [-0.3, -1, 0.2], flood: false, fog: { col: '#e9dfc6', d: 0.0022 }, exposure: 1.1, contrast: 1.22, vignette: 1.3, shadows: 'sun', shA: 0.5,
                     crowdK: 1.12, grassK: 1.03, skyline: 'day' },
        harmattan: { sky: ['#a77f52', '#cfa77a', '#e6cba6'], clear: [0.8, 0.66, 0.5], hemi: 0.88, hemiCol: [1, 0.88, 0.72], ground: [0.45, 0.38, 0.28],
                     sun: 0.7, sunDir: [-0.55, -0.8, 0.5], flood: false, fog: { col: '#cfac82', d: 0.0072 }, exposure: 1.02, contrast: 1.02, vignette: 1.6, shadows: 'sun', shA: 0.22,
                     crowdK: 0.98, grassK: 0.92, skyline: 'dust' },
        rain:      { sky: ['#30363e', '#4c545e', '#6e7781'], clear: [0.3, 0.33, 0.37], hemi: 0.78, hemiCol: [0.85, 0.9, 0.96], ground: [0.28, 0.32, 0.32],
                     sun: 0.3, sunDir: [0.2, -1, 0.3], flood: true, fog: { col: '#636b74', d: 0.0062 }, exposure: 0.98, contrast: 1.08, vignette: 1.9, shadows: 'flood', shA: 0.14,
                     crowdK: 0.84, grassK: 0.86, wet: true, rain: true, skyline: 'grey' },
        humid:     { sky: ['#5a82a8', '#a1bbd0', '#dde5e8'], clear: [0.62, 0.72, 0.8], hemi: 0.92, hemiCol: [1, 0.97, 0.92], ground: [0.38, 0.42, 0.34],
                     sun: 0.95, sunDir: [-0.4, -1, 0.35], flood: false, fog: { col: '#bccad0', d: 0.0042 }, exposure: 1.02, contrast: 1.1, vignette: 1.5, shadows: 'sun', shA: 0.32,
                     crowdK: 1.02, grassK: 0.97, skyline: 'day' }
    };
    const hex3 = (h) => { const c = hexToRgb(h); return new S.B.Color3(c[0] / 255, c[1] / 255, c[2] / 255); };

    // Spécification du stade à partir de sa capacité et de son nom (voir stadiumCapacityFor / stadiumNameFor).
    function stadiumSpec(info) {
        const cap = (info && info.capacity) || 15000;
        const name = String((info && info.name) || '');
        const tier = cap < 9000 ? 'small' : cap < 30000 ? 'medium' : 'large';
        const track = /Omnisports|Municipal|Régional/i.test(name);
        let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
        const fill = clamp((info && info.fill) || (0.55 + (h % 40) / 100), 0.25, 0.98);
        return { cap, tier, track, fill, seed: h || 7 };
    }

    // ---- Collecte des objets du décor (supprimés au match suivant) ---------
    function track(o) { (S.decorObjs || (S.decorObjs = [])).push(o); return o; }
    function clearDecor() {
        (S.decorObjs || []).forEach(o => { try { o.dispose(false, true); } catch (e) { try { o.dispose(); } catch (e2) {} } });
        S.decorObjs = [];
        S.decor = { nets: S.decor && S.decor.nets };
    }
    function dmesh(name, g, mat, live) { const m = toMesh(name, g, mat, live); if (m) track(m); return m; }
    function dflat(name, r, g, b, a) { return track(flatMat(name, r, g, b, a)); }
    function dtex(name, w, h, mip) { return track(new S.B.DynamicTexture(name, { width: w, height: h }, S.scene, mip !== false)); }
    // Matériau éclairé (reçoit hémisphère + soleil) : sols, toits, façades — le relief se lit.
    function litMat(name, tex, col, spec) {
        const B = S.B, m = track(new B.StandardMaterial(name, S.scene));
        if (tex) m.diffuseTexture = tex;
        m.diffuseColor = col ? new B.Color3(col[0], col[1], col[2]) : new B.Color3(1, 1, 1);
        m.specularColor = new B.Color3(spec || 0, spec || 0, spec || 0);
        m.backFaceCulling = false;
        return m;
    }

    // ---- Pelouse --------------------------------------------------------
    function paintPitch(spec, cond) {
        const B = S.B, th = S.theme, PXM = S.lowEnd ? 8 : 11;
        const cw = Math.round(FIELD_W * PXM), ch = Math.round(FIELD_H * PXM);
        const tex = dtex('pitchTex', cw, ch, true);
        const c = tex.getContext(), R = rng(spec.seed + 11);
        const X = (m) => (m + FIELD_W / 2) * PXM, Y = (m) => (m + FIELD_H / 2) * PXM;
        const st = (cond && cond.pitch && cond.pitch.id) || 'correct';
        const wear = { perfect: 0, correct: 0.18, worn: 0.5, heavy: 0.72, bumpy: 0.55 }[st] || 0.18;
        const base = st === 'heavy' ? [46, 112, 50] : st === 'bumpy' ? [62, 128, 58] : st === 'worn' ? [58, 132, 60] : [50, 140, 62];
        const rgb = (k, a) => `rgba(${Math.round(base[0] * k)},${Math.round(base[1] * k)},${Math.round(base[2] * k)},${a == null ? 1 : a})`;
        c.fillStyle = rgb(0.86); c.fillRect(0, 0, cw, ch);                                   // pourtour
        c.fillStyle = rgb(1); c.fillRect(X(-PITCH_W / 2 - 1.5), Y(-PITCH_H / 2 - 1.5), (PITCH_W + 3) * PXM, (PITCH_H + 3) * PXM);
        // tonte : bandes dans la longueur ; sur une pelouse impeccable, damier croisé (comme en Europe)
        const nb = 18, sw = (PITCH_W + 3) / nb;
        for (let i = 0; i < nb; i++) {
            c.fillStyle = i % 2 ? rgb(1.1) : rgb(0.95);
            c.fillRect(X(-PITCH_W / 2 - 1.5 + i * sw), Y(-PITCH_H / 2 - 1.5), sw * PXM + 1, (PITCH_H + 3) * PXM);
        }
        if (st === 'perfect') {
            const nc = 10, sh = (PITCH_H + 3) / nc;
            for (let j = 0; j < nc; j++) if (j % 2) { c.fillStyle = 'rgba(255,255,255,0.045)'; c.fillRect(X(-PITCH_W / 2 - 1.5), Y(-PITCH_H / 2 - 1.5 + j * sh), (PITCH_W + 3) * PXM, sh * PXM); }
        }
        // grandes taches de couleur (l'herbe n'est jamais uniforme)
        const blot = document.createElement('canvas'); blot.width = 48; blot.height = 32;
        const bc = blot.getContext('2d'), bi = bc.createImageData(48, 32);
        for (let i = 0; i < bi.data.length; i += 4) { const v = 110 + R() * 70; bi.data[i] = v * 0.8; bi.data[i + 1] = v; bi.data[i + 2] = v * 0.6; bi.data[i + 3] = 255; }
        bc.putImageData(bi, 0, 0);
        c.save(); c.globalAlpha = 0.22; c.globalCompositeOperation = 'overlay'; c.imageSmoothingEnabled = true; c.drawImage(blot, 0, 0, cw, ch); c.restore();
        // usure : surfaces de but, point de penalty, rond central, couloirs des arbitres assistants
        const dirt = st === 'heavy' ? [86, 66, 42] : [128, 104, 70];
        const patch = (mx, my, rx, ry, a) => {
            if (a <= 0.01) return;
            c.save(); c.translate(X(mx), Y(my)); c.scale(1, ry / rx);
            const gr = c.createRadialGradient(0, 0, 0, 0, 0, rx * PXM);
            gr.addColorStop(0, `rgba(${dirt[0]},${dirt[1]},${dirt[2]},${a})`); gr.addColorStop(0.55, `rgba(${dirt[0]},${dirt[1]},${dirt[2]},${a * 0.55})`);
            gr.addColorStop(1, `rgba(${dirt[0]},${dirt[1]},${dirt[2]},0)`);
            c.fillStyle = gr; c.beginPath(); c.arc(0, 0, rx * PXM, 0, Math.PI * 2); c.fill(); c.restore();
        };
        [-1, 1].forEach(s => {
            const gx = s * PITCH_W / 2;
            patch(gx - s * 3, 0, 5.5, 4.2, wear * 0.95);            // petite surface
            patch(gx - s * 0.9, 0, 2.2, 3.6, wear * 0.9);           // ligne de but, devant le gardien
            patch(gx - s * 11, 0, 1.6, 1.6, wear * 0.7);            // point de penalty
            patch(gx - s * 17, 0, 8, 10, wear * 0.25);
            patch(s * PITCH_W / 4, s * (PITCH_H / 2 - 0.8), 24, 1.6, wear * 0.45);   // couloir de l'arbitre assistant
        });
        patch(0, 0, 6, 6, wear * 0.55);
        if (wear > 0.4) for (let k = 0; k < 26; k++) patch((R() - 0.5) * PITCH_W, (R() - 0.5) * PITCH_H, 1 + R() * 3.5, 1 + R() * 2.5, wear * (0.2 + R() * 0.35));
        // grain fin
        const im = c.getImageData(0, 0, cw, ch), d = im.data;
        for (let i = 0; i < d.length; i += 4) { const n = (R() - 0.5) * 16; d[i] += n * 0.8; d[i + 1] += n; d[i + 2] += n * 0.6; }
        c.putImageData(im, 0, 0);
        // lignes (un rien adoucies)
        c.strokeStyle = 'rgba(255,255,255,0.9)'; c.fillStyle = 'rgba(255,255,255,0.92)';
        c.lineWidth = Math.max(2, 0.14 * PXM); c.shadowColor = 'rgba(255,255,255,0.35)'; c.shadowBlur = 1.5;
        const line = (x1, y1, x2, y2) => { c.beginPath(); c.moveTo(X(x1), Y(y1)); c.lineTo(X(x2), Y(y2)); c.stroke(); };
        const rect = (x, y, w, h) => c.strokeRect(X(x), Y(y), w * PXM, h * PXM);
        const circ = (x, y, r, a0, a1) => { c.beginPath(); c.arc(X(x), Y(y), r * PXM, a0 || 0, a1 == null ? Math.PI * 2 : a1); c.stroke(); };
        const dot = (x, y) => { c.beginPath(); c.arc(X(x), Y(y), 0.3 * PXM, 0, Math.PI * 2); c.fill(); };
        rect(-PITCH_W / 2, -PITCH_H / 2, PITCH_W, PITCH_H);
        line(0, -PITCH_H / 2, 0, PITCH_H / 2);
        circ(0, 0, 9.15); dot(0, 0);
        [-1, 1].forEach(s => {
            const gx = s * PITCH_W / 2;
            rect(s > 0 ? gx - 16.5 : gx, -20.16, 16.5, 40.32);
            rect(s > 0 ? gx - 5.5 : gx, -9.16, 5.5, 18.32);
            dot(gx - s * 11, 0);
            const a = Math.acos(5.5 / 9.15);
            if (s > 0) circ(gx - 11, 0, 9.15, Math.PI - a, Math.PI + a); else circ(gx + 11, 0, 9.15, -a, a);
            [-1, 1].forEach(t => {
                c.beginPath();
                const a0 = s > 0 ? (t > 0 ? Math.PI : Math.PI / 2) : (t > 0 ? Math.PI * 1.5 : 0);
                c.arc(X(gx), Y(t * PITCH_H / 2), 1 * PXM, a0, a0 + Math.PI / 2); c.stroke();
            });
        });
        c.shadowBlur = 0;
        tex.anisotropicFilteringLevel = 8; tex.update();
        const m = litMat('pitchMat', tex, [th.grassK, th.grassK, th.grassK], th.wet ? 0.22 : 0.03);
        if (th.wet) m.specularPower = 24;
        m.emissiveColor = new B.Color3(0.1, 0.1, 0.1);
        const ground = track(B.CreateGround('pitch', { width: FIELD_W, height: FIELD_H }, S.scene));
        ground.material = m; ground.isPickable = false; ground.freezeWorldMatrix();
    }

    // ---- Piste d'athlétisme (stades omnisports) ---------------------------
    // Géométrie d'une vraie piste de 400 m : lignes droites de 84,39 m, virages de 36,5 m de rayon,
    // 8 couloirs de 1,22 m. Le terrain (105 x 68) tient dans l'anneau intérieur.
    const TRK = { half: 42.195, r0: 36.5, w: 9.76 };
    function ovalPt(u, r) {                                   // u ∈ [0,1) le long de la piste
        const L1 = TRK.half * 2, A = Math.PI * r, P = 2 * L1 + 2 * A;
        let s = u * P;
        if (s < L1) return [-TRK.half + s, r];
        s -= L1; if (s < A) { const a = Math.PI / 2 - s / r; return [TRK.half + Math.cos(a) * r, Math.sin(a) * r]; }
        s -= A; if (s < L1) return [TRK.half - s, -r];
        s -= L1; { const a = -Math.PI / 2 - s / r; return [-TRK.half + Math.cos(a) * r, Math.sin(a) * r]; }
    }
    function buildTrack() {
        const B = S.B, N = 120;
        const tex = dtex('trackTex', 256, 64, true), c = tex.getContext();
        c.fillStyle = '#a8432e'; c.fillRect(0, 0, 256, 64);
        for (let i = 0; i < 1400; i++) { c.fillStyle = `rgba(${60 + Math.random() * 40},20,10,0.18)`; c.fillRect(Math.random() * 256, Math.random() * 64, 1.5, 1.5); }
        c.fillStyle = 'rgba(255,255,255,0.85)';
        for (let k = 0; k <= 8; k++) c.fillRect(0, Math.round(k * 63 / 8), 256, 1.4);
        tex.wrapU = B.Texture.WRAP_ADDRESSMODE; tex.update();
        const g = geo();
        for (let i = 0; i < N; i++) {
            const u0 = i / N, u1 = (i + 1) / N;
            const a0 = ovalPt(u0, TRK.r0), a1 = ovalPt(u1, TRK.r0), b0 = ovalPt(u0, TRK.r0 + TRK.w), b1 = ovalPt(u1, TRK.r0 + TRK.w);
            gQuad(g, [a0[0], 0.012, a0[1]], [a1[0], 0.012, a1[1]], [b1[0], 0.012, b1[1]], [b0[0], 0.012, b0[1]],
                [u0 * 40, 0], [u1 * 40, 0], [u1 * 40, 1], [u0 * 40, 1]);
        }
        dmesh('track', g, litMat('trackMat', tex, [0.95, 0.95, 0.95], S.theme.wet ? 0.18 : 0.02));
        // pelouse de l'anneau intérieur (les « D » derrière les buts)
        const gi = geo();
        for (let i = 0; i < N; i++) {
            const a0 = ovalPt(i / N, TRK.r0 + 0.05), a1 = ovalPt((i + 1) / N, TRK.r0 + 0.05);
            gTri(gi, [0, -0.012, 0], [a0[0], -0.012, a0[1]], [a1[0], -0.012, a1[1]], Z2, Z2, Z2);
        }
        dmesh('infield', gi, litMat('infieldMat', null, [0.17 * S.theme.grassK, 0.42 * S.theme.grassK, 0.19 * S.theme.grassK]));
    }

    // ---- Tribunes ---------------------------------------------------------
    // Texture de public : rangées de sièges aux couleurs du club, supporters, places vides
    // selon le remplissage. Deux variantes, répétées en tuiles.
    function crowdTexture(seed, W, H, homeHex, fill) {
        const tex = dtex('crowd' + seed, W, H, true);
        const c = tex.getContext(), R = rng(seed), rows = 16, rh = H / rows, seats = 40, sw = W / seats;
        const home = homeHex || '#1e3a8a';
        const KIT = [home, home, home, home, '#f8fafc', '#f8fafc', '#facc15', '#16a34a', '#dc2626', '#38bdf8', '#a3a3a3'];
        const SKIN = ['#3b2416', '#4a2d1c', '#5a3825', '#6d4530', '#8d5a3c', '#b57d56'];
        const seatC = hexToRgb(home);
        const seat = (k) => `rgb(${Math.round(seatC[0] * k)},${Math.round(seatC[1] * k)},${Math.round(seatC[2] * k)})`;
        c.fillStyle = '#3a414d'; c.fillRect(0, 0, W, H);
        for (let r = 0; r < rows; r++) {
            const y0 = H - (r + 1) * rh;
            c.fillStyle = '#4a515c'; c.fillRect(0, y0 + rh * 0.84, W, rh * 0.16);                       // marche
            c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(0, y0 + rh * 0.78, W, rh * 0.06);              // ombre de la marche
            for (let s = 0; s < seats; s++) {
                const x0 = s * sw;
                if (s % 20 === 10) { c.fillStyle = '#12161d'; c.fillRect(x0, y0, sw, rh); continue; }   // allée
                c.fillStyle = seat(0.8 + 0.15 * ((r + s) % 2)); c.fillRect(x0 + 1, y0 + rh * 0.44, sw - 2, rh * 0.42);
                if (R() < fill) {
                    const shirt = KIT[(R() * KIT.length) | 0];
                    const lift = R() < 0.12 ? -rh * 0.12 : 0;                                              // quelques-uns debout
                    c.fillStyle = shirt; c.fillRect(x0 + sw * 0.12, y0 + rh * 0.34 + lift, sw * 0.76, rh * 0.5);
                    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x0 + sw * 0.18, y0 + rh * 0.62 + lift, sw * 0.64, rh * 0.22);
                    c.fillStyle = SKIN[(R() * SKIN.length) | 0];
                    c.beginPath(); c.arc(x0 + sw * 0.5, y0 + rh * 0.24 + lift, sw * 0.23, 0, Math.PI * 2); c.fill();
                    if (R() < 0.05) { c.fillStyle = home; c.fillRect(x0 + sw * 0.1, y0 - rh * 0.2, sw * 0.8, rh * 0.25); }   // écharpe levée
                }
            }
        }
        tex.wrapU = tex.wrapV = S.B.Texture.WRAP_ADDRESSMODE;
        tex.anisotropicFilteringLevel = 4; tex.update();
        return tex;
    }

    // Une tribune le long d'un côté. Le bord avant va de a à b (au sol, sens horaire vu du
    // dessus), n = normale sortante. Les extrémités sont coupées à 45° (mitre) pour que deux
    // tribunes voisines se rejoignent en cuvette.
    function standSide(G, a, b, n, opt) {
        const { h0, h1, dep, miterA, miterB } = opt;
        const tA = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(tA[0], tA[1]), t = [tA[0] / L, tA[1] / L];
        const ex = (p, along, out, y) => [p[0] + t[0] * along + n[0] * out, y, p[1] + t[1] * along + n[1] * out];
        const fa = ex(a, 0, 0, h0), fb = ex(b, 0, 0, h0);
        const ba = ex(a, miterA ? -dep : 0, dep, h1), bb = ex(b, miterB ? dep : 0, dep, h1);
        const slope = Math.hypot(dep, h1 - h0), UC = 20, VC = 12.8;
        const u0 = miterA ? -dep / UC : 0, u1 = L / UC + (miterB ? dep / UC : 0);
        gQuad(G.crowd, fa, fb, bb, ba, [0, 0], [L / UC, 0], [u1, slope / VC], [u0, slope / VC]);
        gQuad(G.facade, ex(a, 0, 0, 0), ex(b, 0, 0, 0), fb, fa);                                   // muret avant
        { const BL = Math.hypot(bb[0] - ba[0], bb[2] - ba[2]) / 6, BH = h1 / 6;
          gQuad(G.back, ex(a, miterA ? -dep : 0, dep, 0), ex(b, miterB ? dep : 0, dep, 0), bb, ba, [0, 0], [BL, 0], [BL, BH], [0, BH]); } // mur arrière (façade)
        return { ba, bb, fa, fb, t, L };
    }
    function roofOver(G, s, opt) {
        // toit : du haut du mur arrière, en porte-à-faux jusqu'au-dessus du premier rang
        const { h1, dep, over } = opt, n = opt.n;
        const up = 3.2, fr = -dep * over;          // < 0 : le toit avance au-dessus des gradins, vers le terrain
        const ra = [s.ba[0], h1 + up, s.ba[2]], rb = [s.bb[0], h1 + up, s.bb[2]];
        const fa = [s.fa[0] + n[0] * fr, h1 + up - 1.2, s.fa[2] + n[1] * fr], fb = [s.fb[0] + n[0] * fr, h1 + up - 1.2, s.fb[2] + n[1] * fr];
        { const RL = Math.hypot(rb[0] - ra[0], rb[2] - ra[2]) / 12, RD = Math.hypot(fa[0] - ra[0], fa[2] - ra[2]) / 12;
          gQuad(G.roof, ra, rb, fb, fa, [0, 0], [RL, 0], [RL, RD], [0, RD]); }
        gQuad(G.fascia, fa, fb, [fb[0], fb[1] - 1.1, fb[2]], [fa[0], fa[1] - 1.1, fa[2]]);       // bandeau avant du toit
        gQuad(G.back, [s.ba[0], h1, s.ba[2]], [s.bb[0], h1, s.bb[2]], rb, ra);                     // fermeture arrière
        // poteaux de soutien du porte-à-faux (tous les ~18 m) pour les petites tribunes
        if (opt.posts) {
            const k = Math.max(1, Math.round(s.L / 18));
            for (let i = 0; i <= k; i++) {
                const f = i / k, px = s.fa[0] + (s.fb[0] - s.fa[0]) * f + n[0] * fr, pz = s.fa[2] + (s.fb[2] - s.fa[2]) * f + n[1] * fr;
                gTube(G.posts, [px, 0, pz], [px, h1 + up - 1.4, pz], 0.12, 6);
            }
        }
        return { fa, fb };
    }

    // Halo additif (projecteurs), toujours tourné vers la caméra.
    let haloMatCache = null;
    function halo(x, y, z, size, k) {
        if (!haloMatCache || haloMatCache.isDisposed) {
            const B = S.B, t = dtex('haloTex', 128, 128, true), c = t.getContext();
            const gr = c.createRadialGradient(64, 64, 0, 64, 64, 64);
            gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(0.18, 'rgba(255,240,210,0.55)'); gr.addColorStop(0.5, 'rgba(255,230,190,0.12)'); gr.addColorStop(1, 'rgba(255,230,190,0)');
            c.fillStyle = gr; c.fillRect(0, 0, 128, 128); t.hasAlpha = true; t.update();
            const m = texMat('haloMat', t, 1, true); track(m);
            m.alphaMode = 1; m.disableDepthWrite = true; m.fogEnabled = false;
            haloMatCache = m;
        }
        const g = geo(), s = size / 2;
        gQuad(g, [-s, -s, 0], [s, -s, 0], [s, s, 0], [-s, s, 0], [0, 1], [1, 1], [1, 0], [0, 0]);
        const m = dmesh('halo', g, haloMatCache, true);
        if (m) { m.position.set(x, y, z); m.billboardMode = 7; m.alphaIndex = 20; m.visibility = k == null ? 1 : k; }
        return m;
    }

    // Ciel : dôme dégradé + silhouette de ville (immeubles, palmiers, baobabs) à l'horizon.
    function buildSky() {
        const B = S.B, th = S.theme;
        const starry = th.flood && !th.rain;
        const SW = starry ? 512 : 8, t = dtex('skyTex', SW, 256, false), c = t.getContext();
        const gr = c.createLinearGradient(0, 0, 0, 256);
        gr.addColorStop(0, th.sky[0]); gr.addColorStop(0.42, th.sky[1]); gr.addColorStop(0.5, th.sky[2]); gr.addColorStop(1, th.sky[2]);
        c.fillStyle = gr; c.fillRect(0, 0, SW, 256);
        // étoiles peintes dans le ciel (un dôme transparent à part s'affichait noir et masquait tout)
        if (starry) { const R = rng(99); for (let i = 0; i < 260; i++) { c.fillStyle = 'rgba(255,255,255,' + (0.25 + R() * 0.6).toFixed(2) + ')'; c.fillRect(R() * SW, R() * 100, 1.2, 1.2); } }
        t.update();
        const dome = track(B.CreateSphere('sky', { diameter: 760, segments: 16, sideOrientation: 1 }, S.scene));
        const m = texMat('skyMat', t, 1); track(m); m.fogEnabled = false;
        dome.material = m; dome.isPickable = false;          // (pas d'infiniteDistance : le dôme passait DEVANT la scène)
        // horizon
        const W = 2048, H = 160, sk = dtex('skylineTex', W, H, true), k = sk.getContext(), R = rng(S.spec.seed + 3);
        k.clearRect(0, 0, W, H);
        const mode = th.skyline;
        const body = mode === 'night' ? '#05070c' : mode === 'dust' ? 'rgba(120,92,62,0.85)' : mode === 'grey' ? 'rgba(62,68,76,0.9)' : 'rgba(70,92,96,0.85)';
        let x = 0;
        while (x < W) {
            const r = R();
            if (r < 0.55) {                                    // immeuble
                const w = 18 + R() * 60, hh = 30 + R() * 95;
                k.fillStyle = body; k.fillRect(x, H - hh, w, hh);
                if (mode === 'night') for (let yy = H - hh + 6; yy < H - 6; yy += 9) for (let xx = x + 4; xx < x + w - 4; xx += 7) if (R() < 0.35) { k.fillStyle = R() < 0.8 ? 'rgba(255,214,140,0.9)' : 'rgba(170,210,255,0.8)'; k.fillRect(xx, yy, 3, 4); }
                x += w + R() * 10;
            } else if (r < 0.85) {                             // palmier
                const hh = 40 + R() * 50, cx = x + 10;
                k.strokeStyle = body; k.lineWidth = 3; k.beginPath(); k.moveTo(cx, H); k.quadraticCurveTo(cx + 6, H - hh / 2, cx + 2, H - hh); k.stroke();
                k.fillStyle = body;
                for (let f = 0; f < 7; f++) { const a = -Math.PI / 2 + (f - 3) * 0.48; k.beginPath(); k.ellipse(cx + 2 + Math.cos(a) * 12, H - hh + Math.sin(a) * 6 + 4, 14, 3, a, 0, Math.PI * 2); k.fill(); }
                x += 26 + R() * 30;
            } else {                                           // baobab
                const hh = 34 + R() * 22, cx = x + 22;
                k.fillStyle = body; k.fillRect(cx - 6, H - hh, 12, hh);
                k.beginPath(); k.ellipse(cx, H - hh, 26, 11, 0, 0, Math.PI * 2); k.fill();
                x += 50 + R() * 40;
            }
        }
        sk.hasAlpha = true; sk.wrapU = B.Texture.WRAP_ADDRESSMODE; sk.update();
        const g = geo(), RAD = 300, HT = 36, SEG = 40;
        for (let i = 0; i < SEG; i++) {
            const a0 = i / SEG * Math.PI * 2, a1 = (i + 1) / SEG * Math.PI * 2;
            const p0 = [Math.cos(a0) * RAD, Math.sin(a0) * RAD], p1 = [Math.cos(a1) * RAD, Math.sin(a1) * RAD];
            gQuad(g, [p0[0], -2, p0[1]], [p1[0], -2, p1[1]], [p1[0], HT, p1[1]], [p0[0], HT, p0[1]], [i / SEG * 4, 0], [(i + 1) / SEG * 4, 0], [(i + 1) / SEG * 4, 1], [i / SEG * 4, 1]);
        }
        const skm = texMat('skylineMat', sk, mode === 'night' ? 1 : 0.95, true); track(skm); skm.fogEnabled = false;
        dmesh('skyline', g, skm);
    }

    // Panneaux LED autour du terrain (marques fictives), qui défilent.
    function boardTexture() {
        const W = 2048, H = 64, tex = dtex('boards', W, H, true), c = tex.getContext();
        const ads = [['AECM  ELITE', '#0b0f19', '#f5c518'], ['KILI AIR', '#0d47a1', '#ffffff'], ['SAHEL BANK', '#0b6b3a', '#ffffff'],
            ['NIL TELECOM', '#b71c1c', '#ffffff'], ['BAOBAB COLA', '#5b1d0e', '#ffd54f'], ['OKAPI MOBILE', '#4a148c', '#ffffff'],
            ['ZAMBEZI ÉNERGIE', '#00695c', '#e0f2f1'], ['TERANGA ASSUR', '#e65100', '#ffffff']];
        ads.forEach((a, k) => {
            const x = k * 256, gr = c.createLinearGradient(0, 0, 0, H);
            gr.addColorStop(0, a[1]); gr.addColorStop(1, '#000');
            c.fillStyle = gr; c.fillRect(x, 0, 256, H);
            c.fillStyle = a[2]; c.fillRect(x, 0, 256, 3);
            c.font = 'bold 38px Arial, Helvetica, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillText(a[0], x + 128, H / 2 + 1, 240);
        });
        tex.wrapU = tex.wrapV = S.B.Texture.WRAP_ADDRESSMODE; tex.anisotropicFilteringLevel = 4; tex.update();
        return tex;
    }

    let facadeTex = null, roofTex = null;
    function facadeTexture() {
        if (facadeTex && !facadeTex.isDisposed && facadeTex.getScene() === S.scene) return facadeTex;
        const t = dtex('facadeTex', 128, 128, true), c = t.getContext();
        c.fillStyle = '#7c8593'; c.fillRect(0, 0, 128, 128);                                     // béton
        c.fillStyle = '#2b3442'; for (let y = 14; y < 128; y += 32) c.fillRect(0, y, 128, 12);   // bandeaux vitrés
        c.fillStyle = 'rgba(160,190,220,.35)'; for (let y = 14; y < 128; y += 32) c.fillRect(0, y + 2, 128, 3);
        c.fillStyle = '#9aa3b0'; for (let x = 0; x < 128; x += 32) c.fillRect(x, 0, 7, 128);      // poteaux
        c.fillStyle = 'rgba(0,0,0,.18)'; for (let x = 7; x < 128; x += 32) c.fillRect(x, 0, 2, 128);
        t.wrapU = t.wrapV = S.B.Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 4; t.update();
        facadeTex = t; return t;
    }
    function roofTexture() {
        if (roofTex && !roofTex.isDisposed && roofTex.getScene() === S.scene) return roofTex;
        const t = dtex('roofTex', 128, 128, true), c = t.getContext();
        const g = c.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#e6e9ee'); g.addColorStop(1, '#c9ced6');
        c.fillStyle = g; c.fillRect(0, 0, 128, 128);
        c.strokeStyle = 'rgba(70,80,95,.35)'; c.lineWidth = 2;
        for (let x = 0; x <= 128; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 128); c.stroke(); }   // joints des panneaux
        c.strokeStyle = 'rgba(70,80,95,.18)'; c.lineWidth = 1;
        for (let y = 0; y <= 128; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(128, y); c.stroke(); }
        t.wrapU = t.wrapV = S.B.Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 4; t.update();
        roofTex = t; return t;
    }

    // Abords du stade (aperçu du Campus seulement : la caméra de match ne les voit pas) :
    // esplanade, parking, routes, arbres, quelques bâtiments bas.
    function buildSurroundings() {
        const B = S.B, sp = S.spec, R = rng(sp.seed + 41);
        const HX = PITCH_W / 2, HZ = PITCH_H / 2;
        const BX = sp.track ? TRK.half + TRK.r0 + TRK.w + 3 : HX + 7, BZ = sp.track ? TRK.r0 + TRK.w + 2.5 : HZ + 6.5;
        const dep = sp.tier === 'large' ? 40 : sp.tier === 'medium' ? 22 : 14;
        const OX = BX + dep + 4, OZ = BZ + dep + 4;
        // esplanade en dalles autour du stade
        const pl = dtex('plazaTex', 64, 64, true), pc = pl.getContext();
        pc.fillStyle = '#b9b3a6'; pc.fillRect(0, 0, 64, 64); pc.strokeStyle = 'rgba(0,0,0,.12)';
        for (let i = 0; i <= 64; i += 16) { pc.beginPath(); pc.moveTo(i, 0); pc.lineTo(i, 64); pc.moveTo(0, i); pc.lineTo(64, i); pc.stroke(); }
        pl.wrapU = pl.wrapV = B.Texture.WRAP_ADDRESSMODE; pl.update();
        const gp = geo(), W2 = OX + 16, H2 = OZ + 16;
        gQuad(gp, [-W2, -0.01, -H2], [W2, -0.01, -H2], [W2, -0.01, H2], [-W2, -0.01, H2], [0, 0], [W2 / 4, 0], [W2 / 4, H2 / 4], [0, H2 / 4]);
        dmesh('plaza', gp, litMat('plazaMat', pl, [1, 1, 1]));
        // routes
        const gr = geo(), RW = 7, RL = 260;
        gQuad(gr, [-RL, 0.03, H2 + 4], [RL, 0.03, H2 + 4], [RL, 0.03, H2 + 4 + RW], [-RL, 0.03, H2 + 4 + RW]);
        gQuad(gr, [-RL, 0.03, -H2 - 4 - RW], [RL, 0.03, -H2 - 4 - RW], [RL, 0.03, -H2 - 4], [-RL, 0.03, -H2 - 4]);
        gQuad(gr, [W2 + 4, 0.03, -RL], [W2 + 4 + RW, 0.03, -RL], [W2 + 4 + RW, 0.03, RL], [W2 + 4, 0.03, RL]);
        dmesh('roads', gr, litMat('roadMat', null, [0.22, 0.23, 0.25]));
        // parking : rangées de voitures
        const gc = geo(), gc2 = geo();
        for (let row = 0; row < 3; row++) for (let k = 0; k < 18; k++) {
            if (R() < 0.25) continue;
            const x = -W2 + 10 + k * 5.2, z = -H2 - 4 - RW - 8 - row * 7;
            gBox(R() < 0.5 ? gc : gc2, x, 0.7, z, 2.2, 1.3, 4.3);
        }
        dmesh('carsA', gc, litMat('carA', null, [0.75, 0.76, 0.8], 0.3));
        dmesh('carsB', gc2, litMat('carB', null, [0.55, 0.12, 0.1], 0.3));
        // arbres : tronc + feuillage (sphères aplaties instanciées)
        const trunk = geo(), spots = [];
        for (let i = 0; i < 46; i++) {
            const side = i % 4, f = R();
            const x = side < 2 ? (f * 2 - 1) * (W2 + 30) : (side === 2 ? -1 : 1) * (W2 + 10 + R() * 30);
            const z = side < 2 ? (side === 0 ? 1 : -1) * (H2 + 18 + R() * 30) : (f * 2 - 1) * (H2 + 20);
            const h = 4 + R() * 4; spots.push([x, z, h]);
            gTube(trunk, [x, 0, z], [x, h, z], 0.25, 5);
        }
        dmesh('trunks', trunk, litMat('trunkMat', null, [0.35, 0.25, 0.16]));
        const crown = track(B.CreateSphere('crown', { diameter: 1, segments: 6 }, S.scene));
        crown.material = litMat('leafMat', null, [0.16, 0.42, 0.18]);
        const buf = new Float32Array(spots.length * 16), M = new B.Matrix(), q = new B.Quaternion();
        spots.forEach(([x, z, h], i) => { const rr = 3 + h * 0.4; B.Matrix.ComposeToRef(new B.Vector3(rr, rr * 0.8, rr), q, new B.Vector3(x, h + rr * 0.3, z), M); M.copyToArray(buf, i * 16); });
        crown.thinInstanceSetBuffer('matrix', buf, 16, false);
        // quartier : bâtiments bas autour
        const gb = geo(), gb2 = geo();
        for (let i = 0; i < 30; i++) {
            const a = R() * Math.PI * 2, d = Math.max(W2, H2) + 70 + R() * 70;
            const w = 10 + R() * 18, l = 10 + R() * 18, h = 6 + R() * 22;
            gBox(R() < 0.5 ? gb : gb2, Math.cos(a) * d * 1.2, h / 2, Math.sin(a) * d, w, h, l);
        }
        dmesh('blocksA', gb, litMat('blockA', null, [0.82, 0.78, 0.7]));
        dmesh('blocksB', gb2, litMat('blockB', null, [0.66, 0.6, 0.52]));
    }

    function buildStadium() {
        const B = S.B, th = S.theme, sp = S.spec, lo = S.lowEnd, D = S.decor;
        const HX = PITCH_W / 2, HZ = PITCH_H / 2;
        // dalle / abords
        const apron = track(B.CreateGround('apron', { width: 420, height: 360 }, S.scene));
        apron.material = litMat('apronMat', null, sp.track ? [0.26, 0.4, 0.24] : [0.24, 0.38, 0.22]);
        apron.position.y = -0.05; apron.isPickable = false; apron.freezeWorldMatrix();
        if (sp.track) buildTrack();
        // emprise : avec une piste, le public est loin (comme dans les vrais stades omnisports)
        const BX = sp.track ? TRK.half + TRK.r0 + TRK.w + 3 : HX + 7, BZ = sp.track ? TRK.r0 + TRK.w + 2.5 : HZ + 6.5;
        const homeHex = kitHex(S.teams.home, false, false) || '#1e3a8a';
        const awayHex = kitHex(S.teams.away, true, false) || '#e8edf5';
        const texA = crowdTexture(sp.seed + 7, lo ? 512 : 1024, lo ? 256 : 512, homeHex, sp.fill);
        const texB = crowdTexture(sp.seed + 23, lo ? 512 : 1024, lo ? 256 : 512, sp.tier === 'small' ? homeHex : awayHex, Math.max(0.2, sp.fill - 0.15));
        const mA = texMat('crowdA', texA, th.crowdK), mB = texMat('crowdB', texB, th.crowdK); track(mA); track(mB);
        D.crowd = [texA, texB]; D.crowdMats = [mA, mB]; D.crowdK = th.crowdK;
        const mk = () => ({ crowd: geo(), facade: geo(), back: geo(), roof: geo(), fascia: geo(), posts: geo() });
        const GA = mk(), GB = mk();
        // côtés : far (+z, tribune principale face caméra), near (-z), ends (±x). Bord avant sens horaire.
        const sides = {
            far:  { a: [-BX, BZ], b: [BX, BZ], n: [0, 1] },
            near: { a: [BX, -BZ], b: [-BX, -BZ], n: [0, -1] },
            east: { a: [BX, BZ], b: [BX, -BZ], n: [1, 0] },
            west: { a: [-BX, -BZ], b: [-BX, BZ], n: [-1, 0] }
        };
        const roofLights = [];
        const put = (G, key, o) => { const sd = sides[key]; return standSide(G, sd.a, sd.b, sd.n, o); };
        if (sp.tier === 'small') {
            // une tribune principale couverte, des gradins découverts en face, rien derrière les buts
            const s1 = put(GA, 'far', { h0: 1.2, h1: 8, dep: 11 });
            roofOver(GA, s1, { h1: 8, dep: 11, over: 0.15, n: sides.far.n, posts: true });
            put(GB, 'near', { h0: 0.8, h1: 4.5, dep: 7 });
        } else if (sp.tier === 'medium') {
            const o = { h0: 1.4, h1: 13, dep: 18 };
            const s1 = put(GA, 'far', Object.assign({ miterA: true, miterB: true }, o));
            const r1 = roofOver(GA, s1, { h1: 13, dep: 18, over: 0.1, n: sides.far.n });
            roofLights.push(r1);
            put(GA, 'near', Object.assign({ miterA: true, miterB: true }, o));
            put(GB, 'east', Object.assign({ miterA: true, miterB: true }, o, { h1: 10, dep: 15 }));
            put(GB, 'west', Object.assign({ miterA: true, miterB: true }, o, { h1: 10, dep: 15 }));
        } else {
            // cuvette à deux anneaux, loges vitrées entre les deux, toit tout autour
            const lowO = { h0: 1.4, h1: 11, dep: 16, miterA: true, miterB: true };
            ['far', 'near', 'east', 'west'].forEach(k => {
                const G = (k === 'far' || k === 'near') ? GA : GB, sd = sides[k];
                put(G, k, lowO);
                // loges (bande vitrée) puis anneau supérieur, reculé
                const t = [sd.b[0] - sd.a[0], sd.b[1] - sd.a[1]], L = Math.hypot(t[0], t[1]), u = [t[0] / L, t[1] / L];
                const off = 16, a2 = [sd.a[0] + sd.n[0] * off - u[0] * off, sd.a[1] + sd.n[1] * off - u[1] * off], b2 = [sd.b[0] + sd.n[0] * off + u[0] * off, sd.b[1] + sd.n[1] * off + u[1] * off];
                gQuad(G.fascia, [a2[0], 11, a2[1]], [b2[0], 11, b2[1]], [b2[0], 14, b2[1]], [a2[0], 14, a2[1]]);   // loges
                const up = standSide(G, a2, b2, sd.n, { h0: 14, h1: 30, dep: 20, miterA: true, miterB: true });
                const r = roofOver(G, up, { h1: 30, dep: 20, over: 0.55, n: sd.n });
                roofLights.push(r);
            });
        }
        [GA, GB].forEach((G, i) => {
            dmesh('stand' + i, G.crowd, i ? mB : mA);
            dmesh('facade' + i, G.facade, litMat('facadeMat' + i, null, [0.45, 0.47, 0.52]));
            dmesh('standBack' + i, G.back, litMat('standBackMat' + i, facadeTexture(), [0.95, 0.95, 0.95]));
            dmesh('roof' + i, G.roof, litMat('roofMat' + i, roofTexture(), [1, 1, 1], 0.12));
            dmesh('fascia' + i, G.fascia, th.flood ? dflat('fasciaLit' + i, 0.9, 0.82, 0.6) : litMat('fasciaMat' + i, null, [0.75, 0.77, 0.8]));
            dmesh('posts' + i, G.posts, litMat('postMat' + i, null, [0.8, 0.8, 0.82]));
        });

        // panneaux LED au bord du terrain
        const BXb = HX + 4.2, BZb = HZ + 4.2;
        const gBd = geo(), bd = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0) / 32;
            gQuad(gBd, [x0, 0, z0], [x1, 0, z1], [x1, 1.2, z1], [x0, 1.2, z0], [0, 0], [L, 0], [L, 1], [0, 1]); };
        bd(-BXb, BZb, BXb, BZb); bd(BXb, -BZb, -BXb, -BZb); bd(BXb, BZb, BXb, -BZb); bd(-BXb, -BZb, -BXb, BZb);
        const boardsTex = boardTexture();
        dmesh('boards', gBd, track(texMat('boardsMat', boardsTex, th.flood ? 1.55 : 1.35)));
        D.boardsTex = boardsTex;

        // écran géant au-dessus de la tribune derrière le but (score en direct, « BUT ! »)
        try {
            const W = 15, Hh = 7.5;
            let sx, y0;
            if (sp.tier === 'small') { sx = -(HX + 11); y0 = 4.5; }
            else if (sp.tier === 'medium') { sx = -(BX + 15.6); y0 = 10.6; }
            else { sx = -(BX + 16.4); y0 = 14.6; }
            const gSc = geo(), gFr = geo();
            gQuad(gSc, [sx, y0, W / 2], [sx, y0, -W / 2], [sx, y0 + Hh, -W / 2], [sx, y0 + Hh, W / 2], [1, 1], [0, 1], [0, 0], [1, 0]);
            gBox(gFr, sx - 0.35, y0 + Hh / 2, 0, 0.5, Hh + 0.8, W + 0.8);
            if (y0 > 1) { gTube(gFr, [sx - 0.4, 0, -W / 3], [sx - 0.4, y0, -W / 3], 0.25, 6); gTube(gFr, [sx - 0.4, 0, W / 3], [sx - 0.4, y0, W / 3], 0.25, 6); }
            const tex = dtex('screenTex', 768, 384, false);
            dmesh('bigScreen', gSc, track(texMat('screenMat', tex, th.flood ? 1.25 : 1.1)));
            dmesh('bigScreenFrame', gFr, litMat('screenFrame', null, [0.12, 0.13, 0.16]));
            D.screen = { tex, key: '' };
        } catch (e) { console.warn('[3D] écran', e); }

        // piquets de corner
        const gPo = geo(), gFl = geo();
        [-1, 1].forEach(s => [-1, 1].forEach(t => {
            const x = s * HX, z = t * HZ;
            gTube(gPo, [x, 0, z], [x, 1.5, z], 0.025, 6);
            gTri(gFl, [x, 1.5, z], [x, 1.15, z], [x - s * 0.5, 1.32, z], Z2, Z2, Z2);
        }));
        dmesh('cornerPoles', gPo, dflat('poleMat', 0.95, 0.95, 0.95)); dmesh('cornerFlags', gFl, dflat('flagMat', 0.98, 0.8, 0.05));

        // projecteurs : mâts aux quatre coins (petits et moyens stades), rampes sous le toit (grands)
        const gMs = geo(), gHd = geo();
        const headLit = th.flood;
        if (sp.tier !== 'large') {
            [-1, 1].forEach(s => [-1, 1].forEach(t => {
                const x = s * (BX + 8), z = t * (BZ + 8), top = sp.tier === 'small' ? 30 : 38;
                (S.mastHeads || (S.mastHeads = [])).push({ x: x * 0.97, y: top + 1, z: z * 0.97 });
                gTube(gMs, [x, 0, z], [x, top, z], 0.45, 6);
                const dx = -x, dz = -z, L = Math.hypot(dx, dz), px = -dz / L, pz = dx / L;
                gQuad(gHd, [x - px * 3.4, top - 1.8, z - pz * 3.4], [x + px * 3.4, top - 1.8, z + pz * 3.4], [x + px * 3.4, top + 1.8, z + pz * 3.4], [x - px * 3.4, top + 1.8, z - pz * 3.4]);
                if (headLit) halo(x + dx / L * 0.8, top, z + dz / L * 0.8, 34, 0.9);
                (S.lights || (S.lights = [])).push({ x, z, h: top });
            }));
        }
        if (sp.tier !== 'small' && roofLights.length) {
            roofLights.forEach(r => {
                const n = 6;
                for (let i = 0; i <= n; i++) {
                    const f = i / n, x = r.fa[0] + (r.fb[0] - r.fa[0]) * f, y = r.fa[1] - 0.4, z = r.fa[2] + (r.fb[2] - r.fa[2]) * f;
                    gBox(gHd, x, y, z, 2.2, 0.7, 2.2);
                    if (headLit && (sp.tier === 'large' || i % 2 === 0)) halo(x, y, z, 15, 0.55);
                    if (sp.tier === 'large' && i % 3 === 0) (S.lights || (S.lights = [])).push({ x, z, h: y });
                }
            });
        }
        dmesh('mastPoles', gMs, litMat('mastMat', null, [0.42, 0.44, 0.48]));
        dmesh('mastHeads', gHd, headLit ? dflat('headMat', 1, 0.97, 0.88) : litMat('headOff', null, [0.62, 0.64, 0.66], 0.2));

        // bancs de touche (côté tribune principale) : sur tous les appareils (le staff y est assis)
        const gGl = geo(), gBn = geo(), gFr = geo();
        [-1, 1].forEach(s => {
            const x0 = s > 0 ? 6 : -17, x1 = x0 + 11, z0 = HZ + 1.6, z1 = HZ + 3.8, hh = 2.1;
            gQuad(gGl, [x0, 0, z1], [x1, 0, z1], [x1, hh, z1], [x0, hh, z1]);
            gQuad(gGl, [x0, 0, z0], [x0, 0, z1], [x0, hh, z1], [x0, hh, z0]); gQuad(gGl, [x1, 0, z0], [x1, 0, z1], [x1, hh, z1], [x1, hh, z0]);
            gQuad(gGl, [x0, hh, z0], [x1, hh, z0], [x1, hh, z1], [x0, hh, z1]);
            gBox(gBn, (x0 + x1) / 2, SEAT_TOP / 2, z1 - 0.6, 10.4, SEAT_TOP, 0.5);
            [[x0, z0], [x1, z0], [x0, z1], [x1, z1]].forEach(p => gTube(gFr, [p[0], 0, p[1]], [p[0], hh, p[1]], 0.05, 5));
        });
        dmesh('dugoutGlass', gGl, dflat('glassMat', 0.45, 0.65, 0.8, 0.22));
        dmesh('dugoutBench', gBn, litMat('benchMat', null, [0.6, 0.1, 0.12]));
        dmesh('dugoutFrame', gFr, litMat('frameMat', null, [0.85, 0.85, 0.87]));
        // zone technique (pointillés blancs au sol devant les bancs)
        const gTa = geo();
        [-1, 1].forEach(s => { const x0 = s > 0 ? 5 : -18, x1 = x0 + 13, z = HZ + 0.9;
            for (let x = x0; x < x1; x += 0.8) gQuad(gTa, [x, 0.015, z], [x + 0.4, 0.015, z], [x + 0.4, 0.015, z + 0.1], [x, 0.015, z + 0.1]);
            gQuad(gTa, [x0, 0.015, z], [x0 + 0.1, 0.015, z], [x0 + 0.1, 0.015, z + 1.6], [x0, 0.015, z + 1.6]);
            gQuad(gTa, [x1, 0.015, z], [x1 + 0.1, 0.015, z], [x1 + 0.1, 0.015, z + 1.6], [x1, 0.015, z + 1.6]); });
        dmesh('techArea', gTa, dflat('taMat', 0.92, 0.92, 0.92));
        if (lo) return;                                       // mobile faible : reste du décor allégé
    }

    // ---- Ombres portées (une instance par joueur et par source de lumière) --
    // De jour : une ombre allongée à l'opposé du soleil. En nocturne : une ombre légère par
    // mât de projecteur — l'étoile d'ombres caractéristique des matchs sous les lumières.
    function buildShadows() {
        const B = S.B;
        const t = new B.DynamicTexture('shTex', { width: 64, height: 64 }, S.scene, true), c = t.getContext();
        const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gr; c.fillRect(0, 0, 64, 64); t.hasAlpha = true; t.update();
        const m = new B.StandardMaterial('shMat', S.scene);
        m.diffuseTexture = t; m.useAlphaFromDiffuseTexture = true; m.disableLighting = true;
        m.diffuseColor = new B.Color3(0, 0, 0); m.emissiveColor = new B.Color3(0, 0, 0); m.specularColor = new B.Color3(0, 0, 0);
        m.backFaceCulling = false; m.disableDepthWrite = true;
        const g = geo();
        gQuad(g, [-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5], [0, 0], [1, 0], [1, 1], [0, 1]);
        const mesh = toMesh('shadows', g, m, true);
        mesh.position.y = 0.035; mesh.alphaIndex = 2;
        S.sh = { mesh, mat: m, buf: null, n: 0, tmp: new B.Matrix(), sc: new B.Vector3(1, 1, 1), q: new B.Quaternion(), p: new B.Vector3() };
    }
    function shadowCasts(x, z) {
        const th = S.theme;
        if (th.shadows === 'flood' && S.lights && S.lights.length) {
            // les quatre sources les plus fortes (les plus proches)
            return S.lights.map(L => { const dx = x - L.x, dz = z - L.z, d = Math.hypot(dx, dz) || 1; return { dx: dx / d, dz: dz / d, len: clamp(1.8 * d / L.h, 0.8, 3.2), d }; })
                .sort((a, b) => a.d - b.d).slice(0, 4);
        }
        const sd = th.sunDir, hz = Math.hypot(sd[0], sd[2]) || 1;
        return [{ dx: sd[0] / hz, dz: sd[2] / hz, len: clamp(1.8 * hz / Math.abs(sd[1]), 0.6, 3.6) }];
    }
    function updateShadows() {
        const sh = S.sh; if (!sh) return;
        const list = [];
        ['H', 'A'].forEach(k => S.players[k].forEach(P => { if (!P.gone) list.push(P); }));
        if (S.ref) list.push(S.ref);
        const per = S.theme.shadows === 'flood' ? 4 : 1, n = 23 * per;
        if (!sh.buf || sh.n !== n) { sh.buf = new Float32Array(n * 16); sh.n = n; sh.mesh.thinInstanceSetBuffer('matrix', sh.buf, 16, false); }
        let i = 0;
        list.forEach(P => {
            shadowCasts(P.x, P.z).forEach(cst => {
                if (i >= n) return;
                const yaw = Math.atan2(cst.dx, cst.dz);
                S.B.Quaternion.RotationYawPitchRollToRef(yaw, 0, 0, sh.q);
                sh.sc.set(0.62, 1, cst.len + 0.5);
                sh.p.set(P.x + cst.dx * cst.len * 0.42, 0, P.z + cst.dz * cst.len * 0.42);
                S.B.Matrix.ComposeToRef(sh.sc, sh.q, sh.p, sh.tmp);
                sh.tmp.copyToArray(sh.buf, i * 16); i++;
            });
        });
        for (; i < n; i++) { sh.sc.set(0, 0, 0); sh.p.set(0, -5, 0); S.B.Matrix.ComposeToRef(sh.sc, sh.q, sh.p, sh.tmp); sh.tmp.copyToArray(sh.buf, i * 16); }
        sh.mesh.thinInstanceBufferUpdated('matrix');
    }

    // ---- Pluie : voile animé au-dessus du canvas (aucun coût GPU) ------------
    function setRain(on) {
        if (!S.container) return;
        if (!document.getElementById('aecm-rain-style')) {
            const st = document.createElement('style'); st.id = 'aecm-rain-style';
            st.textContent = '@keyframes aecmRain{from{background-position:0 0,0 0}to{background-position:-60px 420px,-30px 300px}}' +
                '.aecm-rain{position:absolute;inset:0;pointer-events:none;z-index:12;opacity:.2;' +
                'background-image:repeating-linear-gradient(105deg,rgba(255,255,255,0) 0 9px,rgba(220,230,255,.55) 9px 10px,rgba(255,255,255,0) 10px 23px),' +
                'repeating-linear-gradient(100deg,rgba(255,255,255,0) 0 15px,rgba(200,215,240,.35) 15px 16px,rgba(255,255,255,0) 16px 37px);' +
                'background-size:140px 140px,90px 90px;animation:aecmRain .55s linear infinite}';
            document.head.appendChild(st);
        }
        if (on && !S.rainEl) { const r = document.createElement('div'); r.className = 'aecm-rain'; S.container.appendChild(r); S.rainEl = r; }
        if (S.rainEl) S.rainEl.style.display = on && S.enabled ? '' : 'none';
    }

    // ---- Ambiance : lumières, brouillard, traitement d'image -----------------
    function applyTheme() {
        const B = S.B, sc = S.scene, th = S.theme;
        sc.clearColor = new B.Color4(th.clear[0], th.clear[1], th.clear[2], 1);
        if (S.hemi) { S.hemi.intensity = th.hemi; S.hemi.diffuse = new B.Color3(th.hemiCol[0], th.hemiCol[1], th.hemiCol[2]); S.hemi.groundColor = new B.Color3(th.ground[0], th.ground[1], th.ground[2]); }
        if (S.sun) { S.sun.intensity = th.sun; S.sun.direction = new B.Vector3(th.sunDir[0], th.sunDir[1], th.sunDir[2]).normalize(); }
        if (th.fog) { sc.fogMode = 2; sc.fogDensity = th.fog.d; sc.fogColor = hex3(th.fog.col); } else sc.fogMode = 0;
        const ip = sc.imageProcessingConfiguration;
        if (ip) {
            ip.contrast = th.contrast; ip.exposure = th.exposure;
            ip.toneMappingEnabled = !S.lowEnd; ip.toneMappingType = 1;      // ACES
            ip.vignetteEnabled = true; ip.vignetteWeight = th.vignette; ip.vignetteStretch = 0.6;
            ip.vignetteColor = new B.Color4(0, 0, 0, 0);
        }
        if (S.sh) S.sh.mat.alpha = th.shA;
        setRain(!!th.rain);
        tunePlayerMats();
    }

    function rebuildDecor() {
        if (!S.ready && !S.scene) return;
        const info = S.condInfo || {};
        S.theme = THEMES[info.weather] || THEMES.clear;
        S.spec = stadiumSpec(info);
        S.lights = []; S.mastHeads = [];
        clearDecor();
        haloMatCache = null;
        try { buildSky(); } catch (e) { console.warn('[3D] ciel', e); }
        try { paintPitch(S.spec, info.cond); } catch (e) { console.warn('[3D] pelouse', e); }
        try { buildStadium(); } catch (e) { console.warn('[3D] stade', e); }
        applyTheme();
        try { applyFxTheme(); } catch (e) { console.warn('[3D] effets', e); }
        S.decorKey = JSON.stringify([info.weather, info.pitch, info.capacity, info.name, S.teams.home, S.teams.away]);
    }

    // ═══ EFFETS VISUELS (Babylon) : image, lumière, particules ═════════════════
    // Tout est généré par le code (textures de particules dessinées sur un canvas) : aucun fichier.
    function fxTex(name, draw, size) {
        const t = new S.B.DynamicTexture(name, { width: size || 64, height: size || 64 }, S.scene, true);
        const c = t.getContext(); c.clearRect(0, 0, size || 64, size || 64); draw(c, size || 64); t.update(); t.hasAlpha = true;
        return t;
    }
    function fxReady(key) {
        const fx = S.fx, t = fx[key];
        if (t && t.getInternalTexture && t.getInternalTexture()) return t;
        fx[key] = fx.makers[key]();
        return fx[key];
    }
    function buildFx() {
        const B = S.B, sc = S.scene;
        if (!B.ParticleSystem || S.fx) return;
        const fx = S.fx = {};
        // image : anticrénelage, netteté, halo lumineux (selon l'ambiance, voir applyFxTheme)
        try {
            const p = fx.pipe = new B.DefaultRenderingPipeline('aecmPipe', false, sc, [S.camera]);
            p.imageProcessingEnabled = false;                 // l'étalonnage reste celui de la scène (applyTheme)
            p.fxaaEnabled = true;
            p.sharpenEnabled = true; p.sharpen.edgeAmount = 0.22; p.sharpen.colorAmount = 1;
            p.bloomEnabled = false; p.bloomThreshold = 0.88; p.bloomWeight = 0.28; p.bloomKernel = 40; p.bloomScale = 0.5;
        } catch (e) { console.warn('[3D] post-traitements', e); fx.pipe = null; }
        try { fx.glow = new B.GlowLayer('aecmGlow', sc, { mainTextureRatio: 0.35, blurKernelSize: 24 }); fx.glow.intensity = 0; } catch (e) { fx.glow = null; }
        // textures des particules (fabriques gardées pour pouvoir les recréer)
        fx.makers = {
            soft: () => fxTex('fxSoft', (c, n) => { const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, n, n); }),
            square: () => fxTex('fxSquare', (c, n) => { c.fillStyle = '#fff'; c.fillRect(n * 0.2, n * 0.32, n * 0.6, n * 0.36); }, 32),
            smoke: () => fxTex('fxSmoke', (c, n) => {
                for (let i = 0; i < 14; i++) { const x = n * (0.3 + Math.random() * 0.4), y = n * (0.3 + Math.random() * 0.4), r = n * (0.18 + Math.random() * 0.16);
                    const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, n, n); }
            }, 128)
        };
        fx.soft = fxTex('fxSoft', (c, n) => { const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, n, n); });
        fx.square = fxTex('fxSquare', (c, n) => { c.fillStyle = '#fff'; c.fillRect(n * 0.2, n * 0.32, n * 0.6, n * 0.36); }, 32);
        fx.smoke = fxTex('fxSmoke', (c, n) => {
            for (let i = 0; i < 14; i++) { const x = n * (0.3 + Math.random() * 0.4), y = n * (0.3 + Math.random() * 0.4), r = n * (0.18 + Math.random() * 0.16);
                const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, n, n); }
        }, 128);
        fx.flare = fxTex('fxFlare', (c, n) => { const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); g.addColorStop(0, 'rgba(255,250,235,.9)'); g.addColorStop(0.2, 'rgba(255,235,200,.35)'); g.addColorStop(1, 'rgba(255,220,180,0)'); c.fillStyle = g; c.fillRect(0, 0, n, n); }, 128);
        fx.flareUrl = (() => { try { return fx.flare.getContext().canvas.toDataURL(); } catch (e) { return null; } })();
        fx.systems = [];
    }
    // selon l'ambiance : halo des projecteurs et des écrans la nuit
    function applyFxTheme() {
        const fx = S.fx; if (!fx) return;
        const th = S.theme || {}, night = !!th.flood;
        if (fx.pipe) { fx.pipe.bloomEnabled = night && !fx.light; fx.pipe.bloomWeight = th.rain ? 0.2 : 0.28; }
        if (fx.glow) {
            fx.glow.intensity = night ? 0.5 : 0;
            const names = /^(mastHeads|bigScreen)/;     // projecteurs et écran géant seulement (les panneaux LED éblouissaient)
            fx.glow.removeIncludedOnlyMesh && S.scene.meshes.forEach(m => { try { fx.glow.removeIncludedOnlyMesh(m); } catch (e) {} });
            S.scene.meshes.forEach(m => { if (names.test(m.name)) fx.glow.addIncludedOnlyMesh(m); });
        }
        // reflets des projecteurs vers la caméra (nuit)
        (fx.flares || []).forEach(f => { try { f.dispose(); } catch (e) {} });
        fx.flares = [];
        if (night && fx.flareUrl && S.B.LensFlareSystem && !fx.light) {
            const heads = (S.mastHeads && S.mastHeads.length) ? S.mastHeads : (S.lights || []).filter((l, i) => i % 3 === 0).map(l => ({ x: l.x, y: l.h, z: l.z }));
            heads.slice(0, 4).forEach((h, i) => {
                try {
                    const em = S.B.CreateSphere('flareEm' + i, { diameter: 0.5, segments: 4 }, S.scene);
                    em.position.set(h.x, h.y, h.z); em.scaling.setAll(0.02); em.isPickable = false; track(em);
                    const sys = new S.B.LensFlareSystem('flares' + i, em, S.scene);
                    sys.meshesSelectionPredicate = () => false;   // pas de test d'occultation : aucun coût par image
                    new S.B.LensFlare(0.32, 0, new S.B.Color3(1, 0.97, 0.9), fx.flareUrl, sys);
                    new S.B.LensFlare(0.08, 0.5, new S.B.Color3(0.98, 0.6, 0.25), fx.flareUrl, sys);
                    new S.B.LensFlare(0.05, 0.85, new S.B.Color3(0.7, 0.8, 1), fx.flareUrl, sys);
                    fx.flares.push(sys);
                } catch (e) {}
            });
        }
    }
    // allègement (garde-fou de fluidité) : on coupe d'abord les effets
    function fxLighten() {
        const fx = S.fx; if (!fx || fx.light) return false;
        fx.light = true;
        try { if (fx.pipe) { fx.pipe.bloomEnabled = false; fx.pipe.sharpenEnabled = false; } } catch (e) {}
        try { if (fx.glow) fx.glow.intensity = 0; } catch (e) {}
        (fx.flares || []).forEach(f => { try { f.dispose(); } catch (e) {} }); fx.flares = [];
        return true;
    }
    function hexColor4(hex, a) { const c = hexToRgb(hex || '#ffffff'); return new S.B.Color4(c[0] / 255, c[1] / 255, c[2] / 255, a); }
    // un système de particules jetable (s'arrête puis se libère tout seul)
    function burst(o) {
        const B = S.B, fx = S.fx; if (!fx) return;
        const ps = new B.ParticleSystem('fx' + (fx.n = (fx.n || 0) + 1), o.cap || 400, S.scene);
        ps.particleTexture = fxReady(o.tex || 'soft');
        ps.emitter = new B.Vector3(o.x, o.y, o.z);
        ps.minEmitBox = new B.Vector3(-(o.w || 1), 0, -(o.d || 1)); ps.maxEmitBox = new B.Vector3(o.w || 1, o.h || 0, o.d || 1);
        ps.color1 = o.c1; ps.color2 = o.c2 || o.c1; ps.colorDead = o.dead || new B.Color4(o.c1.r, o.c1.g, o.c1.b, 0);
        ps.minSize = o.s0; ps.maxSize = o.s1;
        ps.minLifeTime = o.l0; ps.maxLifeTime = o.l1;
        ps.emitRate = o.rate || 0;
        if (o.burst) ps.manualEmitCount = o.burst;
        ps.blendMode = o.add ? B.ParticleSystem.BLENDMODE_ADD : B.ParticleSystem.BLENDMODE_STANDARD;
        ps.gravity = o.g || new B.Vector3(0, 0, 0);
        ps.direction1 = o.d1; ps.direction2 = o.d2;
        ps.minEmitPower = o.p0; ps.maxEmitPower = o.p1;
        ps.minAngularSpeed = -(o.spin || 0); ps.maxAngularSpeed = o.spin || 0;
        ps.updateSpeed = 0.016;
        ps.targetStopDuration = o.dur || 2;
        // on libère le système à la fin, mais PAS sa texture : elle est partagée par tous les effets
        ps.disposeOnStop = false;
        ps.onStoppedObservable.addOnce(() => { setTimeout(() => { try { ps.dispose(false); } catch (e) {} }, 50); });
        ps.start();
        return ps;
    }
    function teamHex(side) {
        let base = '#f97316', acc = '#ffffff';
        try { const k = clubKit(side === 'H' ? S.teams.home : S.teams.away, side === 'A'); base = k.base || base; acc = k.accent || k.trim || acc; } catch (e) {}
        return [base, acc];
    }
    // fumigènes dans la tribune des supporters d'une équipe
    function fxSmoke(side, n) {
        const fx = S.fx; if (!fx) return;
        const [c0, c1] = teamHex(side), BZ = PITCH_H / 2 + 6.5;
        const zs = side === 'H' ? -1 : 1;                   // tribune « domicile » côté caméra, « extérieur » en face
        for (let i = 0; i < (n || 3); i++) {
            const x = (Math.random() * 2 - 1) * 30;
            const col = i % 2 ? c1 : c0;
            burst({ x, y: 3 + Math.random() * 2, z: zs * (BZ + 4 + Math.random() * 4), w: 0.6, d: 0.6, h: 0.3, cap: 260, tex: 'smoke',
                c1: hexColor4(col, 0.55), c2: hexColor4(col, 0.35), s0: 1.6, s1: 3.6, l0: 3, l1: 5.5, rate: 55, dur: 5.5,
                d1: new S.B.Vector3(-0.3, 1, -0.3), d2: new S.B.Vector3(0.3, 1.6, 0.3), p0: 0.6, p1: 1.4, g: new S.B.Vector3(0.25, 0.1, 0), spin: 0.4 });
            // la torche elle-même (point rouge vif)
            burst({ x, y: 3.2, z: zs * (BZ + 6), w: 0.1, d: 0.1, cap: 80, add: true, c1: new S.B.Color4(1, 0.35, 0.15, 1), s0: 0.25, s1: 0.5, l0: 0.2, l1: 0.4, rate: 70, dur: 5.5,
                d1: new S.B.Vector3(-0.2, 1, -0.2), d2: new S.B.Vector3(0.2, 2, 0.2), p0: 0.5, p1: 1.5 });
        }
    }
    function fxGoal(side) {
        const fx = S.fx; if (!fx) return;
        const [c0, c1] = teamHex(side), HZ = PITCH_H / 2;
        // confettis au-dessus des deux tribunes latérales
        [-1, 1].forEach(zs => [-24, 0, 24].forEach(x => {
            burst({ x, y: 16, z: zs * (HZ + 14), w: 9, d: 3, cap: 420, tex: 'square', burst: 320,
                c1: hexColor4(c0, 1), c2: hexColor4(Math.random() < 0.5 ? c1 : '#f97316', 1), dead: hexColor4(c0, 0.6),
                s0: 0.45, s1: 0.8, l0: 3.5, l1: 6, dur: 0.4, d1: new S.B.Vector3(-1, 0.4, -1), d2: new S.B.Vector3(1, 1.2, 1), p0: 1.5, p1: 4,
                g: new S.B.Vector3(0, -1.6, 0), spin: 6 });
        }));
        fxSmoke(side, 4);
        // feux d'artifice la nuit, au-dessus du toit
        if ((S.theme || {}).flood) {
            for (let k = 0; k < 5; k++) schedule(250 + k * 420, () => {
                const col = k % 2 ? c1 : (k % 3 ? '#f97316' : c0);
                burst({ x: (Math.random() * 2 - 1) * 45, y: 42 + Math.random() * 12, z: 60 + Math.random() * 25, w: 0.2, d: 0.2, cap: 260, burst: 220, add: true,
                    c1: hexColor4(col, 1), c2: hexColor4('#ffffff', 1), dead: hexColor4(col, 0), s0: 0.5, s1: 1.1, l0: 1.1, l1: 1.9, dur: 0.2,
                    d1: new S.B.Vector3(-1, -1, -1), d2: new S.B.Vector3(1, 1, 1), p0: 9, p1: 15, g: new S.B.Vector3(0, -4, 0) });
            });
        }
    }

    // ---- Décor vivant : le public saute et le filet ondule sur un but ----
    function decorCheer(side, delayMs) {
        schedule(delayMs, () => {
            S.decor.cheer = now();
            const net = S.decor.nets && S.decor.nets[side === 'H' ? 1 : -1];
            if (net) S.decor.pulse = { net, t0: now() };
        });
    }
    function drawScreen(sc, t) {
        const a = window.app, lm = a && a.liveMatch;
        const goalOn = sc.goalUntil && t < sc.goalUntil;
        const home = (lm && lm.home && lm.home.name) || S.teams.home || 'AECM', away = (lm && lm.away && lm.away.name) || S.teams.away || '';
        const score = lm ? (lm.homeScore || 0) + ' - ' + (lm.awayScore || 0) : '';
        const minute = lm ? (lm.minute || 0) + "'" : '';
        const key = [home, away, score, minute, goalOn ? Math.floor(t / 250) : 0].join('|');
        if (key === sc.key) return;
        sc.key = key;
        const c = sc.tex.getContext(), W = 768, H = 384;
        c.fillStyle = '#0a0e17'; c.fillRect(0, 0, W, H);
        if (goalOn) {
            // bandes orange qui défilent + « BUT ! »
            const off = (t / 6) % 80;
            for (let x = -H - 80 + off; x < W + 80; x += 80) {
                c.fillStyle = '#f97316'; c.beginPath(); c.moveTo(x, H); c.lineTo(x + 40, H); c.lineTo(x + 40 + H * 0.5, 0); c.lineTo(x + H * 0.5, 0); c.closePath(); c.fill();
                c.fillStyle = '#ea580c'; c.beginPath(); c.moveTo(x + 40, H); c.lineTo(x + 80, H); c.lineTo(x + 80 + H * 0.5, 0); c.lineTo(x + 40 + H * 0.5, 0); c.closePath(); c.fill();
            }
            c.fillStyle = '#0a0e17'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.font = 'italic 700 170px Teko, Impact, sans-serif'; c.fillText('BUT !', W / 2, H * 0.5);
            c.font = '600 46px Teko, Impact, sans-serif'; c.fillText(score, W / 2, H * 0.86);
        } else {
            let hc = '#1f2937', ac = '#1f2937';
            try { hc = clubKit(home, false).base || hc; ac = clubKit(away, true).base || ac; } catch (e) {}
            const lum = h => { const n = parseInt(String(h).replace('#', ''), 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
            c.fillStyle = '#f97316'; c.fillRect(0, 0, W, 48);
            c.fillStyle = '#0a0e17'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.font = '600 40px Teko, Impact, sans-serif'; c.fillText(lm ? 'EN DIRECT' : 'AECM', W / 2, 26);
            c.fillStyle = hc; c.fillRect(24, 92, 300, 150); c.fillStyle = ac; c.fillRect(W - 324, 92, 300, 150);
            const nm = (n, x, col) => { c.fillStyle = lum(col) > 0.6 ? '#0a0e17' : '#ffffff'; c.font = '600 52px Teko, Impact, sans-serif';
                const words = String(n).toUpperCase().split(' '); const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
                if (l2) { c.fillText(l1, x, 142); c.fillText(l2, x, 192); } else c.fillText(l1, x, 167); };
            nm(home, 174, hc); nm(away, W - 174, ac);
            c.fillStyle = '#ffffff'; c.font = '700 120px Teko, Impact, sans-serif'; c.fillText(score || 'VS', W / 2, 172);
            c.fillStyle = '#111827'; c.fillRect(W / 2 - 80, 268, 160, 64);
            c.fillStyle = '#f97316'; c.font = '600 54px Teko, Impact, sans-serif'; c.fillText(minute, W / 2, 302);
        }
        sc.tex.update(false);
    }

    function updateDecor() {
        const D = S.decor; if (!D) return;
        const t = now();
        if (D.pulse) {                                         // le fond du filet part vers l'arrière puis revient
            const e = (t - D.pulse.t0) / 1000, n = D.pulse.net;
            if (e > 2.4) { n.scaling.x = 1; n.scaling.y = 1; D.pulse = null; }
            else { const a = Math.exp(-2.6 * e) * Math.min(1, e / 0.08); n.scaling.x = 1 + 0.34 * a * (0.6 + 0.4 * Math.cos(e * 15)); n.scaling.y = 1 - 0.05 * a; }
        }
        if (D.cheer != null && D.crowd) {                      // tout le stade bondit ~5,5 s
            const e = (t - D.cheer) / 1000, amp = Math.max(0, 1 - e / 5.5);
            const jump = amp > 0 ? amp * 0.024 * Math.abs(Math.sin(e * 9)) : 0;
            D.crowd.forEach(x => { x.vOffset = jump; });
            const k0 = D.crowdK || 0.78, k = k0 + 0.16 * amp * (0.5 + 0.5 * Math.sin(e * 14));
            D.crowdMats.forEach(m => { m.emissiveColor.set(k, k, k); });
            if (amp <= 0) D.cheer = null;
        }
        if (D.screen) drawScreen(D.screen, t);
        // panneaux LED : les publicités défilent lentement
        if (D.boardsTex) { const dt = Math.min(0.1, (t - (D.lastT || t)) / 1000); D.boardsTex.uOffset = (D.boardsTex.uOffset + dt * 0.035) % 1; }
        D.lastT = t;
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
        if (!/^staff:/.test(modelKey) && modelKey !== REF_MODEL) {
            let h = 0; for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
            const tall = 0.95 + (h % 11) / 100, broad = 0.96 + ((h >>> 4) % 9) / 100;   // ±5 % de taille, ±4 % de carrure
            holder.scaling.set(broad, tall, broad);
        }
        const meshes = root.getChildMeshes(false);
        meshes.forEach(m => { m.alwaysSelectAsActiveMesh = true; m.isPickable = false; });
        const bones = new Map(root.getChildTransformNodes(false).map(n => [n.name, n]));
        // Os dans une texture : évite la limite d'uniformes des GPU de téléphone d'entrée de gamme.
        if (S.engine.webGLVersion >= 2) inst.skeletons.forEach(sk => { sk.useTextureToStoreBoneMatrices = true; });
        const shadow = B.CreateDisc('sh_' + tag, { radius: 0.5, tessellation: 12 }, scene);
        shadow.rotation.x = Math.PI / 2; shadow.material = S.shadowMat; shadow.position.y = 0.025; shadow.isPickable = false;
        shadow.isVisible = false;                           // ombres : voir updateShadows()
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

    const has = clip => S.clips.has(clip);
    // un des clips disponibles, au hasard (variété des gestes)
    function pickClip(list) {
        const ok = list.filter(has);
        return ok.length ? ok[Math.floor(Math.random() * ok.length)] : list[0];
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

    // Instant du contact avec le ballon dans chaque geste (secondes, à vitesse 1), mesuré sur les
    // clips : pic de vitesse du pied, de la main ou de la tête. Sert à caler le geste sur le départ
    // réel du ballon — sans ça le ballon partait pendant la prise d'élan (gardien, touche, penalty).
    const CONTACT = {
        kick_soccerball: 0.10, kick_soccerball_1: 0.40, kick_soccerball_2: 0.40, soccer_pass: 0.45,
        strike_forward_jog: 0.45, soccer_penalty_kick: 0.75, scissor_kick: 0.75, throw_in: 1.58,
        header_soccerball: 0.85, header_soccerball_2: 0.52, soccer_header: 0.90, header: 0.48,
        gk_drop_kick: 2.12, gk_pass: 0.28, gk_overhand_throw: 1.57
    };

    function playOnce(P, clip, speed, opts) {
        opts = opts || {};
        const g = getGroup(P, clip);
        if (!g) return false;
        if (P.cur === g) { g.stop(); P.cur = null; }        // permet de rejouer le même geste
        const fresh = play(P, clip, false, speed, opts.fade || 0.1);
        if (!fresh) return false;
        // opts.hit = dans combien de ms le ballon part réellement : le geste démarre de façon à ce que
        // le contact tombe à ce moment-là (la prise d'élan trop longue est raccourcie).
        let skip = 0;
        if (opts.hit != null && CONTACT[clip] != null) {
            const fps = (g.targetedAnimations[0] && g.targetedAnimations[0].animation.framePerSecond) || 30;
            skip = Math.max(0, CONTACT[clip] - (opts.hit / 1000) * speed);
            skip = Math.min(skip, Math.max(0, (g.to - g.from) / fps - 0.2));
            if (skip > 0) g.goToFrame(g.from + skip * fps);
        }
        const dur = Math.min((clipSeconds(g) - skip) / speed * (opts.frac || 1) * 1000, opts.max || 1e9);
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

    // ═══ BANCS DE TOUCHE : staff et remplaçants ══════════════════════════════
    // Modèles du staff : personnages statiques auxquels on a greffé le squelette des joueurs
    // (3d/staff/*.glb) — ils jouent donc les mêmes animations. Les poses qui n'existent dans aucune
    // animation (assis, bras levés, mains sur la tête) sont obtenues en orientant les os à la main,
    // à partir de l'image 5 de « soccer_idle ».
    const STAFF_KEYS = ['coach_costume', 'coach_survet', 'adjoint_polo', 'adjoint_survet', 'medecin', 'kine', 'prepa_physique'];
    const BENCH_CREW = {
        H: { coach: 'coach_costume', seated: ['adjoint_polo', 'medecin', 'kine'] },
        A: { coach: 'coach_survet', seated: ['adjoint_survet', 'kine', 'medecin'] }
    };
    const SEAT_TOP = 0.45, SIT_DROP = 0.87;          // assise du banc ; hauteur du bassin debout
    const HZB = PITCH_H / 2;
    function benchGeo(side) {                         // mêmes coordonnées que le décor (buildStadium)
        const x0 = side === 'H' ? -17 : 6;
        return { x0, x1: x0 + 11, seatZ: HZB + 3.2, areaZ: HZB + 2.3, mid: x0 + 5.5,
                 near: side === 'H' ? x0 + 11 : x0 };   // bout du banc côté ligne médiane
    }
    function seatPos(side, k) { const g = benchGeo(side); return { x: g.x0 + 0.8 + k * 0.94, z: g.seatZ - 0.03 }; }

    function clearPose(P) {
        if (P.poseG) { try { P.poseG.stop(); } catch (e) {} P.poseG = null; }
        P.posed = null;
    }
    // pose = 'sit' | 'up' | 'head' | 'clap' | 'stand', ou une liste ('sit' + 'clap' = applaudir assis)
    const CLAP = [75, -20, 40, 70, 40];            // épaule x, y, z, avant-bras x, z (trouvés par recherche : mains jointes devant la poitrine)
    const qAx = (ax, deg) => S.B.Quaternion.RotationAxis(ax === 'x' ? new S.B.Vector3(1, 0, 0) : ax === 'y' ? new S.B.Vector3(0, 1, 0) : new S.B.Vector3(0, 0, 1), deg * Math.PI / 180);
    function setPose(P, pose) {
        const poses = Array.isArray(pose) ? pose : [pose];
        P.groups.forEach(g => { try { g.stop(); } catch (e) {} });
        P.cur = null; P.prev = null; P.fade = 1; P.once = null;
        const g = getGroup(P, 'soccer_idle');
        if (!g) return;
        g.start(false, 1, g.from, g.to); g.goToFrame(g.from + 5); g.pause();
        P.poseG = g; P.posed = poses.join('+');
        const bone = n => P.bones.get('mixamorig:' + n);
        // bases (pose de départ) pour les mouvements recalculés à chaque image
        P.baseQ = {};
        ['Head', 'Spine1', 'LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm'].forEach(n => { const t = bone(n); if (t && t.rotationQuaternion) P.baseQ[n] = t.rotationQuaternion.clone(); });
        const r = (n, ax, deg) => { const t = bone(n); if (t && t.rotationQuaternion) t.rotationQuaternion = t.rotationQuaternion.multiply(qAx(ax, deg)); };
        poses.forEach(ps => {
            if (ps === 'sit') { r('LeftUpLeg', 'x', 80); r('RightUpLeg', 'x', 80); r('LeftLeg', 'x', -85); r('RightLeg', 'x', -85); }
            else if (ps === 'up') { r('LeftArm', 'x', -120); r('RightArm', 'x', -120); }
            else if (ps === 'head') { r('LeftArm', 'x', -150); r('RightArm', 'x', -150); r('LeftForeArm', 'x', -90); r('RightForeArm', 'x', -90); }
        });
        P.clapping = poses.indexOf('clap') >= 0;
        P.liveHead = poses.indexOf('sit') >= 0 || poses.indexOf('clap') >= 0;
        if (P.clapping) clapFrame(P, 0);
    }
    // applaudissements : les bras s'ouvrent et se referment (~4 battements par seconde)
    function clapFrame(P, t) {
        const B = P.baseQ; if (!B.LeftArm || !B.RightArm) return;
        const o = Math.sin(t * 0.026) * 13;
        const set = (n, q) => { const b = P.bones.get('mixamorig:' + n); if (b) b.rotationQuaternion = q; };
        set('LeftArm', B.LeftArm.multiply(qAx('x', CLAP[0])).multiply(qAx('y', CLAP[1])).multiply(qAx('z', CLAP[2] + o)));
        set('RightArm', B.RightArm.multiply(qAx('x', CLAP[0])).multiply(qAx('y', -CLAP[1])).multiply(qAx('z', -CLAP[2] - o)));
        if (B.LeftForeArm) set('LeftForeArm', B.LeftForeArm.multiply(qAx('x', CLAP[3])).multiply(qAx('z', CLAP[4])));
        if (B.RightForeArm) set('RightForeArm', B.RightForeArm.multiply(qAx('x', CLAP[3])).multiply(qAx('z', -CLAP[4])));
    }
    // vivant : la tête suit le ballon, le buste respire
    function liveFrame(P, t, bx, bz) {
        const B = P.baseQ; if (!B) return;
        if (B.Head) {
            const rel = clamp(angDiff(P.yaw, Math.atan2(bx - P.x, bz - P.z)), -1, 1);
            P.headYaw = (P.headYaw || 0) + (-rel * 57.3 - (P.headYaw || 0)) * 0.08;
            const h = P.bones.get('mixamorig:Head'); if (h) h.rotationQuaternion = B.Head.multiply(qAx('y', P.headYaw));
        }
        if (B.Spine1) {
            const sp = P.bones.get('mixamorig:Spine1');
            if (sp) sp.rotationQuaternion = B.Spine1.multiply(qAx('x', Math.sin(t * 0.0021 + (P.phase || 0)) * 1.6));
        }
        if (P.clapping) clapFrame(P, t);
    }
    function placeSit(b) {
        const P = b.P;
        setPose(P, 'sit');
        P.holder.position.set(b.seat.x, SEAT_TOP - SIT_DROP * P.holder.scaling.y, b.seat.z);
        P.holder.rotation.set(0, Math.PI, 0);
        P.x = b.seat.x; P.z = b.seat.z; P.yaw = Math.PI;
        b.st = 'sit';
    }
    function standAt(b, x, z) {
        const P = b.P;
        clearPose(P);
        P.holder.position.set(x, 0, z); P.holder.rotation.x = 0;
        P.x = x; P.z = z;
        play(P, 'soccer_idle', true, 1, 0.2);
        b.st = 'stand';
    }

    async function buildBench() {
        if (S.bench) return;                          // tous les appareils, sans exception
        try {
            await Promise.all(STAFF_KEYS.map(async k => {
                if (!S.containers['staff:' + k]) S.containers['staff:' + k] = await loadContainer(ROOT + 'staff/' + k + '.glb');
            }));
        } catch (e) { console.warn('[3D] staff indisponible', e); return; }
        const nSubs = 7;
        const bench = { H: null, A: null, all: [] };
        ['H', 'A'].forEach(side => {
            const g = benchGeo(side), crew = BENCH_CREW[side];
            const mk = (role, P, seat) => { const b = { P, side, role, seat, st: 'sit', path: [], until: 0, next: 0 }; P.side = side; P.phase = Math.random() * 6.28; bench.all.push(b); return b; };
            // sièges : le staff au bout côté ligne médiane, les remplaçants ensuite
            const order = []; for (let k = 0; k < 11; k++) order.push(k);
            if (side === 'H') order.reverse();
            const coach = mk('coach', makePlayer('co' + side, 'staff:' + crew.coach, false), null);
            const staff = crew.seated.map((m, i) => mk('staff', makePlayer('st' + side + i, 'staff:' + m, false), seatPos(side, order[i])));
            const subs = [];
            for (let i = 0; i < nSubs; i++) {
                const gk = i === nSubs - 1;
                subs.push(mk('sub', makePlayer('sb' + side + i, gk ? GK_SUB[side] : OUTFIELD_MODELS[(i + 1) % OUTFIELD_MODELS.length], gk), seatPos(side, order[crew.seated.length + i])));
            }
            const prepa = mk('prepa', makePlayer('pp' + side, 'staff:prepa_physique', false), null);
            coach.home = { x: g.mid + (side === 'H' ? 2 : -2), z: g.areaZ };
            prepa.home = { x: side === 'H' ? g.x0 - 1.3 : g.x1 + 1.3, z: g.seatZ - 0.9 };
            bench[side] = { coach, staff, subs, prepa };
        });
        S.bench = bench;
        resetBench();
    }

    // Tout le monde à sa place (début de match)
    function resetBench() {
        const bench = S.bench; if (!bench) return;
        S.subQ = []; S.subbing = null;
        bench.all.forEach(b => {
            b.path = []; b.until = 0; b.react = null; b.crossed = true; b.called = false; b.P.enter = null; b.P.holder.setEnabled(true);
            if (b.seat) placeSit(b);
            else { standAt(b, b.home.x, b.home.z); b.P.yaw = Math.PI; b.P.holder.rotation.y = Math.PI; }
            b.next = now() + 4000 + Math.random() * 8000;
        });
    }

    // Réactions : but marqué / encaissé, grosse occasion manquée
    function benchReact(side, kind, delay) {
        const bench = S.bench; if (!bench) return;
        const mine = bench[side], other = bench[side === 'H' ? 'A' : 'H'];
        schedule(delay || 0, () => {
            const t = now();
            if (kind === 'goal') {
                // ceux qui marquent : debout, bras levés
                [mine.coach, mine.prepa].forEach(b => { if (b.st === 'stand') { setPose(b.P, 'up'); b.react = { kind: 'up', until: t + 2600, bounce: true }; } });
                mine.staff.concat(mine.subs).forEach((b, i) => {
                    if (b.st !== 'sit') return;
                    schedule(i * 90, () => {
                        if (b.st !== 'sit') return;
                        clearPose(b.P);
                        b.P.holder.position.set(b.seat.x, 0, b.seat.z - 0.45);
                        setPose(b.P, 'up');
                        b.st = 'cheer'; b.until = now() + 2400 + Math.random() * 900;
                    });
                });
                // ceux qui encaissent : l'entraîneur met les mains sur la tête, puis recadre son équipe
                if (other.coach.st === 'stand') { setPose(other.coach.P, 'head'); other.coach.react = { kind: 'head', until: t + 1800, then: 'directing' }; }
            } else if (kind === 'chance') {
                if (mine.coach.st === 'stand' && !mine.coach.react) { setPose(mine.coach.P, 'head'); mine.coach.react = { kind: 'head', until: t + 1300 }; }
                // le banc applaudit l'occasion (assis)
                mine.staff.concat(mine.subs).forEach((b, i) => {
                    if (b.st !== 'sit' || Math.random() < 0.3) return;
                    schedule(i * 70, () => { if (b.st !== 'sit') return; setPose(b.P, ['sit', 'clap']); b.clapUntil = now() + 1400 + Math.random() * 700; });
                });
                if (mine.prepa.st === 'stand' && !mine.prepa.react) { setPose(mine.prepa.P, 'clap'); mine.prepa.react = { kind: 'clap', until: t + 1800 }; }
            }
        });
    }

    // Remplacement, comme au football : le jeu est ARRÊTÉ. Le remplaçant se lève et attend sur la
    // ligne de touche à hauteur de la ligne médiane ; le joueur remplacé quitte d'abord la pelouse, puis
    // seulement le remplaçant entre, rejoint sa place, et le jeu reprend.
    // Le remplacement est validé tout de suite (le moteur de match compte déjà le nouveau joueur),
    // mais en 3D il attend un BALLON MORT : sortie de but, corner, coup franc ou engagement. D'ici là,
    // le joueur remplacé continue de jouer — pas d'arrêt de jeu inventé.
    function substitute(side, idx) {
        if (!S.bench || !S.bench[side]) return;
        const t0 = (typeof MATCHSIM !== 'undefined' && MATCHSIM.now) ? MATCHSIM.now() : now();
        (S.subQ || (S.subQ = [])).push({ side, idx, t0 });
        // le remplaçant se lève déjà et s'échauffe au bord du banc : on sait qu'il va entrer
        const bench = S.bench[side], wantGK = idx === 0;
        const cand = bench.subs.find(b => b.st === 'sit' && !b.called && !!b.P.isGK === wantGK) || bench.subs.find(b => b.st === 'sit' && !b.called);
        if (cand) { cand.called = true; cand.st = 'ready'; clearPose(cand.P); cand.P.holder.position.set(cand.seat.x, 0, cand.seat.z - 0.6); play(cand.P, 'soccer_idle', true, 1, 0.3); }
    }
    function deadBallNow(q) {
        if (typeof MATCHSIM === 'undefined' || !MATCHSIM.active) return true;
        return (MATCHSIM.deadBall || 0) > q.t0;
    }
    function runSubQueue() {
        if (!S.subQ || !S.subQ.length) return;
        if (!deadBallNow(S.subQ[0])) return;
        const list = S.subQ.splice(0);
        let any = false;
        list.forEach(q => { if (doSubstitute(q.side, q.idx)) any = true; });
        if (any) { const m = MATCHSIM.now(); S.subbing = { since: m, lastM: m }; }
    }
    // Tant que l'échange n'est pas terminé (sortant hors de la pelouse, entrant à sa place), le jeu reste
    // arrêté : ordres, minuteries du moteur et chrono figés. Filet de sécurité : 25 s au plus.
    function holdWhileSubbing() {
        const sb = S.subbing; if (!sb || typeof MATCHSIM === 'undefined') return;
        const M = MATCHSIM, m = M.now();
        const entering = ['H', 'A'].some(k => S.players[k].some(P => P && P.enter));
        const leaving = S.bench && S.bench.all.some(b => b.st === 'walk' && !b.crossed);
        if (!entering && !leaving) { S.subbing = null; return; }
        if (m - sb.since > 25000) {                            // appareil très lent : on termine l'échange d'un coup
            ['H', 'A'].forEach(k => S.players[k].forEach(P => { if (P && P.enter) { P.enter = null; P.init = false; } }));
            if (S.bench) S.bench.all.forEach(b => { if (b.st === 'walk') { b.path = []; b.crossed = true; } });
            S.subbing = null; return;
        }
        const d = Math.max(0, m - sb.lastM); sb.lastM = m;
        try {
            M.holdUntil = Math.max(M.holdUntil || 0, m + 400);
            (M._later || []).forEach(e => { e.at += d; });
            M.holdScene(700);
        } catch (e) {}
    }

    function doSubstitute(side, idx) {
        const bench = S.bench && S.bench[side];
        if (!bench || !S.players[side] || !S.players[side][idx]) return;
        const wantGK = idx === 0;
        const cand = bench.subs.find(b => b.called && b.st === 'ready' && !!b.P.isGK === wantGK) || bench.subs.find(b => b.called && b.st === 'ready')
            || bench.subs.find(b => b.st === 'sit' && !!b.P.isGK === wantGK) || bench.subs.find(b => b.st === 'sit');
        if (!cand) return 0;
        cand.called = false;
        const inP = cand.P, outP = S.players[side][idx];
        const s = side === 'H' ? -1 : 1, lineZ = HZB;
        // durée de l'arrêt : sortie du joueur (à pied, en trottinant) + entrée du remplaçant
        const exitPt = { x: s * 1.4, z: lineZ - 0.3 };
        const dOut = Math.hypot(outP.x - exitPt.x, outP.z - exitPt.z);
        const dIn = Math.hypot(outP.x - s * 0.6, outP.z - lineZ);
        const ms = clamp((dOut / 3.4 + dIn / 4.2) * 1000 + 2200, 5000, 22000);
        // entrant : se lève, va attendre sur la ligne, puis entre quand le sortant a quitté la pelouse
        clearPose(inP);
        inP.holder.position.y = 0; inP.holder.setEnabled(true);
        inP.x = inP.px = cand.seat.x; inP.z = inP.pz = cand.seat.z - 0.45;
        inP.once = null; inP.gone = false; inP.off[0] = inP.off[1] = 0; inP.side = side;
        inP.enter = { pts: [{ x: s * 0.6, z: lineZ + 0.7 }], wait: cand, inPts: [{ x: s * 0.6, z: lineZ - 1.2 }] };
        S.players[side][idx] = inP;
        // sortant : quitte la pelouse par la ligne médiane, puis va s'asseoir sur le banc
        cand.P = outP; outP.enter = null; outP.once = null; outP.side = side;
        outP.holder.rotation.x = 0;
        cand.st = 'walk'; cand.spd = 3.4; cand.crossed = false;
        cand.path = [exitPt, { x: s * 1.9, z: lineZ + 1.0 }, { x: cand.seat.x, z: cand.seat.z - 0.6 }];
        cand.arrive = 'sit';
        // le coach accueille le sortant d'un geste
        if (bench.coach.st === 'stand' && !bench.coach.react) { play(bench.coach.P, 'gk_directing', true, 1, 0.25); bench.coach.react = { kind: 'anim', until: now() + 2500 }; }
        return ms;
    }

    // Entrée d'un remplaçant. Renvoie true tant qu'il est piloté ici (sinon la boucle normale reprend la main).
    function enterStep(P, dt) {
        const E = P.enter;
        // sur la ligne : il attend que le joueur remplacé soit sorti
        if (!E.pts.length && E.wait && !E.wait.crossed) {
            P.yaw += angDiff(P.yaw, Math.PI) * Math.min(1, dt * 5);          // face au terrain
            P.holder.rotation.y = P.yaw;
            play(P, 'soccer_idle', true, 1, 0.3); stepFade(P, dt);
            return true;
        }
        if (!E.pts.length && E.inPts) { E.pts = E.inPts; E.inPts = null; E.wait = null; }
        const tgt = E.pts.length ? E.pts[0] : { x: P.sx + P.off[0], z: P.sz + P.off[1] };
        const dx = tgt.x - P.x, dz = tgt.z - P.z, d = Math.hypot(dx, dz);
        if (!E.pts.length && d < 1.2) {
            P.enter = null; P.smx = P.x; P.smz = P.z; P.px = P.x; P.pz = P.z; P.vx = P.vz = 0;
            P.off[0] = P.x - P.sx; P.off[1] = P.z - P.sz;        // le reste du chemin se résorbe en douceur
            return false;
        }
        if (E.pts.length && d < 0.35) { E.pts.shift(); return true; }
        const sp = Math.min(d / dt, 4.2);
        P.x += dx / d * sp * dt; P.z += dz / d * sp * dt; P.px = P.x; P.pz = P.z;
        const yaw = Math.atan2(dx, dz);
        P.yaw += angDiff(P.yaw, yaw) * Math.min(1, dt * 8);
        P.holder.position.set(P.x, 0, P.z); P.holder.rotation.y = P.yaw; P.holder.rotation.x = 0;
        P.shadow.position.x = P.x; P.shadow.position.z = P.z;
        play(P, 'jog_forward', true, clamp(sp / JOG_SPEED, 0.7, 1.6), 0.2);
        stepFade(P, dt);
        return true;
    }

    function updateBench(dt, t, bx, bz) {
        const bench = S.bench; if (!bench) return;
        bench.all.forEach(b => {
            const P = b.P;
            if (b.st === 'walk') {
                dt = S.rdt || dt;                                   // temps réel : la sortie ne dépend pas de la fluidité
                const tgt = b.path[0];
                if (!tgt) {
                    if (b.arrive === 'sit') placeSit(b); else standAt(b, P.x, P.z);
                    return;
                }
                const dx = tgt.x - P.x, dz = tgt.z - P.z, d = Math.hypot(dx, dz);
                if (!b.crossed && P.z > HZB + 0.15) b.crossed = true;          // il a quitté la pelouse
                if (d < 0.3) { b.path.shift(); return; }
                const sp = Math.min(d / dt, b.spd || 3);
                P.x += dx / d * sp * dt; P.z += dz / d * sp * dt;
                P.yaw += angDiff(P.yaw, Math.atan2(dx, dz)) * Math.min(1, dt * 8);
                P.holder.position.set(P.x, 0, P.z); P.holder.rotation.y = P.yaw;
                play(P, 'jog_forward', true, clamp(sp / JOG_SPEED, 0.6, 1.5), 0.2);
                stepFade(P, dt);
                return;
            }
            if (b.st === 'ready') {                                 // remplaçant appelé : il s'échauffe en attendant le ballon mort
                P.yaw += angDiff(P.yaw, Math.PI) * Math.min(1, dt * 4); P.holder.rotation.y = P.yaw;
                P.holder.position.y = Math.abs(Math.sin(t / 260)) * 0.05;   // petits sauts sur place
                stepFade(P, dt);
                return;
            }
            if (b.st === 'cheer') {                                 // debout devant le banc, bras levés
                const k = Math.max(0, Math.sin((b.until - t) / 140)) * 0.09;
                P.holder.position.y = k;
                if (t > b.until) placeSit(b);
                return;
            }
            if (b.st === 'sit') {
                if (b.clapUntil && t > b.clapUntil) { b.clapUntil = 0; setPose(P, 'sit'); }
                liveFrame(P, t, bx, bz);
                return;
            }
            if (b.st !== 'stand') return;
            if (P.posed && P.clapping) liveFrame(P, t, bx, bz);
            // debout (entraîneur, préparateur) : il suit le ballon du regard
            const R = b.react;
            if (R) {
                if (R.bounce) P.holder.position.y = Math.max(0, Math.sin((R.until - t) / 150)) * 0.12;
                if (t > R.until) {
                    P.holder.position.y = 0;
                    b.react = null;
                    clearPose(P);
                    if (R.then === 'directing' && has('gk_directing')) { play(P, 'gk_directing', true, 1, 0.25); b.react = { kind: 'anim', until: t + 3000 }; }
                    else play(P, 'soccer_idle', true, 1, 0.3);
                }
            } else if (b.role === 'coach' && t > b.next) {            // consignes régulières
                b.next = t + 9000 + Math.random() * 12000;
                if (has('gk_directing')) { play(P, 'gk_directing', true, 1, 0.3); b.react = { kind: 'anim', until: t + 3500 + Math.random() * 2000 }; }
            }
            // l'entraîneur longe sa zone technique pour suivre le jeu (pas pendant un geste)
            if (b.role === 'coach' && !b.react && !P.posed) {
                const g = benchGeo(b.side);
                const tx = clamp(b.home.x + (bx - b.home.x) * 0.12, g.x0 + 0.6, g.x1 - 0.6);
                const dx = tx - P.x;
                if (Math.abs(dx) > (b.walking ? 0.15 : 1.1)) {
                    b.walking = true;
                    const sp = Math.sign(dx) * Math.min(Math.abs(dx) * 2, 1.1);
                    P.x += sp * dt; P.holder.position.x = P.x;
                    // pas chassés : il garde les yeux sur le jeu
                    // vecteur droit du personnage = (cos yaw, -sin yaw) : composante x = cos yaw
                    play(P, has('jog_strafe_right') ? (sp * Math.cos(P.yaw) > 0 ? 'jog_strafe_right' : 'jog_strafe_left') : 'jog_forward', true, 0.55, 0.3);
                } else if (b.walking) { b.walking = false; play(P, 'soccer_idle', true, 1, 0.35); }
            }
            if (!P.posed) {
                const want = Math.atan2(bx - P.x, bz - P.z);
                P.yaw += angDiff(P.yaw, want) * Math.min(1, dt * 2.5);
                P.holder.rotation.y = P.yaw;
                // le geste de consignes déplace le bassin : on garde les pieds dans la zone technique
                stepFade(P, dt);
            }
        });
    }

    // ---- Événements du moteur (passe, tir, tacle, but, arrêt) -----------
    function schedule(ms, fn) { S.timers.push({ at: now() + ms, fn }); }

    // Voile noir au-dessus du canvas (coupures de coups de pied arrêtés).
    function fadeTo(op, ms) {
        if (!S.veil) {
            const v = document.createElement('div');
            v.style.cssText = 'position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:15';
            (S.container || document.body).appendChild(v);
            S.veil = v;
        }
        S.veil.style.transition = 'opacity ' + Math.max(0, ms | 0) + 'ms ease-' + (op ? 'in' : 'out');
        S.veil.style.opacity = String(op);
    }

    function lookAt(P, tx, tz, ms) {
        P.faceYaw = Math.atan2(tx - P.x, tz - P.z); P.faceUntil = now() + ms;
    }

    function handleEvent(ev) {
        const P = S.players[ev.side] && S.players[ev.side][ev.idx];
        if (ev.type === 'pass' && P) {
            const R = S.players[ev.side][ev.to];
            if (R) lookAt(P, R.x, R.z, 450);
            const act = ev.action || 'short';
            const hit = ev.hit != null ? ev.hit : 40;          // le ballon part tout de suite : contact quasi immédiat
            if (act === 'throw' && has('throw_in')) {                 // remise en jeu à la main
                playOnce(P, 'throw_in', 1.25, { fade: 0.1, max: 1500, freeze: true, hit });
                return;
            }
            // le geste dépend de la passe : intérieur du pied au sol, frappe pour un ballon long ou un centre,
            // relance à la main / dégagement pour le gardien
            if (P.isGK) playOnce(P, act === 'long' && has('gk_drop_kick') ? 'gk_drop_kick'
                : (act === 'short' && has('gk_overhand_throw') && Math.random() < 0.5) ? 'gk_overhand_throw'
                : has('gk_pass') ? 'gk_pass' : 'kick_soccerball', 1.3, { fade: 0.08, max: 1300, hit });
            else if ((act === 'short' || act === 'through' || act === 'recycle') && has('soccer_pass')) playOnce(P, 'soccer_pass', 1.35, { fade: 0.08, max: 1000, hit });
            else playOnce(P, act === 'cross' && has('kick_soccerball_1') ? 'kick_soccerball_1' : 'kick_soccerball', 1.25, { fade: 0.08, hit });
            // le receveur se retourne et contrôle à l'arrivée du ballon (poitrine/tête si le ballon est haut)
            const fly = (typeof MATCHSIM !== 'undefined' && MATCHSIM.ball) ? MATCHSIM.ball.fly : null;
            if (R && fly && fly.dur && ev.to >= 0) {
                const arrive = fly.t0 + fly.dur - now();
                schedule(Math.max(0, arrive - 900), () => { if (R.spd < 3.2) lookAt(R, P.x, P.z, 1100); });
                schedule(Math.max(0, arrive - 260), () => {
                    const endZ = MATCHSIM.flyEndZ ? MATCHSIM.flyEndZ(fly) : 0;
                    // ballon coupé ou déjà en geste : rien ; en pleine course, il ne s'arrête que pour une tête
                    if (!MATCHSIM.ball || MATCHSIM.ball.fly !== fly || R.once || (R.spd > 3.4 && endZ < 1.2)) return;
                    const high = endZ >= 1.2, mid = endZ > 0.3 && endZ < 1.2;
                    // un adversaire dans son dos : il contrôle en crochet pour s'en défaire
                    const foes = S.players[ev.side === 'H' ? 'A' : 'H'] || [];
                    const pressed = foes.some(Q => Q && !Q.gone && Math.hypot(Q.x - R.x, Q.z - R.z) < 2.6);
                    const clip = high ? pickClip(['soccer_header', 'header'])
                        : mid ? pickClip(['kneeing_soccerball', 'kneeing_soccerball_2'])
                        : pressed && has('soccer_spin') && Math.random() < 0.45 ? 'soccer_spin'
                        : Math.random() < 0.15 ? pickClip(['stall_soccerball', 'stall_soccerball_1', 'stall_soccerball_2', 'stall_soccerball_3', 'stall_soccerball_4'])
                        : 'receive_soccerball';
                    if (has(clip)) playOnce(R, clip, clip === 'soccer_spin' ? 1.3 : 1.45, { fade: 0.1, max: clip === 'soccer_spin' ? 1000 : 900, hit: 260 });
                });
            }
        } else if (ev.type === 'shot' && P) {
            if (S.rec) S.rec.shots.push({ t: now(), side: ev.side, idx: ev.idx });     // pour le ralenti
            const gx = ev.side === 'H' ? PITCH_W / 2 : -PITCH_W / 2;
            lookAt(P, gx, 0, 600);
            // Sur un centre (corner), la reprise se fait de la tête ; lancé dans sa course, il frappe sans s'arrêter.
            const hitS = 220;                                    // MATCHSIM.shoot : geste annoncé 220 ms avant le départ
            if (ev.sp === 'penalty' && has('soccer_penalty_kick')) playOnce(P, 'soccer_penalty_kick', 1.15, { fade: 0.08, max: 1500, hit: hitS });
            else if (ev.head && has('scissor_kick') && Math.random() < 0.1) playOnce(P, 'scissor_kick', 1.25, { fade: 0.08, freeze: true, max: 1800, hit: hitS });   // reprise acrobatique, rare
            else if (ev.head) playOnce(P, pickClip(['header_soccerball', 'header_soccerball_2', 'soccer_header', 'header']), 1.5, { fade: 0.08, max: 1100, hit: hitS });
            else if (P.spd > 3.2 && has('strike_forward_jog')) playOnce(P, 'strike_forward_jog', 1.2, { fade: 0.08, max: 1300, hit: hitS });
            else playOnce(P, pickClip(['kick_soccerball_1', 'kick_soccerball_2', 'kick_soccerball']), 1.1, { fade: 0.08, hit: hitS });
            // le gardien se tourne vers le tireur et se met en appui
            const gk = S.players[ev.side === 'H' ? 'A' : 'H'][0];
            if (gk) lookAt(gk, P.x, P.z, 1400);
        } else if (ev.type === 'tackle' && P) {
            const L = S.players[ev.loserSide] && S.players[ev.loserSide][ev.loser];
            if (L) lookAt(P, L.x, L.z, 500);
            if (ev.intercept) {
                // interception : il coupe la trajectoire et contrôle
                playOnce(P, has('receive_soccerball') ? 'receive_soccerball' : 'soccer_tackle_2', 1.6, { fade: 0.08, max: 800 });
                return;
            }
            // Trop loin du porteur pour le toucher : pas de tacle dans le vide, il récupère le ballon.
            const dL = L ? Math.hypot(P.x - L.x, P.z - L.z) : 99;
            if (dL > 2.6) {
                playOnce(P, has('receive_soccerball') ? 'receive_soccerball' : 'soccer_tackle_2', 1.6, { fade: 0.08, max: 800 });
                return;
            }
            // au contact : il finit son geste sur le ballon (à ~0,9 m du porteur), sans glisser à côté
            if (L && dL > 1.1) { const k = (dL - 0.9) / dL; P.off[0] += (L.x - P.x) * k * 0.6; P.off[1] += (L.z - P.z) * k * 0.6; }
            // tacle : debout ou glissé selon la vitesse ; l'adversaire est parfois déséquilibré, tombe et se relève
            const slide = P.spd > 3 && Math.random() < 0.55;
            const tk = slide ? pickClip(['soccer_tackle', 'soccer_tackle_3', 'soccer_tackle_2']) : pickClip(['soccer_tackle_2', 'soccer_tackle_1', 'soccer_tackle']);
            playOnce(P, tk, slide ? 1.5 : 2.0, { fade: 0.08, freeze: slide, max: slide ? 1400 : 900 });
            if (L && !L.isGK && Math.random() < (slide ? 0.5 : 0.15) && has('soccer_trip')) {
                schedule(120, () => {
                    playOnce(L, 'soccer_trip', 1.6, { fade: 0.08, freeze: true, max: 2000 });       // chute complète (~2 s)…
                    const ground = slide && has('fallen_idle') && Math.random() < 0.4 ? 900 : 0;      // parfois il reste un instant au sol
                    if (ground) schedule(1900, () => playOnce(L, 'fallen_idle', 1.0, { fade: 0.15, freeze: true, max: ground }));
                    if (has('standing_up')) schedule(1900 + ground, () => playOnce(L, 'standing_up', 2.0, { fade: 0.15, freeze: true, max: 1400 }));   // …puis il se relève
                });
            }
        } else if (ev.type === 'save' && P) {
            benchReact(ev.side === 'H' ? 'A' : 'H', 'chance', 250);   // l'attaquant voit son occasion arrêtée
            // Le plongeon part du côté où arrive le ballon (mesuré sur les clips : « gk_diving_save »
            // part vers la gauche du gardien, « _2 » vers sa droite). Dans l'axe, il capte.
            const sh = (typeof MATCHSIM !== 'undefined') ? MATCHSIM.shotFly : null;
            const tx = sh ? wx(sh.toX) : S.ball.position.x, tz = sh ? wz(sh.toY) : S.ball.position.z;
            const fy = P.faceUntil > now() ? P.faceYaw : P.yaw;
            const side = (tx - P.x) * Math.cos(fy) - (tz - P.z) * Math.sin(fy);   // > 0 : à sa droite
            const low = sh && (sh.peak || 0) < 0.9;
            if (Math.abs(side) < 1.0) {
                playOnce(P, low ? pickClip(['gk_scoop', 'gk_catch_2', 'gk_catch_1', 'gk_catch_4']) : pickClip(['gk_catch_2', 'gk_catch', 'gk_catch_1', 'gk_catch_3', 'gk_catch_4', 'gk_body_block']), 1.2, { fade: 0.1, freeze: true });
                // ballon capté : il le pose au sol pour relancer
                schedule(2300, () => { if (!S.rp && (!P.once || now() >= P.once.until)) playOnce(P, pickClip(['gk_placing_ball', 'gk_placing_ball_2']), 1.6, { fade: 0.2, max: 2400 }); });
            }
            else if (Math.abs(side) < 1.8 && Math.random() < 0.35) playOnce(P, pickClip(['gk_body_block', 'gk_body_block_2', 'gk_body_block_3']), 1.3, { fade: 0.1, freeze: true, max: 1800 });
            else playOnce(P, side > 0 ? 'gk_diving_save_2' : 'gk_diving_save', 1.5, { fade: 0.1, freeze: true });
        } else if (ev.type === 'card' && P) {
            const foes = S.players[ev.side === 'H' ? 'A' : 'H'] || [];
            const victim = foes.filter(Q => Q && !Q.gone && !Q.isGK).sort((a, b) => Math.hypot(a.x - P.x, a.z - P.z) - Math.hypot(b.x - P.x, b.z - P.z))[0];
            if (ev.red) {
                // rouge direct : la victime du tacle s'écroule lourdement, l'expulsé conteste avant de sortir
                if (victim && has('cel_brutal_assassination')) {
                    playOnce(victim, 'cel_brutal_assassination', 1.35, { fade: 0.1, freeze: true, max: 3200 });
                    if (has('standing_up')) schedule(3300, () => playOnce(victim, 'standing_up', 1.8, { fade: 0.15, freeze: true, max: 1500 }));
                }
                if (victim) lookAt(P, victim.x, victim.z, 900);
                if (has('cel_fist_fight_b')) schedule(500, () => playOnce(P, 'cel_fist_fight_b', 1.3, { fade: 0.12, freeze: true, max: 2600 }));
            } else if (victim && has('soccer_trip') && Math.random() < 0.6) {
                playOnce(victim, 'soccer_trip', 1.6, { fade: 0.08, freeze: true, max: 2000 });
                if (has('standing_up')) schedule(1900, () => playOnce(victim, 'standing_up', 2.0, { fade: 0.15, freeze: true, max: 1400 }));
            }
        } else if (ev.type === 'injury' && P) {
            // blessure : il s'effondre, reste au sol un moment, puis se relève en boitant (énergie à plat)
            if (has('cel_dying')) {
                playOnce(P, 'cel_dying', 1.25, { fade: 0.12, freeze: true, max: 3400 });
                if (has('fallen_idle')) schedule(3400, () => playOnce(P, 'fallen_idle', 1.0, { fade: 0.15, freeze: true, max: 2600 }));
                if (has('standing_up')) schedule(6000, () => playOnce(P, 'standing_up', 1.4, { fade: 0.15, freeze: true, max: 1800 }));
            }
        } else if (ev.type === 'cut') {
            // Coupure « télé » d'un coup de pied arrêté : fondu au noir, les joueurs sont posés
            // à leur place sous le noir, puis l'image revient.
            fadeTo(1, ev.out || 380);
            S.cutIn = ev.inn || 520;
        } else if (ev.type === 'snap') {
            const f = S.lastFrame;
            ['H', 'A'].forEach(k => (S.players[k] || []).forEach(Q => {
                Q.smx = null; Q.off[0] = Q.off[1] = 0; Q.once = null;
                Q.px = Q.sx; Q.pz = Q.sz; Q.vx = Q.vz = 0; Q.spd = 0; Q.moving = false;
            }));
            if (f) { S.bsx = wx(f.ball.x); S.bsz = wz(f.ball.y); }
            S.camSnap = true;
            fadeTo(0, S.cutIn || 520);
        } else if (ev.type === 'goal') {
            // Le ballon arrive au fond des filets : tout est calé sur SON arrivée.
            const sh = (typeof MATCHSIM !== 'undefined') ? MATCHSIM.shotFly : null;
            const delay = sh ? Math.max(0, sh.t0 + sh.dur - now()) : 0;
            decorCheer(ev.side, delay);
            benchReact(ev.side, 'goal', delay + 150);
            schedule(delay + 100, () => { try { fxGoal(ev.side); } catch (e) {} });
            if (!S.camHook) schedule(delay + 2900, () => { try { startReplay(ev.side); } catch (e) { console.warn('[3D] ralenti', e); } });
            if (S.decor && S.decor.screen) schedule(delay, () => { if (S.decor.screen) S.decor.screen.goalUntil = now() + 6000; });
            // gardien battu : il plonge pendant que le ballon arrive, pas avant
            const other = ev.side === 'H' ? 'A' : 'H';
            const gk = S.players[other][0];
            if (gk) schedule(Math.max(0, delay - 350), () => playOnce(gk, 'gk_miss', 1.3, { fade: 0.1 }));
            const pick = () => { const ok = CELEBRATIONS.filter(c => S.clips.has(c)); const last = S.lastCel; const pool = ok.length > 1 ? ok.filter(c => c !== last) : ok;
                const c = pool[Math.floor(Math.random() * pool.length)]; S.lastCel = c; return c; };
            // célébration du buteur : il a le temps de la jouer en entier (le moteur
            // retient le jeu pendant ce temps-là)
            const scorer = P;
            if (scorer) schedule(delay + 120, () => {
                const clip = pick();
                if (clip) playOnce(scorer, clip, 1.0, { fade: 0.15, freeze: true, frac: 1.0, max: 3200 });
            });
            // les trois coéquipiers les plus proches viennent le féliciter
            if (scorer) {
                const mates = S.players[ev.side].filter(Q => Q !== scorer && !Q.isGK)
                    .sort((a, b) => Math.hypot(a.x - scorer.x, a.z - scorer.z) - Math.hypot(b.x - scorer.x, b.z - scorer.z))
                    .slice(0, 3);
                mates.forEach((Q, k) => schedule(delay + 1100 + k * 220, () => {
                    const clip = pick();
                    if (clip) playOnce(Q, clip, 1.0, { fade: 0.2, frac: 0.8, max: 1800 });
                }));
            }
        }
    }

    // ═══ RALENTI DU BUT (comme à la télé) ══════════════════════════════════════
    // Le moteur 3D garde en mémoire les 8 dernières secondes de jeu (positions des joueurs et du
    // ballon, frappes). Après un but, l'action est rejouée au ralenti avec une caméra au ras de la
    // pelouse, puis le direct reprend. Pendant ce temps le match reste arrêté (chrono figé).
    const REC_MS = 8000, RP_WINDOW = 4000, RP_SPEED = 0.45;   // ~9 s de ralenti (un toucher le passe)
    function recordFrame(f, t) {
        const R = S.rec || (S.rec = { frames: [], shots: [] });
        const cp = arr => arr.map(d => ({ x: d.x, y: d.y, carrier: d.carrier, off: d.off }));
        R.frames.push({ t, H: cp(f.H), A: cp(f.A), ball: { x: f.ball.x, y: f.ball.y, z: f.ball.z || 0 } });
        while (R.frames.length && t - R.frames[0].t > REC_MS) R.frames.shift();
        while (R.shots.length && t - R.shots[0].t > REC_MS) R.shots.shift();
    }
    function startReplay(side) {
        const R = S.rec; if (!R || R.frames.length < 30 || S.rp || !S.enabled) return;
        const end = R.frames[R.frames.length - 1].t, from = Math.max(R.frames[0].t, end - RP_WINDOW);
        const frames = R.frames.filter(fr => fr.t >= from).map(fr => fr);   // copie figée de la séquence
        const shots = R.shots.filter(s => s.t >= from);
        const realMs = (end - from) / RP_SPEED;
        S.rp = { frames, shots, from, end, i: 0, vt: 0, side, realStart: performance.now(), lastReal: performance.now(), shotDone: {} };
        // le match attend la fin du ralenti
        const m = MATCHSIM.now();
        S.rp.holdLast = m;
        fadeTo(1, 220);
        schedule(230, () => {
            if (!S.rp) return;
            ['H', 'A'].forEach(k => S.players[k].forEach(P => { if (P) { P.init = false; P.once = null; P.smx = null; } }));
            S.bsx = null;
            S.rp.go = true; S.rp.lastReal = performance.now();
            S.scene.animationTimeScale = RP_SPEED;
            rpOverlay(true);
            fadeTo(0, 260);
        });
        S.rp.maxReal = realMs + 1200;
    }
    // l'image rejouée correspondant au temps virtuel du ralenti
    function replayFrame() {
        const rp = S.rp, nowR = performance.now();
        if (!rp.go) { const fr = rp.frames[0]; return { H: fr.H, A: fr.A, ball: fr.ball, ev: [] }; }
        rp.vt += (nowR - rp.lastReal) * RP_SPEED; rp.lastReal = nowR;
        const tr = rp.from + rp.vt;
        while (rp.i < rp.frames.length - 1 && rp.frames[rp.i + 1].t <= tr) rp.i++;
        const fr = rp.frames[rp.i];
        // les frappes rejouées : même geste qu'en direct
        rp.shots.forEach((s, k) => {
            if (rp.shotDone[k] || s.t > tr) return;
            rp.shotDone[k] = true;
            const P = S.players[s.side] && S.players[s.side][s.idx];
            if (P) playOnce(P, has('strike_forward_jog') ? 'strike_forward_jog' : 'kick_soccerball', 1.2, { fade: 0.08 });
        });
        if (tr >= rp.end || nowR - rp.realStart > rp.maxReal) { endReplay(); return null; }
        return { H: fr.H, A: fr.A, ball: fr.ball, ev: [] };
    }
    function endReplay() {
        const rp = S.rp; if (!rp) return;
        rp.ending = true;
        fadeTo(1, 200);
        setTimeout(() => {
            S.rp = null;
            S.scene.animationTimeScale = 1;
            rpOverlay(false);
            ['H', 'A'].forEach(k => S.players[k].forEach(P => { if (P) { P.init = false; P.once = null; P.smx = null; } }));
            S.bsx = null; S.lastT = 0;
            S.lastEvId = (typeof MATCHSIM !== 'undefined' && MATCHSIM.evSeq) || S.lastEvId;
            fadeTo(0, 300);
        }, 220);
    }
    // tant que le ralenti passe, le match reste figé (ordres, minuteries et chrono)
    function holdWhileReplay() {
        const rp = S.rp; if (!rp || typeof MATCHSIM === 'undefined') return;
        const M = MATCHSIM, m = M.now();
        const d = Math.max(0, m - rp.holdLast); rp.holdLast = m;
        try { M.holdUntil = Math.max(M.holdUntil || 0, m + 500); (M._later || []).forEach(e => { e.at += d; }); M.holdScene(800); } catch (e) {}
    }
    // caméra du ralenti : au ras de la pelouse, de côté, elle suit le ballon
    function replayCamera(dt, bx, bz) {
        const cam = S.camera, B = S.B, rp = S.rp;
        const dir = rp.side === 'H' ? 1 : -1;                     // sens d'attaque de l'équipe qui a marqué
        const tx = bx - dir * 7, tz = bz - 11, ty = 2.4;
        const k = 1 - Math.exp(-dt * 3.5);
        if (!rp.cam) rp.cam = { x: tx, y: ty, z: tz, lx: bx, lz: bz };
        rp.cam.x += (tx - rp.cam.x) * k; rp.cam.y += (ty - rp.cam.y) * k; rp.cam.z += (tz - rp.cam.z) * k;
        rp.cam.lx += (bx - rp.cam.lx) * k * 1.4; rp.cam.lz += (bz - rp.cam.lz) * k * 1.4;
        cam.position.set(rp.cam.x, rp.cam.y, rp.cam.z);
        cam.setTarget(new B.Vector3(rp.cam.lx, 1.0, rp.cam.lz));
    }
    // bandeau « RALENTI » + bandes noires (charte : orange, noir)
    function rpOverlay(on) {
        let el = S.rpEl;
        if (!el && on && S.container) {
            el = S.rpEl = document.createElement('div');
            el.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:14;opacity:0;transition:opacity .25s';
            el.innerHTML = '<i style="position:absolute;left:0;right:0;top:0;height:9%;background:#000"></i>' +
                '<i style="position:absolute;left:0;right:0;bottom:0;height:9%;background:#000"></i>' +
                '<b style="position:absolute;left:14px;top:calc(9% + 10px);display:flex;align-items:center;gap:8px;padding:4px 12px 3px;' +
                'font:italic 700 20px Teko,Impact,sans-serif;letter-spacing:.06em;color:#0a0e17;' +
                'background:repeating-linear-gradient(115deg,#f97316 0 14px,#ea580c 14px 28px);border-radius:4px">' +
                '<span style="width:9px;height:9px;border-radius:50%;background:#0a0e17;animation:aecmRpBlink 1s steps(2) infinite"></span>RALENTI</b>';
            if (!document.getElementById('aecm-rp-style')) { const st = document.createElement('style'); st.id = 'aecm-rp-style'; st.textContent = '@keyframes aecmRpBlink{50%{opacity:0}}'; document.head.appendChild(st); }
            S.container.appendChild(el);
        }
        if (el) el.style.opacity = on ? '1' : '0';
    }

    // ---- Caméra ---------------------------------------------------------
    const SMOOTH_K = 9;     // raideur du lissage visuel (1/s) ; ~0,11 s de retard, imperceptible

    function updateCamera(dt, ballX, ballZ) {
        const cam = S.camera, B = S.B;
        const aspect = Math.max(0.5, S.engine.getAspectRatio(cam));
        const wide = S.camMode === 'wide';
        const portrait = aspect < 1.15;                         // téléphone en portrait : cadre presque carré ou haut
        const cw = S.canvas.clientWidth || 360;
        // angle « retransmission » : assez bas pour voir la tribune d'en face au-dessus du jeu
        const el = (wide ? 50 : (portrait ? 34 : 23)) * Math.PI / 180;
        // Vue d'ensemble en portrait : on tourne la caméra de 90° pour que la longueur du terrain (105 m)
        // aille dans le sens de la hauteur de l'écran — le terrain remplit le cadre au lieu d'être un fin ruban.
        const rot = wide && portrait;
        let viewW;                                              // largeur de terrain visible au sol (m)
        if (rot) viewW = Math.max(FIELD_H, FIELD_W * Math.sin(el) * aspect) - 2;
        else if (wide) viewW = FIELD_W - 2;
        else viewW = portrait ? clamp(cw / 13.5, 24, 42) : clamp(cw / 13, 36, 58);   // vue suivie : cadre « retransmission » plus large en paysage
        const th = Math.tan(cam.fov / 2);
        const dist = (viewW / 2) / (th * aspect);
        const lim = Math.max(0, FIELD_W / 2 - viewW / 2 - 2);
        const tx = wide ? 0 : clamp(ballX, -lim, lim);
        const tz = wide ? 0 : clamp(ballZ * 0.35 + (portrait ? 0 : 5), -10, 14);   // paysage : la tribune d en face entre dans le cadre
        let k = 1 - Math.exp(-dt * (wide ? 6 : 3.2));
        if (S.camSnap) { k = 1; S.camSnap = false; }            // après une coupure : plan directement cadré
        S.camX += (tx - S.camX) * k; S.camZ += (tz - S.camZ) * k;
        if (rot) cam.position.set(S.camX - Math.cos(el) * dist, Math.sin(el) * dist, S.camZ);
        else cam.position.set(S.camX, Math.sin(el) * dist, S.camZ - Math.cos(el) * dist);
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
        S.lastT = t; S.rdt = clamp(dt || 0.016, 0.001, 0.5); dt = clamp(dt || 0.016, 0.001, 0.1);

        // ralenti : les déplacements avancent en temps « virtuel » (vitesses réelles, gestes au ralenti)
        if (S.rp && S.rp.go) dt = Math.max(0.001, dt * RP_SPEED);
        let f = S.rp ? replayFrame() : null;
        if (!f) { f = MATCHSIM.frame(); if (!S.rp && !S.camHook) recordFrame(f, t); }
        S.lastFrame = f;

        // minuteries (célébrations différées)
        for (let i = S.timers.length - 1; i >= 0; i--) if (t >= S.timers[i].at) { const fn = S.timers[i].fn; S.timers.splice(i, 1); try { fn(); } catch (e) {} }

        // positions d'abord (les événements ont besoin des positions à jour)
        ['H', 'A'].forEach(side => f[side].forEach((d, i) => {
            const P = S.players[side][i]; if (!P) return;
            const sx = wx(d.x), sz = wz(d.y);
            // saut de la simulation (engagement, remise en jeu) : on suit sans glisser
            if (!P.init || Math.hypot(sx - P.lsx, sz - P.lsz) > 9) { P.init = true; P.off[0] = P.off[1] = 0; P.px = sx; P.pz = sz; P.vx = P.vz = 0; P.smx = null; }
            P.lsx = P.sx = sx; P.lsz = P.sz = sz;
        }));
        // ballon
        // Lissage visuel : le moteur interpole en ligne droite entre deux actions, donc la vitesse change
        // d'un coup à chaque nouvel ordre (arrêts/départs secs, « sauts » dans l'action). Un filtre
        // exponentiel court (~0,1 s) arrondit ces angles ; joueurs et ballon utilisent le MÊME filtre,
        // le ballon reste donc collé au pied du porteur.
        const sk = 1 - Math.exp(-dt * SMOOTH_K);
        const rbx = wx(f.ball.x), rbz = wz(f.ball.y), byT = (S.ballY0 || 0.17) + Math.max(0, f.ball.z || 0);
        // en montée on suit exactement ; en descente brutale (tête, contrôle de la poitrine) il retombe
        if (S.byS == null || byT >= S.byS || S.rp) S.byS = byT; else S.byS = Math.max(byT, S.byS - dt * 6.5);
        const by = S.byS;
        if (S.bsx == null || Math.hypot(rbx - S.lbx, rbz - S.lbz) > 25) { S.bsx = rbx; S.bsz = rbz; }   // vraie téléportation (remise en jeu) : on suit sans glisser
        else { S.bsx += (rbx - S.bsx) * sk; S.bsz += (rbz - S.bsz) * sk; }
        S.lbx = rbx; S.lbz = rbz;
        const bx = S.bsx, bz = S.bsz;
        const pbx = S.ball.position.x, pbz = S.ball.position.z;
        S.ball.position.set(bx, by, bz);
        S.ball.rotation.x += (bz - pbz) / 0.17; S.ball.rotation.z -= (bx - pbx) / 0.17;
        S.ballShadow.position.set(bx, 0.02, bz);
        const ss = 1 / (1 + Math.max(0, f.ball.z || 0) * 0.35); S.ballShadow.scaling.set(ss, ss, ss);

        // nouveaux événements
        (f.ev || []).forEach(ev => { if (ev.id > S.lastEvId) { S.lastEvId = ev.id; try { handleEvent(ev); } catch (e) { console.warn('[3D] ev', e); } } });
        updateDecor();

        // joueurs
        let carrier = null;
        ['H', 'A'].forEach(side => f[side].forEach((d, i) => {
            const P = S.players[side][i]; if (!P) return;
            if (P.enter && enterStep(P, S.rdt || dt)) return;       // remplaçant qui entre en jeu (temps réel)
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
            const rx = P.sx + P.off[0], rz = P.sz + P.off[1];
            if (P.smx == null) { P.smx = rx; P.smz = rz; }
            P.smx += (rx - P.smx) * sk; P.smz += (rz - P.smz) * sk;
            const x = P.smx, z = P.smz;
            const ivx = (x - P.px) / dt, ivz = (z - P.pz) / dt;
            const a = 1 - Math.exp(-dt * 6);
            P.vx += (ivx - P.vx) * a; P.vz += (ivz - P.vz) * a;
            P.spd = Math.hypot(P.vx, P.vz);
            P.px = x; P.pz = z; P.x = x; P.z = z;

            // Expulsé : il disparaît une fois la ligne de touche franchie.
            const gone = !!d.off && (d.y < 0.5 || d.y > 99.5);
            if (gone !== !!P.gone) { P.gone = gone; P.holder.setEnabled(!gone); P.shadow.setEnabled(!gone); }
            if (gone) return;

            // Allure : un joueur qui recule ou glisse latéralement en surveillant le ballon ne lui
            // tourne pas le dos (avant : tout le monde faisait demi-tour et trottinait « en avant »).
            // back = course arrière, left/right = pas chassés ; seulement à allure modérée et près du jeu.
            const toBall = Math.atan2(bx - x, bz - z), velYaw = Math.atan2(P.vx, P.vz);
            let gait = 'fwd';
            if (P.spd > 0.6 && !d.carrier && P.spd < 3.8 && Math.hypot(bx - x, bz - z) < 38) {
                const rel = angDiff(toBall, velYaw);                  // > 0 : il se déplace vers SA droite
                const ar = Math.abs(rel);
                if (ar > 2.45) gait = 'back';
                else if (ar > 1.75 && P.spd < 3.2) gait = rel > 0 ? 'backR' : 'backL';          // recule en diagonale
                else if (ar > 1.15 && P.spd < 2.8) gait = rel > 0 ? 'right' : 'left';
                else if (ar > 0.5 && P.spd < 3.4) gait = rel > 0 ? 'fwdR' : 'fwdL';             // avance en diagonale, l'œil sur le ballon
            }
            if (gait !== P.gait) {                                    // pas de clignotement : on garde une allure 0,4 s minimum
                if (!P.gaitT || t - P.gaitT > 400) { P.gait = gait; P.gaitT = t; }
            }
            const g8 = P.gait || 'fwd';

            // orientation
            let target = P.yaw;
            if (P.faceUntil > t) target = P.faceYaw;
            else if (P.spd > 0.6) target = g8 === 'fwd' ? velYaw : toBall;      // diagonales et pas chassés : face au ballon
            else target = toBall;
            if (P.once && P.once.freeze && t < P.once.until) target = P.yaw;
            P.yaw += angDiff(P.yaw, target) * Math.min(1, dt * (P.spd > 0.6 ? 9 : 6));
            P.holder.position.set(x, 0, z);
            P.holder.rotation.y = P.yaw;
            // Sprint : au-delà du trot, le corps se penche vers l'avant au lieu d'accélérer les jambes
            // à l'infini (un trot passé en accéléré donnait des « petits pas » de dessin animé).
            const lean = (!P.once && P.moving && g8 === 'fwd') ? clamp((P.spd - 3.2) * 0.045, 0, 0.16) : 0;
            P.lean = (P.lean || 0) + (lean - (P.lean || 0)) * Math.min(1, dt * 6);
            P.holder.rotation.x = P.lean;
            P.shadow.position.x = x; P.shadow.position.z = z;
            if (d.carrier) carrier = P;

            // choix du clip
            if (P.once && t >= P.once.until) P.once = null;
            if (!P.once) {
                P.moving = P.moving ? P.spd > 0.30 : P.spd > 0.55;       // hystérésis : seuils différents pour partir et s'arrêter
                if (!P.moving) P.wasMoving = false;
                // gardien : pas chassés pour suivre le ballon latéralement, sans lui tourner le dos
                const gkSide = P.isGK && P.moving && P.spd < 3 && has('gk_sidestep') && Math.abs(angDiff(toBall, velYaw)) > 1.0;
                if (gkSide) {
                    if (P.gkAlt == null) P.gkAlt = Math.random() < 0.5;
                    play(P, P.gkAlt && has('gk_sidestep_2') ? 'gk_sidestep_2' : 'gk_sidestep', true, clamp(P.spd / 1.6, 0.7, 1.6), 0.25);
                } else if (P.moving) {
                    // Diagonales mesurées sur les clips (rotation moyenne du bassin) : « _diagonal » et « _diagonal_2 »
                    // partent à droite, « _diagonal_1 » à gauche ; en arrière, « _diagonal » à droite, « _2 » à gauche.
                    if (P.diagAlt == null) P.diagAlt = Math.random() < 0.5;
                    const started = !P.wasMoving; P.wasMoving = true;
                    if (started && !P.isGK && has('transition') && Math.random() < 0.25) {   // démarrage : il s'élance
                        playOnce(P, 'transition', 1.2, { fade: 0.12, max: 520 });
                    }
                    const clip = g8 === 'back' ? 'jog_backward' : g8 === 'right' ? 'jog_strafe_right' : g8 === 'left' ? 'jog_strafe_left'
                        : g8 === 'fwdR' ? (P.diagAlt ? 'jog_forward_diagonal' : 'jog_forward_diagonal_2') : g8 === 'fwdL' ? 'jog_forward_diagonal_1'
                        : g8 === 'backR' ? 'jog_backward_diagonal' : g8 === 'backL' ? 'jog_backward_diagonal_2' : 'jog_forward';
                    const ref = (g8 === 'fwd' || g8 === 'fwdR' || g8 === 'fwdL') ? JOG_SPEED : (g8 === 'back' || g8 === 'backR' || g8 === 'backL') ? BACK_SPEED : STRAFE_SPEED;
                    play(P, S.clips.has(clip) ? clip : 'jog_forward', true, clamp(P.spd / ref, 0.6, g8 === 'fwd' ? 1.75 : 1.6), 0.25);
                }
                // à l'arrêt : près du ballon on reste en appui, loin du jeu on souffle ; le gardien
                // place sa défense quand le jeu est loin
                else if (P.isGK) {
                    if (P.gkAlt == null) P.gkAlt = Math.random() < 0.5;
                    play(P, (Math.hypot(bx - x, bz - z) > 40 && has('gk_directing')) ? 'gk_directing' : (P.gkAlt && has('gk_idle_2') ? 'gk_idle_2' : 'gk_idle'), true, 1, 0.35);
                }
                else {
                    // Ballon arrêté (touche, faute, changement) : celui qui l'a aux pieds jongle en attendant.
                    const dead = typeof MATCHSIM !== 'undefined' && MATCHSIM.phase !== 'shot' && ((MATCHSIM.now() - (MATCHSIM.deadBall || -1e9)) < 2800 || (MATCHSIM.holdUntil || 0) > MATCHSIM.now() + 600);   // vrai arrêt de jeu, pas une simple pause du porteur
                    if (dead && d.carrier && !S.rp && t > (P.juggleNext || 0)) {
                        P.juggleNext = t + 4500 + Math.random() * 4000;
                        playOnce(P, pickClip(['kick_up_soccerball', 'stall_soccerball_1', 'stall_soccerball_2', 'stall_soccerball_3', 'stall_soccerball_4']), 1.0, { fade: 0.2, max: 2200 });
                    } else play(P, (d.carrier || Math.hypot(bx - x, bz - z) < 22) ? 'offensive_idle' : 'soccer_idle', true, 1, 0.3);
                }
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

        holdWhileReplay();
        if (!S.rp) runSubQueue();
        holdWhileSubbing();
        updateBench(dt, t, bx, bz);

        // Ballon au pied : la simulation le place ~1 m devant le porteur, toujours vers le but
        // adverse, sur la position SIMULÉE du joueur — à l'écran il flottait donc à 1-3 m du
        // corps. On le colle au joueur affiché, devant lui, et on fond la transition.
        {
            const M = MATCHSIM, b = M.ball;
            const loose = !carrier || b.fly || b.fixed || (M.shotFly && (now() >= M.shotFly.t0 || M.shotFly.stay)) || S.rp;
            // nouveau porteur sans vol (récupération au contact) : on repart de zéro, le ballon glisse jusqu'à lui
            if (!loose && S.attachP !== carrier) { S.attach = 0; S.attachP = carrier; }
            const want = loose ? 0 : 1;
            S.attach = (S.attach || 0) + (want - (S.attach || 0)) * Math.min(1, dt * (want ? 9 : 14));
            const holder = S.attachP;                 // en se décollant, le ballon part du pied de CELUI qui l'avait
            if (loose && S.attach < 0.5) S.attach = 0;  // dès que le ballon vole, la simulation reprend la main
            if (S.attach > 0.01 && holder && !holder.gone) {
                const fy = holder.yaw, fx = holder.x + Math.sin(fy) * 0.36, fz = holder.z + Math.cos(fy) * 0.36;
                const k = S.attach;
                const nx = S.ball.position.x + (fx - S.ball.position.x) * k, nz = S.ball.position.z + (fz - S.ball.position.z) * k;
                S.ball.rotation.x += (nz - S.ball.position.z) / 0.17; S.ball.rotation.z -= (nx - S.ball.position.x) / 0.17;
                S.ball.position.x = nx; S.ball.position.z = nz;
                S.ballShadow.position.x = nx; S.ballShadow.position.z = nz;
                S.bsx = nx; S.bsz = nz;          // le lissage repart d'ici quand le ballon quitte le pied
            }
        }
        if (carrier && !S.camHook && !S.rp) { S.ring.isVisible = true; S.ring.position.x = carrier.x; S.ring.position.z = carrier.z; }
        else S.ring.isVisible = false;

        updateShadows();
        // la cinématique pilote sa propre caméra (et n'a pas de garde-fou de fluidité)
        if (S.camHook) S.camHook(dt, bx, bz, carrier);
        else if (S.rp && S.rp.go) replayCamera(dt, bx, bz);
        else updateCamera(dt, bx, bz);
        S.scene.render();
        if (!S.camHook) guardFps(t);
    }

    // Filet de sécurité : si le téléphone n'arrive vraiment pas à suivre, on allège d'abord
    // (résolution en deux paliers), et seulement en dernier recours on passe en 2D — pour CE match
    // uniquement : ce n'est jamais mémorisé (avant, un démarrage lent coupait la 3D pour toujours).
    function guardFps(t) {
        if (window.__AECM_NO_FPS_GUARD) return;
        if (document.hidden) { S.guardT0 = 0; return; }                   // appli en arrière-plan : on ne mesure rien
        if (!S.guardT0) { S.guardT0 = t; S.guardLast = t; S.slowCount = 0; return; }
        if (t - S.guardT0 < 8000 || t - S.guardLast < 1000) return;      // 8 s de chauffe (chargement, shaders), puis 1 mesure/s
        S.guardLast = t;
        const fps = S.engine.getFps();
        S.slowCount = fps < (S.lowEnd ? 10 : 12) ? S.slowCount + 1 : 0;
        if (S.slowCount >= 3 && fxLighten()) { S.slowCount = 0; S.guardT0 = t; S.guardLast = t; return; }   // palier 0 : effets coupés
        if (S.slowCount >= 4 && S.resTarget > 1) {                       // palier 1 : 1 pixel CSS
            S.resTarget = 1; S.engine.setHardwareScalingLevel(1);
            S.slowCount = 0; S.guardT0 = t; S.guardLast = t;
            return;
        }
        if (S.slowCount >= 4 && S.resTarget > 0.7) {                     // palier 2 : 3/4 de la définition
            S.resTarget = 0.7; S.engine.setHardwareScalingLevel(1 / 0.7);
            S.slowCount = 0; S.guardT0 = t; S.guardLast = t;
            return;
        }
        if (S.slowCount >= 6) {
            console.warn('[Match3D] trop lent (' + fps.toFixed(0) + ' i/s) : 2D pour ce match');
            setEnabled(false, { temp: true });
            try { if (window.app && app.showNotification) app.showNotification('Vue 3D mise en pause pour ce match (appareil trop sollicité). Bouton 2D/3D pour la relancer.', 'info'); } catch (e) {}
        }
    }

    // ---- Chargement -----------------------------------------------------
    async function fetchBytes(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error(url + ' ' + r.status);
        return r.arrayBuffer();
    }

    async function loadContainer(url, key) {
        S.lastUrl = url;
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
        S.step = 'démarrage'; S.lastUrl = '';
        try {
            if (!webglOK()) throw new Error('WebGL indisponible');
            S.step = 'chargement du moteur 3D';
            await ensureBabylon();
            S.step = 'création du rendu WebGL';
            const B = S.B = window.BABYLON_AECM;
            S.lowEnd = detectLowEnd();
            // À 22 px de haut sur un téléphone, 'far' (1 500-2 700 triangles) est quasi identique à 'match' (5 000) et bien moins lourd.
            S.quality = 'match';                          // modèles détaillés sur tous les appareils

            const dpr = window.devicePixelRatio || 1;
            const engine = S.engine = new B.Engine(S.canvas, !S.lowEnd, { alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false, stencil: false }, false);
            // Résolution de rendu. Babylon : niveau 1 = 1 pixel par pixel CSS, 0,5 = 2x plus fin.
            // Avant : max(1, dpr/1,5) donnait un niveau de 2 (écran dpr 3) à 3 (mobile faible) : le rendu
            // était calculé à 1/2 ou 1/3 de la définition CSS puis étiré = personnages pixélisés.
            S.resTarget = S.lowEnd ? Math.min(dpr, 1.25) : Math.min(dpr, 2);
            engine.setHardwareScalingLevel(1 / Math.max(1, S.resTarget));
            const scene = S.scene = new B.Scene(engine);
            scene.clearColor = new B.Color4(0.04, 0.09, 0.07, 1);
            scene.autoClearDepthAndStencil = true;
            scene.skipPointerMovePicking = true;
            scene.pointerMovePredicate = () => false;

            const cam = S.camera = new B.FreeCamera('cam', new B.Vector3(0, 30, -40), scene);
            cam.fov = 0.62; cam.minZ = 1; cam.maxZ = 900;
            S.hemi = new B.HemisphericLight('hemi', new B.Vector3(0.2, 1, -0.3), scene);
            S.hemi.intensity = 1.05; S.hemi.groundColor = new B.Color3(0.45, 0.5, 0.45);
            S.sun = new B.DirectionalLight('sun', new B.Vector3(-0.4, -1, 0.5), scene);
            S.sun.intensity = 0.8;

            S.step = 'terrain et ballon';
            try { buildFx(); } catch (e) { console.warn('[3D] effets', e); }
            buildBall();
            S.decor = {};
            try { buildGoals(); } catch (e) { console.warn('[3D] buts', e); }
            buildShadows();
            S.theme = THEMES.clear;

            // Modèles (un fichier par apparence) + bibliothèques d'animations
            S.step = 'modèles des joueurs';
            const q = S.quality;
            const models = OUTFIELD_MODELS.concat(GK_MODELS, [REF_MODEL]);
            await Promise.all(models.map(async k => {
                S.containers[k] = await loadContainer(ROOT + 'personnages/' + (k === REF_MODEL ? 'far' : q) + '/' + k + '.glb', k);
            }));
            S.step = 'animations';
            await Promise.all([loadLib('anim_football'), loadLib('anim_goalkeeper')]);
            S.step = 'création des joueurs';

            for (const side of ['H', 'A']) {
                for (let i = 0; i < 11; i++) {
                    const gk = i === 0;
                    const P = makePlayer(side + i, gk ? GK_FOR[side] : OUTFIELD_MODELS[i % OUTFIELD_MODELS.length], gk);
                    S.players[side].push(P);
                }
            }
            // arbitre : nouveau modèle (repli sur l'ancien s'il manque)
            try { S.containers['staff:arbitre'] = await loadContainer(ROOT + 'staff/arbitre.glb'); S.ref = makePlayer('ref', 'staff:arbitre', false); }
            catch (e) { S.ref = makePlayer('ref', REF_MODEL, false); }
            S.ref.x = 0; S.ref.z = 0;
            S.step = 'bancs de touche';
            await buildBench();

            S.ready = true;
            S.step = 'stade';
            rebuildDecor();
            S.step = 'maillots';
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
            if (S.btn) { S.btn.textContent = '2D'; S.btn.style.opacity = '.6'; }
            // On dit POURQUOI (avant : repli silencieux, impossible de savoir ce qui bloquait).
            // Le bouton 2D/3D reste actif : un nouvel appui retente le chargement.
            const why = describeErr(e);
            console.warn('[Match3D] étape « ' + S.step + ' » :', why);
            try { if (window.app && app.showNotification) app.showNotification('3D indisponible (' + S.step + ') : ' + why + '. Bouton 2D/3D pour réessayer.', 'warning'); } catch (e3) {}
        }
    }

    // ---- API publique ---------------------------------------------------
    function setEnabled(on, opts) {
        S.enabled = !!on;
        // le choix n'est mémorisé que s'il vient du joueur (bouton 2D/3D)
        if (opts && opts.user) { try { localStorage.setItem('AECM_3D', on ? '1' : '0'); localStorage.setItem('AECM_3D_USER', '1'); } catch (e) {} }
        if (on) { S.resTarget = S.resTarget || 1; S.guardT0 = 0; }
        if (S.veil) { S.veil.style.transition = 'none'; S.veil.style.opacity = '0'; }
        if (S.rainEl) S.rainEl.style.display = on && S.theme && S.theme.rain ? '' : 'none';
        if (on && !S.ready && !S.failed) { showLayers(false); boot(); }
        else showLayers(on && S.ready);
        if (!on) stopLoop(); else if (S.wantRun) start();
    }

    function attach() {
        const container = document.getElementById('pitch-container');
        if (!container) return;
        if (S.canvas && !S.canvas.isConnected) {             // l'écran de match a été reconstruit
            try { S.engine && S.engine.dispose(); } catch (e) {}
            if (S.veil) { try { S.veil.remove(); } catch (e) {} S.veil = null; }
            if (S.rainEl) { try { S.rainEl.remove(); } catch (e) {} S.rainEl = null; }
            S.decorObjs = []; S.decorKey = null; S.sh = null;
            Object.assign(S, { engine: null, scene: null, camera: null, ready: false, booting: false, running: false,
                containers: {}, glbBytes: {}, clips: new Map(), libs: {}, players: { H: [], A: [] }, ref: null, bench: null, fx: null, matCache: new Map(), lastEvId: 0, decor: {} });
            S.canvas = null; S.btn = null;
        }
        if (!S.canvas) {
            const cv = document.createElement('canvas');
            cv.id = 'match3d-canvas';
            cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:10;display:none;outline:none;touch-action:manipulation';
            cv.addEventListener('click', () => {                // tap : vue suivie <-> vue d'ensemble (ou passe le ralenti)
                if (S.rp && S.rp.go && !S.rp.ending) { endReplay(); return; }
                S.camMode = S.camMode === 'follow' ? 'wide' : 'follow';
            });
            container.insertBefore(cv, container.firstChild);
            S.canvas = cv;
        }
        // Le bouton 2D/3D peut manquer si le canevas a été créé ailleurs (cinématique, aperçu du stade).
        if (!S.btn || !S.btn.isConnected) {
            const btn = document.createElement('button');
            btn.type = 'button'; btn.id = 'pitch-3d-btn';
            btn.className = 'absolute top-2 start-2 z-40 bg-black/50 hover:bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 backdrop-blur-sm transition-colors';
            btn.title = 'Vue 3D / 2D';
            btn.onclick = () => {
                if (S.failed) {                                  // échec précédent : on retente le chargement
                    Object.assign(S, { failed: false, booting: false, ready: false, containers: {}, glbBytes: {}, clips: new Map(), libs: {}, players: { H: [], A: [] }, ref: null, bench: null, fx: null, matCache: new Map() });
                    setEnabled(true, { user: true }); return;
                }
                setEnabled(!S.enabled, { user: true });
            };
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
        S.bsx = null;                      // lissage du ballon repart de la position réelle
        ['H', 'A'].forEach(k => (S.players[k] || []).forEach(P => { P.smx = null; P.moving = false; }));
        if (S.ready) {
            // décor du match (stade du club qui reçoit, météo) : reconstruit seulement s'il change
            const key = JSON.stringify([S.condInfo && S.condInfo.weather, S.condInfo && S.condInfo.pitch, S.condInfo && S.condInfo.capacity, S.condInfo && S.condInfo.name, home, away]);
            if (key !== S.decorKey) { try { rebuildDecor(); } catch (e) { console.warn('[3D] décor', e); } }
            const old = Array.from(S.matCache.values());
            S.matCache.clear();
            S.players.H.concat(S.players.A).forEach(P => { P.init = false; P.once = null; P.enter = null; });
            resetBench();
            schedule(1800, () => { try { fxSmoke('H', 3); fxSmoke('A', 2); } catch (e) {} });
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

    // Conditions du match : { weather: 'night'|'clear'|..., pitch: 'perfect'|..., capacity, name, fill, cond }.
    // À appeler AVANT setTeams (qui reconstruit le décor si besoin).
    function setConditions(info) { S.condInfo = info || null; }

    // Essai depuis la console : Match3D.preview({ weather: 'night', capacity: 5000, name: 'Stade Omnisports — X' })
    function preview(over) { S.condInfo = Object.assign({}, S.condInfo || {}, over || {}); S.decorKey = null; if (S.ready) rebuildDecor(); }

    // =====================================================================
    // APERÇU DU STADE (Campus) — une vraie scène 3D du stade du club, construite
    // avec EXACTEMENT les mêmes fonctions que le décor du match (tribunes, toit,
    // piste, projecteurs, sièges aux couleurs du club). Scène et moteur séparés :
    // l'état du match (S) est prêté le temps de la construction, puis rendu.
    // =====================================================================
    const PV = { engine: null, canvas: null, ro: null, info: null };
    function stopStadiumPreview() {
        try { PV.ro && PV.ro.disconnect(); } catch (e) {}
        try { PV.engine && PV.engine.stopRenderLoop(); PV.engine && PV.engine.dispose(); } catch (e) {}
        try { PV.canvas && PV.canvas.remove(); } catch (e) {}
        PV.engine = PV.canvas = PV.ro = null;
    }
    async function stadiumPreview(container, info) {
        stopStadiumPreview();
        if (!container || !webglOK()) return false;
        try {
            await ensureBabylon();
        } catch (e) { return false; }
        if (!container.isConnected) return false;
        const B = window.BABYLON_AECM;
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;outline:none;touch-action:none';
        container.appendChild(canvas);
        const lowEnd = detectLowEnd();
        const engine = new B.Engine(canvas, !lowEnd, { alpha: false, preserveDrawingBuffer: false, stencil: false }, false);
        const dpr = window.devicePixelRatio || 1;
        engine.setHardwareScalingLevel(1 / Math.max(1, lowEnd ? Math.min(dpr, 1.25) : Math.min(dpr, 2)));
        const scene = new B.Scene(engine);
        scene.skipPointerMovePicking = true;
        const cam = new B.FreeCamera('pvCam', new B.Vector3(0, 80, -160), scene);
        cam.fov = 0.78; cam.minZ = 1; cam.maxZ = 1200;
        const hemi = new B.HemisphericLight('pvHemi', new B.Vector3(0.2, 1, -0.3), scene);
        const sun = new B.DirectionalLight('pvSun', new B.Vector3(-0.4, -1, 0.5), scene);

        // On prête l'état du décor à cette scène le temps de la construction.
        const keep = {}; ['B', 'scene', 'engine', 'decorObjs', 'decor', 'theme', 'spec', 'lights', 'teams', 'condInfo', 'hemi', 'sun', 'lowEnd'].forEach(k => keep[k] = S[k]);
        const keepHalo = haloMatCache;
        try {
            S.B = B; S.scene = scene; S.engine = engine; S.decorObjs = []; S.decor = {}; S.lights = [];
            S.teams = { home: info.club, away: info.club }; S.lowEnd = lowEnd;
            S.condInfo = { weather: info.weather || 'clear', capacity: info.capacity, name: info.name, fill: info.fill || 0.85 };
            S.theme = THEMES[S.condInfo.weather] || THEMES.clear; S.spec = stadiumSpec(S.condInfo);
            haloMatCache = null;
            buildSky(); paintPitch(S.spec, info.cond || null); buildStadium();
            try { buildSurroundings(); } catch (e) { console.warn('[Stade 3D] abords', e); }
            try { buildGoals(); } catch (e) {}
            // ambiance (sans la pluie DOM ni les joueurs du match)
            const th = S.theme;
            scene.clearColor = new B.Color4(th.clear[0], th.clear[1], th.clear[2], 1);
            hemi.intensity = th.hemi; hemi.diffuse = new B.Color3(...th.hemiCol); hemi.groundColor = new B.Color3(...th.ground);
            sun.intensity = th.sun; sun.direction = new B.Vector3(...th.sunDir).normalize();
            if (th.fog) { scene.fogMode = 2; scene.fogDensity = th.fog.d * 0.6; scene.fogColor = hex3(th.fog.col); }
            const ip = scene.imageProcessingConfiguration;
            if (ip) { ip.contrast = th.contrast; ip.exposure = th.exposure; ip.toneMappingEnabled = !lowEnd; ip.toneMappingType = 1; ip.vignetteEnabled = true; ip.vignetteWeight = 1.2; ip.vignetteColor = new B.Color4(0, 0, 0, 0); }
        } catch (e) {
            console.warn('[Stade 3D]', e);
        } finally {
            Object.keys(keep).forEach(k => S[k] = keep[k]);
            haloMatCache = keepHalo;
        }

        // Caméra : tour lent en vue aérienne ; on fait tourner au doigt, on zoome à deux doigts / molette.
        const sp = stadiumSpec(info);
        let ang = -Math.PI / 2 + 0.5, elev = 0.5, dist = sp.track ? 205 : sp.tier === 'large' ? 190 : sp.tier === 'medium' ? 165 : 140;
        const dMin = dist * 0.55, dMax = dist * 1.3;
        let drag = null, last = performance.now(), idleUntil = 0;
        const pts = new Map(); let pinch0 = 0;
        canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, e); drag = { x: e.clientX, y: e.clientY }; idleUntil = performance.now() + 4000; });
        canvas.addEventListener('pointermove', e => {
            if (!pts.has(e.pointerId)) return;
            pts.set(e.pointerId, e);
            if (pts.size === 2) {
                const [a, b] = [...pts.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
                if (pinch0) dist = clamp(dist * pinch0 / d, dMin, dMax);
                pinch0 = d; return;
            }
            if (!drag) return;
            ang -= (e.clientX - drag.x) * 0.008; elev = clamp(elev + (e.clientY - drag.y) * 0.004, 0.18, 1.2);
            drag = { x: e.clientX, y: e.clientY }; idleUntil = performance.now() + 4000;
        });
        const up = e => { pts.delete(e.pointerId); pinch0 = 0; if (!pts.size) drag = null; };
        canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
        canvas.addEventListener('wheel', e => { e.preventDefault(); dist = clamp(dist * (e.deltaY > 0 ? 1.08 : 0.93), dMin, dMax); idleUntil = performance.now() + 4000; }, { passive: false });
        const tgt = new B.Vector3(0, 4, 0);
        engine.runRenderLoop(() => {
            const t = performance.now(), dt = Math.min(0.05, (t - last) / 1000); last = t;
            if (!drag && t > idleUntil) ang += dt * 0.12;
            cam.position.set(Math.cos(ang) * Math.cos(elev) * dist, Math.sin(elev) * dist, Math.sin(ang) * Math.cos(elev) * dist);
            cam.setTarget(tgt);
            if (canvas.clientWidth && canvas.clientHeight) scene.render();
        });
        if (window.ResizeObserver) { PV.ro = new ResizeObserver(() => engine.resize()); PV.ro.observe(container); }
        PV.engine = engine; PV.canvas = canvas; PV.info = info;
        return true;
    }


    // =====================================================================
    // CINÉMATIQUE DE LANCEMENT — façon générique des anciens PES : un VRAI match
    // joué par le moteur (non jouable), filmé comme une retransmission de prestige.
    //   1. les projecteurs s'allument, drone qui plonge dans le stade du club ;
    //   2. les équipes sortent du tunnel en deux files ;
    //   3. l'entraîneur, au bord du terrain, donne ses consignes (celles de VOS tactiques) ;
    //   4. coup d'envoi, attaque, frappe au ralenti filmée derrière le but, filet, célébration ;
    //   5. grue qui s'élève, logo.
    // Moteur et scène séparés ; l'état du match (S) et le moteur de simulation (MATCHSIM)
    // sont prêtés pendant la séquence puis rendus intacts.
    // info : { home, away, stadium, capacity, sim: {...}, coach: [phrases], onCue(name, data) }
    // =====================================================================
    const IN = { engine: null, skip: null };
    function introSkip() { if (IN.skip) IN.skip(); }
    // Débogage : fait avancer la cinématique de ms millisecondes, image par image (30 i/s).
    function introStep(ms) {
        if (!IN.loop) return false;
        if (IN.fakeNow == null) IN.fakeNow = performance.now();
        for (let t = 0; t < ms && IN.loop; t += 33) { IN.fakeNow += 33; try { IN.loop(); } catch (e) { console.warn(e); return false; } }
        return true;
    }

    async function intro(container, info) {
        info = info || {};
        if (!container || !webglOK() || IN.engine) return false;
        const simOK = typeof MATCHSIM !== 'undefined' && !MATCHSIM.active && info.sim;
        try { await ensureBabylon(); } catch (e) { return false; }
        if (!container.isConnected) return false;
        const B = window.BABYLON_AECM;
        const lowEnd = detectLowEnd();
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;outline:none;touch-action:none';
        container.appendChild(canvas);
        const engine = new B.Engine(canvas, !lowEnd, { alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false, stencil: false }, false);
        const dpr = window.devicePixelRatio || 1;
        engine.setHardwareScalingLevel(1 / Math.max(1, lowEnd ? Math.min(dpr, 1.25) : Math.min(dpr, 2)));
        IN.engine = engine;
        const scene = new B.Scene(engine);
        scene.skipPointerMovePicking = true;
        const cam = new B.FreeCamera('inCam', new B.Vector3(-24, 1.4, -10), scene);
        cam.fov = 0.72; cam.minZ = 0.3; cam.maxZ = 1400;
        const hemi = new B.HemisphericLight('inHemi', new B.Vector3(0.2, 1, -0.3), scene);
        const sun = new B.DirectionalLight('inSun', new B.Vector3(-0.4, -1, 0.5), scene);

        // --- horloge virtuelle (ralentis) : partagée par le rendu ET le moteur de simulation ---
        let vt = performance.now(), scale = 1;
        const vclock = () => vt;

        // --- prêt de l'état du match et du moteur de simulation ---
        const saved = {}; Object.keys(S).forEach(k => { saved[k] = S[k]; });
        const keepHalo = haloMatCache;
        const simKeep = simOK ? { now: MATCHSIM.now, onCut: MATCHSIM.onCut, cond: MATCHSIM.cond, TICK: MATCHSIM.TICK } : null;
        Object.assign(S, {
            B, engine, scene, camera: cam, hemi, sun, container: null, canvas, rainEl: null, veil: null, sh: null,
            containers: {}, glbBytes: {}, clips: new Map(), libs: {}, players: { H: [], A: [] }, ref: null, bench: null, fx: null, mastHeads: [],
            matCache: new Map(), decorObjs: [], decor: {}, lights: [], timers: [], ready: false, enabled: true,
            teams: { home: info.home || null, away: info.away || null }, lowEnd, quality: 'far',
            condInfo: { weather: 'night', capacity: info.capacity || 12000, name: info.stadium || '', fill: 0.97 },
            nowFn: vclock, camMode: 'follow', camX: 0, camZ: 0, lastEvId: 0, lastT: 0
        });
        haloMatCache = null;
        let ro = null, simOn = false;
        const restore = () => {
            try { ro && ro.disconnect(); } catch (e) {}
            try { engine.stopRenderLoop(); engine.dispose(); } catch (e) {}
            try { canvas.remove(); } catch (e) {}
            if (simKeep) {
                try { if (simOn) MATCHSIM.stop(); } catch (e) {}
                MATCHSIM.now = simKeep.now; MATCHSIM.onCut = simKeep.onCut; MATCHSIM.cond = simKeep.cond; MATCHSIM.TICK = simKeep.TICK;
            }
            Object.keys(S).forEach(k => { if (!(k in saved)) delete S[k]; });
            Object.assign(S, saved);
            haloMatCache = keepHalo;
            IN.engine = null; IN.skip = null; IN.loop = null; IN.fakeNow = null;
        };

        const cue = (n, d) => { try { info.onCue && info.onCue(n, d); } catch (e) {} };
        const sfx = (n, ...a) => { try { if (typeof SFX !== 'undefined' && SFX[n]) SFX[n](...a); } catch (e) {} };
        let coach = null, extraLibs = null;
        try {
            try { buildFx(); } catch (e) {}                    // halo des projecteurs, fumigènes, feux d'artifice
            rebuildDecor();
            try { buildSurroundings(); } catch (e) {}
            try { buildGoals(); } catch (e) {}
            // vu du ciel, la nuit : toits et parvis éclairés par la ville, pas par le soleil
            const seen = new Set();
            scene.meshes.forEach(m => { const mt = m.material; if (!/^(roof\d|plaza)/.test(m.name) || !mt || seen.has(mt) || !mt.diffuseColor) return; seen.add(mt); mt.diffuseColor.scaleInPlace(0.4); });
            buildBall();
            S.ball.scaling.setAll(0.68); S.ballY0 = 0.116;    // taille réelle : ici la caméra est au ras des joueurs
            S.ball.position.set(0, 0.17, 0); S.ring.isVisible = false; S.ballShadow.position.set(0, 0.02, 0);
            const models = OUTFIELD_MODELS.concat(GK_MODELS, [REF_MODEL]);
            await Promise.all(models.map(async k => {
                S.containers[k] = await loadContainer(ROOT + 'personnages/far/' + k + '.glb', k);
            }));
            await loadLib('anim_football');
            // gardiens, gestes de l'entraîneur et célébrations : chargés pendant le début de la séquence
            extraLibs = Promise.all([loadLib('anim_goalkeeper'), loadLib('anim_celebration')]).catch(() => null);
            ['H', 'A'].forEach(side => {
                for (let i = 0; i < 11; i++) {
                    const P = makePlayer('in' + side + i, i === 0 ? GK_FOR[side] : OUTFIELD_MODELS[i % OUTFIELD_MODELS.length], i === 0);
                    S.players[side].push(P);
                }
            });
            S.ready = true;
            await applyKits();
            // l'entraîneur : le vrai modèle en costume (repli : gardien recoloré en sombre)
            try {
                S.containers['staff:coach_costume'] = await loadContainer(ROOT + 'staff/coach_costume.glb');
                coach = makePlayer('coach', 'staff:coach_costume', false);
            } catch (e) {
                coach = makePlayer('coach', GK_MODEL, false);
                try { const m = (await teamMaterial(GK_MODEL, '#111827')).mat; coach.meshes.forEach(x => { x.material = m; }); } catch (e2) {}
            }
            coach.holder.setEnabled(false);
            // l'arbitre
            if (simOK) {
                try { S.containers['staff:arbitre'] = await loadContainer(ROOT + 'staff/arbitre.glb'); S.ref = makePlayer('ref', 'staff:arbitre', false); }
                catch (e) { S.ref = makePlayer('ref', REF_MODEL, false); }
                S.ref.holder.setEnabled(false);
            }
            tunePlayerMats();
        } catch (e) {
            console.warn('[Intro 3D]', e);
            restore();
            return false;
        }
        if (!container.isConnected) { restore(); return false; }

        // --- projecteurs : éteints au départ, allumés un groupe après l'autre ---
        const th = S.theme;
        const halos = scene.meshes.filter(m => m.name.indexOf('halo') === 0);
        const groups = [[], [], [], []];
        halos.forEach(m => { groups[(m.position.x < 0 ? 0 : 2) + (m.position.z < 0 ? 0 : 1)].push(m); });
        const ORDER = [1, 3, 0, 2];
        halos.forEach(m => { m._k = m.visibility; m.visibility = 0; });
        const ip = scene.imageProcessingConfiguration;
        const EXPO = th.exposure, H0 = hemi.intensity, S0 = sun.intensity;

        // --- sortie du tunnel : deux files vers la caméra ---
        const HZt = PITCH_H / 2, HXt = PITCH_W / 2;
        const WALK_T0 = 1.5, WALK_SPD = 2.9, STOP_Z = 12, GAP = 1.55;
        ['H', 'A'].forEach((side, s) => S.players[side].forEach((P, k) => {
            P.lane = s ? 1.25 : -1.25; P.k = k;
            P.z0 = HZt + 4 + k * GAP; P.zStop = STOP_Z + k * GAP;
            P.x = P.lane; P.z = P.z0; P.yaw = Math.PI;
            P.holder.position.set(P.x, 0, P.z); P.holder.rotation.y = P.yaw;
            play(P, 'soccer_idle', true, 1, 0.01);
        }));
        const ease = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
        const lerp = (a, b, u) => a + (b - a) * u;
        const V = (x, y, z) => new B.Vector3(x, y, z);
        const lead = () => S.players.H[0].z;
        const WALK_SHOTS = [
            [0.0, 1.9, u => V(lerp(-24, -20, u), lerp(1.4, 2.0, u), lerp(-10, -6, u)), u => V(lerp(-62, -40, ease(u)), lerp(17, 13, u), 48)],
            [1.9, 4.6, u => { const a = lerp(-2.25, -1.62, ease(u)); const r = lerp(170, 58, ease(u)); return V(Math.cos(a) * r * 0.55, lerp(150, 24, ease(u)), Math.sin(a) * r); },
                       u => V(0, lerp(0, 2, u), lerp(4, 22, u))],
            [4.6, 7.4, u => V(lerp(-5.5, -4.2, u), 1.7, lead() - lerp(3.5, 1.5, u)), u => V(lerp(-1.2, 0.6, u), 1.55, lead() + lerp(3, 7, u))]
        ];
        const CUT_T = 7.4;                 // fondu au noir : on passe au match

        // --- entraîneur au bord du terrain, devant son banc ---
        const CX = -11.5, CZ = HZt + 0.9;
        // cadrage sur le BASSIN du squelette : ses gestes d'indication déplacent tout le corps (mouvement inclus dans le clip)
        const coachAt = () => { const h = coach && coach.bones && (coach.bones.get('mixamorig:Hips') || [...coach.bones.values()].find(n => /hips/i.test(n.name))); if (!h) return { x: CX, z: CZ }; const p = h.getAbsolutePosition(); return { x: p.x, z: p.z }; };
        const cc = { x: CX, z: CZ };
        const coachCam = (u) => { const a = coachAt(); if (!cc.init) { cc.init = true; cc.x = a.x; cc.z = a.z; } cc.x += (a.x - cc.x) * 0.12; cc.z += (a.z - cc.z) * 0.12; cam.position.set(cc.x + lerp(2.6, 2.1, u), 1.58, cc.z - lerp(3.0, 2.5, u)); cam.setTarget(V(cc.x - 0.2, 1.38, cc.z)); };
        const coachLines = (info.coach && info.coach.length ? info.coach : ['Restez compacts !', 'On joue simple, on joue vite !']).slice(0, 3);

        // --- scénario du match (temps virtuel en ms depuis le coup d'envoi) ---
        let G0 = 0, nextTick = 0, step = 0, shotSeen = 0, goalAt = 0, slowUntil = 0, celebAt = 0;
        function startSim() {
            if (!simOK) return false;
            try {
                MATCHSIM.now = vclock; MATCHSIM.onCut = null; MATCHSIM.cond = null;
                MATCHSIM.TICK = 2600;
                MATCHSIM.init(info.sim);
                simOn = true;
                S.lastEvId = MATCHSIM.evSeq || 0;
                ['H', 'A'].forEach(k => S.players[k].forEach(P => { P.init = false; P.smx = null; P.once = null; P.moving = false; P.holder.rotation.x = 0; }));
                if (S.ref) S.ref.holder.setEnabled(true);
                MATCHSIM.director('center'); MATCHSIM.hold(MATCHSIM.TICK * 1.1);
                G0 = vt; nextTick = vt + MATCHSIM.TICK * 1.1;
                return true;
            } catch (e) { console.warn('[Intro 3D] simulation', e); simOn = false; return false; }
        }
        const order = (st, opts, dur) => {
            try { MATCHSIM.director(st, opts); const d = dur || MATCHSIM.TICK; if (!(MATCHSIM.holdUntil && MATCHSIM.holdUntil > MATCHSIM.now() + d)) MATCHSIM.hold(d); nextTick = vt + d; } catch (e) {}
        };
        // caméras du match
        const cs = { x: 0, y: 8, z: -20, tx: 0, ty: 1, tz: 0 };
        const glide = (dt, p, l, k) => {
            const a = 1 - Math.exp(-dt * (k || 4));
            cs.x += (p.x - cs.x) * a; cs.y += (p.y - cs.y) * a; cs.z += (p.z - cs.z) * a;
            cs.tx += (l.x - cs.tx) * a; cs.ty += (l.y - cs.ty) * a; cs.tz += (l.z - cs.tz) * a;
            cam.position.set(cs.x, cs.y, cs.z); cam.setTarget(V(cs.tx, cs.ty, cs.tz));
        };
        const snapCam = (p, l) => { cs.x = p.x; cs.y = p.y; cs.z = p.z; cs.tx = l.x; cs.ty = l.y; cs.tz = l.z; cam.position.copyFrom(p); cam.setTarget(l); };
        let camShot = '', camShotT = 0;
        const cutTo = (name) => { if (camShot !== name) { camShot = name; camShotT = vt; return true; } return false; };

        return new Promise(resolve => {
            let t0 = 0, done = false, last = 0, ci = 0, lit = 0, phase = 'walk', blackAt = 0, endAt = 0, coachLine = -1, libsReady = false, libsHooked = false;
            const finish = () => { if (done) return; done = true; cue('end'); setTimeout(() => { restore(); resolve(true); }, 650); };
            IN.skip = finish;
            const WALK_CUES = [[0.25, 'start'], [2.0, 'stadium'], [4.7, 'teams']];

            // l'entraîneur : gestes d'indication (gardien « qui dirige »), tourné vers le jeu
            const coachStep = (dt) => {
                if (!coach || !coach.holder.isEnabled()) return;
                const t = vt;
                if (!coach.once) {
                    const busy = (t / 1000) % 4.2;
                    const clip = celebAt && t - celebAt < 3000 ? null
                        : busy < 2.6 ? (has('gk_directing') ? 'gk_directing' : 'offensive_idle') : (has('gk_directing_2') ? 'gk_directing_2' : 'soccer_idle');
                    if (clip) play(coach, clip, true, 1, 0.3);
                }
                const bx = S.ball ? S.ball.position.x : 0, bz = S.ball ? S.ball.position.z : 0;
                // face à la caméra de trois quarts (tourné vers son équipe) pendant ses consignes, sinon vers le ballon
                const want = (camShot === 'coach' || camShot === 'coachjoy') ? Math.atan2(cam.position.x - CX, cam.position.z - CZ) - 0.55 : Math.atan2(bx - CX, bz - CZ);
                coach.yaw = (coach.yaw == null ? Math.PI : coach.yaw) + angDiff(coach.yaw == null ? Math.PI : coach.yaw, want) * Math.min(1, dt * 3);
                coach.holder.position.set(CX + Math.sin(t / 1700) * 0.25, 0, CZ); coach.holder.rotation.y = coach.yaw;
                stepFade(coach, dt);
            };

            // caméra pendant le match (appelée par frame() à la place de la caméra de retransmission)
            S.camHook = (dt, bx, bz, carrier) => {
                const G = vt - G0;
                if (goalAt && vt > goalAt + 3600 && celebAt === 0) { celebAt = vt; }
                if (endAt && vt >= endAt) {                                  // grue finale + logo
                    const u = clamp((vt - endAt) / 4200, 0, 1);
                    if (cutTo('crane')) snapCam(V(0, 2.2, -16), V(0, 1.6, 4));
                    cam.position.set(lerp(0, 2, u), lerp(2.2, 36, ease(u)), lerp(-16, -84, ease(u))); cam.setTarget(V(0, lerp(1.6, 3, u), lerp(4, 10, u)));
                    return;
                }
                if (celebAt && vt - celebAt < 2200) {                       // l'entraîneur exulte
                    if (cutTo('coachjoy')) { cue('coachjoy'); const c = CELEBRATIONS.find(has) || (has('gk_directing_2') ? 'gk_directing_2' : null); if (coach && c) playOnce(coach, c, 1, { fade: 0.15, max: 2200 }); }
                    coachCam(0.5); return;
                }
                if (goalAt && vt >= goalAt) {                                // célébration : caméra serrée sur le buteur
                    const P = S.players.H[MATCHSIM.lastShooter != null ? MATCHSIM.lastShooter : 9] || carrier;
                    if (P) {
                        const ang = (vt - goalAt) / 2600;
                        const p = V(P.x + Math.cos(ang) * 4.2, 1.5, P.z - 3.6 + Math.sin(ang) * 1.2), l = V(P.x, 1.15, P.z);
                        if (cutTo('celeb')) snapCam(p, l); else glide(dt, p, l, 3);
                    }
                    return;
                }
                if (shotSeen) {                                              // frappe : derrière le but, au ralenti
                    const gx = HXt + 3.3;                          // juste derrière le filet, devant les panneaux
                    const p = V(gx, 1.85, clamp(bz * 0.4, -5, 5)), l = V(bx, 0.9, bz);
                    if (cutTo('goalcam')) snapCam(p, l); else glide(dt, p, l, 6);
                    return;
                }
                if (G < 2600) { coachCam(clamp(G / 2600, 0, 1)); cutTo('coach'); return; }          // consignes de l'entraîneur
                if (G < 6200) {                                              // plan large de retransmission
                    if (cutTo('tv')) { S.camX = bx; S.camZ = 0; S.camSnap = true; }
                    updateCamera(dt, bx, bz); return;
                }
                // travelling au ras de la pelouse, le long de la touche, à hauteur du porteur
                const tx = carrier ? carrier.x : bx, tz = carrier ? carrier.z : bz;
                const p = V(tx - 7.5, 1.35, tz - 8.5), l = V(tx + 2.5, 1.0, tz);
                if (cutTo('low')) snapCam(p, l); else glide(dt, p, l, 3.5);
            };

            const loopFn = () => {
                const nowT = IN.fakeNow != null ? IN.fakeNow : performance.now();       // débogage : temps simulé (introStep)
                if (!t0) { t0 = nowT; last = nowT; vt = nowT; }
                const rdt = Math.min(0.05, (nowT - last) / 1000); last = nowT;
                vt += rdt * 1000 * scale;
                scene.animationTimeScale = scale;
                const T = (nowT - t0) / 1000, dt = rdt * scale;

                if (phase === 'walk') {
                    while (ci < WALK_CUES.length && T >= WALK_CUES[ci][0]) { cue(WALK_CUES[ci][1]); ci++; }
                    const want = Math.min(4, Math.floor((T - 0.35) / 0.32) + 1);
                    while (lit < want && lit < 4) { groups[ORDER[lit]].forEach(m => { m.visibility = m._k * 1.6; m._flash = nowT; }); cue('light', lit); lit++; }
                    halos.forEach(m => { if (m._flash) { const e = (nowT - m._flash) / 300; if (e >= 1) { m.visibility = m._k; m._flash = 0; } else m.visibility = m._k * (1 + 0.6 * (1 - e)); } });
                    const on = Math.min(1, Math.max(0, (T - 0.3) / 1.4));
                    if (ip) ip.exposure = lerp(0.12, EXPO, ease(on));
                    hemi.intensity = lerp(H0 * 0.25, H0, on); sun.intensity = lerp(0, S0, on);
                    ['H', 'A'].forEach(side => S.players[side].forEach(P => {
                        P.z = Math.max(P.zStop, P.z0 - WALK_SPD * Math.max(0, T - WALK_T0));
                        const walking = T >= WALK_T0 && P.z > P.zStop + 0.02;
                        if (walking) { P.x = P.lane + Math.sin((T + P.k) * 1.7) * 0.05; play(P, 'jog_forward', true, WALK_SPD / JOG_SPEED * 0.92, 0.25); }
                        else if (T >= WALK_T0) play(P, P.isGK && has('gk_idle') ? 'gk_idle' : 'soccer_idle', true, 1, 0.35);
                        P.holder.position.set(P.x, 0, P.z); P.holder.rotation.y = P.yaw;
                        stepFade(P, dt);
                    }));
                    let sh = WALK_SHOTS[WALK_SHOTS.length - 1];
                    for (const s of WALK_SHOTS) { if (T < s[1]) { sh = s; break; } }
                    const u = clamp((T - sh[0]) / (sh[1] - sh[0]), 0, 1), p = sh[2](u), l = sh[3](u);
                    const wob = 0.05 * Math.sin(T * 1.3) + 0.03 * Math.sin(T * 2.7);
                    cam.position.set(p.x + wob, p.y + wob * 0.6, p.z); cam.setTarget(l);
                    if (canvas.clientWidth && canvas.clientHeight) scene.render();
                    if (T >= CUT_T) { phase = 'black'; blackAt = nowT; cue('black'); }
                    return;
                }

                if (phase === 'black') {
                    // sous le noir : placement des équipes pour le coup d'envoi, entraîneur au bord du terrain
                    if (nowT - blackAt < 380) { if (canvas.clientWidth) scene.render(); return; }
                    if (extraLibs && !libsReady) { if (!libsHooked) { libsHooked = true; extraLibs.then(() => { libsReady = true; }); } if (nowT - blackAt < 4000) return; }
                    if (coach) { coach.holder.setEnabled(true); coach.yaw = Math.PI; }
                    if (!startSim()) { phase = 'end'; endAt = vt; cue('logo'); return; }
                    sfx('whistle');
                    phase = 'match'; cue('match');
                    coachLine = -1;
                    return;
                }

                if (phase === 'match' || phase === 'end') {
                    const G = vt - G0;
                    // consignes : une phrase après l'autre pendant le plan sur l'entraîneur
                    const li = Math.floor((G + 200) / 1300);
                    if (G < 2600 && li !== coachLine && li < coachLines.length) { coachLine = li; cue('coach', coachLines[li]); }
                    if (G >= 2600 && coachLine !== 99) { coachLine = 99; cue('coachoff'); }
                    // ordres au moteur, comme le ferait le match : engagement, attaque, frappe
                    if (step === 0 && G > 1400) { step = 1; order('home_attack'); }
                    else if (step === 1 && G > 1400 + MATCHSIM.TICK) { step = 2; order('home_attack'); }
                    else if (step === 2 && G > 1400 + MATCHSIM.TICK * 2.1) {
                        step = 3; order('home_shot', { shooterIdx: 9 });
                        try { MATCHSIM.setShotOutcome('goal'); } catch (e) {}
                        const eta = Math.max(0, MATCHSIM.shotEta());
                        goalAt = vt + Math.max(400, eta - 200);
                    }
                    if (simOn && vt >= nextTick && step < 4) { try { MATCHSIM.tick(); } catch (e) {} nextTick = vt + MATCHSIM.TICK; }
                    // frappe repérée : ralenti jusqu'au fond des filets
                    if (step === 3 && !shotSeen && (MATCHSIM.evq || []).some(e => e.type === 'shot' && e.id > (G0 ? 0 : 0) && e.t >= G0)) { shotSeen = vt; scale = 0.32; sfx('kick'); cue('slowmo'); }
                    if (step === 3 && goalAt && vt >= goalAt) {
                        step = 4; scale = 1;
                        try { MATCHSIM.note('goal', 'H', MATCHSIM.lastShooter != null ? MATCHSIM.lastShooter : 9); MATCHSIM.celebrate('H', MATCHSIM.lastShooter != null ? MATCHSIM.lastShooter : 9, 3800); } catch (e) {}
                        sfx('goal');
                        let scorer = ''; try { scorer = (MATCHSIM.team('H').names || [])[MATCHSIM.lastShooter != null ? MATCHSIM.lastShooter : 9] || ''; } catch (e) {}
                        cue('goal', scorer);
                    }
                    if (step === 4 && !endAt && celebAt && vt - celebAt > 2200) { endAt = vt; cue('logo'); }
                    if (endAt && vt - endAt > 3000 && ci < 99) { ci = 99; cue('tap'); }
                    if (endAt && vt - endAt > 8000) finish();
                    // le moteur de simulation continue après le but (retour au rond central)
                    if (step === 4 && vt >= nextTick) { try { MATCHSIM.tick(); } catch (e) {} nextTick = vt + MATCHSIM.TICK; }
                    coachStep(dt);
                    if (simOn) { try { frame(); } catch (e) { console.warn('[Intro 3D] image', e); } }
                    else { S.camHook(dt, 0, 0, null); if (canvas.clientWidth) scene.render(); }       // sans simulation : grue + logo seuls
                }
            };
            IN.loop = loopFn;
            engine.runRenderLoop(loopFn);
            if (window.ResizeObserver) { ro = new ResizeObserver(() => engine.resize()); ro.observe(container); }
        });
    }

    window.Match3D = { _fx: { goal: (s) => fxGoal(s), smoke: (s, n) => fxSmoke(s, n) }, attach, setTeams, substitute, setConditions, preview, start, pause, setEnabled, stadiumPreview, stopStadiumPreview, intro, introSkip, introStep, _S: S };
})();
