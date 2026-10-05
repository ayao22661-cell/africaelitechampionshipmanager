# AECM – Personnages 3D riggés + animations

## Contenu
- `personnages/{hd,match,far}/perso_00..10.glb` : 11 personnages avec squelette Mixamo (noms `mixamorig:*`), poids de peau calculés automatiquement.
  - `hd` : 15 000 triangles, 52 os, textures 2048 (fiche joueur, célébrations)
  - `match` : 5 000 triangles, 22 os (sans doigts), textures 1024 (vue de match)
  - `far` : 1 500 à 2 700 triangles, 22 os, textures 512 (joueurs éloignés)
- `animations/anim_football.glb` (41 clips), `anim_goalkeeper.glb` (23), `anim_celebration.glb` (12)
- `animations.json` : durée, boucle conseillée, déplacement d'origine de chaque clip
- `personnages.json` : correspondance des numéros avec les apparences
- `vendor/meshopt_decoder.js` : décodeur à embarquer en local
- `exemple_babylon.js` : chargement, retargeting, 22 joueurs

## À savoir
1. Les personnages mesurent 1,80 m, pieds à y = 0, face à +Z, comme le squelette Mixamo.
2. Les clips sont **sur place** : le déplacement du bassin a été retiré. MATCHSIM garde le contrôle des positions, donc le nombre de buts n'est pas touché.
3. Un clip qui vise un os absent fait planter `clone()` : utilisez la fonction `brancher()` de l'exemple.
4. Fichiers compressés (Meshopt + WebP) : configurez `MeshoptCompression.Configuration` vers `vendor/meshopt_decoder.js`.
5. Clips non adaptés à un jeu tout public : `cel_brutal_assassination`, `cel_fist_fight_b`, `cel_dying` (laissés dans la bibliothèque, à ne pas utiliser sans choix de votre part).
6. Le pack « Coach Game Pack » n'a pas été converti (thème ferme, hors football).

## Limites connues
- Squelette et poids calculés automatiquement : très bons sur les poses testées, mais des défauts légers sont possibles sur les mains, les épaules et les vêtements amples (veste du personnage 00). À contrôler visuellement dans votre jeu.
- Une légère différence de hauteur de pieds (quelques cm) peut exister selon le personnage.
- Testé avec Babylon.js 9.29 en environnement sans écran (chargement, 22 os / 52 os, retargeting, 22 instances). Non testé sur un vrai téléphone : mesurez images par seconde et chauffe.
