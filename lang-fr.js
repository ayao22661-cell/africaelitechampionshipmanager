// ═══════════════════════════════════════════════════════════════════════════
// TRADUCTION — FRANÇAIS (langue de référence, valeur de repli pour toute clé
// manquante dans une autre langue — voir t() dans app.js).
// Regroupé sous window.I18N_FR, chargé AVANT app.js (voir index.html), qui
// assemble ensuite les trois fichiers de langue dans le registre I18N.
// ═══════════════════════════════════════════════════════════════════════════
window.I18N_FR = {
    'app.subtitle': 'Manager',
    'nav.dashboard': 'Tableau de Bord',
    'nav.squad': 'Effectif',
    'nav.tactics': 'Tactique',
    'nav.market': 'Mercato',
    'nav.staff': 'Encadrement',
    'nav.standings': 'Compétition',
    'nav.awards': 'Palmarès',
    'nav.shop': 'Boutique',
    'nav.campus': 'Campus',
    'nav.home_mobile': 'Accueil',
    'nav.more': 'Plus',
    'nav.profile': 'Profil',
    'nav.reset': 'Réinitialiser',
    'nav.settings': 'Paramètres',

    // ── Titres d'écrans ──────────────────────────────────────────────────
    'screen.tactics': 'Bureau Tactique',
    'screen.standings': 'Classement',
    'screen.squad': 'Effectif Pro',
    'screen.squad_sub': 'Vos joueurs actuellement sous contrat.',

    // Onglet « Direct » de l'écran de match : clé dédiée car le mot français
    // sert aussi au style de jeu « Direct », qui ne se traduit pas pareil.
    'match.tab_live': 'Direct'
};
