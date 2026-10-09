# Sélectionneur : candidature et démission corrigées (09/10/2026)

- **Candidature** : elle n'embauche plus immédiatement. La fédération étudie le dossier pendant 2 journées puis répond selon la réputation, les étoiles du coach et le classement du club. Elle peut refuser. La carte de l'écran Manager affiche l'état réel (candidature en attente, refusée…).
- **Démission** : elle est définitive pour la saison. Plus d'offre spontanée et plus de candidature possible avant la saison suivante, ce qui évite d'être réembauché d'un simple toucher. Message de confirmation et article de presse.

# Les 76 animations utilisées, sans exception (09/10/2026)

Les 25 dernières animations jamais jouées sont maintenant toutes en jeu :
- **Courses en diagonale** (5) : avancer ou reculer en biais en gardant l'œil sur le ballon. Le sens de chaque clip a été mesuré (rotation du bassin) pour éviter les « pas de danse à l'envers ».
- **Élan** (`transition`) : un joueur qui démarre s'élance parfois.
- **Crochet** (`soccer_spin`) : contrôle orienté quand un adversaire est dans son dos.
- **Contrôles** : 2e contrôle du genou, 4 contrôles de semelle de plus, 4e tête.
- **Jongles pendant les arrêts de jeu** (`kick_up_soccerball`, semelles) : celui qui a le ballon jongle en attendant la reprise (touche, faute, remplacement), jamais en plein jeu.
- **Gardien** : 2e pas chassé, 2e attente, 2 prises de balle et 2 parades du corps de plus ; après une prise de balle, il **pose le ballon** pour relancer.
- **Blessure** (`cel_dying`) : le joueur s'effondre, reste au sol, puis se relève.
- **Carton rouge direct** : la victime du tacle s'écroule lourdement (`cel_brutal_assassination`), l'expulsé conteste face à l'arbitre (`cel_fist_fight_b`) avant de sortir.
- Carton jaune : la victime de la faute tombe et se relève.
Le moteur 3D est désormais prévenu des cartons et des blessures (nouveaux événements).

# Vers le niveau de FM / SM : banc, analyse, vestiaire, actu, sélectionneur, animations, son (09/10/2026)

**Pendant le match**
- **Cris du banc** (bouton « Banc » en haut à gauche) : Encouragez, Exigez plus, Resserrez, Calmez-vous. Effet de 10 minutes sur le danger créé/concédé, la fatigue, les cartons et le moral, puis 5 minutes de recharge. Les fortes têtes n'aiment pas qu'on les secoue.
- **Onglet Analyse** (ex-Zones) : **carte des tirs** (position réelle, taille = xG, plein = but) et **courbe des xG cumulés** minute par minute, nombre d'occasions franches, puis les cartes de chaleur.
- Couleurs de maillot toujours lisibles sur fond sombre dans les graphiques et les stats.

**Personnalités et vestiaire**
- Les traits existants (Bosseur, Leader, Fort caractère, Fidèle, Professionnel, Ambitieux…) pèsent désormais aussi **en match** : cartons pour les caractériels, sang-froid sur penalty et en fin de match pour les pros et les leaders, défaites plus ou moins bien encaissées.
- **Vestiaire** (bouton dans Effectif) : ambiance du groupe en anneau, cadres, influents et groupe en visages avec leur moral, alerte quand un cadre râle. Un leader sur le terrain soude le groupe après une victoire ; un vestiaire tendu fait baisser le moral de tous.
- Trait affiché dans la liste de l'effectif.

**Fil d'actu** (Messagerie › Fil d'actu)
- Supporters, presse et rumeurs réagissent après chaque match : résultat, homme du match, joueur en difficulté, rumeurs de transfert, tête du classement. Sauvegardé.

**Sélectionneur national**
- La fédération de votre pays vous propose le poste (ou candidature depuis l'écran Manager). Vous convoquez **23 joueurs** parmi tous ceux de la nationalité, dans tous les championnats.
- **CAN jouable** (années paires) : 16 nations, 4 poules, quarts, demies, finale, tirs au but ; plan de jeu choisi avant chaque match (prudent, équilibré, offensif). **Éliminatoires** les années impaires.
- Confiance de la fédération, bilan, titres ; limogeage si les résultats ne suivent pas. Le match de la sélection passe avant la journée du club.

**Animations 3D** : frappe de penalty, ciseau acrobatique (rare), 3 gestes de tête, contrôles du genou et de la semelle, relance à la main du gardien, prises de balle et parades du corps variées, joueur qui reste un instant au sol, 3 célébrations de plus (9 au total, jamais deux fois de suite la même).

**Son** (synthétisé, aucun fichier ajouté) : applaudissements sur les arrêts et au coup de sifflet final, sifflets et huées sur les cartons, chants de supporters sur les corners et pendant le jeu, ambiance plus forte les soirs de CAF.

**Corrigé** : bouton 2D/3D parfois absent au lancement du match (erreur au coup d'envoi).
Traductions anglaise et arabe ajoutées (111 textes). Taille de l'application inchangée.

# Fenêtres par-dessus le jeu : coupe nationale, CAF, fin de mois (08/10/2026)

- **Tirage de la coupe nationale** : l'ancienne fenêtre (bordures, émojis, listes de noms) est remplacée par une fenêtre visuelle. À gauche, coupe dessinée, tour suivant, pastille Qualifié/Éliminé et bouton Continuer ; à droite, les affiches en écussons face à face (la vôtre en orange) et les qualifiés en écussons.
- **Après un match de CAF** : l'écran d'après-match affichait « a.p. » pour un simple match de poule (le temps additionnel était pris pour une prolongation). Corrigé.
- **Avant-match CAF** : la ligne « undefined » dans « Comment ils jouent » est supprimée (adversaire continental sans couloir d'attaque défini). Nom unifié : « Ligue Elite Africaine » partout, y compris sur les compositions.
- **Bilan du mois** : la fenêtre texte avec émoji devient un résultat en grand (vert ou rouge), avec recettes et dépenses en barres.
Vérifié avec un vrai match de poule CAF joué de bout en bout : aucune erreur.

# Consignes, Entraînement, Notes et après-match allégés (08/10/2026)

| Écran | Avant | Maintenant |
|---|---|---|
| **Notes en direct** | Moyenne et homme du match sous le terrain (cachés, il fallait défiler) | Barre fine **au-dessus** du terrain : moyenne + ★ homme du match avec visage et note |
| **Bilan du match** (Stats, fin de match) | Phrases longues | **Tuiles courtes** : chiffre clé + 2-3 mots (ex. « 1.9 · xG gâchés »), couleur positive/négative/alerte ; la phrase complète au toucher |
| **Après-match** (Notes du match) | Tableau texte avec émojis | Score et écussons en grand (fond vert/rouge selon le résultat), 3 barres possession/tirs/xG aux couleurs des maillots, **homme du match** mis en avant, joueurs en **tuiles** (visage, note colorée, buts/passes en icônes), bouton Continuer |
| **Tactique › Consignes** | 15 vignettes en grille, gros boutons empilés, 4 sous-sections avec descriptions | Formations en **une bande déroulante** ; **mini-terrain** qui dessine vos réglages (ligne, zone de pressing, couloirs, style) à côté de **5 lignes compactes** (Mentalité, Style, Couloir, Pressing, Ligne) ; sous-sections en tuiles 2×2 sans description ; contour des vignettes supprimé |
| **Consignes en direct** | Grille de formations + 6 rangées de boutons | Même tableau compact, **tient sur un écran sans défiler** |
| **Entraînement › La semaine** | 3 panneaux empilés (665 px), barres et paragraphe | 2 cartes côte à côte (330 px) : séances, verdict en pastille, effets et automatismes en **anneaux**, intensité en sélecteur |
| **Entraînement › Effectif** | Une grande carte par joueur (2 000 px) | **Une ligne par joueur** (moitié moins haut) : visage, poste/âge, attributs à travailler, anneau de progression (jours avant +1), note |
Vérifié : aucun contour, aucune erreur, tous les choix restent fonctionnels.

# Vérification complète et corrections (08/10/2026)

- **Bouton « Voir les résultats de la journée »** : en fin de match il était caché sous le tableau de score (barre orange sans texte). Il est maintenant en bas au centre, à la place du bandeau de commentaire.
- **Bandeau du bas** : le score n'est plus collé au texte (« (xG: 0.13)0 - 1 »).
- **Fil du direct** : l'écusson de l'équipe s'affiche aussi pour les buts, changements et phrases « l'adversaire » (repérage par le nom du joueur).
- **Bouton de droite** (Direct / Stats / Notes / Zones) : il suit maintenant l'onglet choisi dans le panneau.
- **Notes** : terrain compact dans le panneau du match, noms jamais cachés (testé sur les 15 formations).
- **Encadrement** : rangée de filtres qui faisait déborder la page de 4 px.
Contrôlé : 16 écrans sans erreur ni bordure, 5 tests automatiques OK, match complet (mi-temps, changement sur blessure, fin) sans erreur.

# Coupe d'Afrique (phase finale) et écrans du match rendus visuels (08/10/2026)

| Écran | Avant | Maintenant |
|---|---|---|
| **Coupes africaines › phase finale** | Ancien style texte, vide tant que la phase n'était pas jouée | **Tableau à élimination** toujours affiché : 8es → Quarts → Demies → Finale → Champion. Écussons, score cumulé aller-retour (détail des deux matchs, t.a.b.), vainqueur en vert, votre parcours en orange, « À venir » pour les cases pas encore tirées, coupe dorée et écusson du champion à la fin |
| **Match › Direct** | Phrases de commentaire empilées | **Fil chronologique** : minute, pictogramme (but, carton, changement, blessure, occasion, coup de pied arrêté, sifflet), écusson de l'équipe concernée ; les buts en bandeau orange avec le score |
| **Match › Stats** | Barres d'une seule couleur | **Barres face à face** partant du centre, aux couleurs des maillots des deux équipes, valeur dominante en blanc ; **anneau de possession** bicolore ; écussons en tête |
| **Match › Notes** | Liste de noms | **Terrain vu de dessus** : chaque titulaire à son poste, note en pastille colorée, **anneau d'énergie** autour du visage, buts/passes/cartons en badges ; homme du match en orange, moyenne et nombre de joueurs fatigués |
| **Match › bilan final** | Lignes de texte | Cartes colorées : ▲ positif (vert), ▼ négatif (rouge), ! alerte (ambre) |
Vérifié : aucun contour ajouté, couleurs de la charte (maillots des clubs pour les stats). Zones (cartes de chaleur) et Consignes (vignettes de formation) étaient déjà visuelles.

# Écrans textuels rendus visuels : CAF, Palmarès, Bilan, fin de saison (08/10/2026)

| Écran | Avant | Maintenant |
|---|---|---|
| **Coupes africaines** | 8 grands tableaux de poule empilés, en-tête volumineux | En-tête sur une ligne avec la **frise des phases** (Poules → 8es → Quarts → Demies → Finale, phase en cours en orange) ; **8 poules en cartes compactes** (écusson, abréviation, barre de points, qualifiés repérés), votre poule en premier et en orange ; bandeau doré du champion d'Afrique |
| **Palmarès** (Héritage › Palmarès) | Liste de saisons avec petites icônes | **Vitrine à trophées** dessinée : coupe du championnat, coupe continentale, Ballon d'Or, Soulier d'Or, Gant d'Or, Espoir — or si gagné (« ×2 », saisons), silhouette sinon |
| **Palmarès individuel** (Trophées) | Noms en lignes | Tuiles : trophée (doré si chez vous), visage du lauréat, écusson du club |
| **Bilan de saison** | Petit tableau J/G/N/P | Cartes par compétition : anneau du % de victoires, barre victoires/nuls/défaites, buts marqués/encaissés ; **forme** des 10 derniers matchs en tuiles (écusson adverse, score, couleur du résultat) |
| **Fin de saison** | Fenêtre verticale qui débordait en paysage | Deux colonnes en paysage (résultat / actions) |
Vérifié : aucun contour sur ces écrans. Déjà visuels et laissés tels quels : Distinctions, Staff, Profil du manager, Entraînement, Messagerie.

# Ralenti du but, comme à la télé (08/10/2026)

Après chaque but (en 3D), l'action est **rejouée au ralenti** : les 4 dernières secondes avant le but, à 45 % de la vitesse (~9 s), caméra au ras de la pelouse sur le côté qui suit le ballon, bandeau « ● RALENTI » orange rayé et bandes noires de cinéma, fondus au noir à l'entrée et à la sortie. Le tireur refait son geste de frappe.
- Le moteur garde en mémoire les 8 dernières secondes (positions des 22 joueurs, du ballon, frappes) — `recordFrame`.
- Pendant le ralenti, le match reste figé (ordres, minuteries, chrono) puis reprend là où il en était ; les événements survenus pendant ne sont pas rejoués.
- Un toucher sur le terrain passe le ralenti.

# Babylon enrichi : effets visuels du stade (08/10/2026)

| Élément | Détail |
|---|---|
| Moteur 3D | `vendor/babylon-aecm.js` reconstruit (même Babylon 9.29.0) avec post-traitements, halo, particules et reflets de projecteurs : 3,5 → 3,9 Mo. Recette : `tools/babylon/` |
| Image | Anticrénelage (FXAA) et netteté sur tous les matchs ; la nuit, halo (bloom) sur les projecteurs et l'écran géant |
| Projecteurs | Reflets (lens flares) des projecteurs vers la caméra en nocturne |
| But | Confettis aux couleurs du club au-dessus des deux tribunes latérales, fumigènes colorés dans le public, feux d'artifice au-dessus du toit la nuit |
| Coup d'envoi | Les supporters des deux équipes allument leurs fumigènes |
| Fluidité | Si le téléphone peine, les effets se coupent d'abord (avant toute baisse de résolution) |
| Cinématique | Profite aussi des effets (nuit) |
Tout est généré par le code (textures des particules dessinées sur un canvas) : aucun fichier image ajouté.

# Touches et fautes dans le jeu (08/10/2026)

| Nouveauté | Détail |
|---|---|
| **Touches** | Le ballon sort sur les côtés : porteur pressé le long de la ligne, ballon long / centre / changement d'aile trop appuyé, tacle qui dévie en touche. Le joueur adverse le plus proche va au ballon et remet en jeu **à la main** (geste `throw_in` en 3D, ballon en cloche) — environ 6 par match |
| **Fautes** | Une partie des tacles est sifflée (coup de sifflet) : l'équipe qui avait le ballon le garde et joue un coup franc court — environ 2 à 3 par match. Les coups francs dangereux restent gérés par le match comme avant |
| Remplacements | Touches et fautes sont aussi des ballons morts : les remplacements en attente s'y font (en plus des sorties de but et des engagements) |
| Ballon | Filet de sécurité dans `ballNow` : un ballon libre loin de son porteur le rejoint par un court trajet au lieu d'être recollé d'un coup |
| Tests | Les tests de la simulation (`tests/*.js`) fonctionnent à nouveau directement (fins de ligne Windows de `app.js`) ; 0 saut de ballon mesuré sur 8 matchs simulés |

# Remplacements uniquement quand le ballon est mort (07/10/2026)

Trop d'arrêts de jeu : un remplacement ne crée plus d'arrêt. Il est validé tout de suite (le moteur compte déjà le nouveau joueur), mais en 3D il **attend un ballon mort** : sortie de but ou engagement (après un but, à la mi-temps). Pendant l'attente, le joueur remplacé continue de jouer et le remplaçant s'échauffe debout devant le banc.
Au ballon mort : le jeu reste arrêté **exactement** le temps de l'échange (le sortant quitte la pelouse, puis l'entrant rejoint sa place), puis repart. Les déplacements suivent le temps réel (indépendants de la fluidité du téléphone) ; filet de sécurité de 25 s.
Corners et coups francs ne servent pas de moment de remplacement : le moteur les joue sur des minuteries qu'on ne peut pas suspendre proprement.

# Remplacements selon les règles du football (07/10/2026)

Avant, le joueur remplacé sortait et le remplaçant entrait pendant que le jeu continuait. Désormais (`Match3D.substitute`) :
1. le jeu s'ARRÊTE (ordres figés et chrono arrêté : `MATCHSIM.hold` + `holdScene`) ;
2. le remplaçant se lève et attend sur la ligne de touche, à hauteur de la ligne médiane ;
3. le joueur remplacé quitte la pelouse par la ligne médiane ;
4. seulement alors le remplaçant entre et rejoint sa place ;
5. le jeu reprend ; le joueur sorti va s'asseoir sur le banc.
Durée de l'arrêt calculée sur la distance à parcourir (5 à 22 s).

# Match plus vivant : silhouettes, banc animé, tambours, écran géant (07/10/2026)

| Élément | Détail |
|---|---|
| Silhouettes | Nouveau joueur de champ (cheveux longs) dans la rotation des 22, aux couleurs du club ; chaque joueur a sa taille (±5 %) et sa carrure (±4 %), stables d'un match à l'autre |
| Gardiens | Gardien domicile violet, gardien extérieur vert (nouveau modèle), gardien remplaçant violet/vert : ils gardent leurs propres couleurs |
| Détail | Modèles détaillés (« match ») sur tous les appareils |
| Banc vivant | Assis, staff et remplaçants suivent le ballon de la tête et respirent ; ils **applaudissent** les occasions de leur équipe (assis), le préparateur aussi ; l'entraîneur **longe sa zone technique** en pas chassés pour suivre le jeu |
| Tambours de supporters | Rythmes de tribune synthétisés (doum, claque, mains), 3 motifs qui alternent ; plus forts quand le ballon approche d'un but, ils s'emballent 8 s après un but. Aucun fichier audio |
| Foule | « Ooooh » sur une vraie occasion manquée ; clameur plus longue sur un but ; la nappe de foule suit enfin l'action (elle n'était jamais pilotée) |
| Écran géant | Au-dessus de la tribune derrière le but : « EN DIRECT », noms sur les couleurs des maillots, score, minute ; « BUT ! » sur bandes orange pendant 6 s après un but |
| Poids | +0,4 Mo (3 modèles à ~130 Ko) |

# Bancs et nouvelles animations sur TOUS les appareils (07/10/2026)

Plus aucun tri par appareil : les abris, le staff, les 7 remplaçants, leurs réactions et les remplacements en direct s'affichent aussi sur les téléphones modestes (avant : rien sur ces téléphones, et 5 remplaçants au lieu de 7 sur les écrans étroits).

# Écran toujours allumé en jeu (07/10/2026)

Le téléphone se mettait en veille au bout de quelques secondes, même pendant un match. `MainActivity` pose maintenant `FLAG_KEEP_SCREEN_ON` : l'écran reste allumé tant que le jeu est au premier plan, la veille normale reprend dès qu'on quitte l'appli. (Changement natif Android : il ne passe pas par `assets/www`.)

# Bancs de touche vivants : staff, remplaçants, remplacements en direct (07/10/2026)

| Élément | Détail |
|---|---|
| Nouveaux personnages 3D | 7 membres du staff (entraîneur en costume, entraîneur en survêtement, 2 adjoints, médecin, kiné, préparateur physique) + nouvel arbitre (`3d/staff/*.glb`). Les fichiers fournis (25 Mo chacun, sans squelette) ont été **squelettés automatiquement** (squelette des joueurs greffé, poids de peau transférés) puis allégés : ~6 000 triangles, texture 1024 WebP, meshopt → **110 à 155 Ko** chacun (1,1 Mo en tout). Script : `tools/rig_staff.mjs` |
| Bancs | Chaque banc : l'entraîneur debout dans la zone technique, 3 membres du staff assis, 5 à 7 remplaçants assis **aux couleurs du club** (gardien remplaçant compris), le préparateur physique debout à côté des remplaçants. Assise du banc ramenée à 45 cm |
| Poses ajoutées | Assis, bras levés, mains sur la tête (os orientés par le code : aucune animation de ce type n'existait) |
| Réactions | But : l'entraîneur et le préparateur bondissent bras levés, le staff et les remplaçants se lèvent pour fêter ; l'entraîneur adverse met les mains sur la tête puis donne des consignes. Occasion arrêtée : l'entraîneur de l'attaque met les mains sur la tête. Pendant le jeu : consignes régulières, il suit le ballon du regard |
| Remplacements en direct | Le remplaçant se lève, rejoint la ligne médiane et entre à sa place dans le jeu ; le joueur remplacé sort par le même endroit et va s'asseoir à sa place sur le banc (vous et l'adversaire, blessures comprises) — `Match3D.substitute`, appelé par `simReplace` |
| Cinématique | L'entraîneur est le vrai modèle en costume ; nouvel arbitre |
| Téléphones faibles | Pas de bancs (comme le décor des abris), aucun coût |

# Maillots 3D propres (07/10/2026)

| Problème | Correction |
|---|---|
| Maillots « déchirés », taches de la couleur d'origine | Recoloration **par triangle** du modèle (`kitMasks`) au lieu d'un tri pixel par pixel : chaque morceau de maillot ou de short est repeint en entier ; manches, col et chaussettes inclus |
| Plaques d'une autre couleur sur le short | Le short est repéré par triangle (hauteur sur le corps + couleur), plus de demi-short |
| Lignes sur le maillot, points clairs sur les bras | Bords des îlots de texture remplis avec la couleur de l'îlot voisin (`padIslands`) ; pixels d'arête mal attribués écartés |
| Plis trop sombres (maillot blanc sale) | Ombrage adouci (`paintZone`) |

# Carte joueur unique, partout (07/10/2026)

Une seule carte joueur, inspirée des cartes des jeux de football (forme d'écusson, note et poste en haut à gauche, drapeau et écusson du club, visage, nom, six attributs en deux colonnes), aux couleurs AECM et sans aucune bordure.
| Où | Ce qui change |
|---|---|
| Effectif (vue Cartes) | Carte unique + jauges Forme / Moral, alertes (contrat, ego) et soin dessous |
| Mercato | Carte unique (attributs « ? » tant que le joueur n'est pas supervisé) + boutons Superviser / Acheter / Signer dessous |
| Académie | Carte unique (potentiel en étiquette, bilan en réserve) + Promouvoir / Prêter dessous |
| Packs de joueurs | Les recrues apparaissent en cartes |
Paliers par note : élite ≥ 85 (orange), or ≥ 75, argent ≥ 65, bronze. Fonction commune : `playerCardHTML(p, opts)` dans `app.js`, styles `.pcd-*` dans `sm-shell.css`.

# Inspiration « jeux de gestion » appliquée partout, charte AECM conservée (07/10/2026)

Inspiré des captures fournies (Soccer Manager, Football Manager Mobile, FC Mobile, UFL), sans rien copier : uniquement l'orange #f97316 et les gris ui-900/800/700.
| Écran | Changement |
|---|---|
| Tous | **Aucune bordure, aucun contour** : règle globale (seuls les traits du terrain restent) ; faux contours en dégradé des cartes joueurs et « rings » supprimés ; vérifié sur les 16 écrans (0 contour) |
| Tous | Onglets façon SM : onglet actif en bloc orange plein, biseauté ; barres d'onglets plus fines (34 px) |
| Tous | Un nouvel écran s'ouvre en haut (il gardait le défilement de l'écran précédent) |
| Gemmes | Plus de violet (hors charte) : bleu ciel, comme l'icône du bandeau |
| Calendrier | Ligne façon FM : date · écusson · adversaire · D/E · **difficulté 1 à 5 colorée** (ou score V/N/D) · compétition ; seul le prochain match est en orange |
| Classement | En-tête sur une ligne (ligue + pays) ; zones sur la pastille du rang ; résultats de la journée « domicile · écusson · score · écusson · extérieur », votre match en orange |
| Effectif | Le tableau apparaît dès l'ouverture : tuiles de chiffres sur une ligne, titre masqué, en-tête de colonnes collant |
| Fiche joueur | Colonne gauche façon fiche de gestion (poste, valeur, âge, salaire, contrat, potentiel, matchs) ; **tuiles d'état** Moral / Forme / Disponibilité / Matchs ; actions sur une ligne ; notes d'attributs en cercles pleins |
| Mercato | Nouvel onglet **Transferts** : les transferts du continent (poste · note · joueur · club → club · montant · date), enregistrés et sauvegardés (`logTransfer`, `transferFeed`) |
| Campus | Carte du club : étiquettes des installations posées sur le stade, avec leur niveau en anneau orange (un toucher descend à l'installation) |
| Match | **But** : carte du buteur (note, poste, visage, nom) + grand bandeau orange rayé « BUT ! » ; **remplacement** : carte entrant ↗ / sortant ↙ avec écusson et minute (vous et l'adversaire) ; tableau de score aux couleurs des maillots |
| Cinématique | Nom du stade en bandeau : bloc icône + titre sur bande orange + capacité et compétition |

# Écrans de gestion refaits en « hubs » de jeu (07/10/2026)

L'accueil et ses onglets ne changent pas. Les autres écrans reprennent le langage des jeux de gestion actuels — en-têtes à tuiles et cartes (Football Manager 26), hubs à onglets (EA FC 26), vues d'ensemble par section (Soccer Manager 26) — sans en copier les designs, avec la charte d'AECM uniquement.
| Écran | Changement |
|---|---|
| Effectif | Tuiles (joueurs, note moyenne et du onze, âge moyen, masse salariale, indisponibles, contrats à régler) ; filtres par ligne ; tri (note, poste, âge, forme, valeur) ; **liste groupée par ligne** (visage, nationalité, poste, âge, note cerclée, potentiel, forme, moral, statuts, valeur, contrat, dernière note ; titulaires repérés) ; bascule Liste / Cartes (`renderSquadHub`) |
| Mercato | Tuiles (budget, mercato ouvert ou fermé avec jours restants, effectif, liste de suivi, gemmes) ; **hub à onglets** Recherche / Packs de joueurs / Prêts ; filtres sur une ligne ; grille de 4 à 5 joueurs |
| Entraînement, Académie, Manager, Palmarès, Campus | Tuiles de chiffres clés sous le titre ; panneaux sur deux colonnes |
| Campus | Stade 3D et installations sur toute la largeur |
| Tous | Longues explications repliées sur une ligne (ⓘ, un toucher les déplie) ; panneaux en grille à deux colonnes au lieu d'une pile |
Mécanique commune : `hubify()` dans `sm-shell.js` (tuiles `HERO`, onglets `TABS`, grille `.sm-masonry`, notes `.sm-note`), réappliquée à chaque rendu d'écran.

# Interface en paysage, façon jeu de gestion de football (06/10/2026)

L'application passe en **paysage** (`AndroidManifest.xml` : `screenOrientation="sensorLandscape"`). Deux nouveaux fichiers chargés après le jeu, `sm-shell.css` et `sm-shell.js`. Aucune logique de jeu n'est modifiée : tout passe par `app.switchView`, `app.startSimulationSequence`, `app.openGlobalSearch`, `app.openOffice`. **Couleurs : uniquement la charte existante** (brand-500 / brand-600, ui-900 / 800 / 700, jetons `--surface-grad`, `--text`, `--border`…). La mise en page s'active quand l'écran est plus large que haut (`html.land`) ; le portrait reste tel qu'avant.
| Écran | Changement |
|---|---|
| Coquille | Menu latéral avec toutes les sections, en trois groupes séparés par un filet de la marque ; élément actif en aplat dégradé ; badge des messages ; Réglages / Bureau / Recherche en pied de menu ; barre de progression de carrière rangée sous le logo |
| Barre du haut | Bouton retour (historique de navigation), écusson et nom, recherche, pastilles Crédits / Gemmes / Budget, grand bouton **Continuer** daté (joue la journée depuis l'accueil) |
| Onglets | Tous les sélecteurs à onglets (`.seg`, `#subnav`) deviennent des onglets soulignés |
| Accueil | Deux colonnes (prochain match à gauche, décisions et actualités à droite) |
| Effectif | Grille de 4 à 5 cartes par ligne |
| Tactique | Terrain à gauche, effectif en colonne à droite, à la hauteur de l'écran ; joueurs sur le terrain en **mini-cartes** (visage, note cerclée, poste, nom, jauge de forme) |
| Fiche joueur | Grande fenêtre en deux colonnes : identité et actions à gauche, détail à droite (statistiques sur 3 colonnes) |
| Nouvelle carrière | Deux colonnes : formulaire (nom, ligue, club, signature) à gauche, le manager en grand à droite (tenue, visage, âge), fond de stade éclairé |
| Classement | Vrai tableau : #, club, J, V, N, D, BP, BC, +/-, Pts, forme (pastilles V/N/D) ; bandes titre / continental / relégation ; votre club en dégradé de la marque |
| Fiche joueur | Attributs en pastilles rondes avec nom complet, cerclées de la couleur du niveau, jauge dessous (`statRings`) ; note globale en tête |
| Match — barre des joueurs | En bas : poste, nom, cœur d'énergie coloré, note en direct (même calcul que l'onglet Notes), cartons ; compteur de changements ; repliable |
| Match — carte du buteur | À chaque but (événement `goal` du moteur) : visage, nom, « BUT ! », minute et score, écusson, 4 s en bas à gauche |
| Match | 3D plein écran ; pastille de score centrée (chrono · domicile · score · extérieur) ; rail à droite (Tactique, Changer, Direct, Stats, Notes, Zones) qui ouvre les panneaux par-dessus la 3D ; bandeau du dernier commentaire en bas ; bouton de fin de match en bas à droite |

# Match 3D : duels au contact, décor par stade et par météo, caméra « retransmission » (06/10/2026)

**Jeu** : le ballon changeait de camp quel que soit l'écart, puis volait jusqu'au défenseur. À l'écran, ça donnait des tacles à 15 m et des « passes » à l'adversaire. En plus, l'ordre `midfield` tirait au sort l'équipe en possession toutes les deux minutes.
| Changement | Détail |
|---|---|
| `MATCHSIM.tackle` | Duel uniquement au contact (< 4,5 unités) : le défenseur va sur le ballon, le porteur est déséquilibré, le ballon reste au pied du duel |
| Interception (`pass(…, canCut)`) | Un adversaire sur la trajectoire coupe la passe : le ballon s'arrête sur lui, il y court |
| `MATCHSIM.regain` | L'ordre « k attaque » ne donne plus le ballon d'office : duel si un joueur de k est à moins de 7 unités, sinon ballon disputé à la retombée d'une passe. La frappe qui suit attend la fin de la récupération (`regainUntil`) |
| `midfield` / `forwardPass` | L'équipe qui a le ballon le garde et progresse par une vraie passe |
| Fin d'offensive | Le dernier geste sort derrière la ligne, puis sortie de but (le ballon ne vole plus de l'attaquant au gardien) |
| `winBall` | Fenêtres de contre-attaque par style : lisait `team.tac.style`, qui n'existe pas (toutes les équipes partaient 2 tours) |
Mesuré (`tests/match_flow_test.js` + sonde) : ballons « offerts » à l'adversaire (vol > 6 m) 24 → 3 par match, changements de possession 31 → 21 par match, tacle à 2,7 m en médiane.

**Décor 3D** (`match3d.js`, reconstruit à chaque match via `Match3D.setConditions`) :
| | |
|---|---|
| Ambiances | `MATCH_WEATHER` → nocturne (projecteurs, halos, étoiles), plein soleil, chaleur, harmattan (brume ocre), pluie (voile animé + brume + pelouse brillante), chaleur humide. Brouillard, contraste, exposition, tonalité ACES, vignette |
| Pelouse | Texture peinte : grain, taches, tonte en bandes (damier si « impeccable »), usure selon `PITCH_STATES` (surfaces, point de penalty, rond central, couloirs des arbitres assistants) |
| Stade | Selon `stadiumCapacityFor` : < 9 000 une tribune couverte à poteaux + gradins ; < 30 000 quatre tribunes, toit sur la principale ; sinon cuvette à deux anneaux, loges, toit tout autour. Sièges aux couleurs du club, remplissage variable. « Omnisports / Municipal / Régional » : vraie piste de 400 m |
| Autour | Panneaux LED qui défilent, mâts ou rampes de projecteurs, bancs, zone technique, horizon (immeubles, palmiers, baobabs) |
| Ombres | Instanciées (1 appel de dessin) : une ombre allongée selon le soleil ; en nocturne, une par mât (étoile d'ombres) |
| Joueurs | Matériaux PBR plus lumineux (pas de carte d'environnement dans le bundle) |
| Caméra | Vue suivie plus basse (23° en paysage) et plus large : jeu au premier plan, tribune d'en face visible |
| Correctifs | Le dôme de ciel en `infiniteDistance` passait devant la scène ; un dôme d'étoiles transparent s'affichait noir |
Essai : `Match3D.preview({ weather: 'night', capacity: 6000, name: 'Stade Omnisports — X' })`.

# Match 3D : tirs réalistes, vrais tireurs de corner, coupures télé, gestes des joueurs (06/10/2026)

**Symptômes** : tirs de 40 à 66 m, corners centrés alors que le tireur était encore au milieu du terrain, joueurs qui font demi-tour pour reculer, gardien qui plonge au hasard, expulsé toujours visible.

Mesuré avec le nouveau `tests/match_flow_test.js` (pilotage minute par minute identique au jeu, avant → après, tempo Normal) :
| | avant | après |
|---|---|---|
| Tirs dans le jeu : distance médiane | 30 m (44 m en Rapide) | 18 m |
| Tirs de plus de 40 m | 23 % (70 % en Rapide) | 0 % (≤ 4 % en Rapide) |
| Tireur de corner ↔ ballon quand il part | 3 à 50 m (p90 : 41 m) | 0,7 m |
| Tireur de coup franc ↔ ballon | jusqu'à 18 m | < 1 m |

| Changement | Détail |
|------------|--------|
| Point de frappe (`MATCHSIM.director`, tir dans le jeu) | Le tireur frappait là où la limite de vitesse l'arrêtait. On choisit d'abord un vrai point de frappe (½ dans la surface, ⅕ de frappes lointaines jusqu'à 30 m), il y court, un partenaire le sert en profondeur pour que ballon et tireur arrivent ensemble, la défense recule et le plus proche sort au contact |
| Choix du tireur (`executeShot`) | Les tickets ATT/MIL/DEF sont pondérés par la distance réelle au but adverse : un défenseur resté dans son camp ne frappe plus de 60 m. Les coups de pied arrêtés gardent la répartition d'origine (têtes des défenseurs) |
| Installation des coups de pied arrêtés (`MATCHSIM.setPiece`) | Vitesse ramenée de 11 m/s à ~7 m/s. Si l'installation demande plus de 4,5 s : **coupure télé** (fondu au noir, joueurs posés à leur place, image qui revient — `note('cut')` / `note('snap')`, `app.pitchCut` pour la 2D) |
| Corner | Côté où le ballon est sorti, course d'élan du tireur, geste joué quand le ballon part (il l'était 650 ms trop tôt), reprise **de la tête** (`header_soccerball`) |
| Corner / coup franc joués (`MATCHSIM.release`) | Course d'élan du tireur avant la remise en jeu ; double événement « passe » supprimé |
| Coup franc | Toujours aux abords de la surface (le commentaire l'annonce « bien placé »), mais du côté du terrain où était le ballon |
| Expulsions (`MATCHSIM.sendOff`, `app.simSlots`) | Les listes de titulaires perdent un élément à chaque carton rouge : les index ne désignaient plus la bonne silhouette (le mauvais joueur frappait à l'écran). Correspondance joueur ↔ silhouette tenue à jour (remplacements, blessures, rouges) ; l'expulsé sort par la touche puis disparaît (2D et 3D) |
| Gardien 3D | Se tourne vers le tireur ; plonge du côté où arrive le ballon (`gk_diving_save` = sa gauche, `_2` = sa droite, mesuré sur les clips), capte dans l'axe (`gk_catch_2`) |
| Allures 3D | Course arrière (`jog_backward`) et pas chassés (`jog_strafe_left/right`) quand un joueur recule ou glisse en surveillant le ballon, au lieu de lui tourner le dos |
| Tests | `tests/sim_test.js` ignore les coupures volontaires (le saut a lieu sous le noir) et les compte |

# Écran de match sur mobile : terrain agrandi, plein écran, caméra rapprochée (06/10/2026)

**Symptôme** : sur téléphone en portrait, le terrain ne faisait que 192 px de haut (`h-48`) sous un bandeau de score de 96 px : les joueurs en 3D tenaient en ~22 px et on ne distinguait presque rien.

| Changement | Détail |
|------------|--------|
| Hauteur du terrain | `clamp(260px, 45dvh, 520px)` au lieu de 192 px fixes (`dvh` suit la barre d'adresse du navigateur) |
| Bandeau de score | 64 px au lieu de 96 px sur mobile (logos 36 px, score `text-4xl`), marges de la zone centrale et du pied de page réduites, encoche et barre du bas respectées |
| Plein écran | Nouveau bouton (`#pitch-full`, `app.togglePitchFull`) : le terrain recouvre tout l'écran, avec un mini-score/chrono recopié (`#pitch-hud`). Quitté automatiquement au coup de sifflet final |
| Paysage | Téléphone couché : terrain à gauche (60 %), direct à droite (40 %), bandeau réduit |
| Boutons du terrain | Tempo, plein écran et réduire sont alignés en haut à droite (avant, tempo et réduire se **chevauchaient** sur mobile) |
| Caméra 3D (`match3d.js`) | Vue suivie en portrait : ~13,5 px/m au lieu de 11 (joueurs plus gros), élévation 44° ; vue d'ensemble en portrait : caméra **tournée de 90°**, la longueur du terrain suit la hauteur de l'écran au lieu d'un mince ruban |

**Pixellisation des personnages (cause trouvée)** : `setHardwareScalingLevel(Math.max(1, dpr / 1.5))` produisait un niveau de **2** sur un écran dpr 3 (**3** sur mobile faible) — soit un rendu à 1/2 ou 1/3 de la définition CSS, ensuite étiré. Désormais le rendu se fait à `min(dpr, 2)` (mobile faible : `min(dpr, 1,25)`), avec repli automatique : si l'appareil rame, la résolution retombe d'abord à 1 px CSS avant que la 3D soit coupée (`guardFps`).

**Sauts / à-coups dans l'action (3D)** : le moteur interpole en ligne droite entre deux actions (`MATCHSIM.playerNow`), donc la vitesse des joueurs et du ballon change brutalement à chaque nouvel ordre (arrêt sec, départ sec, direction qui change d'un coup). Ajouts dans `match3d.js` : lissage visuel exponentiel (`SMOOTH_K = 9`, ~0,1 s de retard) appliqué aux joueurs **et** au ballon avec le même filtre (le ballon reste collé au pied), la caméra suit le ballon lissé, et hystérésis course/arrêt (seuils 0,55 / 0,30) pour supprimer le clignotement entre les animations de course et d'attente. Les vraies téléportations (remise en jeu, > 9 m pour un joueur, > 25 m pour le ballon) restent instantanées.

**Corners / coups francs : joueurs de l'autre côté du terrain, attaquants seuls (`app.js`, `MATCHSIM.setPiece`)**
Causes trouvées : (1) l'installation durait 2,6 s quelle que soit la distance, alors que la vitesse est plafonnée (~29 unités sur 2,6 s) : un joueur à 70 unités de la surface s'arrêtait en route et la frappe partait quand même ; (2) les places (surface, mur, défense) étaient données par rang (« les plus avancés »), pas par proximité ; (3) les défenseurs formaient une ligne sans marquer personne.
- Places attribuées par **proximité** (appariement glouton) : les joueurs les plus proches prennent la surface, les autres restent en retrait.
- **Marquage individuel** : chaque attaquant de la surface reçoit un défenseur, côté but ; corner : + 2 hommes aux poteaux et un à l'entrée ; coup franc : mur de 4 + marquage + un libéro.
- **Durée d'installation adaptative** (2,6 → 5 s max) selon la distance du tireur, du buteur et des ~70 % des autres joueurs placés ; penalty : selon le tireur (jusqu'à 4,5 s).
- Jeu courant : « **premier défenseur** » — le défenseur le plus proche du porteur vient au contact s'il est à moins de 24 unités, même hors de la zone de pressing (laisse élargie pour lui).

Mesuré (`tests/setpiece_test.js`, `tests/mark_test.js`, 200 essais, avant → après) :
| | avant | après |
|---|---|---|
| Corner, jeu réaliste : attaquants dans la zone au moment de la frappe | 2,2 | 6,8 |
| Corner, équipe à l'autre bout : tirs avec ≥ 4 attaquants dans la zone | 1 % | 100 % |
| Attaquants de la surface sans défenseur à moins de 6 | 25–46 % | 0–2 % |
| Porteur pressé (adversaire à moins de 5 unités) | 29 % | 46 % |
Contrepartie : la mise en place dure plus longtemps (jusqu'à 5 s au lieu de 2,6 s) quand l'équipe est loin ; l'horloge du match reste arrêtée pendant ce temps. Les tests existants (`pos_test`, `sim_test` : téléportations, hors-jeu) passent toujours.
Les attaquants avancés étaient déjà presque tous marqués en jeu courant (1 à 5 % seuls) : le marquage individuel n'a donc été ajouté que sur coups de pied arrêtés.

**Non vérifié** : aucun rendu sur un vrai téléphone ni dans un navigateur (pas de Chromium dans mon environnement). Contrôles faits : syntaxe JS (`app.js`, `match3d.js`) et équilibre des balises de l'écran de match. À tester : portrait, paysage, plein écran, tap sur le terrain (suivie ↔ d'ensemble). Si la vue d'ensemble tournée déplaît, retirer la variable `rot` dans `updateCamera`.

---

# Décor 3D : buts, filets, stade (06/10/2026)

**Avant** : deux boîtes blanches carrées + un filet « filaire » flou, et tout ce qui dépassait du terrain était un grand vide noir.

| Élément | Détail |
|---------|--------|
| Buts | Poteaux **ronds** (Ø 15 cm), barre, rails de filet, arceaux arrière en pente, aux cotes réglementaires (7,32 × 2,44 m) |
| Filets | Vraies **mailles** (texture alpha répétée, 30 cm), 4 pans : dessus, fond incliné, 2 côtés. Sur un but, **le fond du filet ondule** et le public s'agite |
| Ballon | Le moteur arrêtait le ballon d'un but à 99,5 % — **0,5 m avant la ligne**. Il finit maintenant 0,9 m **au fond du filet** (`applyOutcome`, `app.js`) |
| Tribunes | 4 gradins en pente (≈ 5 000 spectateurs peints, blocs de supporters, allées), façades, murs, joues de virages : pas de trou dans le bol |
| Panneaux LED | Tout le tour du terrain, texte lisible depuis le centre. Marques **fictives** (AECM Elite, Kili Air, Sahel Bank, Nil Telecom) |
| Détails | 4 piquets de corner avec fanion, bancs de touche vitrés (côté lointain), 4 pylônes d'éclairage, dalle autour du terrain |
| Public vivant | Sur un but, les gradins « bondissent » ~5,5 s avec un éclat de luminosité (`decorCheer` / `updateDecor`) |

**Technique** : le bundle Babylon embarqué (`vendor/babylon-aecm.js`) n'expose ni `CreateCylinder`, ni `CreateTube`, ni `VertexData`.
Le décor est donc fabriqué à la main (sommets/indices/UV) et **fusionné par matériau** : ≈ 25 maillages pour tout le stade.
Tout est en matériaux sans éclairage (aucune ombre, aucun coût de lumière). Textures peintes une seule fois au démarrage.
**Mobile faible** (`lowEnd`) : public en 512×256, tessellation réduite, **sans** bancs ni pylônes. Chaque construction est dans
un `try/catch` : un souci de décor n'envoie jamais le match en 2D.
Piège rencontré : `DynamicTexture` est en mode *clamp* par défaut — sans `wrapU/V = WRAP`, les mailles, les rangs du public et
les panneaux s'étirent sur le pixel du bord.

**Vérifié par rendu réel** (Chromium headless, vrai `match3d.js` + vrai `MATCHSIM`) : caméra suivie, vue d'ensemble, gros plans
but/filet/tribune, séquence de but (ballon à 53,45 m pour une ligne à 52,5 m ; filet ×1,11 ; public décalé), mode `lowEnd`.
Non vérifié : performances sur un vrai téléphone (rendu logiciel ici, donc pas de mesure d'images/s fiable).

---

# Correctif placement des joueurs — équipes trop hautes, hors-jeu (05/10/2026)

**Symptôme** : les joueurs étaient placés très haut sur le terrain, plusieurs se trouvaient en position de
hors-jeu, et le placement général paraissait faux. Le défaut vit dans le moteur `MATCHSIM` (`app.js`) : le rendu
2D et le rendu 3D (`match3d.js`, inchangé) ne font que lire ses positions, les deux sont donc corrigés d'un coup.

| # | Cause | Correction |
|---|-------|------------|
| POS-1 | Les formations sont dessinées sur une **demi-pelouse** (profondeur 0-50) mais `baseOf` les déployait **×2** sur le terrain entier : attaquants à 90 % de la longueur, milieux à 60-70 %, défense à la ligne médiane. Toute l'équipe campait dans le camp adverse, y compris au coup d'envoi | Courbe de profondeur par ligne : défense 21-30, milieux 36-53, attaquants 58-65 (% depuis son but). Laisses `ahead` des attaquants/ailiers/meneur élargies pour qu'ils atteignent toujours la surface ; la ligne « haute » élargit celle des défenseurs |
| POS-2 | **Signe inversé** dans le garde-fou de hors-jeu : `dernier défenseur + 1,5` autorisait à le dépasser. De plus il ne visait que BT/ailiers/meneur (un milieu pouvait être hors-jeu), ignorait le ballon et lisait les positions du tour *précédent* de l'adversaire | Passe dédiée en fin de `applyTargets`, sur les cibles définitives des deux équipes : un cran **en retrait** du dernier défenseur, tous les joueurs de champ concernés, et conforme à la règle (derrière le ballon on est en jeu ; pas de hors-jeu sur corner) |
| POS-3 | Au coup d'envoi, « tout le monde dans son camp » n'était qu'un commentaire : 11 joueurs sur 22 commençaient dans le camp adverse | Bornage au camp propre (hors porteur) ; l'équipe qui ne donne pas le coup d'envoi reste hors du rond central (9,15 m) ; replacement un peu plus rapide |

**Mesuré** (moteur seul, sans navigateur, 15 formations × 300 tours) : joueurs en position de hors-jeu par tour
**2,00 → 0,001** ; milieux de terrain en 4-4-2 à 64-71 % → **43-51 %**, défenseurs à ligne normale **~42 % → ~29 %** ;
joueurs hors de leur camp au coup d'envoi **11 → 0**. Banc d'essai d'animation (`tests/sim_test.js`) inchangé :
0 saut de ballon, déplacement max. d'un joueur 0,19 m par image, aux 3 tempos.
Nouveau test : `node tests/pos_test.js` (hauteur des lignes et hors-jeu par formation).

*Non vérifié ici : le rendu visuel dans un vrai navigateur (WebGL indisponible dans mon environnement). Les
chiffres ci-dessus portent sur les positions calculées par le moteur, qui est ce que 2D et 3D affichent.*

---

# Correctif animation du match — sauts, penalties, coups francs, célébrations (05/10/2026)

**Cause racine** : l'horloge du match (une minute toutes les 1,1 à 3,8 s) donnait un nouvel ordre à la
simulation *avant* que l'action précédente soit terminée. Chaque ordre annulait la passe ou le tir en
cours et reposait le ballon ailleurs : d'où les ballons qui « sautent », les joueurs qui se téléportent
et les célébrations coupées. Les penalties, coups francs et corners n'avaient aucune mise en scène
propre : le tireur frappait depuis n'importe où.

| Problème | Correction |
|----------|------------|
| Ballon qui saute au lieu d'être joué | Le ballon voyage toujours depuis sa position réelle (`rebind`) : nouvelle passe, récupération, relance du gardien, engagement, remise au point. Un ordre qui ne change rien (« on attaque déjà ») n'annule plus la passe en vol |
| Joueurs qui se téléportent | `commit()` repartait de l'ancienne *cible* au lieu de la position réellement occupée à l'écran : corrigé (saut max. mesuré par image : 12 m → 0,19 m) |
| Tir qui apparaît dans la surface | Le tireur finit sa course avec le ballon au pied, puis frappe ; le geste de frappe est joué juste avant le départ du ballon |
| Penalties jamais tirés / mal placés | Scène dédiée : ballon sur le point de penalty (11 m), tireur qui prend son élan, gardien sur sa ligne, tous les autres hors de la surface |
| Coups francs mal placés | Ballon posé à 19-30 m du but, mur de 4 joueurs à 9,15 m sur la ligne ballon → but, gardien décalé, attaquants et défenseurs dans la surface |
| Corners | Ballon au piquet, tireur dédié, attaquants/défenseurs dans la surface, centre enroulé jusqu'au buteur puis frappe |
| Corners / coups francs sans tir (≈ 85 %) | Désormais joués aussi : installation, tireur, remise en jeu à un partenaire |
| Pas le temps de célébrer | Le ballon reste au fond des filets, le buteur célèbre ~3,8 s, ses coéquipiers viennent le féliciter, **puis** engagement. L'horloge du match est gelée pendant toute la scène |
| Résultat affiché avant l'arrivée du ballon | Score, commentaire et son tombent 0,3 s avant que le ballon touche le filet ; le ballon va où le résultat l'exige (filet, gardien, à côté) |
| Gardien qui plonge trop tôt (3D) | Plongeon calé sur l'arrivée du ballon |
| Intervalle de l'horloge codé en dur (800 ms) après un remplacement | Reprend le tempo choisi (Lent / Normal / Rapide) |

Banc d'essai : `tests/sim_test.js` (Node, sans navigateur) rejoue 150 ordres aléatoires et 10 scènes
(penalty, coup franc, corner, tir, avec but / arrêt / hors cadre) aux 3 tempos et mesure le déplacement du
ballon et des joueurs à chaque image de 16 ms. Résultat : 0 saut de ballon, déplacement max. d'un joueur 0,19 m par image.

---

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

## 07/10/2026 — Revue des pop-ups en paysage
- Dialogues (entretien, presse, interview) en 2 colonnes ; effectif adverse, prêts et packs en grille.
- Derniers contours orange supprimés (ombres intérieures, focus, carte du prochain match).
- Paysage : bureau du club, messagerie, compositions (22 joueurs visibles), discours de mi-temps, remplacements, consignes en direct (15 formations), notes d après-match.
- Portrait des joueurs agrandi dans les dialogues ; barre orange retirée du rapport d avant-match.

## 07/10/2026 — Graphisme, cinématique de lancement, gestes en match
- Cinématique 3D au lancement (stade du club de nuit, projecteurs qui s allument, survol en drone, sortie des deux équipes du tunnel, logo AECM26). Bouton Passer ; réglage Paramètres (activer/désactiver, revoir).
- Match 3D : passe courte du plat du pied, contrôle du receveur (poitrine/tête sur ballon haut), frappe en pleine course, tacles debout/glissés variés, chute et relevé du joueur taclé, interception, gardien (dégagement, relance, pas chassés, placement de sa défense), inclinaison du corps en sprint.
- Carte Prochain match : nouveau décor de stade (perspective, tonte, foule, LED, projecteurs) pour les 6 stades de la boutique.
- Effectif : 6 chiffres clés sur une ligne, filtres sur une ligne. Entrée d écran animée, réaction au toucher des boutons, halo de fond, palier du menu lisible.

## 07/10/2026 — Cinématique de match façon PES, shorts aux couleurs du club
- Cinématique de lancement : après les projecteurs, le survol et la sortie du tunnel, un vrai match joué par le moteur (non jouable) : l entraîneur au bord du terrain donne ses consignes (tirées de vos tactiques, sous-titrées), coup d envoi, plan télé, travelling au ras de la pelouse, frappe au ralenti filmée derrière le but, BUT ! avec le nom du buteur, joie de l entraîneur, grue + logo. Arbitre présent.
- Shorts : la zone du short est retrouvée sur le modèle 3D (entre genou et taille) et peinte à la couleur de short du club ; fini le short noir d un des modèles de joueurs.

## 07/10/2026 — Joueurs 3D : fin du rendu gris et délavé
- Matériaux des joueurs passés de métal (metallic = 1, gris sans reflets) à tissu mat, opaques.
- Léger éclairage propre tiré de la texture : maillots et peau gardent leurs couleurs sous la pluie et la nuit.
- Couleurs de tenue très sombres relevées en 3D (même teinte) pour rester lisibles ; voile de pluie allégé.

## 07/10/2026 — Écrans qui restaient affichés
- Campus : une fois visité, son écran (et son stade 3D) restait affiché sous tous les autres (mise en page en colonnes qui forçait l affichage). Un écran caché reste désormais caché.
- Changer d écran ferme les fenêtres de navigation restées ouvertes : recherche, effectif d un autre club, bureau, fiches (comparaison, agence, données, chronique, recrutement).

## 07/10/2026 — Refonte Héritage et Distinctions, fin des textes coupés
- Héritage : bandeau de tête (écusson + 4 chiffres de carrière), 4 onglets (Carrière, Trophées, Palmarès, Vétérans), cartes épurées, palmarès en 2 colonnes, records lisibles.
- Course aux trophées : Ballon d Or pleine largeur, autres distinctions en cartes verticales, tableaux en 2 colonnes, noms sur 2 lignes.
- Distinctions : rendez-vous quotidien avec la série des 7 jours, objectifs en lignes fines, Onze de la journée sur un mini-terrain, Pass de saison en piste horizontale ; bandeau et titre redondants retirés.
- Partout en paysage : plus de textes coupés « … » (deux lignes à la place), libellés des tuiles de chiffres entiers, État du club sur une colonne, cartes d intensité d entraînement lisibles.
- Aucune bordure : contours retirés des nouveaux composants (Héritage, Distinctions, tuiles, puces, cinématique) et des barres d onglets ; les blocs se distinguent par leur fond.

## 07/10/2026 — Remplacements simplifiés (façon jeux de gestion)
- Avant le match (Tactique, paysage) : joueurs du terrain cliquables ; banc en bande sous le terrain ; réservistes en liste compacte à droite. Toucher un joueur puis un autre = échange (glisser-déposer aussi). Le joueur touché s allume.
- Pendant le match : nouvel écran Remplacements = le onze sur un terrain (énergie en anneau, note du match, fatigués en rouge) + le banc. Toucher un titulaire puis un remplaçant = changement fait ; plusieurs changements d affilée ; bouton « Le plus fatigué » (un geste) ; « Reprendre le match ».

## 07/10/2026 — La 3D se lance sur mobile
- Le garde-fou de fluidité ne coupe plus la 3D pour toujours : 8 s de chauffe, seuil 12 i/s, deux paliers de résolution, et en dernier recours 2D pour CE match seulement (jamais mémorisé).
- Seul le bouton 2D/3D enregistre un choix ; un ancien « 2D » écrit automatiquement par les versions précédentes est ignoré. 3D par défaut sur tous les appareils compatibles.
- Échec de chargement 3D : la raison s affiche, et le bouton 2D/3D retente le chargement.
- Android : accélération matérielle explicite et mémoire étendue (largeHeap) pour la 3D.
- Cause du « 3D indisponible : [object Event] » sur mobile : la cinématique de lancement créait le décodeur des modèles 3D sans le régler sur la copie locale ; Babylon allait le chercher sur Internet, l échec restait en mémoire et bloquait la 3D des matchs. Un seul réglage partagé (ensureBabylon) pour la cinématique, le match et le stade du Campus : plus aucun fichier chargé hors de l application.
- Message d erreur 3D précis : étape en cours + fichier concerné.

## 07/10/2026 — Compositions d avant-match façon jeux de gestion
- Les deux onze face à face sur UN terrain (votre club et l adversaire de chaque côté), visage + note de chaque joueur (note cachée « ? » sans recruteur), bandeau des deux clubs aux couleurs de leur maillot, Retour / Coup d envoi aux extrémités, ligne date · compétition · stade, formation et moyenne du onze, remplaçants sous chaque moitié, entraîneurs et maillots en bas. Placement sans chevauchement. Sans bordures.
