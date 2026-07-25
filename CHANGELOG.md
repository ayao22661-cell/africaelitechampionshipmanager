# Changelog — Audit & correctifs AECM (25/07/2026)

**53 correctifs appliqués sur 90 points identifiés à l'audit initial.**
Chaque correctif est marqué `// FIX #N` dans `app.js` — cherchez le numéro pour le retrouver.

**Tests effectués à chaque lot** : simulation complète de 2 saisons (championnat + CAF jusqu'à
la finale), sauvegarde/rechargement en cours de CAF, reprise du jeu après rechargement, et un
test dédié avec les 4 membres du staff engagés sur plusieurs journées. Aucun crash, effectif
jamais tombé à 0, finale CAF jouée et gagnée, données bien restaurées à chaque fois.

---

## Lot 1 — Bugs bloquants et majeurs (22 correctifs)

| # | Bug | Gravité | Correction |
|---|-----|---------|------------|
| 1 | `this.messages` non initialisé → crash après le 1er match (~53% des parties) | 🔴 Bloquant | Initialisé dans le constructeur |
| 2 | Tous les contrats expirent en même temps → effectif à 0 en fin de saison 1 | 🔴 Bloquant | Contrats calés sur 38 journées/saison + effectif plancher (16) + recrutement d'urgence automatique |
| 3 | La finale CAF n'est jamais jouée, la saison reste bloquée | 🔴 Bloquant | Les fixtures CAF sont désormais toujours incluses dans le calcul de fin de saison |
| 4 | Achat d'un joueur = duplication (reste dans les 2 effectifs) | 🟠 Majeur | Le joueur est retiré de son club d'origine à l'achat (idem transferts IA) |
| 5 | Buts adverses comptés deux fois | 🟠 Majeur | Suppression du double comptage dans `finishLiveMatch` |
| 6 | Suspensions/blessures purgées avant d'avoir fait rater un match | 🟠 Majeur | Snapshot pré-match : on ne décrémente que ce qui existait déjà avant le coup d'envoi |
| 7 | Les agents libres réels (contrat expiré, coupés par l'IA) disparaissent à chaque rafraîchissement | 🟠 Majeur | `renderMarket` ne régénère plus le pool s'il existe déjà |
| 8 | Salaires déduits deux fois (par journée + par mois) | 🟠 Majeur | Suppression de la double déduction, le bloc mensuel n'est plus qu'un récapitulatif |
| 9 | Discours motivant à usage unique pour toute la partie | 🟠 Majeur | Réinitialisé chaque mois (comme le TODO le demandait déjà dans le HTML) |
| 10 | Classement/force non recalculés après une journée CAF simulée en arrière-plan | 🟡 Confort | Recalcul ajouté dans `simulateAIBypassMatchday` |
| 11 | `cafSlots`, `currentSeason`, `speechUsedThisMonth`, `freeAgentPool`, `quarterIndex` perdus au rechargement | 🟡 Confort | Tous sauvegardés/restaurés désormais |
| 12 | Sauvegarde gonflée (effectifs des 16 clubs CAF dupliqués) | 🟡 Perf | `cafData` allégé à la sauvegarde, réhydraté avec les vrais objets au chargement |
| 13 | Fixtures avec équipes introuvables après reload → matchs qui disparaissent silencieusement | 🟡 Confort | Filtrées explicitement au chargement |
| 21 | (vérifié, pas un vrai bug) champ `_ref` mort dans `initCAF` | 🔵 Ménage | Supprimé |
| 22 | Crash potentiel si l'équipe défensive n'a plus aucun joueur (cascade cartons/blessures) | 🟠 Majeur | Garde-fous dans `executeShot` et `calculateEffectiveStat` |
| 28 | Les tirs différés (penalty/corner/coup franc) peuvent s'exécuter après la fin du match | 🟡 Confort | Vérification `minute < 90` ajoutée aux 3 `setTimeout` |
| 34 | `formatMoney` casse sur les négatifs et les décimales | 🟡 Confort | Réécrite, gère signe et arrondi correctement |
| 38 | Licenciement de staff non sauvegardé | 🟡 Confort | `saveGame()` ajouté |
| 42 | Académie génère toujours des noms francophones (mauvaise variable) | 🟠 Majeur | Corrigé — testé avec un club marocain, génère bien des noms arabes |
| 49 | Filtre "OVR minimum" du marché ne filtrait rien | 🟡 Confort | Logique inversée corrigée |
| 51/52 | Superviser un agent libre facturait sans rien faire ; dépenses non sauvegardées | 🟡 Confort | Recherche étendue aux agents libres + `saveGame()` ajouté partout |
| 73 | Un joueur à 0% de moral/énergie traité comme s'il était à 80%/100% (piège `\|\|` sur zéro) | 🟠 Majeur | `\|\|` remplacé par `??` sur tous les points à impact (moteur de match inclus) |
| 82 | Effectif utilisateur pouvait perdre sa liaison avec `myClub.squad` | 🟠 Majeur | `splice()` en place au lieu de réassignation de tableau |
| 87 | Une erreur imprévue pendant un match fige silencieusement la partie pour toujours | 🟠 Majeur (filet de sécurité) | `try/catch` générique autour de la boucle de match |

## Lot 2 — CAF, affichage, qualité (10 correctifs)

| # | Bug | Correction |
|---|-----|------------|
| 14 | Groupes CAF départagés uniquement sur les points (buts jamais enregistrés) | `cafGF`/`cafGA` enregistrés et utilisés dans les 2 tris |
| 15 | `unlockMatchday` sans clé `'quarts'` → badge "déverrouillé" affiché en permanence | Clé ajoutée (journée 9) |
| 16 | Scores des quarts de finale jamais affichés (codé en dur sur "vs") | Affichage aller/retour ajouté, sur le modèle des demi-finales |
| 17 | Un match retour 0-0 affichait "? — ?" (piège du `\|\|` sur zéro) | `??` à la place, corrigé pour quarts ET demies |
| 24 | Remplacement IA sur blessure n'incrémentait pas le compteur de changements | Compteur incrémenté — l'IA respecte enfin la limite de 5 |
| 30 | Accumulation de nœuds DOM dans le commentaire de match sur une longue partie | Purge automatique au-delà de 60 lignes |
| 57 | `#header-reputation` jamais mis à jour (affichait "National" en dur) | Mis à jour à chaque `updateHeader()` |
| 64 | Le compteur de journée pouvait afficher "49/48" en fin de saison | Plafonné à 48 à l'affichage |
| 66 | La mini-forme du prochain match affichait les 3 matchs les PLUS ANCIENS | `slice(0,3)` au lieu de `slice(-3)` |
| 77 | Joueurs générés avec seulement l'initiale du prénom ("S. Touré" pour tous) | Prénom complet utilisé |

## Lot 3 — Design économique, académie, marché, moteur (14 correctifs)

Contrairement aux lots précédents, celui-ci implémente aussi les points qui relevaient de
choix de design (l'utilisateur a demandé de trancher soi-même, en s'appuyant sur la recherche
de marché africain faite en amont — salaires réels ~150-1000€/mois, primes CAF ~6M$).

| # | Bug / Point de design | Correction |
|---|------------------------|------------|
| 31/32 | `getPlayerValue` en escalier brutal (79→5M€, 80→12M€), sans lien avec l'âge/potentiel | Courbe exponentielle lissée + facteurs âge (pic 24-29 ans, décote après) et potentiel |
| 33 | Salaires incohérents entre joueurs générés (`/200`) et joueurs réels (`/100`) | Formule unique `getPlayerWage()` — ~8,4%/an de la valeur, vérifié |
| 35 | `sellPlayer` vendait toujours au prix catalogue exact, sans négociation | Décote de 12% à la vente |
| 37 | Le staff était décoratif (aucun des effets "+10%", "-15%"... n'était appliqué) | **4 effets réels implémentés** : médecin (-15% risque blessure), kiné (+10% récup énergie), coach adjoint (+5% force en match), recruteur (coût de supervision divisé par 2) |
| 43/44 | Jeunes d'académie sans stats/contrat avant promotion, stats toutes identiques | Stats variées par poste générées dès la création, contrat par défaut |
| 45 | Jeunes de 22 ans supprimés silencieusement de l'académie | Message de notification ajouté |
| 47 | Aucun bonus de progression lié au niveau d'infrastructure de l'académie | Bonus de progression proportionnel au niveau |
| 48 | Aucun salaire réellement déduit pour l'académie malgré le `wage` affiché | Inclus dans la masse salariale mensuelle |
| 53 | Marché limité à 6 joueurs, tous de votre propre championnat | Élargi à 12 (6 de votre ligue + 6 des 9 autres championnats africains) |
| 78 | ~160 lignes de tableaux de noms dupliqués entre académie et génération standard | Réutilisation de `REGIONAL_NAMES`, duplicata supprimé |
| 85 | IDs de joueurs sans garantie d'unicité (`Math.random()` seul) | Compteur incrémental ajouté à chaque ID généré |
| 23 | Terrain tactique et terrain de match live n'utilisaient pas la même échelle | Facteur `×2` aligné entre les deux vues |

## Lot 4 — Dernier tour : économie, interface, buts CAF (7 correctifs)

| # | Bug / Point de design | Correction |
|---|------------------------|------------|
| 40 | Billetterie/droits TV/primes trop généreux (cause de la croissance rapide du budget observée en test) | Recalibrés sur des bases réalistes : affluence × prix moyen du billet (~7€, cohérent avec 5-20$ observés en Afrique), droits TV et primes revus à la baisse. **Vérifié : budget après 2 saisons passe de ~90M€ à ~7-11M€**, bien plus soutenable |
| 40b | Prime de fin de saison (jusqu'à 15M€) dépassait presque la prime CAF (5M€) | Réduite à 4M€ max (1er) / 300K€ min (dernier) — la CAF reste la récompense suprême |
| 61 | Buts/passes marqués en CAF comptabilisés dans le classement des buteurs du championnat | Compteurs séparés (`cafGoals`/`cafAssists`), soustraits à l'affichage du classement de championnat. *Note : n'affecte en pratique que les matchs CAF joués en direct par l'utilisateur — les matchs simulés en arrière-plan ne touchaient déjà pas aux stats individuelles* |
| 63 | Badge de notification trop petit (8×8px) pour afficher un nombre à 2 chiffres | Agrandi et centré, affiche correctement le compteur |
| 65 | `dash-position` et `dash-position-label` affichaient 2 formats différents ("3ème" vs "3e") | Format unifié |
| 71 | Échange de joueurs sans validation (pouvait aligner 0 gardien) | Avertissement (non bloquant) si le onze de départ se retrouve sans gardien |

**Retest complet effectué** : 2 saisons, CAF jusqu'à la finale, save/load, reprise — toujours stable, budget final nettement plus raisonnable.



## 📋 Reste à corriger (~37 points, tous mineurs/cosmétiques) — pour une prochaine session

### CAF (impact réel très faible)
- Force des clubs CAF figée pendant la compétition en cours (le code de secours concerné ne se déclenche quasiment jamais en pratique)
- Tirs au but 50/50 aléatoires, ignorent les stats des joueurs

### Moteur de match
- Événements (corner + coup franc + but + carton) peuvent se cumuler sur la même minute
- Pas de temps additionnel, pas de prolongation

### Économie (calibrage fin, pas de bug)
- Budget des clubs IA toujours basé sur une formule inventée (`force² × 500`) plutôt que sur un vrai modèle économique par club

### Interface (cosmétique, mais visible)
- Plusieurs éléments HTML jamais mis à jour (`#staff-budget-display`, `#dash-match-competition`, `#live-status-text`)
- Vue `#view-inbox` entièrement morte (remplacée par `#inbox-overlay`, jamais nettoyée)
- Mélange d'`alert()`/`confirm()` natifs et de notifications maison

### Qualité de code
- Beaucoup de méthodes à l'indentation cassée (signe de patchs successifs non consolidés) — cosmétique pur, aucun impact fonctionnel

### Autre
- Migration hors du CDN Tailwind (JIT en prod) — décision d'infrastructure, hors périmètre d'un patch de bugs

---

## Repères de marché africain utilisés pour le lot 3 (recherche web)
- Salaires réels Ligue 1 ivoirienne : 100 000 – 650 000 FCFA/mois (~150 – 1000 €)
- Billets de championnat domestique africain : 5 – 20 $
- Prime CAF Champions League 2025/26 pour le vainqueur : ~6 M$ (le jeu est à 5 M€, cohérent)
- Transferts de stars africaines vers l'Europe : 30-80 M€ (hors périmètre — le jeu modélise des transferts intra-Afrique, bien plus bas)
