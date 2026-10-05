// Exemple Babylon.js (8+) : charger un personnage, des animations partagees, et jouer 22 joueurs.
import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup';
import '@babylonjs/loaders/glTF/2.0';

// 1) Decodeur Meshopt EN LOCAL (jeu hors ligne)
MeshoptCompression.Configuration = { decoder: { url: 'vendor/meshopt_decoder.js' } };

// 2) Charger une fois : modele de joueur + bibliotheque d'animations
const modele  = await LoadAssetContainerAsync('personnages/match/perso_03.glb', scene);
const biblio  = await LoadAssetContainerAsync('animations/anim_football.glb', scene);
const clips   = new Map(biblio.animationGroups.map(g => [g.name, g]));

// 3) Brancher un clip partage sur UN joueur (par nom d'os).
//    IMPORTANT : ne pas utiliser clone() avec un os manquant (plante). On ignore les os absents.
function brancher(clipSource, racine, nom) {
  const os = new Map(racine.getChildTransformNodes(false).map(n => [n.name, n]));
  const g = new AnimationGroup(nom, scene);
  for (const ta of clipSource.targetedAnimations) {
    const cible = os.get(ta.target.name);
    if (cible) g.addTargetedAnimation(ta.animation, cible);
  }
  return g;
}

// 4) 22 joueurs a partir du meme fichier
const joueurs = [];
for (let i = 0; i < 22; i++) {
  const inst = modele.instantiateModelsToScene(n => n, false);
  const racine = inst.rootNodes[0];
  racine.scaling.setAll(1);                 // le personnage mesure deja 1,80 m
  const anim = brancher(clips.get('soccer_idle'), racine, 'anim_' + i);
  anim.start(true);
  joueurs.push({ racine, anim });
}

// 5) Changer d'animation selon la vitesse venant de MATCHSIM.frame() (run entre 0 et 1)
function choisirClip(run) { return run < 0.05 ? 'soccer_idle' : 'jog_forward'; }

// 6) Deplacement : les clips sont SUR PLACE. C'est votre moteur (MATCHSIM) qui place le joueur (x, y).
//    animations.json donne le deplacement d'origine de chaque clip (deplacement_racine_avant_m) si besoin.
