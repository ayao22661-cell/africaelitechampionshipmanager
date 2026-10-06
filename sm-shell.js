/* =====================================================================
 * AECM — sm-shell.js
 * Coquille paysage des écrans de gestion (voir sm-shell.css).
 *   - html.land quand l'écran est plus large que haut ;
 *   - menu latéral complet (toutes les sections, regroupées) ;
 *   - barre du haut : retour, recherche, monnaies, bouton « Continuer » ;
 *   - historique de navigation pour le bouton retour.
 * Ne remplace aucune logique du jeu : tout passe par app.switchView,
 * app.openGlobalSearch, app.startSimulationSequence, app.openOffice.
 * ===================================================================== */
(function () {
    'use strict';
    const tr = (s) => { try { return typeof t === 'function' ? t(s) : s; } catch (e) { return s; } };

    function setLand() {
        const land = window.innerWidth > window.innerHeight && window.innerWidth >= 600;
        document.documentElement.classList.toggle('land', land);
        if (typeof placeTierBar === 'function') try { placeTierBar(); } catch (e) {}
    }
    setLand();
    window.addEventListener('resize', setLand);
    window.addEventListener('orientationchange', () => setTimeout(setLand, 120));

    // Icônes (24x24). Reprises du menu d'origine quand elles existent.
    const P = {
        dashboard: 'M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z',
        inbox: 'M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4M12,11L20,6H4L12,11M4,18H20V8.33L12,13.33L4,8.33V18Z',
        tactics: 'M21 3H3C2 3 1 4 1 5V19C1 20 2 21 3 21H21C22 21 23 20 23 19V5C23 4 22 3 21 3M21 19H3V5H21V19M7 11C5.9 11 5 11.9 5 13S5.9 15 7 15 9 14.1 9 13 8.1 11 7 11M11 7C9.9 7 9 7.9 9 9S9.9 11 11 11 13 10.1 13 9 12.1 7 11 7M15 11C13.9 11 13 11.9 13 13S13.9 15 15 15 17 14.1 17 13 16.1 11 15 11M19 7C17.9 7 17 7.9 17 9S17.9 11 19 11 21 10.1 21 9 20.1 7 19 7Z',
        squad: 'M21.9 7.4L16 3H8L2.1 7.4C1.6 7.8 1.4 8.5 1.7 9.1L3.6 13.5C3.8 14 4.5 14.2 5 13.9L8 11.8V20C8 20.6 8.4 21 9 21H15C15.6 21 16 20.6 16 20V11.8L19 13.9C19.5 14.3 20.2 14.1 20.4 13.5L22.3 9.1C22.6 8.5 22.4 7.8 21.9 7.4Z',
        training: 'M12,2L16,8H13V14H11V8H8L12,2M4,16H20V18H4V16M2,20H22V22H2V20Z',
        market: 'M3,6H21V8H3V6M5,10H19L18,20H6L5,10M9,12V18H11V12H9M13,12V18H15V12H13M8,2H16V4H8V2Z',
        manager: 'M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z',
        standings: 'M7,13H21V11H7M7,19H21V17H7M7,7H21V5H7M2,11H3.8L2,13.1V14H5V13H3.2L5,10.9V10H2M3,8H4V4H2V5H3M2,17H4V17.5H3V18.5H4V19H2V20H5V16H2V17Z',
        caf: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4.5L14.4,6.2L13.5,9H10.5L9.6,6.2L12,4.5M6,8.5L8.5,9.5L9.3,12.3L7.5,14.6L4.6,14A7.6,7.6 0 0,1 6,8.5M18,8.5A7.6,7.6 0 0,1 19.4,14L16.5,14.6L14.7,12.3L15.5,9.5L18,8.5M10.4,14.5H13.6L15,17.6L12,19.5L9,17.6L10.4,14.5Z',
        awards: 'M12,15C8.7,15 6,12.3 6,9V3H18V9C18,12.3 15.3,15 12,15M12,17C13,17 13,19 13,19V21H16A1,1 0 0,1 17,22H7A1,1 0 0,1 8,21H11V19C11,19 11,17 12,17M4,4H2V9A3,3 0 0,0 5,12V10A1,1 0 0,1 4,9V4M20,4H22V9A3,3 0 0,1 19,12V10A1,1 0 0,0 20,9V4Z',
        legacy: 'M12,2L15,8L22,9L17,14L18,21L12,18L6,21L7,14L2,9L9,8L12,2Z',
        campus: 'M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7Z',
        staff: 'M16 11C17.66 11 18.9 9.66 18.9 8C18.9 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11M8 11C9.66 11 10.9 9.66 10.9 8C10.9 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11M16 13C13.67 13 9 14.17 9 16.5V19H23V16.5C23 14.17 18.33 13 16 13M8 13C7.6 13 7.15 13.04 6.67 13.12C8.28 14.08 9.5 15.34 9.5 17.5V19H1.41L1.24 18.84C1.1 18.35 1 17.7 1 16.5C1 14.17 5.67 13 8 13Z',
        academy: 'M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z',
        shop: 'M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z',
        settings: 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97L21.54,14.63C21.73,14.78 21.78,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.03 19.05,18.95L16.56,17.94C16.04,18.34 15.5,18.67 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.22,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.22,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.78,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,12.97Z',
        office: 'M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z'
    };
    // Sections, dans l'ordre des jeux de gestion : le club au quotidien, puis les compétitions, puis les installations.
    const GROUPS = [
        [['dashboard', 'Accueil'], ['inbox', 'Messagerie'], ['tactics', 'Tactique'], ['squad', 'Effectif'],
         ['training', 'Entraînement'], ['market', 'Mercato'], ['manager', 'Manager']],
        [['standings', 'Compétition'], ['caf', 'Coupes africaines'], ['awards', 'Palmarès'], ['legacy', 'Héritage']],
        [['campus', 'Campus'], ['staff', 'Encadrement'], ['academy', 'Académie'], ['shop', 'Boutique']]
    ];
    const svg = (d, cls) => `<svg class="${cls || 'sm-ico'}" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
    const CHEV = '<svg class="sm-chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function buildSide() {
        const aside = document.querySelector('body > aside, aside.hidden.lg\\:flex') || document.querySelector('aside');
        if (!aside || aside.dataset.sm) return;
        aside.dataset.sm = '1';
        aside.classList.add('sm-side');
        let html = `<div class="sm-side-brand">${svg(P.awards, 'sm-ico')}<b>AECM<i>26</i></b></div><nav class="sm-side-nav" aria-label="${tr('Navigation principale')}">`;
        GROUPS.forEach((g, gi) => {
            if (gi) html += '<div class="sm-sep"></div>';
            g.forEach(([id, label]) => {
                html += `<button type="button" class="sm-item p-3" data-target="${id}" onclick="app.switchView('${id}')">${svg(P[id])}<span>${tr(label)}</span>${id === 'inbox' ? '<span class="sm-badge" id="sm-inbox-badge" hidden></span>' : ''}${CHEV}</button>`;
            });
        });
        html += `</nav><div class="sm-side-foot">
            <button type="button" onclick="app.switchView('settings')" title="${tr('Paramètres')}" data-target="settings">${svg(P.settings, '')}</button>
            <button type="button" onclick="app.openOffice && app.openOffice()" title="${tr('Bureau du club')}">${svg(P.office, '')}</button>
            <button type="button" onclick="app.openGlobalSearch && app.openGlobalSearch()" title="${tr('Rechercher')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg></button>
        </div>`;
        aside.innerHTML = html;
        placeTierBar();
    }

    // En paysage, la barre de progression de carrière se range sous le logo du menu (chaque pixel de hauteur compte).
    let tierHome = null;
    function placeTierBar() {
        const tb = document.getElementById('tier-bar'), aside = document.querySelector('aside.sm-side');
        if (!tb || !aside) return;
        if (!tierHome) tierHome = { parent: tb.parentNode, next: tb.nextSibling };
        const land = document.documentElement.classList.contains('land');
        if (land && tb.parentNode !== aside) aside.insertBefore(tb, aside.children[1] || null);
        else if (!land && tb.parentNode === aside) tierHome.parent.insertBefore(tb, tierHome.next);
    }

    function buildHeader() {
        const head = document.getElementById('main-header');
        if (!head || head.dataset.sm) return;
        head.dataset.sm = '1';
        // bouton retour, avant l'écusson
        const left = head.firstElementChild;
        const back = document.createElement('button');
        back.type = 'button'; back.className = 'sm-back sm-only'; back.id = 'sm-back';
        back.setAttribute('aria-label', tr('Retour'));
        back.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        back.onclick = goBack;
        if (left) left.prepend(back);
        // à droite : recherche, monnaies, « Continuer »
        const right = head.lastElementChild;
        if (right) right.classList.add('sm-hide');
        const box = document.createElement('div');
        box.className = 'sm-only'; box.style.cssText = 'align-items:center;gap:8px;align-self:stretch;flex:0 1 auto;min-width:0';
        box.innerHTML = `
            <button type="button" class="sm-search sm-only" onclick="app.openGlobalSearch && app.openGlobalSearch()"><span>${tr('Rechercher')}</span><i><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg></i></button>
            <div class="sm-pills sm-only">
              <button type="button" class="sm-pill sm-only" onclick="app.switchView('shop')" title="${tr('Crédits')}"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#f59e0b"/><path d="M9 9h6M9 12h6M9 15h6" stroke="#7c2d12" stroke-width="1.6"/></svg><span id="sm-credits">0</span><span class="sm-plus">+</span></button>
              <button type="button" class="sm-pill sm-only" onclick="app.switchView('shop')" title="${tr('Gemmes')}"><svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z" fill="#38bdf8"/><path d="M2 9h20M9 3l3 18 3-18" stroke="#0a0e17" stroke-width=".8" fill="none"/></svg><span id="sm-gems">0</span><span class="sm-plus">+</span></button>
              <button type="button" class="sm-pill sm-only" onclick="app.openOffice && app.openOffice()" title="${tr('Budget')}"><svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" fill="#10b981"/><circle cx="12" cy="12" r="3" fill="#0a0e17"/></svg><span id="sm-budget">0</span><span class="sm-plus">+</span></button>
            </div>
            <button type="button" class="sm-continue sm-only" id="sm-continue" onclick="window.AECMShell.continue()">
              <span class="sm-c-txt"><b>${tr('Continuer')}</b><small id="sm-continue-date">—</small></span>
              <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>`;
        head.appendChild(box);
    }

    // ---- Historique (bouton retour) -----------------------------------
    const hist = [];
    let cur = 'dashboard', going = false;
    function goBack() {
        if (!hist.length || !window.app) return;
        going = true;
        try { app.switchView(hist.pop()); } finally { going = false; }
        sync();
    }
    function hookApp() {
        if (!window.app || app.__smHooked) return false;
        app.__smHooked = true;
        const sv = app.switchView.bind(app);
        app.switchView = function (id) {
            const before = cur;
            // le stade 3D du Campus ne tourne que quand on le regarde
            if (id !== 'campus' && window.Match3D && Match3D.stopStadiumPreview) try { Match3D.stopStadiumPreview(); } catch (e) {}
            const r = sv(id);
            if (id !== 'inbox' && id !== before && document.getElementById('view-' + id) && !document.getElementById('view-' + id).classList.contains('hidden-view')) {
                if (!going && before) { hist.push(before); if (hist.length > 30) hist.shift(); }
                cur = id;
            }
            sync();
            return r;
        };
        const uh = app.updateHeader && app.updateHeader.bind(app);
        if (uh) app.updateHeader = function () { const r = uh(); sync(); return r; };
        return true;
    }

    function fmt(n) { n = Math.round(n || 0); return n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : String(n); }
    function sync() {
        const a = window.app; if (!a) return;
        const set = (id, v) => { const el = document.getElementById(id); if (el && el.textContent !== v) el.textContent = v; };
        set('sm-credits', fmt(a.credits));
        set('sm-gems', fmt(a.gems));
        const hb = document.getElementById('header-budget'); if (hb) set('sm-budget', hb.textContent);
        const hm = document.getElementById('header-matchday'); if (hm) set('sm-continue-date', hm.textContent);
        const back = document.getElementById('sm-back'); if (back) back.disabled = !hist.length;
        const nb = document.getElementById('notification-badge'), sb = document.getElementById('sm-inbox-badge');
        if (nb && sb) { sb.textContent = nb.textContent; sb.hidden = nb.classList.contains('hidden') || !nb.textContent || nb.textContent === '0'; }
        const vm = document.getElementById('view-match');
        setInMatch(!!vm && !vm.classList.contains('hidden-view'));
        // l'élément actif du menu suit la vue affichée
        document.querySelectorAll('aside.sm-side .sm-item').forEach(b => b.classList.toggle('is-active', b.dataset.target === cur));
    }

    // ---- Match en paysage : rail d'actions, bandeau du direct --------------
    const RAIL = [
        ['tac', 'Tactique', P.tactics, false],
        ['subs', 'Changer', 'M7 7h10l-3-3m3 13H7l3 3', true],
        ['commentary', 'Direct', 'M4 5h16v11H8l-4 4z', true],
        ['stats', 'Stats', 'M5 20V10M12 20V4M19 20v-7', true],
        ['ratings', 'Notes', 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z', false],
        ['heat', 'Zones', 'M3 5h18v14H3zM12 5v14M3 12h18', true]
    ];
    function buildMatchHud() {
        const vm = document.getElementById('view-match');
        if (!vm || document.getElementById('sm-rail')) return;
        const rail = document.createElement('div');
        rail.className = 'sm-rail'; rail.id = 'sm-rail';
        rail.innerHTML = RAIL.map(([id, label, d, stroke]) =>
            `<button type="button" data-r="${id}"><svg viewBox="0 0 24 24" ${stroke ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' : 'fill="currentColor"'}><path d="${d}"/></svg>${tr(label)}</button>`).join('');
        rail.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b || !window.app) return;
            const r = b.dataset.r, root = document.documentElement;
            if (r === 'tac') { app.toggleLiveTacticsModal && app.toggleLiveTacticsModal(); return; }
            if (r === 'subs') { app.showSubstitutions && app.showSubstitutions(); return; }
            const open = root.classList.contains('sm-panel-open') && app._matchTab === r;
            root.classList.toggle('sm-panel-open', !open);
            if (!open) app.switchMatchTab(r);
            syncRail();
        });
        vm.appendChild(rail);
        const tk = document.createElement('div');
        tk.className = 'sm-ticker'; tk.id = 'sm-ticker';
        vm.appendChild(tk);
        const lc = document.getElementById('live-commentary');
        if (lc && window.MutationObserver) new MutationObserver(updTicker).observe(lc, { childList: true });
    }
    function syncRail() {
        const open = document.documentElement.classList.contains('sm-panel-open');
        document.querySelectorAll('#sm-rail button').forEach(b => b.classList.toggle('is-on', open && !!window.app && app._matchTab === b.dataset.r));
    }
    const esc = s => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    function updTicker() {
        const tk = document.getElementById('sm-ticker'), lc = document.getElementById('live-commentary');
        if (!tk || !lc) return;
        const row = lc.firstElementChild;
        if (!row) { tk.textContent = ''; return; }
        const min = row.querySelector('span'), m = min ? min.textContent.trim() : '';
        const txt = row.textContent.trim().slice(m.length).trim();
        tk.innerHTML = (m ? `<span class="op">${esc(m)}</span>` : '') + esc(txt);
    }
    // Barre des joueurs en bas du match : poste, nom, énergie, note en direct (même calcul que l'onglet Notes).
    function renderStrip() {
        const a = window.app, lm = a && a.liveMatch;
        let el = document.getElementById('sm-strip');
        if (!lm || !document.documentElement.classList.contains('in-match')) return;
        if (!el) {
            el = document.createElement('div'); el.id = 'sm-strip'; el.className = 'sm-strip';
            el.innerHTML = '<button type="button" class="sm-strip-tog" aria-label="Effectif"><svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg><span id="sm-strip-subs"></span></button><div class="sm-strip-row" id="sm-strip-row"></div>';
            el.querySelector('.sm-strip-tog').onclick = () => document.documentElement.classList.toggle('sm-strip-min');
            (document.getElementById('view-match') || document.body).appendChild(el);
        }
        let ctx = null; try { ctx = a.ratingContext ? a.ratingContext(false) : null; } catch (e) {}
        const starters = (ctx && ctx.starters) || (lm.home.isUser ? lm.homeStarters : lm.awayStarters) || [];
        const row = document.getElementById('sm-strip-row');
        row.innerHTML = starters.slice(0, 11).map(p => {
            let n = null; try { n = ctx ? a.computePlayerRating(p, ctx) : null; } catch (e) {}
            const en = Math.round(p.energy ?? 100), ec = en > 70 ? '#10b981' : en > 45 ? '#f59e0b' : '#ef4444';
            const cls = n == null ? '' : n >= 7.5 ? 'is-great' : n >= 6.5 ? 'is-good' : n >= 5.5 ? 'is-ok' : 'is-bad';
            let pos = ''; try { pos = playerRole(p).short; } catch (e) { pos = p.position || ''; }
            const card = p.redThisMatch ? '<i class="rc"></i>' : p.yellowThisMatch ? '<i class="yc"></i>' : '';
            return `<div class="sm-pl" onclick="app.showSubstitutions && app.showSubstitutions()">
                <b class="sm-pl-pos">${esc(pos)}</b>
                <span class="sm-pl-name">${esc(String(p.name || '').split(' ').pop())}${card}</span>
                <svg class="sm-pl-en" viewBox="0 0 24 24" style="color:${ec}"><path d="M12 21s-7-4.4-9.3-8.6C1 9 3 5 6.8 5c2 0 3.4 1.2 5.2 3 1.8-1.8 3.2-3 5.2-3C21 5 23 9 21.3 12.4 19 16.6 12 21 12 21z"/></svg>
                <span class="sm-pl-note ${cls}">${n == null ? '—' : n.toFixed(1)}</span>
            </div>`;
        }).join('');
        const side = lm.home.isUser ? 'home' : 'away';
        const made = (lm.subsMade && lm.subsMade[side]) || 0, max = a.subsAllowed ? a.subsAllowed() : 5;
        const sb = document.getElementById('sm-strip-subs'); if (sb) sb.textContent = `${max - made}/${max} ${tr('Changements')}`;
    }

    // Carte du buteur : à chaque but (événement « goal » du moteur de placement).
    let lastGoalEv = 0;
    function watchGoals() {
        const M = (typeof MATCHSIM !== "undefined") ? MATCHSIM : null, a = window.app;
        if (!M || !M.active || !a || !a.liveMatch) return;
        (M.evq || []).forEach(ev => {
            if (ev.type !== 'goal' || ev.id <= lastGoalEv) return;
            lastGoalEv = ev.id;
            const lm = a.liveMatch, slots = lm.simSlots && lm.simSlots[ev.side];
            const p = slots && ev.idx != null ? slots[ev.idx] : null;
            const club = ev.side === 'H' ? lm.home : lm.away;
            showGoalCard(p, club, a.matchClock ? a.matchClock() : (lm.minute + "'"), `${lm.homeScore} - ${lm.awayScore}`);
        });
    }
    function showGoalCard(p, club, minute, score) {
        let el = document.getElementById('sm-goal');
        if (!el) { el = document.createElement('div'); el.id = 'sm-goal'; el.className = 'sm-goal'; (document.getElementById('view-match') || document.body).appendChild(el); }
        let face = ''; try { face = p ? playerFaceSVG(p) : ''; } catch (e) {}
        let crest = ''; try { crest = club ? clubCrestSVG(club.name) : ''; } catch (e) {}
        el.innerHTML = `<span class="sm-goal-face">${face || crest}</span>
            <span class="sm-goal-txt"><b>${esc(p ? p.name : (club ? club.name : ''))}</b><em>${tr('BUT !')}</em><small>${esc(minute)} · ${esc(score)}</small></span>
            <span class="sm-goal-crest">${crest}</span>`;
        el.classList.remove('is-on'); void el.offsetWidth; el.classList.add('is-on');
        clearTimeout(showGoalCard._t); showGoalCard._t = setTimeout(() => el.classList.remove('is-on'), 4200);
    }

    function setInMatch(on) {
        const root = document.documentElement, was = root.classList.contains('in-match');
        root.classList.toggle('in-match', !!on);
        if (on && !was) lastGoalEv = (typeof MATCHSIM !== "undefined" && MATCHSIM.evSeq) || 0;   // pas de carte pour les buts d'un match précédent
        if (!on) root.classList.remove('sm-panel-open');
        if (was !== !!on) setTimeout(() => { try { window.Match3D && Match3D._S && Match3D._S.engine && Match3D._S.engine.resize(); } catch (e) {} }, 60);
    }

    window.AECMShell = {
        // « Continuer » : même action que le bouton principal du tableau de bord (jouer la journée)
        continue() {
            const a = window.app; if (!a) return;
            if (cur !== 'dashboard') { a.switchView('dashboard'); return; }
            if (typeof a.startSimulationSequence === 'function') a.startSimulationSequence();
        },
        sync, back: goBack
    };

    function boot() {
        buildSide(); buildHeader(); buildMatchHud();
        if (!hookApp()) { const id = setInterval(() => { if (hookApp()) { clearInterval(id); sync(); } }, 200); }
        sync();
        setInterval(sync, 1500);
        // match : notes et buts suivis en continu (léger : 11 lignes, quelques événements)
        setInterval(() => { try { if (document.documentElement.classList.contains('in-match')) { renderStrip(); watchGoals(); } } catch (e) {} }, 1000);
        setInterval(() => { try { if (document.documentElement.classList.contains('in-match')) watchGoals(); } catch (e) {} }, 250);      // monnaies et badge : sans dépendre de chaque écran qui les modifie
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
