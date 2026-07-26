# Changelog — Audit & correctifs AECM (25-26/07/2026)

**75 correctifs et 2 fonctionnalités** appliqués sur 114 points identifiés (dont 9 bugs découverts en cours de correction, absents de l'audit initial).
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



## Lot 5 — Moteur de match, CAF, économie IA, interface (10 correctifs)

Session du 26/07/2026. Ce lot attaque la liste « Reste à corriger » du lot 4 : tous les points
de moteur de match, de CAF et d'interface morte sont traités.

| # | Bug / Point de design | Correction |
|---|------------------------|------------|
| 88 | Corner + coup franc + carton + action de but pouvaient tomber sur **la même minute** (commentaire incohérent, jusqu'à 3 tirs simultanés) | Un seul événement par minute. `pickMinuteEvent()` tire **un seul** nombre aléatoire comparé aux poids cumulés — les probabilités marginales de chaque événement sont conservées à l'identique, mais ils s'excluent mutuellement. *Vérifié sur 200 000 tirages : écart max 0,05 point vs les taux d'origine.* |
| 89 | Pas de temps additionnel — le match s'arrêtait pile à 90'00 | Arrêts de jeu générés au coup d'envoi (1-3 min en 1re période, 2-5 min en 2e), annoncés en commentaire, joués réellement. Horloge remappée : `45+2'`, `90+3'`. Tous les garde-fous `minute < 90` recalés sur `maxMinute` |
| 90 | Tirs au but à 50/50 (`Math.random() > 0.5`) — un club très supérieur éliminé une fois sur deux | Vraie séance simulée : 5 tireurs (meilleurs `finishing`/`composure` du onze) contre le gardien adverse (`positioning`), puis mort subite. *Testé sur 10 000 séances : 82 % pour le meilleur à 25 points d'écart d'OVR, 51 % à égalité — la loterie reste une loterie* |
| 91 | Force des clubs CAF **figée** au jour du tirage : blessures, suspensions, transferts et progression n'avaient aucun effet sur les matchs de CAF | `refreshCAFForces()` recalcule la force de tous les clubs engagés (groupes, quarts, demies, finale) à partir de leur effectif réel, appelée après chaque journée jouée ou simulée |
| 92 | Budget des clubs IA basé sur une formule inventée (`force² × 500`), sans lien avec le modèle économique du jeu ni avec le championnat | Dérivé des **mêmes sources de revenus que le club utilisateur** (billetterie recalibrée au lot 4, droits TV, sponsors), pondérées par le poids économique réel de chaque championnat. Budget de transfert = 30 % du CA annuel. *Effet : Al Ahly (Égypte) ~3,1 M€, l'ASEC à force égale ~1,3 M€ — la hiérarchie économique entre championnats existe enfin* |
| 93 | `#staff-budget-display` jamais mis à jour (affichait « 0 M€ » en dur) | Mis à jour à chaque ouverture de la vue Staff |
| 94 | `#dash-match-competition` affichait « Championnat » en dur, même avant une finale de CAF | Affiche la vraie compétition : Championnat / CAF — Phase de groupes / Quart / Demi-finale / Finale |
| 95 | `#live-status-text` figé sur « En Cours », y compris à la mi-temps et après le coup de sifflet final | `updateLiveStatus()` : En Cours / Mi-temps / Temps add. / Terminé, avec la couleur correspondante |
| 96 | Vue `#view-inbox` entièrement morte (remplacée par `#inbox-overlay`, jamais nettoyée) | Bloc supprimé du HTML — la boîte de réception ne passe plus que par `#inbox-overlay` / `#inbox-content` |
| 97 | Mélange d'`alert()`/`confirm()` natifs et de notifications maison (bloquants, hors charte, bloqués par certains navigateurs mobiles) | **Plus un seul `alert()` ni `confirm()` natif.** Erreurs → notifications maison ; messages informatifs → `showAlert()` ; les 3 `confirm()` (vente, prolongation, effacement de sauvegarde) → modale `showConfirm()` avec callback. La vente revérifie l'effectif à la validation, la modale étant asynchrone |

**Tests de ce lot** : distribution des événements de match validée sur 200 000 tirages,
séances de tirs au but sur 10 000 simulations, modèle de budget IA comparé à l'ancienne
formule sur les 10 championnats. Syntaxe validée, structure HTML rééquilibrée après
suppression du bloc mort (182 `<div>` / 182 `</div>`).


## Lot 6 — Prolongation, économie IA persistante, joueurs perdus (5 correctifs)

Ce lot solde la liste du lot 5 : la prolongation (le point volontairement laissé de côté)
et le budget persistant des clubs IA. Un bug **majeur** non identifié à l'audit initial a
été découvert en travaillant sur l'économie : les joueurs vendus disparaissaient du jeu.

| # | Bug / Point de design | Gravité | Correction |
|---|------------------------|---------|------------|
| 98 | **Pas de prolongation** : un quart/demi retour ou une finale à égalité s'arrêtait au coup de sifflet et le vainqueur était décidé aussitôt aux tirs au but | 🟠 Majeur | Prolongation réglementaire de 2 × 15 min + arrêts de jeu, avec pause à la mi-temps de prolongation, coup de fatigue de 8 points d'énergie sur les 22 joueurs, changement supplémentaire de l'IA, et horloge étendue (`105+1'`, `120+2'`). Le déclenchement respecte le **cumulé ET la règle du but à l'extérieur** — le match aller ne part jamais en prolongation. Séance de tirs au but jouée et **affichée en direct** si l'égalité persiste, puis réutilisée telle quelle par `processCAFKnockoutStats` (pas de second tirage qui contredirait ce que vous venez de voir à l'écran) |
| 99 | Limite de 5 remplacements même en prolongation | 🔵 Règle | 6e remplacement accordé en prolongation (règle IFAB), pour vous **et** pour l'IA. Le compteur « X restants » suit |
| 100 | Le score de la séance de tirs au but n'était nulle part | 🟡 Confort | `simulatePenaltyShootout` renvoie `{ winner, scoreA, scoreB }` — affiché en commentaire de match et dans le tableau CAF (« 4-3 t.a.b. » au lieu de « TAB »), et sauvegardé |
| 101 | Budget des clubs IA **recalculé à neuf à chaque arbitrage** : un club IA ne s'appauvrissait jamais et pouvait acheter à l'infini | 🟠 Majeur | Solde courant persistant dans `club.budget` (sauvegardé avec `globalData`, initialisé à la volée pour rester compatible avec les anciennes sauvegardes). Il se vide à l'achat, se remplit à la vente, et est recrédité de son allocation annuelle en début de saison, plafonné à 3 années. L'IA **vérifie désormais qu'elle peut se payer le joueur** avant de recruter — ce qu'elle ne faisait pas du tout |
| 102 | **Un joueur vendu à un club IA disparaissait purement et simplement du jeu** — retiré de votre effectif, jamais ajouté chez l'acheteur | 🔴 Bloquant (silencieux) | Le joueur rejoint l'effectif du club acheteur, avec un contrat, et l'acheteur paie réellement le transfert. *Non détecté à l'audit initial : rien ne plante, le joueur s'évapore simplement — plus jamais croisé en championnat, jamais revendu, absent du classement des buteurs* |

**Tests de ce lot** : horloge validée sur les deux périodes de prolongation et leurs arrêts de
jeu ; déclenchement de la prolongation validé sur 10 scénarios (finale, phase de groupes,
championnat, match aller, et 5 configurations de match retour incluant les départages au
but à l'extérieur) ; cycle de vie du budget IA simulé sur 3 saisons avec achats, ventes,
plafonnement et refus pour fonds insuffisants — le solde ne devient jamais négatif.


## Lot 7 — Dernier passage d'audit : CAF entre saisons, contrats IA, agents libres (7 correctifs)

Aucun point de la liste « Reste à corriger » n'était fonctionnel — j'ai donc repassé le code
au crible plutôt que de faire une passe cosmétique. **Sept bugs supplémentaires trouvés, dont
deux qui n'apparaissent qu'à partir de la saison 2 et un uniquement après un rechargement.**

| # | Bug | Gravité | Correction |
|---|-----|---------|------------|
| 103 | `initCAF` créait des **copies** des clubs qualifiés, mais le rechargement (`findRealClub`) les remplaçait par les vrais clubs du classement. Le jeu ne se comportait donc pas pareil avant et après un rechargement | 🟠 Majeur | Les clubs CAF référencent désormais **toujours** les objets réels des classements. C'est aussi la cause racine de #104 |
| 104 | **Les compteurs CAF n'étaient JAMAIS remis à zéro entre les saisons.** Le classement du championnat l'était bien (points, buts, forme), mais pas `cafPoints`/`cafW`/`cafD`/`cafL`/`cafGF`/`cafGA` | 🔴 Bloquant | Remise à zéro au tirage. *Sans ça, dès la saison 2 les groupes démarraient avec les points de la saison précédente et la qualification pour les quarts se jouait sur des résultats périmés. Invisible en test si l'on ne recharge pas la partie entre les deux saisons* |
| 105 | `cafGF`/`cafGA` **non sauvegardés** : le départage au goal-average (FIX #14) était perdu à chaque rechargement, les groupes retombaient sur un tri aux seuls points | 🟠 Majeur | Ajoutés à la sauvegarde et à la restauration. *Régression silencieuse du FIX #14* |
| 106 | **Les contrats des joueurs IA n'expiraient jamais** — seul votre effectif était décrémenté. Vous étiez le seul club du continent à perdre des joueurs libres | 🟠 Majeur | Contrats IA décrémentés eux aussi. À l'expiration, le club reconduit dans la plupart des cas (cadres et effectifs courts systématiquement) ; sinon le joueur part et rejoint le vivier d'agents libres |
| 107 | Le vivier d'agents libres ne faisait que **grossir** : les joueurs coupés par l'IA s'y accumulaient sans jamais vieillir, prendre leur retraite ni être purgés | 🟡 Perf / cohérence | Vieillissement annuel (progression avant 30 ans, déclin après), retrait à 37 ans, vivier borné aux 60 meilleurs (les plus jeunes à qualité égale) |
| 108 | Promotion d'académie : stats par défaut incomplètes (`composure`, `dribbling`, `strength` manquants — trois stats utilisées par le moteur de match, qui retombaient sur l'OVR brut en ignorant fatigue et moral), et `\|\|` sur énergie/moral à zéro | 🟡 Confort | Stats complétées, `??` à la place de `\|\|`. *Le même piège que le FIX #73, resté dans ce coin du code* |
| 109 | Conséquence directe de #106 : une fois les contrats IA rendus périssables, **plus rien ne reconstituait les effectifs IA**, qui convergeaient tous vers le plancher de 16 | 🟠 Majeur | Les clubs IA recrutent dans le vivier d'agents libres en ciblant leur poste le plus dégarni. Le vivier cesse du même coup d'être un cul-de-sac : les joueurs libérés retrouvent un club |

**Tests de ce lot** : remise à zéro des compteurs CAF vérifiée sur deux tirages consécutifs
(0 club héritant de points) ; aller-retour de sauvegarde des groupes contrôlé champ par champ ;
**simulation de 6 saisons sur un monde complet de 200 clubs / 4 000 joueurs** — les effectifs IA
se stabilisent à 17,9 joueurs de moyenne, ne descendent jamais sous le plancher de 16, aucun
contrat expiré ne reste non traité, le vivier d'agents libres circule (34-60) au lieu de
saturer, et l'effectif utilisateur n'est jamais touché par la gestion IA.

*Réserve honnête sur ce chiffre : le banc de test ne modélise pas le vieillissement et les
retraites des joueurs sous contrat, ni les promotions d'académie des clubs IA. L'équilibre réel
en jeu sera un peu différent — il est simplement montré ici que la boucle contrats → agents
libres → recrutement ne fuit pas.*


## Lot 8 — Un continent qui vit sans vous : marché IA↔IA et académies IA (2 fonctionnalités)

Ce lot n'est pas un correctif : ce sont les deux pistes d'approfondissement restantes. Elles ont
été ajoutées **sans toucher à la structure du fichier** — aucun découpage en modules, aucun
déplacement de code existant. Deux nouvelles méthodes, trois points de branchement.

| # | Fonctionnalité | Ce qui a changé |
|---|----------------|-----------------|
| 110 | **Marché IA ↔ IA** | Les clubs IA ne pouvaient recruter que dans `marketPool`, le vivier commun, et n'initiaient jamais de vente. Ils ne se parlaient pas : un club en difficulté financière ne pouvait pas se refaire une trésorerie, et un bon joueur coincé en 15e position d'un effectif n'en bougeait jamais. Désormais, toutes les 3 journées, 3 à 5 négociations s'ouvrent : le club acheteur identifie **son poste de titulaire le plus faible**, cherche mieux ailleurs, et achète dans ses moyens. Le vendeur ne cède jamais son meilleur joueur au poste ni ne descend sous 17 joueurs. **Vente forcée** : un club dont la trésorerie tombe sous 20 % de son enveloppe annuelle brade à −25 % — le mécanisme qui lui manquait pour se renflouer |
| 111 | **Académies des clubs IA** | Les clubs IA n'avaient aucun centre de formation : ils ne se renouvelaient que par le marché et, depuis le lot 7, par les agents libres. À long terme le continent vieillissait sans relève, pendant que vous, seul, produisiez des jeunes. Chaque intersaison, les clubs IA sortent 0 à 2 joueurs de 17-19 ans. **La qualité dépend de la stature du club et du poids économique de son championnat** : les Sundowns ou Al Ahly forment nettement mieux qu'un club de milieu de tableau camerounais. Vous êtes averti par message quand une vraie pépite (potentiel ≥ 85) sort ailleurs qu'à vos couleurs |

Deux points d'appui techniques au passage : le coefficient économique par championnat, jusque-là
enfermé dans `getAIClubAnnualBudget`, est remonté au niveau module (`LEAGUE_TIER`) puisque
l'académie IA en dépend aussi ; et `reorderAISquad()` retrie l'effectif après chaque mouvement
(gardien en tête, puis par niveau) — sans quoi `squad.slice(0, 11)` aurait pu aligner une recrue
au hasard, voire un onze sans gardien.

**Tests de ce lot** : simulation de **8 saisons sur le monde réel du jeu** (10 championnats,
199 clubs IA, effectifs générés par le moteur), contrats, agents libres, budgets et académies
tournant ensemble.

- Aucun invariant violé : effectifs toujours entre 17 et 25, jamais un club sans gardien titulaire, jamais un budget négatif, effectif utilisateur jamais touché par la gestion IA
- **Équilibre compétitif préservé** : l'écart de force entre le meilleur et le pire club IA passe de 15 à 18 points sur 8 saisons — le marché fait bouger la hiérarchie sans la faire exploser, et la force médiane reste stable à 75
- Volumétrie : ~50 transferts IA↔IA par saison sur 199 clubs (environ un club sur quatre conclut un transfert dans l'année), fee moyen ~4 M€, cohérent avec les enveloppes calibrées au lot 4
- La clause de vente forcée se déclenche bien : jusqu'à 10 clubs simultanément à sec en cours de saison
- Académies : ~130 jeunes promus par saison sur l'ensemble du continent, se stabilisant autour de 3 diplômés par effectif

*Un réglage important est venu du test et non de la conception : à la première version, le club
acheteur visait le meilleur joueur disponible puis vérifiait son budget à la fin — la quasi-totalité
des négociations échouaient au dernier moment et le marché ne produisait que 6 à 7 transferts par
saison. Le prix est maintenant calculé dès la prospection et les cibles hors budget sont écartées
d'emblée : un club fait son marché dans ses moyens. Le volume est passé de 7 à ~50.*

---
## 📋 Reste à faire — pour une prochaine session

Aucun bug fonctionnel connu, et les deux pistes d'approfondissement sont implémentées.

### Qualité de code (aucun impact sur une partie)
- Beaucoup de méthodes à l'indentation cassée (patchs successifs non consolidés) — cosmétique pur. Une passe Prettier réglerait tout d'un coup, mais rendrait illisible tout `diff` ultérieur avec vos versions précédentes : à garder pour quand vous n'aurez plus besoin de comparer
- `app.js` dépasse 9 000 lignes dans un seul fichier. Le découpage en modules reste le vrai investissement pour la suite — mais c'est une opération à mener seule, à froid, avec un test de bout en bout avant et après, pas en fin de session de correctifs

### Autre
- Migration hors du CDN Tailwind (JIT en prod) — décision d'infrastructure, hors périmètre d'un patch de bugs

---

## Repères de marché africain utilisés pour le lot 3 (recherche web)
- Salaires réels Ligue 1 ivoirienne : 100 000 – 650 000 FCFA/mois (~150 – 1000 €)
- Billets de championnat domestique africain : 5 – 20 $
- Prime CAF Champions League 2025/26 pour le vainqueur : ~6 M$ (le jeu est à 5 M€, cohérent)
- Transferts de stars africaines vers l'Europe : 30-80 M€ (hors périmètre — le jeu modélise des transferts intra-Afrique, bien plus bas)
