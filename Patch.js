// =============================================================
//  PATCH.JS — African Elite Clubs Manager
//  Features : Prêts · Stade · Sponsors · Rôles par poste
//  Chargé APRÈS app.js  →  <script src="patch.js"></script>
// =============================================================

// ─────────────────────────────────────────────────────────────
//  SECTION 0 — INJECTION DES VUES HTML ET BOUTONS DE NAV
//  Toutes les vues et boutons sont injectés dynamiquement
//  pour ne pas toucher à index.html
// ─────────────────────────────────────────────────────────────

(function injectUI() {
    // 1. Cibler le conteneur principal de l'application
    const dashView = document.getElementById('view-dashboard');
    const mainContainer = dashView ? dashView.parentElement : document.body;
    
    // 2. Classes corrigées : scroll activé (overflow-y-auto) et padding mobile (pb-24)
    const viewClasses = 'hidden-view w-full h-full overflow-y-auto max-w-6xl mx-auto animate-[fadeIn_0.3s_ease-out] p-4 pb-24';

    // ── Vue Stade ──────────────────────────────────────────────
    if (!document.getElementById('view-stadium')) {
        const stadiumView = document.createElement('div');
        stadiumView.id = 'view-stadium';
        stadiumView.className = viewClasses;
        stadiumView.innerHTML = `
            <div class="mb-6">
                <h2 class="font-teko text-3xl text-white uppercase tracking-wide">🏟️ Stade</h2>
                <p class="text-slate-400 text-sm mt-1">Améliorez votre enceinte pour augmenter les revenus de billetterie.</p>
            </div>
            <div id="stadium-content"></div>
        `;
        mainContainer.appendChild(stadiumView);
    }

    // ── Vue Sponsors ───────────────────────────────────────────
    if (!document.getElementById('view-sponsors')) {
        const sponsorsView = document.createElement('div');
        sponsorsView.id = 'view-sponsors';
        sponsorsView.className = viewClasses;
        sponsorsView.innerHTML = `
            <div class="mb-6">
                <h2 class="font-teko text-3xl text-white uppercase tracking-wide">🤝 Sponsors</h2>
                <p class="text-slate-400 text-sm mt-1">Gérez vos partenaires commerciaux et signez de nouveaux contrats.</p>
            </div>
            <div id="sponsors-content"></div>
        `;
        mainContainer.appendChild(sponsorsView);
    }

    // ── Vue Prêts ──────────────────────────────────────────────
    if (!document.getElementById('view-loans')) {
        const loansView = document.createElement('div');
        loansView.id = 'view-loans';
        loansView.className = viewClasses;
        loansView.innerHTML = `
            <div class="mb-6">
                <h2 class="font-teko text-3xl text-white uppercase tracking-wide">🔄 Prêts de joueurs</h2>
                <p class="text-slate-400 text-sm mt-1">Prêtez vos jeunes talents pour qu'ils gagnent du temps de jeu.</p>
            </div>
            <div id="loans-content"></div>
        `;
        mainContainer.appendChild(loansView);
    }

    // ── Boutons nav desktop ────────────────────────────────────
    const desktopNav = document.querySelector('nav.flex-1.py-6');
    if (desktopNav && !desktopNav.querySelector('[data-target="stadium"]')) {
        const navBtns = [
            { target: 'stadium',  icon: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`, label: 'Stade' },
            { target: 'sponsors', icon: `<path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/>`, label: 'Sponsors' },
            { target: 'loans',    icon: `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>`, label: 'Prêts' },
        ];
        // Insérer avant le bouton "Effacer"
        const deleteBtn = desktopNav.querySelector('.mt-8');
        navBtns.forEach(({ target, icon, label }) => {
            const btn = document.createElement('button');
            btn.setAttribute('data-target', target);
            btn.onclick = () => app.switchView(target);
            btn.className = 'flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium transition-all group';
            btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24">${icon}</svg><span>${label}</span>`;
            if (deleteBtn) desktopNav.insertBefore(btn, deleteBtn);
            else desktopNav.appendChild(btn);
        });
    }

    // ── Boutons nav mobile (more-menu) ─────────────────────────
    const moreMenu = document.getElementById('more-menu');
    if (moreMenu && !moreMenu.querySelector('[data-patch-nav]')) {
        
        // Rendre le menu scrollable sur mobile
        moreMenu.classList.add('overflow-y-auto', 'max-h-[60vh]', 'no-scrollbar');
        
        const mobileItems = [
            { target: 'stadium',  label: '🏟️ Stade' },
            { target: 'sponsors', label: '🤝 Sponsors' },
            { target: 'loans',    label: '🔄 Prêts' },
        ];
        const resetBtn = moreMenu.querySelector('button:last-child');
        mobileItems.forEach(({ target, label }) => {
            const btn = document.createElement('button');
            btn.setAttribute('data-patch-nav', target);
            btn.onclick = () => { app.switchView(target); moreMenu.classList.add('hidden'); };
            // Ajout de shrink-0 pour éviter l'écrasement des boutons
            btn.className = 'w-full shrink-0 flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors font-medium border-t border-white/5';
            btn.textContent = label;
            if (resetBtn) moreMenu.insertBefore(btn, resetBtn);
            else moreMenu.appendChild(btn);
        });
    }
})();


// ─────────────────────────────────────────────────────────────
//  SECTION 1 — PRÊTS DE JEUNES
// ─────────────────────────────────────────────────────────────

GameManager.prototype.initLoans = function () {
    if (!this.loanedPlayers) this.loanedPlayers = [];
};

/**
 * Ouvrir la modale de prêt pour un joueur
 */
GameManager.prototype.openLoanModal = function (playerId) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;

    // Construire la liste des clubs disponibles
    const clubs = Object.values(this.globalData)
        .flatMap(l => l.standings)
        .filter(c => !c.isUser)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

    let existingModal = document.getElementById('loan-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'loan-modal';
    modal.className = 'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="panel-glass rounded-2xl p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto no-scrollbar border border-white/10">
            <h3 class="font-teko text-2xl text-white uppercase mb-1">Prêter ${player.name}</h3>
            <p class="text-slate-400 text-xs mb-4">${player.position} · OVR ${player.ovr} · ${player.age} ans</p>
            <div class="mb-4">
                <label class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Club d'accueil</label>
                <select id="loan-club-select" class="w-full bg-ui-700 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                    ${clubs.map(c => `<option value="${c.name}">${c.name} (OVR ${c.force})</option>`).join('')}
                </select>
            </div>
            <div class="mb-5">
                <label class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Durée (en journées)</label>
                <select id="loan-duration-select" class="w-full bg-ui-700 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="5">5 matchdays</option>
                    <option value="10" selected>10 matchdays</option>
                    <option value="19">Saison entière (19 J)</option>
                </select>
            </div>
            <div class="flex gap-3">
                <button onclick="app.confirmLoan('${playerId}')" class="btn-primary flex-1 py-2 rounded-lg text-sm font-bold text-white">Prêter</button>
                <button onclick="document.getElementById('loan-modal').remove()" class="btn-secondary flex-1 py-2 rounded-lg text-sm font-bold">Annuler</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

GameManager.prototype.confirmLoan = function (playerId) {
    this.initLoans();
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;

    const clubName = document.getElementById('loan-club-select')?.value;
    const duration = parseInt(document.getElementById('loan-duration-select')?.value || '10');

    if (!clubName) return;

    // Retirer du squad actif
    this.userSquad = this.userSquad.filter(p => p.id !== playerId);

    this.loanedPlayers.push({
        player,
        toClub: clubName,
        returnMatchday: this.matchday + duration,
        loanedAt: this.matchday
    });

    this.messages.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: 'info', read: false,
        text: `🔄 ${player.name} prêté à ${clubName} pour ${duration} journées. Retour prévu à la J${this.matchday + duration}.`
    });

    document.getElementById('loan-modal')?.remove();
    this.updateUserClubForce();
    this.renderSquad();
    this.renderLoans();
    this.saveGame();
    this.showNotification(`✅ ${player.name} prêté à ${clubName} !`);
};

/**
 * Vérifier les retours de prêt — appelé dans finishLiveMatch
 */
GameManager.prototype.checkLoanReturns = function () {
    this.initLoans();
    const returning = this.loanedPlayers.filter(l => this.matchday >= l.returnMatchday);
    returning.forEach(l => {
        // Légère progression pendant le prêt
        const daysOnLoan = l.returnMatchday - l.loanedAt;
        if (l.player.age < 24 && l.player.ovr < (l.player.pot || 85)) {
            const gain = daysOnLoan >= 10 ? 2 : 1;
            l.player.ovr = Math.min(l.player.pot || 85, l.player.ovr + gain);
        }
        l.player.energy = Math.min(100, (l.player.energy || 100) + 20);
        this.userSquad.push(l.player);
        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info', read: false,
            text: `🔄 Retour de prêt : ${l.player.name} (OVR ${l.player.ovr}) est de retour de ${l.toClub}.`
        });
    });
    this.loanedPlayers = this.loanedPlayers.filter(l => this.matchday < l.returnMatchday);
    if (returning.length > 0) {
        this.updateUserClubForce();
        this.renderSquad();
    }
};

/**
 * Rappeler un joueur prêté avant terme (coût : 200 K€)
 */
GameManager.prototype.recallLoan = function (playerId) {
    this.initLoans();
    const loanIdx = this.loanedPlayers.findIndex(l => l.player.id === playerId);
    if (loanIdx === -1) return;
    const cost = 200000;
    if (this.budget < cost) { alert(`Budget insuffisant (200 K€ requis).`); return; }
    if (!confirm(`Rappeler ce joueur coûte ${formatMoney(cost)}. Confirmer ?`)) return;
    this.budget -= cost;
    const loan = this.loanedPlayers.splice(loanIdx, 1)[0];
    this.userSquad.push(loan.player);
    this.showNotification(`✅ ${loan.player.name} rappelé de son prêt !`);
    this.updateUserClubForce();
    this.renderSquad();
    this.renderLoans();
    this.saveGame();
};

GameManager.prototype.renderLoans = function () {
    this.initLoans();
    const container = document.getElementById('loans-content');
    if (!container) return;

    const loanable = this.userSquad.filter(p => p.age <= 23 && p.ovr < 78);
    const active = this.loanedPlayers;

    let html = '';

    // Section joueurs prêtables
    html += `<div class="panel-glass rounded-2xl p-4 mb-4 border border-white/8">
        <h3 class="font-teko text-xl text-white uppercase mb-3">Candidats au prêt</h3>
        <p class="text-xs text-slate-500 mb-3">Joueurs ≤ 23 ans · OVR &lt; 78 · Un prêt développe leur OVR.</p>`;
    if (loanable.length === 0) {
        html += `<p class="text-slate-500 text-sm italic">Aucun joueur éligible pour le moment.</p>`;
    } else {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`;
        loanable.forEach(p => {
            html += `
            <div class="bg-ui-800 rounded-xl p-3 flex items-center justify-between border border-white/5">
                <div>
                    <p class="text-white font-bold text-sm">${p.name}</p>
                    <p class="text-slate-400 text-xs">${p.position} · ${p.age} ans · OVR ${p.ovr} → Pot ${p.pot || '?'}</p>
                </div>
                <button onclick="app.openLoanModal('${p.id}')" class="btn-primary px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0 ml-2">Prêter</button>
            </div>`;
        });
        html += `</div>`;
    }
    html += `</div>`;

    // Section prêts actifs
    html += `<div class="panel-glass rounded-2xl p-4 border border-white/8">
        <h3 class="font-teko text-xl text-white uppercase mb-3">Prêts en cours (${active.length})</h3>`;
    if (active.length === 0) {
        html += `<p class="text-slate-500 text-sm italic">Aucun joueur actuellement prêté.</p>`;
    } else {
        active.forEach(l => {
            const remaining = l.returnMatchday - this.matchday;
            html += `
            <div class="bg-ui-800 rounded-xl p-3 flex items-center justify-between border border-white/5 mb-2">
                <div>
                    <p class="text-white font-bold text-sm">${l.player.name}</p>
                    <p class="text-slate-400 text-xs">${l.player.position} · OVR ${l.player.ovr} chez <span class="text-brand-500">${l.toClub}</span></p>
                    <p class="text-slate-500 text-xs mt-0.5">Retour dans <span class="text-white font-bold">${remaining}</span> journée(s)</p>
                </div>
                <button onclick="app.recallLoan('${l.player.id}')" class="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ml-2">Rappeler (200K)</button>
            </div>`;
        });
    }
    html += `</div>`;

    container.innerHTML = html;
};


// ─────────────────────────────────────────────────────────────
//  SECTION 2 — STADE
// ─────────────────────────────────────────────────────────────

const STADIUM_LEVELS = [
    { level: 1, name: 'Stade Municipal',    capacity: 5000,  upgradeCost: 2000000,  maintenanceCost: 50000  },
    { level: 2, name: 'Stade Régional',     capacity: 10000, upgradeCost: 5000000,  maintenanceCost: 100000 },
    { level: 3, name: 'Stade National',     capacity: 20000, upgradeCost: 12000000, maintenanceCost: 200000 },
    { level: 4, name: 'Grand Stade',        capacity: 35000, upgradeCost: 25000000, maintenanceCost: 350000 },
    { level: 5, name: 'Stade Panafricain',  capacity: 60000, upgradeCost: null,     maintenanceCost: 600000 },
];

GameManager.prototype.initStadium = function () {
    if (!this.stadium) {
        this.stadium = { level: 1 };
    }
};

GameManager.prototype.getStadiumData = function () {
    this.initStadium();
    return STADIUM_LEVELS[this.stadium.level - 1];
};

/**
 * Remplace le calcul de billetterie dans finishLiveMatch
 */
GameManager.prototype.calculateTicketing = function (isHome) {
    if (!isHome) return 0;
    this.initStadium();
    const stadData = this.getStadiumData();
    const myClub = this.getMyClub();
    const force = myClub?.force || 65;
    // Taux de remplissage : 40% base + force/250 (max ~80%)
    const fillRate = Math.min(0.88, 0.40 + (force / 250));
    // Prix moyen du billet : évolue avec le niveau du stade
    const ticketPrice = 5 + this.stadium.level * 3;
    return Math.floor(stadData.capacity * fillRate * ticketPrice);
};

GameManager.prototype.upgradeStadium = function () {
    this.initStadium();
    const current = this.getStadiumData();
    if (!current.upgradeCost) {
        alert('Votre stade est déjà au niveau maximum !');
        return;
    }
    const next = STADIUM_LEVELS[this.stadium.level];
    if (this.budget < current.upgradeCost) {
        alert(`Budget insuffisant. Il vous faut ${formatMoney(current.upgradeCost)}.`);
        return;
    }
    if (!confirm(`Améliorer vers "${next.name}" (capacité : ${next.capacity.toLocaleString()} spectateurs) pour ${formatMoney(current.upgradeCost)} ?\n\nCette opération est irréversible.`)) return;
    this.budget -= current.upgradeCost;
    this.stadium.level++;
    this.messages.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: 'info', read: false,
        text: `🏟️ Amélioration réussie ! Votre stade est maintenant "${next.name}" (${next.capacity.toLocaleString()} places).`
    });
    this.showNotification(`🏟️ ${next.name} opérationnel !`);
    this.renderStadium();
    this.updateHeader();
    this.saveGame();
};

GameManager.prototype.renderStadium = function () {
    this.initStadium();
    const container = document.getElementById('stadium-content');
    if (!container) return;

    const current = this.getStadiumData();
    const next = this.stadium.level < 5 ? STADIUM_LEVELS[this.stadium.level] : null;
    const fillRate = Math.min(88, Math.floor(40 + ((this.getMyClub()?.force || 65) / 250 * 100)));
    const ticketing = this.calculateTicketing(true);
    const progressPct = ((this.stadium.level - 1) / 4) * 100;

    container.innerHTML = `
        <!-- Stade actuel -->
        <div class="panel-glass rounded-2xl p-5 mb-4 border border-white/8">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="font-teko text-2xl text-white">${current.name}</h3>
                    <p class="text-slate-400 text-sm">Niveau ${current.level} / 5</p>
                </div>
                <div class="text-right">
                    <p class="font-teko text-3xl text-brand-500">${current.capacity.toLocaleString()}</p>
                    <p class="text-xs text-slate-400 uppercase tracking-wide">places</p>
                </div>
            </div>

            <!-- Barre de progression niveau -->
            <div class="mb-5">
                <div class="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Niveau 1</span><span>Niveau 5 (MAX)</span>
                </div>
                <div class="h-2 bg-ui-900 rounded-full overflow-hidden">
                    <div class="h-full bg-brand-500 rounded-full transition-all" style="width:${progressPct}%"></div>
                </div>
            </div>

            <!-- Stats billetterie -->
            <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="bg-ui-800 rounded-xl p-3 text-center border border-white/5">
                    <p class="font-teko text-xl text-emerald-400">${fillRate}%</p>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide">Taux Remplissage</p>
                </div>
                <div class="bg-ui-800 rounded-xl p-3 text-center border border-white/5">
                    <p class="font-teko text-xl text-white">${formatMoney(ticketing)}</p>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide">Billetterie / Match dom.</p>
                </div>
                <div class="bg-ui-800 rounded-xl p-3 text-center border border-white/5">
                    <p class="font-teko text-xl text-red-400">${formatMoney(current.maintenanceCost)}</p>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide">Maintenance / mois</p>
                </div>
            </div>

            ${next ? `
            <!-- Amélioration disponible -->
            <div class="bg-ui-800 rounded-xl p-4 border border-brand-500/20">
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <p class="text-white font-bold text-sm">→ ${next.name}</p>
                        <p class="text-slate-400 text-xs">${next.capacity.toLocaleString()} places · Maintenance ${formatMoney(next.maintenanceCost)}/mois</p>
                    </div>
                    <div class="text-right">
                        <p class="text-brand-500 font-teko text-lg">${formatMoney(current.upgradeCost)}</p>
                    </div>
                </div>
                <button onclick="app.upgradeStadium()" 
                    ${this.budget < current.upgradeCost ? 'disabled' : ''}
                    class="w-full btn-primary py-2 rounded-lg text-sm font-bold text-white mt-1">
                    ${this.budget < current.upgradeCost ? `❌ Budget insuffisant (manque ${formatMoney(current.upgradeCost - this.budget)})` : '⬆️ Améliorer le stade'}
                </button>
            </div>` : `
            <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
                <p class="text-emerald-400 font-bold text-sm">🏆 Stade au niveau maximum !</p>
            </div>`}
        </div>

        <!-- Historique revenus billetterie -->
        <div class="panel-glass rounded-2xl p-4 border border-white/8">
            <h3 class="font-teko text-xl text-white uppercase mb-2">💡 Infos revenus</h3>
            <p class="text-slate-400 text-xs leading-relaxed">
                Les revenus de billetterie dépendent du niveau de votre stade et de la force de votre équipe. 
                Un meilleur classement attire plus de spectateurs. Les droits TV (250 K€/match) sont fixes.
                La maintenance est déduite chaque mois (tous les 4 matchdays).
            </p>
        </div>
    `;
};


// ─────────────────────────────────────────────────────────────
//  SECTION 3 — SPONSORS
// ─────────────────────────────────────────────────────────────

const SPONSOR_NAMES = [
    'Orange Afrique', 'MTN Group', 'Total Energies', 'Dangote Group',
    'Ecobank', 'Jumia', 'Air Côte d\'Ivoire', 'NSIA Banque',
    'Canal+ Afrique', 'Nestlé Afrique', 'SABMiller', 'Coris Bank',
    'CIB Bank', 'Ethiopian Airlines', 'Afriland First Bank', 'Société Générale Afrique'
];

GameManager.prototype.initSponsors = function () {
    if (!this.sponsors) this.sponsors = [];
    if (!this.pendingSponsorOffers) this.pendingSponsorOffers = [];
};

/**
 * Génère des offres de sponsoring — appelé en début de saison et J10
 */
GameManager.prototype.generateSponsorOffers = function () {
    this.initSponsors();
    if (this.sponsors.length >= 3) return; // Max 3 sponsors actifs
    const maxNew = 3 - this.sponsors.length;
    const usedNames = [...this.sponsors.map(s => s.name), ...this.pendingSponsorOffers.map(s => s.name)];
    const available = SPONSOR_NAMES.filter(n => !usedNames.includes(n));
    if (available.length === 0) return;

    const myForce = this.getMyClub()?.force || 65;
    const baseAmount = Math.floor(myForce * myForce * 80); // Force 70 ≈ 392 K€ /saison

    const numOffers = Math.min(maxNew, Math.floor(Math.random() * 2) + 1);
    for (let i = 0; i < numOffers; i++) {
        const name = available[Math.floor(Math.random() * available.length)];
        available.splice(available.indexOf(name), 1);
        const variation = 0.8 + Math.random() * 0.6;
        const amount = Math.floor(baseAmount * variation);
        const duration = [10, 19, 38][Math.floor(Math.random() * 3)]; // matchdays
        const offerId = Math.random().toString(36).substr(2, 9);
        this.pendingSponsorOffers.push({ id: offerId, name, amount, duration });
        this.messages.unshift({
            id: offerId,
            type: 'sponsor_offer',
            sponsorId: offerId,
            read: false,
            text: `🤝 Offre sponsor : ${name} propose ${formatMoney(amount)} sur ${duration} journées. Accepter ?`
        });
    }
};

GameManager.prototype.acceptSponsorOffer = function (offerId) {
    this.initSponsors();
    const offerIdx = this.pendingSponsorOffers.findIndex(o => o.id === offerId);
    if (offerIdx === -1) return;
    const offer = this.pendingSponsorOffers.splice(offerIdx, 1)[0];
    this.sponsors.push({ ...offer, matchesLeft: offer.duration, signedAt: this.matchday });
    this.messages = this.messages.map(m => m.id === offerId ? { ...m, read: true, type: 'info', text: `✅ Contrat signé avec ${offer.name} (${formatMoney(offer.amount)} / ${offer.duration} J).` } : m);
    this.showNotification(`✅ Sponsor ${offer.name} signé !`);
    this.renderSponsors();
    this.saveGame();
};

GameManager.prototype.declineSponsorOffer = function (offerId) {
    this.initSponsors();
    this.pendingSponsorOffers = this.pendingSponsorOffers.filter(o => o.id !== offerId);
    this.messages = this.messages.map(m => m.id === offerId ? { ...m, read: true, type: 'info', text: `❌ Offre sponsor refusée.` } : m);
    this.renderSponsors();
};

/**
 * Verser les revenus sponsors et décrémenter — appelé dans finishLiveMatch
 */
GameManager.prototype.processSponsorRevenue = function () {
    this.initSponsors();
    let totalRevenue = 0;
    const expired = [];
    this.sponsors.forEach(s => {
        // Revenu par journée = montant total / durée
        const perMatch = Math.floor(s.amount / s.duration);
        totalRevenue += perMatch;
        s.matchesLeft--;
        if (s.matchesLeft <= 0) {
            expired.push(s);
        }
    });
    this.sponsors = this.sponsors.filter(s => s.matchesLeft > 0);
    expired.forEach(s => {
        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info', read: false,
            text: `🤝 Contrat sponsor ${s.name} terminé. Nouveau contrat possible en début de saison.`
        });
    });
    if (totalRevenue > 0) {
        this.budget += totalRevenue;
        this.monthlyRevenue = (this.monthlyRevenue || 0) + totalRevenue;
    }
};

GameManager.prototype.renderSponsors = function () {
    this.initSponsors();
    const container = document.getElementById('sponsors-content');
    if (!container) return;

    const active = this.sponsors;
    const pending = this.pendingSponsorOffers;

    let html = '';

    // Sponsors actifs
    html += `<div class="panel-glass rounded-2xl p-5 mb-4 border border-white/8">
        <h3 class="font-teko text-xl text-white uppercase mb-3">Contrats actifs (${active.length}/3)</h3>`;
    if (active.length === 0) {
        html += `<p class="text-slate-500 text-sm italic">Aucun sponsor. Les offres arrivent en début de saison et à la J10.</p>`;
    } else {
        active.forEach(s => {
            const perMatch = Math.floor(s.amount / s.duration);
            const progress = Math.max(0, Math.floor((s.matchesLeft / s.duration) * 100));
            html += `
            <div class="bg-ui-800 rounded-xl p-4 mb-3 border border-white/5">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-white font-bold">${s.name}</p>
                    <p class="text-emerald-400 font-bold text-sm">+${formatMoney(perMatch)}/J</p>
                </div>
                <div class="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Matchdays restants : <span class="text-white font-bold">${s.matchesLeft}</span></span>
                    <span>Total : ${formatMoney(s.amount)}</span>
                </div>
                <div class="h-1.5 bg-ui-900 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width:${progress}%"></div>
                </div>
            </div>`;
        });
    }
    html += `</div>`;

    // Offres en attente
    if (pending.length > 0) {
        html += `<div class="panel-glass rounded-2xl p-5 border border-brand-500/20">
            <h3 class="font-teko text-xl text-white uppercase mb-3">Offres en attente</h3>`;
        pending.forEach(o => {
            html += `
            <div class="bg-ui-800 rounded-xl p-4 mb-3 border border-brand-500/20">
                <div class="flex items-center justify-between mb-1">
                    <p class="text-white font-bold">${o.name}</p>
                    <p class="text-brand-500 font-bold">${formatMoney(o.amount)}</p>
                </div>
                <p class="text-slate-400 text-xs mb-3">Durée : ${o.duration} journées · ${formatMoney(Math.floor(o.amount / o.duration))}/J</p>
                <div class="flex gap-2">
                    <button onclick="app.acceptSponsorOffer('${o.id}')" class="btn-primary flex-1 py-1.5 rounded-lg text-xs font-bold text-white">✅ Accepter</button>
                    <button onclick="app.declineSponsorOffer('${o.id}')" class="btn-secondary flex-1 py-1.5 rounded-lg text-xs font-bold">❌ Refuser</button>
                </div>
            </div>`;
        });
        html += `</div>`;
    } else if (active.length > 0) {
        html += `<div class="panel-glass rounded-2xl p-4 border border-white/8">
            <p class="text-slate-500 text-sm italic text-center">Aucune offre en attente. Nouvelles offres à la J10 ou en début de saison.</p>
        </div>`;
    }

    container.innerHTML = html;
};


// ─────────────────────────────────────────────────────────────
//  SECTION 4 — RÔLES PAR POSTE
// ─────────────────────────────────────────────────────────────

// Mapping positions détaillées → catégorie de rôles
const POS_TO_ROLE_CAT = {
    'G': 'GB', 'GB': 'GB',
    'DC': 'DEF', 'DG': 'LAT', 'DD': 'LAT', 'DEF': 'DEF',
    'MDC': 'MDC', 'MC': 'MIL', 'MIL': 'MIL',
    'MOC': 'MOC', 'MOD': 'MOC', 'MOG': 'MOC',
    'BT': 'ATT', 'ATT': 'ATT',
};

function getRolesForPlayer(player) {
    const cat = POS_TO_ROLE_CAT[player.position];
    return cat ? PLAYER_ROLES[cat] : null;
}

const PLAYER_ROLES = {

    // ── GARDIENS ──────────────────────────────────────────────
    GB: [
        { id: 'shot_stopper',   name: 'Gardien Classique',
          desc: 'Réflexes purs, plongeons spectaculaires, reste sur sa ligne.',
          mods: { positioning: 1.3, composure: 1.15, passing: 0.9 } },
        { id: 'sweeper_keeper', name: 'Gardien Libéro',
          desc: 'Sort haut pour casser les attaques, distribue proprement.',
          mods: { positioning: 0.9, passing: 1.25, pace: 1.2 } },
        { id: 'command_keeper', name: 'Gardien Leader',
          desc: 'Dirige sa défense à la voix, dominant dans les airs.',
          mods: { positioning: 1.15, strength: 1.25, leadership: 1.2, composure: 1.1 } },
        { id: 'penalty_keeper', name: 'Spécialiste Penalties',
          desc: 'Psychologie de fer, excellent pour arrêter les tirs au but.',
          mods: { composure: 1.35, positioning: 1.2, pace: 0.95 } },
    ],

    // ── DÉFENSEURS CENTRAUX ───────────────────────────────────
    DEF: [
        { id: 'stopper',          name: 'Stoppeur',
          desc: 'Défenseur physique, gagne ses duels aériens et au sol.',
          mods: { tackling: 1.35, strength: 1.3, positioning: 1.1, passing: 0.9 } },
        { id: 'cover',            name: 'Libéro',
          desc: 'Lit le jeu, couvre les espaces derrière la ligne.',
          mods: { positioning: 1.35, pace: 1.15, tackling: 1.1, passing: 1.0 } },
        { id: 'ball_playing_def', name: 'Défenseur Relanceur',
          desc: 'Lance proprement les attaques depuis l\'arrière.',
          mods: { passing: 1.35, vision: 1.25, tackling: 0.95, pace: 1.05 } },
        { id: 'aggressive_def',   name: 'Défenseur Agressif',
          desc: 'Pressing haut, coupe les passes, provoque les erreurs.',
          mods: { tackling: 1.3, aggression: 1.35, positioning: 0.95, passing: 0.85 } },
    ],

    // ── LATÉRAUX (DG / DD) ────────────────────────────────────
    LAT: [
        { id: 'attacking_fb',  name: 'Latéral Offensif',
          desc: 'Monte sur l\'aile, centres en retrait, percussions.',
          mods: { pace: 1.3, dribbling: 1.2, passing: 1.15, tackling: 0.9 } },
        { id: 'defensive_fb',  name: 'Latéral Défensif',
          desc: 'Bloc bas, priorité aux duels, coupe les ailes adverses.',
          mods: { tackling: 1.3, positioning: 1.25, pace: 1.05, dribbling: 0.85 } },
        { id: 'wingback',      name: 'Piston',
          desc: 'Fait l\'aller-retour sur toute la hauteur du terrain.',
          mods: { pace: 1.2, stamina_proxy: 1.1, passing: 1.1, dribbling: 1.1 } },
        { id: 'inverted_fb',   name: 'Latéral Inversé',
          desc: 'Rentre dans l\'axe, tire ou joue en combinaison.',
          mods: { finishing: 1.2, vision: 1.2, dribbling: 1.1, tackling: 0.85 } },
    ],

    // ── MILIEUX DÉFENSIFS (MDC) ───────────────────────────────
    MDC: [
        { id: 'anchor',        name: 'Sentinelle',
          desc: 'Reste devant la défense, protège sans prendre de risques.',
          mods: { tackling: 1.35, positioning: 1.3, passing: 0.95, vision: 0.9 } },
        { id: 'half_back',     name: 'Demi Défensif',
          desc: 'S\'intègre entre les défenseurs pour relancer proprement.',
          mods: { positioning: 1.25, passing: 1.2, tackling: 1.15, vision: 1.1 } },
        { id: 'ball_winner',   name: 'Récupérateur',
          desc: 'Pressing intense, tackling décisif, coupe toutes les passes.',
          mods: { tackling: 1.4, aggression: 1.35, pace: 1.1, passing: 0.8 } },
        { id: 'deep_lying_pm', name: 'Régisseur',
          desc: 'Dicte le tempo depuis le bas, vision de jeu exceptionnelle.',
          mods: { passing: 1.4, vision: 1.35, tackling: 0.8, composure: 1.15 } },
    ],

    // ── MILIEUX CENTRAUX (MC) ─────────────────────────────────
    MIL: [
        { id: 'box_to_box',    name: 'Box-to-Box',
          desc: 'Présent dans les deux surfaces, moteur inépuisable.',
          mods: { finishing: 1.15, tackling: 1.1, passing: 1.1, pace: 1.05 } },
        { id: 'carrilero',     name: 'Carrilero',
          desc: 'Milieu discipliné, soutien aux latéraux, propre techniquement.',
          mods: { passing: 1.2, positioning: 1.2, tackling: 1.1, vision: 1.05 } },
        { id: 'mezzala',       name: 'Mezzala',
          desc: 'Attaque les espaces entre les lignes, finisseur latent.',
          mods: { finishing: 1.2, dribbling: 1.15, vision: 1.2, tackling: 0.85 } },
        { id: 'roaming_pm',    name: 'Meneur en Retrait',
          desc: 'Décisionnaire discret, trouve les passes décisives de loin.',
          mods: { vision: 1.35, passing: 1.3, composure: 1.2, tackling: 0.75 } },
    ],

    // ── MILIEUX OFFENSIFS / AILIERS (MOC / MOD / MOG) ─────────
    MOC: [
        { id: 'trequartista',  name: 'Trequartista',
          desc: 'Liberté totale en pointe basse, génie créateur.',
          mods: { vision: 1.4, passing: 1.3, dribbling: 1.15, tackling: 0.6 } },
        { id: 'shadow_str',    name: 'Second Attaquant',
          desc: 'Surgit de la seconde ligne pour finir ou servir.',
          mods: { finishing: 1.3, pace: 1.2, vision: 1.1, tackling: 0.8 } },
        { id: 'wide_playmaker', name: 'Ailier Créateur',
          desc: 'Percute sur son côté puis centre ou dribble vers l\'intérieur.',
          mods: { dribbling: 1.3, passing: 1.25, pace: 1.1, finishing: 0.95 } },
        { id: 'inverted_winger', name: 'Ailier Inversé',
          desc: 'Rentre dans l\'axe pour frapper de l\'intérieur du pied.',
          mods: { finishing: 1.25, dribbling: 1.2, pace: 1.15, passing: 0.95 } },
        { id: 'enganche',      name: 'Enganche',
          desc: 'Meneur de jeu classique, pivot de l\'attaque, passes clés.',
          mods: { vision: 1.45, passing: 1.35, composure: 1.2, pace: 0.8 } },
    ],

    // ── ATTAQUANTS (BT) ───────────────────────────────────────
    ATT: [
        { id: 'poacher',       name: 'Renard des Surfaces',
          desc: 'Vit dans la surface, instinct de buteur pur, frappe sans hésiter.',
          mods: { finishing: 1.45, composure: 1.35, dribbling: 0.85, pace: 0.95 } },
        { id: 'advanced_fw',   name: 'Avant-Centre Complet',
          desc: 'Jeu dos au but ET face au goal, participe au jeu collectif.',
          mods: { finishing: 1.25, strength: 1.15, passing: 1.1, composure: 1.2 } },
        { id: 'deep_striker',  name: 'Pivot',
          desc: 'Joue dos au but, remise pour les milieux, protège le ballon.',
          mods: { strength: 1.35, passing: 1.25, vision: 1.2, finishing: 0.9 } },
        { id: 'pressing_fw',   name: 'Attaquant Presseur',
          desc: 'Harcèle les défenseurs, provoque des erreurs hautes.',
          mods: { pace: 1.3, aggression: 1.25, tackling: 1.1, finishing: 1.0 } },
        { id: 'winger_st',     name: 'Ailier Attaquant',
          desc: 'Vitesse et débordements, centres en retrait, un-contre-un.',
          mods: { pace: 1.35, dribbling: 1.3, finishing: 0.95, strength: 0.85 } },
        { id: 'target_man',    name: 'Attaquant de Puissance',
          desc: 'Dominant dans les airs, remises de tête, frappe de loin.',
          mods: { strength: 1.4, positioning: 1.2, finishing: 1.1, pace: 0.8 } },
    ],
};

/**
 * Wrapper de calculateEffectiveStat — applique les modificateurs de rôle
 */
const _origCalcStat = GameManager.prototype.calculateEffectiveStat;
GameManager.prototype.calculateEffectiveStat = function (player, statName) {
    const base = _origCalcStat.call(this, player, statName);
    if (!player.role) return base;
    const posRoles = getRolesForPlayer(player);
    if (!posRoles) return base;
    const roleDef = posRoles.find(r => r.id === player.role);
    if (!roleDef) return base;
    const mod = roleDef.mods[statName];
    return mod ? base * mod : base;
};

GameManager.prototype.openRoleModal = function (playerId) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;
    const roles = getRolesForPlayer(player);
    if (!roles) { alert('Aucun rôle disponible pour ce poste.'); return; }

    let existingModal = document.getElementById('role-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'role-modal';
    modal.className = 'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';

    const rolesHTML = roles.map(r => `
        <div onclick="app.setPlayerRole('${player.id}', '${r.id}')"
             class="cursor-pointer rounded-xl p-3 border transition-all mb-2
             ${player.role === r.id ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-ui-800 hover:border-white/30'}">
            <div class="flex items-center justify-between mb-1">
                <p class="text-white font-bold text-sm">${r.name} ${player.role === r.id ? '✓' : ''}</p>
            </div>
            <p class="text-slate-400 text-xs mb-2">${r.desc}</p>
            <div class="flex flex-wrap gap-1">
                ${Object.entries(r.mods).map(([stat, val]) =>
                    `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${val >= 1.2 ? 'bg-emerald-500/20 text-emerald-400' : val >= 1.0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}">
                        ${stat.toUpperCase()} ×${val.toFixed(2)}
                    </span>`
                ).join('')}
            </div>
        </div>`
    ).join('');

    modal.innerHTML = `
        <div class="panel-glass rounded-2xl p-5 max-w-sm w-full max-h-[85vh] overflow-y-auto no-scrollbar border border-white/10">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="font-teko text-xl text-white uppercase">${player.name}</h3>
                    <p class="text-slate-400 text-xs">${player.position} · OVR ${player.ovr}</p>
                </div>
                <button onclick="document.getElementById('role-modal').remove()" class="text-slate-400 hover:text-white text-xl font-bold">✕</button>
            </div>
            <p class="text-xs text-slate-500 mb-3">Choisissez un rôle pour amplifier les points forts de ce joueur en match.</p>
            ${rolesHTML}
        </div>
    `;
    document.body.appendChild(modal);
};

GameManager.prototype.setPlayerRole = function (playerId, roleId) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;
    const roles = getRolesForPlayer(player);
    const roleDef = roles?.find(r => r.id === roleId);
    if (!roleDef) return;
    player.role = roleId;
    this.saveGame();
    document.getElementById('role-modal')?.remove();
    this.renderSquad();
    this.showNotification(`🎯 ${player.name} → Rôle "${roleDef.name}" attribué !`);
};


// ─────────────────────────────────────────────────────────────
//  SECTION 5 — HOOKS : surcharge des méthodes existantes
// ─────────────────────────────────────────────────────────────

// ── 5a. finishLiveMatch — injecter prêts + sponsors + billetterie stade ──

const _origFinishLiveMatch = GameManager.prototype.finishLiveMatch;
GameManager.prototype.finishLiveMatch = function () {
    // Patch billetterie stade : on corrige AVANT d'appeler l'original
    // en monkey-patching la méthode interne de calcul des revenus.
    // On stocke la valeur corrigée dans une propriété temporaire que
    // l'original lira s'il existe — mais comme l'original calcule
    // directement, on surcharge calculateTicketing que l'original n'appelle pas.
    // → Solution propre : on laisse l'original tourner MAIS on corrige
    //   le budget a posteriori (delta billetterie).

    const wasHome = this.liveMatch?.home?.isUser;
    const oldBudget = this.budget;

    // Appel original
    _origFinishLiveMatch.call(this);

    // Recalcul billetterie si match à domicile
    if (wasHome) {
        const myClub = this.getMyClub();
        const force = myClub?.force || 65;
        // Formule originale de app.js
        const origTicketing = Math.floor(Math.pow(Math.max(1, force - 40), 2) * 500);
        // Nouvelle billetterie via stade
        const newTicketing = this.calculateTicketing(true);
        const delta = newTicketing - origTicketing;
        if (delta !== 0) {
            this.budget += delta;
            this.monthlyRevenue = (this.monthlyRevenue || 0) + delta;
        }
    }

    // Revenus sponsors
    this.processSponsorRevenue();

    // Retours de prêt
    this.checkLoanReturns();

    // Maintenance stade tous les 4 matchdays (= 1 mois)
    if (this.matchday > 0 && this.matchday % 4 === 0) {
        this.initStadium();
        const stadData = this.getStadiumData();
        this.budget -= stadData.maintenanceCost;
        this.monthlyExpenses = (this.monthlyExpenses || 0) + stadData.maintenanceCost;
    }
};

// ── 5b. startNextSeason — générer des offres sponsors + reset sponsors expirés ──

const _origStartNextSeason = GameManager.prototype.startNextSeason;
GameManager.prototype.startNextSeason = function () {
    _origStartNextSeason.call(this);
    this.generateSponsorOffers();
};

// ── 5c. switchView — ajouter les nouvelles vues ──

const _origSwitchView = GameManager.prototype.switchView;
GameManager.prototype.switchView = function (viewId) {
    const patchViews = ['stadium', 'sponsors', 'loans'];
    if (patchViews.includes(viewId)) {
        // Cacher toutes les vues connues
        ['dashboard', 'standings', 'squad', 'tactics', 'market', 'match', 'staff', 'academy', 'caf',
         'stadium', 'sponsors', 'loans'].forEach(id => {
            const el = document.getElementById('view-' + id);
            if (el) el.classList.add('hidden-view');
            document.querySelectorAll(`[data-target="${id}"]`).forEach(btn => {
                btn.classList.remove('text-brand-500', 'bg-brand-500/10');
                btn.classList.add('text-slate-400');
            });
        });
        const targetEl = document.getElementById('view-' + viewId);
        if (targetEl) targetEl.classList.remove('hidden-view');
        document.querySelectorAll(`[data-target="${viewId}"]`).forEach(btn => {
            btn.classList.remove('text-slate-400');
            btn.classList.add('text-brand-500', 'bg-brand-500/10');
        });
        if (viewId === 'stadium')  this.renderStadium();
        if (viewId === 'sponsors') this.renderSponsors();
        if (viewId === 'loans')    this.renderLoans();
        return;
    }
    _origSwitchView.call(this, viewId);
};

// ── 5d. refreshAllViews — pas besoin de rafraîchir les vues patch (lourd) ──

const _origRefreshAllViews = GameManager.prototype.refreshAllViews;
GameManager.prototype.refreshAllViews = function () {
    _origRefreshAllViews.call(this);
    // Les vues patch se refreshent uniquement quand elles sont visibles
    const active = document.querySelector('.panel-glass[id^="view-"]');
    const stadiumEl = document.getElementById('view-stadium');
    const sponsorsEl = document.getElementById('view-sponsors');
    const loansEl = document.getElementById('view-loans');
    if (stadiumEl && !stadiumEl.classList.contains('hidden-view')) this.renderStadium();
    if (sponsorsEl && !sponsorsEl.classList.contains('hidden-view')) this.renderSponsors();
    if (loansEl && !loansEl.classList.contains('hidden-view')) this.renderLoans();
};

// ── 5e. renderSquad — ajouter boutons Rôle et Prêt sur les cartes joueurs ──

const _origRenderSquad = GameManager.prototype.renderSquad;
GameManager.prototype.renderSquad = function () {
    _origRenderSquad.call(this);
    // Après le rendu original, injecter les boutons Rôle + Prêt dans chaque carte
    this.userSquad.forEach(p => {
        // On cherche la carte via le bouton Vendre qui contient l'id du joueur
        const sellBtn = document.querySelector(`button[onclick*="sellPlayer('${p.id}')"]`);
        if (!sellBtn) return;
        const card = sellBtn.closest('.relative.bg-gradient-to-br');
        if (!card) return;
        const actionZone = sellBtn.parentElement;

        // Bouton Rôle
        if (!actionZone.querySelector(`[data-role-btn="${p.id}"]`)) {
            const roleBtn = document.createElement('button');
            roleBtn.setAttribute('data-role-btn', p.id);
            roleBtn.onclick = (e) => { e.stopPropagation(); app.openRoleModal(p.id); };
            const roles = getRolesForPlayer(p);
            const currentRole = roles?.find(r => r.id === p.role);
            roleBtn.className = 'w-full mt-1 py-1 text-[9px] font-bold uppercase rounded transition-colors bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white';
            roleBtn.textContent = currentRole ? `🎯 ${currentRole.name}` : '🎯 Définir un rôle';
            actionZone.insertBefore(roleBtn, sellBtn);
        }

        // Bouton Prêter (jeunes uniquement)
        if (p.age <= 23 && p.ovr < 78 && !actionZone.querySelector(`[data-loan-btn="${p.id}"]`)) {
            const loanBtn = document.createElement('button');
            loanBtn.setAttribute('data-loan-btn', p.id);
            loanBtn.onclick = (e) => { e.stopPropagation(); app.openLoanModal(p.id); };
            loanBtn.className = 'w-full mt-1 py-1 text-[9px] font-bold uppercase rounded transition-colors bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white';
            loanBtn.textContent = '🔄 Prêter';
            actionZone.insertBefore(loanBtn, sellBtn);
        }
    });
};

// ── 5f. renderInbox — ajouter gestion des offres sponsor dans la boite de réception ──

const _origRenderInbox = GameManager.prototype.renderInbox;
GameManager.prototype.renderInbox = function () {
    const container = document.getElementById('inbox-content');
    if (!container) { _origRenderInbox.call(this); return; }

    const msgs = this.messages || [];
    if (msgs.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">Aucun message.</p>`;
        return;
    }

    container.innerHTML = msgs.map(m => {
        const isOffer = m.type === 'offer';
        const isSponsor = m.type === 'sponsor_offer';
        const isTrophy = m.type === 'trophy';

        let actions = '';
        if (isOffer) {
            actions = `<div class="flex gap-2 mt-3">
                <button onclick="app.acceptOffer('${m.id}')" class="btn-primary px-3 py-1 rounded-lg text-xs font-bold text-white">Accepter</button>
                <button onclick="app.rejectOffer('${m.id}')" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">Refuser</button>
            </div>`;
        } else if (isSponsor) {
            actions = `<div class="flex gap-2 mt-3">
                <button onclick="app.acceptSponsorOffer('${m.id}')" class="btn-primary px-3 py-1 rounded-lg text-xs font-bold text-white">✅ Accepter</button>
                <button onclick="app.declineSponsorOffer('${m.id}')" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">❌ Refuser</button>
            </div>`;
        }

        const borderColor = isTrophy ? 'border-yellow-500/40' : isOffer || isSponsor ? 'border-brand-500/30' : 'border-white/5';
        return `
        <div class="panel-glass rounded-xl p-4 mb-2 border ${m.read ? 'border-white/5' : borderColor}">
            <p class="text-white text-sm ${m.read ? 'opacity-60' : 'font-bold'}">${m.text}</p>
            ${actions}
        </div>`;
    }).join('');
};

// ── 5g. saveGame / loadGame — persister les nouvelles données ──

const _origSaveGame = GameManager.prototype.saveGame;
GameManager.prototype.saveGame = function () {
    // On laisse saveGame original tourner, puis on patch la sauvegarde
    try {
        const saved = JSON.parse(localStorage.getItem('AECM_Save') || '{}');
        // Injecter les nouvelles propriétés
        if (_origSaveGame) _origSaveGame.call(this);
        const reSaved = JSON.parse(localStorage.getItem('AECM_Save') || '{}');
        reSaved.stadium = this.stadium || { level: 1 };
        reSaved.sponsors = this.sponsors || [];
        reSaved.pendingSponsorOffers = this.pendingSponsorOffers || [];
        reSaved.loanedPlayers = (this.loanedPlayers || []).map(l => ({
            player: l.player,
            toClub: l.toClub,
            returnMatchday: l.returnMatchday,
            loanedAt: l.loanedAt
        }));
        localStorage.setItem('AECM_Save', JSON.stringify(reSaved));
    } catch(e) {
        console.error('patch.js saveGame error:', e);
    }
};

const _origLoadGame = GameManager.prototype.loadGame;
GameManager.prototype.loadGame = function () {
    const result = _origLoadGame.call(this);
    try {
        const data = JSON.parse(localStorage.getItem('AECM_Save') || '{}');
        this.stadium = data.stadium || { level: 1 };
        this.sponsors = data.sponsors || [];
        this.pendingSponsorOffers = data.pendingSponsorOffers || [];
        this.loanedPlayers = data.loanedPlayers || [];
    } catch(e) {
        this.stadium = { level: 1 };
        this.sponsors = [];
        this.pendingSponsorOffers = [];
        this.loanedPlayers = [];
    }
    return result;
};

// ── 5h. Génération offres sponsors au J10 (hook dans finishLiveMatch déjà patché) ──

const _patchedFinish = GameManager.prototype.finishLiveMatch;
GameManager.prototype.finishLiveMatch = function () {
    _patchedFinish.call(this);
    // Offres sponsors à la J10 si pas encore eu d'offres cette saison
    if (this.matchday === 10) {
        this.generateSponsorOffers();
    }
};

// ── 5i. Palmarès dans le dashboard ────────────────────────────

const _origRenderDashboard = GameManager.prototype.renderDashboard;
GameManager.prototype.renderDashboard = function () {
    _origRenderDashboard.call(this);
    // Injecter le palmarès sous les stats si l'élément n'existe pas encore
    if (!this.trophies || this.trophies.length === 0) return;
    const existing = document.getElementById('patch-trophies-strip');
    if (existing) {
        existing.remove(); // re-render
    }
    // Chercher un bon point d'ancrage dans le dashboard
    const dashView = document.getElementById('view-dashboard');
    if (!dashView) return;
    const strip = document.createElement('div');
    strip.id = 'patch-trophies-strip';
    strip.className = 'mx-4 mb-4 panel-glass rounded-2xl p-4 border border-yellow-500/20';
    strip.innerHTML = `
        <h3 class="font-teko text-lg text-yellow-400 uppercase tracking-wide mb-2">🏆 Palmarès</h3>
        <div class="flex flex-wrap gap-2">
            ${this.trophies.map(t => `
                <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5 text-center">
                    <p class="text-yellow-400 font-bold text-xs">${t.type === 'caf_cl' ? '🌍' : '🏆'} ${t.type === 'caf_cl' ? 'CAF CL' : 'Champion'}</p>
                    <p class="text-slate-400 text-[9px]">${t.league.split('(')[0].trim()} · S${t.season}</p>
                </div>
            `).join('')}
        </div>
    `;
    // Insérer en bas du dashboard avant le padding final
    dashView.appendChild(strip);
};

// =============================================================
//  SECTION 6 — DISCUSSIONS AVEC LES JOUEURS
//  Chaque joueur peut exprimer mécontentement, demander du
//  temps de jeu, demander un transfert ou féliciter le coach.
// =============================================================

const PLAYER_MOODS = {
    happy:      { label: '😄 Heureux',       color: 'text-emerald-400', min: 75 },
    content:    { label: '🙂 Satisfait',      color: 'text-blue-400',   min: 55 },
    unhappy:    { label: '😐 Mécontent',      color: 'text-yellow-400', min: 35 },
    angry:      { label: '😤 En colère',      color: 'text-orange-400', min: 15 },
    requesting: { label: '🚨 Veut partir',    color: 'text-red-400',    min: 0  },
};

GameManager.prototype.getPlayerMood = function (player) {
    const morale = player.morale ?? 80;
    if (morale >= 75) return PLAYER_MOODS.happy;
    if (morale >= 55) return PLAYER_MOODS.content;
    if (morale >= 35) return PLAYER_MOODS.unhappy;
    if (morale >= 15) return PLAYER_MOODS.angry;
    return PLAYER_MOODS.requesting;
};

/**
 * Ouvre la modale de discussion avec un joueur
 */
GameManager.prototype.openPlayerTalk = function (playerId) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;

    const mood = this.getPlayerMood(player);
    const isStarter = this.userSquad.indexOf(player) < 11;
    const morale = player.morale ?? 80;

    // Générer le discours du joueur selon son état
    let playerSpeech = '';
    let options = [];

    if (morale >= 75) {
        playerSpeech = `"Coach, je suis vraiment heureux ici. L'ambiance est top et je me sens en confiance. On va tout donner !"`;
        options = [
            { id: 'praise',    label: '👍 Féliciter (+moral)', cost: 0 },
            { id: 'extension', label: '📋 Proposer prolongation', cost: 0 },
            { id: 'captain',   label: '🏅 Nommer capitaine', cost: 0 },
        ];
    } else if (morale >= 55) {
        playerSpeech = `"Ça va coach, je fais mon travail. Mais j'aimerais${!isStarter ? ' plus de temps de jeu' : ' sentir plus de confiance de votre part'}.`;
        options = [
            { id: 'motivate',  label: '💬 Discours motivant (+5 moral)', cost: 0 },
            { id: 'promise',   label: '🤝 Promettre plus de jeu', cost: 0 },
            { id: 'bonus',     label: `💰 Prime de motivation (${formatMoney(player.wage * 2)})`, cost: player.wage * 2 },
        ];
    } else if (morale >= 35) {
        playerSpeech = `"Franchement coach, je suis déçu. ${!isStarter ? "Je ne joue pas assez." : "Les résultats ne suivent pas."} J'attends des actes.`;
        options = [
            { id: 'motivate',  label: '💬 Discours de soutien (+3 moral)', cost: 0 },
            { id: 'bonus',     label: `💰 Prime de fidélité (${formatMoney(player.wage * 3)})`, cost: player.wage * 3 },
            { id: 'loan_out',  label: '🔄 Proposer un prêt pour gagner du jeu', cost: 0 },
            { id: 'transfer',  label: '🚪 Mettre sur la liste des transferts', cost: 0 },
        ];
    } else if (morale >= 15) {
        playerSpeech = `"Coach, je vais être direct : je veux partir. La situation ne me convient plus du tout."`;
        options = [
            { id: 'convince',  label: '🙏 Le convaincre de rester (+8 moral, coûte 200K€)', cost: 200000 },
            { id: 'bonus',     label: `💰 Grosse prime (${formatMoney(player.wage * 5)}) pour calmer la situation`, cost: player.wage * 5 },
            { id: 'transfer',  label: '🚪 Accepter de le vendre', cost: 0 },
        ];
    } else {
        playerSpeech = `"C'est terminé coach. Je ne rejouerai plus dans ces conditions. Mon agent cherche activement un club."`;
        options = [
            { id: 'sell_now',  label: `💸 Vendre maintenant (${formatMoney(player.price || 0)})`, cost: 0 },
            { id: 'convince',  label: '🙏 Dernière chance : le convaincre (300K€)', cost: 300000 },
        ];
    }

    let existingModal = document.getElementById('player-talk-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'player-talk-modal';
    modal.className = 'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="panel-glass rounded-2xl p-5 max-w-sm w-full max-h-[85vh] overflow-y-auto no-scrollbar border border-white/10">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="font-teko text-xl text-white uppercase">${player.name}</h3>
                    <p class="text-xs ${mood.color} font-bold">${mood.label} · Moral ${morale}%</p>
                </div>
                <button onclick="document.getElementById('player-talk-modal').remove()" class="text-slate-400 hover:text-white text-xl font-bold">✕</button>
            </div>

            <!-- Bulle de dialogue joueur -->
            <div class="bg-ui-800 rounded-xl p-4 mb-4 border border-white/5 relative">
                <div class="absolute -top-2 left-5 w-4 h-4 bg-ui-800 rotate-45 border-l border-t border-white/5"></div>
                <p class="text-slate-300 text-sm italic leading-relaxed">${playerSpeech}</p>
            </div>

            <!-- Options de réponse -->
            <div class="flex flex-col gap-2">
                ${options.map(o => `
                    <button onclick="app.handlePlayerTalk('${player.id}', '${o.id}')"
                        ${o.cost > 0 && this.budget < o.cost ? 'disabled' : ''}
                        class="text-left px-4 py-2.5 rounded-xl border transition-all text-sm font-medium
                        ${o.cost > 0 && this.budget < o.cost
                            ? 'border-white/5 text-slate-600 bg-ui-900 cursor-not-allowed'
                            : 'border-white/10 bg-ui-800 hover:border-brand-500/50 hover:bg-brand-500/10 text-slate-300 hover:text-white'}">
                        ${o.label}
                        ${o.cost > 0 ? `<span class="text-[10px] text-red-400 ml-1">(budget requis)</span>` : ''}
                    </button>`).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

GameManager.prototype.handlePlayerTalk = function (playerId, action) {
    const player = this.userSquad.find(p => p.id === playerId);
    if (!player) return;

    document.getElementById('player-talk-modal')?.remove();

    switch (action) {
        case 'praise':
            player.morale = Math.min(100, (player.morale ?? 80) + 8);
            this.showNotification(`💬 ${player.name} repart motivé ! Moral +8.`);
            break;

        case 'motivate':
            player.morale = Math.min(100, (player.morale ?? 80) + 5);
            this.showNotification(`💬 Discours motivant. ${player.name} reprend confiance.`);
            break;

        case 'extension':
            if (confirm(`Proposer une prolongation à ${player.name} (+10% salaire) ?`)) {
                const raise = Math.floor((player.wage || 0) * 0.1);
                player.wage = (player.wage || 0) + raise;
                player.contract = { duration: 2, expiresIn: 76 };
                player.morale = Math.min(100, (player.morale ?? 80) + 15);
                this.showNotification(`✅ ${player.name} a prolongé ! Salaire +${formatMoney(raise)}/mois.`);
            }
            break;

        case 'captain':
            // Retirer le brassard de l'ancien capitaine
            this.userSquad.forEach(p => { p.isCaptain = false; });
            player.isCaptain = true;
            player.morale = Math.min(100, (player.morale ?? 80) + 20);
            this.showNotification(`🏅 ${player.name} est le nouveau capitaine !`);
            break;

        case 'promise':
            player.morale = Math.min(100, (player.morale ?? 80) + 6);
            // Mémoriser la promesse — à honorer dans les 5 prochains matchs
            if (!this.promises) this.promises = [];
            this.promises.push({ playerId, deadline: this.matchday + 5, type: 'playtime' });
            this.showNotification(`🤝 Promesse faite à ${player.name}. Tenez-la dans les 5 prochains matchs !`);
            break;

        case 'bonus':
            const bonusCost = (player.wage || 0) * (player.morale < 35 ? 3 : player.morale < 55 ? 2 : 2);
            if (this.budget < bonusCost) { this.showNotification('Budget insuffisant.', 'error'); break; }
            this.budget -= bonusCost;
            player.morale = Math.min(100, (player.morale ?? 80) + 12);
            this.showNotification(`💰 Prime versée (${formatMoney(bonusCost)}). ${player.name} est ragaillardi.`);
            break;

        case 'convince':
            const convinceCost = player.morale < 15 ? 300000 : 200000;
            if (this.budget < convinceCost) { this.showNotification('Budget insuffisant.', 'error'); break; }
            this.budget -= convinceCost;
            player.morale = Math.min(100, (player.morale ?? 80) + 20);
            this.showNotification(`🙏 ${player.name} accepte de rester. Il a retrouvé le sourire.`);
            break;

        case 'loan_out':
            document.getElementById('player-talk-modal')?.remove();
            this.openLoanModal(playerId);
            return;

        case 'transfer':
            player.transferListed = true;
            player.morale = Math.min(100, (player.morale ?? 80) + 10); // Soulagement d'être listé
            this.showNotification(`🚪 ${player.name} est sur la liste des transferts.`);
            break;

        case 'sell_now':
            if (this.userSquad.length <= 14) {
                this.showNotification('Effectif minimum de 14 joueurs.', 'error'); break;
            }
            const sellPrice = player.price || 0;
            if (confirm(`Vendre ${player.name} pour ${formatMoney(sellPrice)} ?`)) {
                this.budget += sellPrice;
                this.userSquad = this.userSquad.filter(p => p.id !== playerId);
                this.updateUserClubForce();
                this.showNotification(`💸 ${player.name} vendu pour ${formatMoney(sellPrice)}.`);
            }
            break;
    }

    this.saveGame();
    this.renderSquad();
    this.updateHeader();
};

/**
 * Vérifier les promesses non tenues — appelé dans finishLiveMatch
 */
GameManager.prototype.checkPromises = function () {
    if (!this.promises || this.promises.length === 0) return;
    const broken = this.promises.filter(pr => this.matchday >= pr.deadline);
    broken.forEach(pr => {
        const player = this.userSquad.find(p => p.id === pr.playerId);
        if (!player) return;
        const isStarter = this.userSquad.indexOf(player) < 11;
        if (!isStarter) {
            // Promesse de temps de jeu non tenue
            player.morale = Math.max(0, (player.morale ?? 80) - 20);
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'warning', read: false,
                text: `😠 ${player.name} : vous n'avez pas tenu votre promesse de temps de jeu. Moral -20.`
            });
        }
    });
    this.promises = this.promises.filter(pr => this.matchday < pr.deadline);
};

/**
 * Générer des demandes spontanées de joueurs mécontents
 * Appelé toutes les 3 journées dans finishLiveMatch
 */
GameManager.prototype.generatePlayerComplaints = function () {
    if (this.matchday % 3 !== 0) return;
    const complainers = this.userSquad.filter(p => (p.morale ?? 80) < 40 && Math.random() < 0.35);
    complainers.slice(0, 1).forEach(p => { // max 1 par déclenchement
        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'player_complaint',
            playerId: p.id,
            read: false,
            text: `💬 ${p.name} demande à vous parler (moral: ${p.morale ?? 80}%). Cliquez pour ouvrir la discussion.`
        });
    });
};


// =============================================================
//  SECTION 7 — OBJECTIFS DU BOARD & RISQUE DE LICENCIEMENT
// =============================================================

const BOARD_OBJECTIVES = [
    { id: 'title',       label: '🏆 Gagner le titre',         rankRequired: 1,  difficulty: 'hard'   },
    { id: 'top3',        label: '🥉 Finir dans le top 3',     rankRequired: 3,  difficulty: 'medium' },
    { id: 'top5',        label: '📈 Finir dans le top 5',     rankRequired: 5,  difficulty: 'easy'   },
    { id: 'survive',     label: '✅ Assurer le maintien',     rankRequired: 15, difficulty: 'easy'   },
];

GameManager.prototype.initBoard = function () {
    if (!this.boardData) {
        // Objectif initial basé sur la réputation de départ
        const rep = this.reputation || 30;
        let objective;
        if (rep >= 70)      objective = BOARD_OBJECTIVES[0]; // title
        else if (rep >= 50) objective = BOARD_OBJECTIVES[1]; // top3
        else if (rep >= 30) objective = BOARD_OBJECTIVES[2]; // top5
        else                objective = BOARD_OBJECTIVES[3]; // survive

        this.boardData = {
            objectiveId:    objective.id,
            confidence:     50,    // 0-100 : confiance du board envers le coach
            warningIssued:  false,
            firedWarning:   false,
            seasonsManaged: 1,
        };

        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'board', read: false,
            text: `📋 Objectif du Board : "${objective.label}". Tenez les promesses ou votre poste sera en danger !`
        });
    }
};

GameManager.prototype.getBoardObjective = function () {
    this.initBoard();
    return BOARD_OBJECTIVES.find(o => o.id === this.boardData.objectiveId) || BOARD_OBJECTIVES[2];
};

/**
 * Évaluer la situation en cours de saison — appelé toutes les 5 journées
 */
GameManager.prototype.evaluateBoardConfidence = function () {
    if (!this.boardData) this.initBoard();
    if (this.matchday % 5 !== 0 || this.matchday === 0) return;

    const myClub = this.getMyClub();
    const standings = [...(this.globalData[this.userLeagueId]?.standings || [])];
    standings.sort((a, b) => (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)));
    const currentRank = standings.findIndex(c => c.isUser) + 1;
    const objective = this.getBoardObjective();
    const totalTeams = standings.length;

    // Calcul de la confiance
    const rankRatio = currentRank / objective.rankRequired;
    let delta = 0;

    if (rankRatio <= 0.8)       delta = +5;   // En avance sur l'objectif
    else if (rankRatio <= 1.2)  delta = +1;   // Dans la cible
    else if (rankRatio <= 1.8)  delta = -5;   // Légèrement en retard
    else                        delta = -12;  // Très en retard

    // Forme récente
    const recentForm = myClub?.form?.slice(0, 3) || [];
    const wins = recentForm.filter(f => f === 'W').length;
    const losses = recentForm.filter(f => f === 'L').length;
    if (wins >= 3) delta += 5;
    if (losses >= 3) delta -= 8;

    this.boardData.confidence = Math.max(0, Math.min(100, this.boardData.confidence + delta));

    // Avertissement si confiance basse
    if (this.boardData.confidence <= 25 && !this.boardData.warningIssued) {
        this.boardData.warningIssued = true;
        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'board_warning', read: false,
            text: `⚠️ Le Board s'impatiente. Confiance : ${this.boardData.confidence}%. Encore 5 journées pour redresser la barre ou votre contrat sera réexaminé.`
        });
    }

    // Licenciement si confiance à 0 pendant 2 évaluations consécutives
    if (this.boardData.confidence <= 10) {
        if (this.boardData.firedWarning) {
            this._firingPending = true;
        } else {
            this.boardData.firedWarning = true;
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'board_warning', read: false,
                text: `🚨 ALERTE LICENCIEMENT : Le Board a perdu confiance (${this.boardData.confidence}%). C'est votre dernière chance. Une victoire est indispensable.`
            });
        }
    } else {
        this.boardData.firedWarning = false;
        if (this.boardData.warningIssued && this.boardData.confidence >= 40) {
            this.boardData.warningIssued = false; // Reset si redressement
        }
    }

    // Notification positive si confiance haute
    if (this.boardData.confidence >= 80 && delta > 0) {
        this.showNotification(`✨ Le Board est très satisfait de votre travail ! Confiance : ${this.boardData.confidence}%`);
    }
};

/**
 * Évaluation finale de saison par le Board
 */
GameManager.prototype.evaluateEndOfSeason = function () {
    if (!this.boardData) this.initBoard();
    const standings = [...(this.globalData[this.userLeagueId]?.standings || [])];
    standings.sort((a, b) => (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)));
    const finalRank = standings.findIndex(c => c.isUser) + 1;
    const objective = this.getBoardObjective();
    const achieved = finalRank <= objective.rankRequired;

    if (achieved) {
        this.boardData.confidence = Math.min(100, this.boardData.confidence + 30);
        this.boardData.seasonsManaged = (this.boardData.seasonsManaged || 1) + 1;
        this.boardData.warningIssued = false;
        this.boardData.firedWarning = false;
        // Nouvel objectif plus ambitieux si confiance haute
        if (this.boardData.confidence >= 75 && objective.id !== 'title') {
            const idx = BOARD_OBJECTIVES.findIndex(o => o.id === objective.id);
            if (idx > 0) {
                this.boardData.objectiveId = BOARD_OBJECTIVES[idx - 1].id;
                this.messages.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'board', read: false,
                    text: `📈 Le Board relève les ambitions ! Nouvel objectif : "${BOARD_OBJECTIVES[idx - 1].label}".`
                });
            }
        }
        return { fired: false, message: `✅ Objectif "${objective.label}" atteint ! Le Board vous renouvelle sa confiance.` };
    } else {
        this.boardData.confidence = Math.max(0, this.boardData.confidence - 25);
        if (this.boardData.confidence <= 15) {
            return { fired: true, message: `🚨 Licencié ! Vous avez terminé ${finalRank}e (objectif : top ${objective.rankRequired}). Le Board a décidé de se séparer de vous.` };
        }
        // Objectif revu à la baisse
        if (objective.id !== 'survive') {
            const idx = BOARD_OBJECTIVES.findIndex(o => o.id === objective.id);
            this.boardData.objectiveId = BOARD_OBJECTIVES[Math.min(idx + 1, BOARD_OBJECTIVES.length - 1)].id;
        }
        return { fired: false, message: `⚠️ Objectif manqué (${finalRank}e place). Le Board réduit ses attentes mais reste vigilant.` };
    }
};

/**
 * Rendre le widget Board dans le dashboard
 */
GameManager.prototype.renderBoardWidget = function () {
    this.initBoard();
    const existing = document.getElementById('patch-board-widget');
    if (existing) existing.remove();

    const dashView = document.getElementById('view-dashboard');
    if (!dashView) return;

    const objective = this.getBoardObjective();
    const conf = this.boardData.confidence;
    const confColor = conf >= 60 ? 'bg-emerald-500' : conf >= 35 ? 'bg-yellow-500' : 'bg-red-500';
    const confLabel = conf >= 70 ? 'Excellent' : conf >= 50 ? 'Correct' : conf >= 30 ? 'Fragile' : '🚨 Critique';

    const widget = document.createElement('div');
    widget.id = 'patch-board-widget';
    widget.className = 'mx-4 mb-4 panel-glass rounded-2xl p-4 border border-white/8';
    widget.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <h3 class="font-teko text-lg text-white uppercase tracking-wide">🏛️ Board</h3>
            <span class="text-xs font-bold ${conf < 30 ? 'text-red-400' : conf < 60 ? 'text-yellow-400' : 'text-emerald-400'}">${confLabel}</span>
        </div>
        <p class="text-slate-400 text-xs mb-2">Objectif : <span class="text-white font-bold">${objective.label}</span></p>
        <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-ui-900 rounded-full overflow-hidden">
                <div class="h-full ${confColor} rounded-full transition-all" style="width:${conf}%"></div>
            </div>
            <span class="text-xs text-slate-400 shrink-0">${conf}%</span>
        </div>
        ${conf <= 25 ? `<p class="text-red-400 text-[10px] font-bold mt-2 uppercase tracking-wide">⚠️ Votre poste est menacé</p>` : ''}
    `;
    // Insérer avant le palmarès s'il existe, sinon en bas du dashboard
    const trophiesStrip = document.getElementById('patch-trophies-strip');
    if (trophiesStrip) dashView.insertBefore(widget, trophiesStrip);
    else dashView.appendChild(widget);
};


// =============================================================
//  SECTION 8 — NÉGOCIATIONS DE TRANSFERT
//  Contre-offre, paiement échelonné, clause de rachat
// =============================================================

/**
 * Ouvre la modale de négociation quand un club IA fait une offre
 * Remplace l'ancien système accepter/refuser binaire
 */
GameManager.prototype.openTransferNegotiation = function (offerId) {
    const offer = this.messages.find(m => m.id === offerId);
    if (!offer) return;
    const player = this.userSquad.find(p => p.id === offer.playerId);
    if (!player) return;

    const basePrice = player.price || 0;
    const offerAmount = offer.amount;
    const counterAmount = Math.floor(basePrice * 1.15); // +15% comme contre-offre suggérée
    const installmentAmount = Math.floor(offerAmount * 0.5); // 50% maintenant, 50% plus tard

    let existingModal = document.getElementById('transfer-nego-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'transfer-nego-modal';
    modal.className = 'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="panel-glass rounded-2xl p-5 max-w-sm w-full max-h-[85vh] overflow-y-auto no-scrollbar border border-white/10">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-teko text-xl text-white uppercase">Négociation</h3>
                <button onclick="document.getElementById('transfer-nego-modal').remove()" class="text-slate-400 hover:text-white font-bold text-xl">✕</button>
            </div>

            <!-- Infos joueur + offre -->
            <div class="bg-ui-800 rounded-xl p-3 mb-4 border border-white/5">
                <p class="text-white font-bold">${player.name} <span class="text-slate-400 font-normal text-xs">· ${player.position} · OVR ${player.ovr}</span></p>
                <p class="text-slate-400 text-xs mt-0.5">Valeur estimée : <span class="text-white">${formatMoney(basePrice)}</span></p>
                <p class="text-brand-500 text-sm font-bold mt-1">${offer.buyerName} propose : ${formatMoney(offerAmount)}</p>
            </div>

            <!-- Options de négociation -->
            <div class="flex flex-col gap-2">
                <!-- Accepter -->
                <button onclick="app.resolveTransfer('${offerId}', 'accept', 0, false)"
                    class="text-left px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all">
                    <p class="text-emerald-400 font-bold text-sm">✅ Accepter l'offre</p>
                    <p class="text-slate-400 text-xs">${formatMoney(offerAmount)} — versement immédiat</p>
                </button>

                <!-- Contre-offre -->
                <div class="px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10">
                    <p class="text-blue-400 font-bold text-sm mb-2">💬 Contre-offre</p>
                    <div class="flex items-center gap-2">
                        <input id="counter-input" type="number" value="${counterAmount}"
                            class="flex-1 bg-ui-900 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                            min="${Math.floor(offerAmount * 0.9)}" step="100000"/>
                        <button onclick="app.resolveTransfer('${offerId}', 'counter', parseInt(document.getElementById('counter-input').value), false)"
                            class="btn-primary px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0">Envoyer</button>
                    </div>
                    <p class="text-slate-500 text-[10px] mt-1">Le club IA accepte si ≤ +25% de son offre initiale</p>
                </div>

                <!-- Paiement échelonné -->
                <button onclick="app.resolveTransfer('${offerId}', 'installment', ${offerAmount}, true)"
                    class="text-left px-4 py-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all">
                    <p class="text-yellow-400 font-bold text-sm">📅 Accepter en échelonné</p>
                    <p class="text-slate-400 text-xs">${formatMoney(installmentAmount)} maintenant + ${formatMoney(offerAmount - installmentAmount)} dans 10 journées</p>
                </button>

                <!-- Clause de rachat -->
                <button onclick="app.resolveTransfer('${offerId}', 'buyback', ${offerAmount}, false)"
                    class="text-left px-4 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all">
                    <p class="text-purple-400 font-bold text-sm">🔁 Accepter + clause de rachat</p>
                    <p class="text-slate-400 text-xs">${formatMoney(offerAmount)} + droit de rachat à ${formatMoney(Math.floor(offerAmount * 1.4))} dans 2 saisons</p>
                </button>

                <!-- Refuser -->
                <button onclick="app.resolveTransfer('${offerId}', 'reject', 0, false)"
                    class="text-left px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all">
                    <p class="text-red-400 font-bold text-sm">❌ Refuser l'offre</p>
                    <p class="text-slate-400 text-xs">Le joueur reste au club</p>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

GameManager.prototype.resolveTransfer = function (offerId, action, amount, installment) {
    const offer = this.messages.find(m => m.id === offerId);
    if (!offer) return;
    const player = this.userSquad.find(p => p.id === offer.playerId);

    document.getElementById('transfer-nego-modal')?.remove();

    if (action === 'reject') {
        this.messages = this.messages.filter(m => m.id !== offerId);
        this.showNotification(`❌ Offre de ${offer.buyerName} refusée.`);
        this.renderInbox();
        this.saveGame();
        return;
    }

    if (!player) return;
    if (this.userSquad.length <= 14) {
        this.showNotification('Effectif minimum de 14 joueurs.', 'error');
        return;
    }

    if (action === 'counter') {
        const maxAcceptable = offer.amount * 1.25;
        if (amount > maxAcceptable) {
            this.showNotification(`❌ ${offer.buyerName} refuse votre contre-offre de ${formatMoney(amount)}. Trop élevée.`, 'error');
            this.messages = this.messages.filter(m => m.id !== offerId);
            this.renderInbox();
            this.saveGame();
            return;
        }
        // Accepté
        this.budget += amount;
        this.showNotification(`✅ ${offer.buyerName} accepte la contre-offre ! ${player.name} vendu pour ${formatMoney(amount)}.`);
    } else if (action === 'installment') {
        const first = Math.floor(amount * 0.5);
        const second = amount - first;
        this.budget += first;
        // Mémoriser le versement différé
        if (!this.pendingInstallments) this.pendingInstallments = [];
        this.pendingInstallments.push({
            amount: second,
            dueMatchday: this.matchday + 10,
            buyerName: offer.buyerName,
            playerName: player.name
        });
        this.showNotification(`💰 ${player.name} vendu en échelonné. ${formatMoney(first)} reçus maintenant.`);
    } else if (action === 'buyback') {
        this.budget += amount;
        if (!this.buybackClauses) this.buybackClauses = [];
        this.buybackClauses.push({
            playerId: player.id,
            playerName: player.name,
            buybackPrice: Math.floor(amount * 1.4),
            expiresInSeasons: 2
        });
        this.showNotification(`✅ ${player.name} vendu avec clause de rachat à ${formatMoney(Math.floor(amount * 1.4))}.`);
    } else {
        // accept
        this.budget += offer.amount;
        this.showNotification(`✅ ${player.name} vendu à ${offer.buyerName} pour ${formatMoney(offer.amount)}.`);
    }

    // Retirer le joueur
    this.userSquad = this.userSquad.filter(p => p.id !== offer.playerId);
    this.messages = this.messages.filter(m => m.id !== offerId);
    this.updateUserClubForce();
    this.updateHeader();
    this.refreshAllViews();
    this.renderInbox();
    this.saveGame();
};

/**
 * Vérifier les versements échelonnés dus
 */
GameManager.prototype.checkInstallments = function () {
    if (!this.pendingInstallments || this.pendingInstallments.length === 0) return;
    const due = this.pendingInstallments.filter(i => this.matchday >= i.dueMatchday);
    due.forEach(i => {
        this.budget += i.amount;
        this.monthlyRevenue = (this.monthlyRevenue || 0) + i.amount;
        this.messages.unshift({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info', read: false,
            text: `💰 Versement échelonné reçu : ${formatMoney(i.amount)} de ${i.buyerName} pour ${i.playerName}.`
        });
    });
    this.pendingInstallments = this.pendingInstallments.filter(i => this.matchday < i.dueMatchday);
};


// =============================================================
//  SECTION 9 — HOOKS SUPPLÉMENTAIRES
// =============================================================

// ── Injecter checkPromises + generatePlayerComplaints + board + installments
//    dans le finishLiveMatch déjà patché ──

const _patch2Finish = GameManager.prototype.finishLiveMatch;
GameManager.prototype.finishLiveMatch = function () {
    _patch2Finish.call(this);
    this.checkPromises();
    this.generatePlayerComplaints();
    this.evaluateBoardConfidence();
    this.checkInstallments();

    // Licenciement en attente
    if (this._firingPending) {
        this._firingPending = false;
        setTimeout(() => {
            alert(`🚨 LICENCIEMENT\n\nLe Board a décidé de mettre fin à votre contrat.\nConfiance tombée à zéro.\n\nVotre aventure s'arrête ici.`);
            // Reset du board — nouvelle chance avec confiance basse
            this.boardData.confidence = 30;
            this.boardData.warningIssued = false;
            this.boardData.firedWarning = false;
            this.messages.unshift({
                id: Math.random().toString(36).substr(2, 9),
                type: 'board', read: false,
                text: `🔄 Après négociation, le Board vous accorde une dernière chance. Confiance rétablie à 30%.`
            });
            this.saveGame();
        }, 1500);
    }
};

// ── Évaluation fin de saison dans startNextSeason ──

const _patch2StartSeason = GameManager.prototype.startNextSeason;
GameManager.prototype.startNextSeason = function () {
    // Évaluation AVANT de passer à la saison suivante
    const eval_ = this.evaluateEndOfSeason();
    this.messages.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: eval_.fired ? 'board_warning' : 'board',
        read: false,
        text: eval_.message
    });
    // Renouveler les clauses de rachat (décrémenter)
    if (this.buybackClauses) {
        this.buybackClauses = this.buybackClauses
            .map(c => ({ ...c, expiresInSeasons: c.expiresInSeasons - 1 }))
            .filter(c => c.expiresInSeasons > 0);
    }
    _patch2StartSeason.call(this);
};

// ── renderInbox : bouton "Négocier" remplace "Accepter/Refuser" pour les offres ──

const _patch2RenderInbox = GameManager.prototype.renderInbox;
GameManager.prototype.renderInbox = function () {
    const container = document.getElementById('inbox-content');
    if (!container) { _patch2RenderInbox.call(this); return; }

    const msgs = this.messages || [];
    if (msgs.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">Aucun message.</p>`;
        return;
    }

    container.innerHTML = msgs.map(m => {
        const isOffer = m.type === 'offer';
        const isSponsor = m.type === 'sponsor_offer';
        const isTrophy = m.type === 'trophy';
        const isComplaint = m.type === 'player_complaint';
        const isBoard = m.type === 'board' || m.type === 'board_warning';

        let actions = '';
        if (isOffer) {
            // Nouveau : bouton Négocier
            actions = `<div class="flex gap-2 mt-3">
                <button onclick="app.openTransferNegotiation('${m.id}')" class="btn-primary flex-1 px-3 py-1 rounded-lg text-xs font-bold text-white">💬 Négocier</button>
                <button onclick="app.resolveTransfer('${m.id}','reject',0,false)" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">❌ Refuser</button>
            </div>`;
        } else if (isSponsor) {
            actions = `<div class="flex gap-2 mt-3">
                <button onclick="app.acceptSponsorOffer('${m.id}')" class="btn-primary flex-1 px-3 py-1 rounded-lg text-xs font-bold text-white">✅ Signer</button>
                <button onclick="app.declineSponsorOffer('${m.id}')" class="btn-secondary px-3 py-1 rounded-lg text-xs font-bold">❌ Refuser</button>
            </div>`;
        } else if (isComplaint) {
            actions = `<div class="mt-3">
                <button onclick="app.openPlayerTalk('${m.playerId}'); app.switchView('inbox');"
                    class="btn-primary px-4 py-1 rounded-lg text-xs font-bold text-white">💬 Parler au joueur</button>
            </div>`;
        }

        const borderColor = isTrophy ? 'border-yellow-500/40'
            : isBoard ? (m.type === 'board_warning' ? 'border-red-500/30' : 'border-blue-500/20')
            : isOffer || isSponsor ? 'border-brand-500/30'
            : isComplaint ? 'border-orange-500/30'
            : 'border-white/5';

        return `
        <div class="panel-glass rounded-xl p-4 mb-2 border ${m.read ? 'border-white/5 opacity-70' : borderColor}">
            <p class="text-white text-sm ${m.read ? '' : 'font-bold'}">${m.text}</p>
            ${actions}
        </div>`;
    }).join('');

    this.messages.forEach(m => m.read = true);
};

// ── renderSquad : ajouter bouton "Parler" sur chaque carte joueur ──

const _patch2RenderSquad = GameManager.prototype.renderSquad;
GameManager.prototype.renderSquad = function () {
    _patch2RenderSquad.call(this);
    this.userSquad.forEach(p => {
        const sellBtn = document.querySelector(`button[onclick*="sellPlayer('${p.id}')"]`);
        if (!sellBtn) return;
        const actionZone = sellBtn.parentElement;
        if (actionZone.querySelector(`[data-talk-btn="${p.id}"]`)) return;

        const mood = this.getPlayerMood(p);
        const talkBtn = document.createElement('button');
        talkBtn.setAttribute('data-talk-btn', p.id);
        talkBtn.onclick = (e) => { e.stopPropagation(); app.openPlayerTalk(p.id); };
        talkBtn.className = `w-full mt-1 py-1 text-[9px] font-bold uppercase rounded transition-colors
            ${(p.morale ?? 80) < 40 ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white animate-pulse' : 'bg-slate-700/40 text-slate-400 hover:bg-slate-600 hover:text-white'}`;
        talkBtn.textContent = `💬 ${mood.label}`;
        // Insérer avant le bouton vendre
        actionZone.insertBefore(talkBtn, sellBtn);
    });
};

// ── renderDashboard : injecter le widget Board ──

const _patch2RenderDashboard = GameManager.prototype.renderDashboard;
GameManager.prototype.renderDashboard = function () {
    _patch2RenderDashboard.call(this);
    this.initBoard();
    this.renderBoardWidget();
};

// ── saveGame / loadGame : persister board + discussions + transferts ──

const _patch2SaveGame = GameManager.prototype.saveGame;
GameManager.prototype.saveGame = function () {
    _patch2SaveGame.call(this);
    try {
        const saved = JSON.parse(localStorage.getItem('AECM_Save') || '{}');
        saved.boardData = this.boardData || null;
        saved.promises = this.promises || [];
        saved.pendingInstallments = this.pendingInstallments || [];
        saved.buybackClauses = this.buybackClauses || [];
        localStorage.setItem('AECM_Save', JSON.stringify(saved));
    } catch(e) {
        console.error('patch.js save (section 9) error:', e);
    }
};

const _patch2LoadGame = GameManager.prototype.loadGame;
GameManager.prototype.loadGame = function () {
    const result = _patch2LoadGame.call(this);
    try {
        const data = JSON.parse(localStorage.getItem('AECM_Save') || '{}');
        this.boardData = data.boardData || null;
        this.promises = data.promises || [];
        this.pendingInstallments = data.pendingInstallments || [];
        this.buybackClauses = data.buybackClauses || [];
    } catch(e) {
        this.boardData = null;
        this.promises = [];
        this.pendingInstallments = [];
        this.buybackClauses = [];
    }
    return result;
};


// ─────────────────────────────────────────────────────────────
//  SECTION 10 — CORRECTION DU CHARGEMENT INITIAL (COLD START)
// ─────────────────────────────────────────────────────────────
// Étant donné que app.js s'exécute en premier et charge la sauvegarde
// AVANT que Patch.js ne modifie la fonction loadGame, les données du patch
// (prêts, stade, sponsors, etc.) restent vides au rechargement de la page.
// Ce bloc force la récupération immédiate des données sauvegardées.

(function forceLoadPatchData() {
    if (typeof app !== 'undefined') {
        try {
            const data = JSON.parse(localStorage.getItem('AECM_Save') || '{}');
            app.stadium = data.stadium || { level: 1 };
            app.sponsors = data.sponsors || [];
            app.pendingSponsorOffers = data.pendingSponsorOffers || [];
            app.loanedPlayers = data.loanedPlayers || [];
            app.boardData = data.boardData || null;
            app.promises = data.promises || [];
            app.pendingInstallments = data.pendingInstallments || [];
            app.buybackClauses = data.buybackClauses || [];
        } catch(e) {
            console.error("Erreur lors du chargement initial des données Patch :", e);
        }
    }
})();

console.log('✅ patch.js chargé — Prêts · Stade · Sponsors · Rôles · Palmarès · Discussions · Board · Négociations actifs (Mobile Fixé & Chargement Sauvegarde Corrigé)');