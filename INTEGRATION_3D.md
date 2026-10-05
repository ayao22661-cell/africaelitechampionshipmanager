# Rendu 3D du match — ce qui a été fait

## Fichiers ajoutés (assets/www/)
- match3d.js              module de rendu (lit MATCHSIM.frame(), ne modifie jamais la simulation)
- vendor/babylon-aecm.js  Babylon.js 9.29 réduit au nécessaire (3,4 Mo, chargé seulement à l'ouverture d'un match)
- vendor/meshopt_decoder.js
- 3d/personnages/{far,match}/perso_03,05,07,08,10.glb   joueurs (3 corps), gardien, arbitre
- 3d/animations/anim_{football,goalkeeper,celebration}.glb
- tools/build3d/   de quoi reconstruire le bundle Babylon

## Modifications
- index.html : une ligne `<script src="match3d.js">` avant app.js
- app.js (aucune logique de jeu changée) :
  * MATCHSIM.note() + journal d'événements (passe, tir, tacle) lu par la 3D
  * frame() renvoie aussi `ev` et `ballIdx`
  * MATCHSIM.lastShooter ; notes 'goal' et 'save' au moment du résultat
  * 5 appels `Match3D.*` (attach, setTeams, start, pause)
Le détail est dans app_js_3d.patch.

## Comportement
- Bouton 2D/3D en haut à gauche du terrain (choix mémorisé). 2D = repli automatique si WebGL/fichier manque.
- Tap sur le terrain 3D : vue qui suit le ballon <-> vue d'ensemble.
- Téléphone faible (<=2 Go ou <=3 coeurs) : modèles « far », textures 512, 30 i/s, 2D par défaut.
- Maillots : texture recolorée avec la couleur du club (clubKit), maillot bleu/vert/gris + gardien (orange à l'extérieur).
- Clips : jog_forward (vitesse = vitesse réelle / 2,48 m/s), idle, kick (passe/tir), tacle, plongeon / gk_miss, célébration du buteur (clips violents exclus).
