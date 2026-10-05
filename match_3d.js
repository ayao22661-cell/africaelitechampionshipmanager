// AECM 3D Match Engine - Babylon.js integration (Robust & Production-Ready)
window.AECM3D = {
    engine: null,
    scene: null,
    is3DActive: false,
    initialized: false,
    players: [],
    ball: null,

    init: async function(canvasId) {
        if (this.initialized) return;
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn("Canvas 3D introuvable:", canvasId);
            return;
        }

        try {
            if (typeof BABYLON === 'undefined') {
                console.warn("Babylon.js non chargé, chargement dynamique des scripts CDN...");
                await this.loadScript("https://cdn.babylonjs.com/babylon.js");
                await this.loadScript("https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js");
            }

            if (typeof BABYLON === 'undefined') {
                throw new Error("Impossible de charger Babylon.js");
            }

            this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color4(0.04, 0.07, 0.13, 1);

            // Caméra tactique isométrique
            const camera = new BABYLON.ArcRotateCamera("MatchCamera", -Math.PI / 2, Math.PI / 3.5, 80, new BABYLON.Vector3(0, 0, 0), this.scene);
            camera.attachControl(canvas, true);
            camera.lowerRadiusLimit = 25;
            camera.upperRadiusLimit = 130;
            camera.wheelPrecision = 50;

            // Éclairage stade
            const hemiLight = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
            hemiLight.intensity = 0.7;
            hemiLight.diffuse = new BABYLON.Color3(0.95, 0.95, 1.0);

            const dirLight = new BABYLON.DirectionalLight("Dir", new BABYLON.Vector3(-1, -2, -1), this.scene);
            dirLight.intensity = 0.8;
            dirLight.position = new BABYLON.Vector3(0, 50, 0);

            // Terrain de football 3D stylisé
            const pitchWidth = 90;
            const pitchHeight = 60;
            const ground = BABYLON.MeshBuilder.CreateGround("pitch", { width: pitchWidth, height: pitchHeight }, this.scene);
            const pitchMat = new BABYLON.StandardMaterial("pitchMat", this.scene);
            pitchMat.diffuseColor = new BABYLON.Color3(0.13, 0.52, 0.24);
            pitchMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            ground.material = pitchMat;

            // Lignes du terrain (marquages blancs)
            const linesPlane = BABYLON.MeshBuilder.CreateGround("lines", { width: pitchWidth - 4, height: pitchHeight - 4 }, this.scene);
            linesPlane.position.y = 0.05;
            const linesMat = new BABYLON.StandardMaterial("linesMat", this.scene);
            linesMat.wireframe = true;
            linesMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
            linesPlane.material = linesMat;

            // Buts (cages) gauche et droite
            const createGoal = (xPos, rotationY) => {
                const goalGroup = new BABYLON.TransformNode("goal_" + xPos, this.scene);
                goalGroup.position = new BABYLON.Vector3(xPos, 0, 0);
                goalGroup.rotation.y = rotationY;

                const postMat = new BABYLON.StandardMaterial("postMat", this.scene);
                postMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);

                const p1 = BABYLON.MeshBuilder.CreateCylinder("p1", { diameter: 0.6, height: 5 }, this.scene);
                p1.position = new BABYLON.Vector3(0, 2.5, -6);
                p1.material = postMat;
                p1.parent = goalGroup;

                const p2 = BABYLON.MeshBuilder.CreateCylinder("p2", { diameter: 0.6, height: 5 }, this.scene);
                p2.position = new BABYLON.Vector3(0, 2.5, 6);
                p2.material = postMat;
                p2.parent = goalGroup;

                const bar = BABYLON.MeshBuilder.CreateCylinder("bar", { diameter: 0.5, height: 12 }, this.scene);
                bar.rotation.z = Math.PI / 2;
                bar.position = new BABYLON.Vector3(0, 5, 0);
                bar.material = postMat;
                bar.parent = goalGroup;

                return goalGroup;
            };

            createGoal(-pitchWidth / 2 + 2, 0);
            createGoal(pitchWidth / 2 - 2, 0);

            // Ballon 3D
            this.ball = BABYLON.MeshBuilder.CreateSphere("matchBall", { diameter: 1.2 }, this.scene);
            const ballMat = new BABYLON.StandardMaterial("ballMat", this.scene);
            ballMat.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.95);
            ballMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            this.ball.material = ballMat;
            this.ball.position = new BABYLON.Vector3(0, 0.6, 0);

            // Configuration meshopt si présent
            if (BABYLON.MeshoptCompression) {
                BABYLON.MeshoptCompression.Configuration = { decoder: { url: 'vendor/meshopt_decoder.js' } };
            }

            // Tentative de chargement du modèle GLB de personnage (perso_03.glb)
            let loadedContainer = null;
            try {
                loadedContainer = await BABYLON.LoadAssetContainerAsync('aecm_extracted/personnages/far/perso_03.glb', this.scene);
            } catch (e) {
                try {
                    loadedContainer = await BABYLON.LoadAssetContainerAsync('personnages/far/perso_03.glb', this.scene);
                } catch (err2) {
                    console.warn("Modèle GLB non chargé, utilisation du rendu géométrique avancé des joueurs.");
                }
            }

            // Création des 22 joueurs sur le terrain
            for (let i = 0; i < 22; i++) {
                const isHome = i < 11;
                const indexInTeam = isHome ? i : i - 11;
                
                // Position tactique 4-4-2 ou similaire
                const row = indexInTeam === 0 ? 0 : (indexInTeam <= 4 ? 1 : (indexInTeam <= 8 ? 2 : 3));
                const col = indexInTeam === 0 ? 0 : (indexInTeam % 4);
                
                const x = isHome ? -35 + (row * 10) + (Math.random() * 4) : 35 - (row * 10) - (Math.random() * 4);
                const z = -20 + (col * 13) + (Math.random() * 3);

                if (loadedContainer) {
                    const inst = loadedContainer.instantiateModelsToScene(n => n, false);
                    const racine = inst.rootNodes[0];
                    racine.scaling.setAll(0.8);
                    racine.position = new BABYLON.Vector3(x, 0, z);
                    if (!isHome) racine.rotation.y = Math.PI;
                    this.players.push({ mesh: racine, isHome, basePos: new BABYLON.Vector3(x, 0, z) });
                } else {
                    // Fallback géométrique (capsules / cylindres stylisés avec maillot coloré)
                    const playerMesh = BABYLON.MeshBuilder.CreateCapsule("player_" + i, { radius: 0.9, height: 3 }, this.scene);
                    const pMat = new BABYLON.StandardMaterial("pMat_" + i, this.scene);
                    pMat.diffuseColor = isHome ? new BABYLON.Color3(0.92, 0.35, 0.1) : new BABYLON.Color3(0.12, 0.45, 0.85);
                    playerMesh.material = pMat;
                    playerMesh.position = new BABYLON.Vector3(x, 1.5, z);
                    this.players.push({ mesh: playerMesh, isHome, basePos: new BABYLON.Vector3(x, 1.5, z) });
                }
            }

            // Boucle d'animation dynamique (mouvements fluides des joueurs pendant le match)
            let frameCounter = 0;
            this.scene.registerBeforeRender(() => {
                frameCounter += 0.02;
                if (this.ball && this.is3DActive) {
                    // Mouvement naturel du ballon entre les équipes
                    this.ball.position.x = Math.sin(frameCounter * 0.8) * 25;
                    this.ball.position.z = Math.cos(frameCounter * 0.5) * 12;
                    this.ball.rotation.x += 0.03;
                    this.ball.rotation.z += 0.02;

                    // Légère animation des joueurs (respiration / pressing)
                    this.players.forEach((p, idx) => {
                        if (p.mesh) {
                            const offset = Math.sin(frameCounter + idx) * 0.5;
                            p.mesh.position.z = p.basePos.z + offset;
                        }
                    });
                }
            });

            this.engine.runRenderLoop(() => {
                if (this.is3DActive && this.scene) {
                    this.scene.render();
                }
            });

            window.addEventListener('resize', () => {
                if (this.engine) this.engine.resize();
            });

            this.initialized = true;
            console.log("Moteur 3D AECM initialisé avec succès.");
        } catch (e) {
            console.error("Erreur critique initialisation Babylon 3D:", e);
        }
    },

    loadScript: function(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    toggleView: function() {
        this.is3DActive = !this.is3DActive;
        const canvas = document.getElementById('renderCanvas');
        const svgPitch = document.querySelector('#pitch-container svg');
        const toggleBtnText = document.getElementById('view-mode-label');

        console.log("AECM3D toggleView appelé, is3DActive =", this.is3DActive);

        if (this.is3DActive) {
            if (!this.initialized) {
                this.init('renderCanvas');
            }
            if (canvas) {
                canvas.classList.remove('hidden');
                canvas.style.display = 'block';
            }
            if (svgPitch) svgPitch.classList.add('opacity-10');
            if (toggleBtnText) toggleBtnText.textContent = "Mode 2D";
            setTimeout(() => {
                if (this.engine) this.engine.resize();
            }, 50);
        } else {
            if (canvas) {
                canvas.classList.add('hidden');
                canvas.style.display = 'none';
            }
            if (svgPitch) svgPitch.classList.remove('opacity-10');
            if (toggleBtnText) toggleBtnText.textContent = "Vue 3D";
        }
    }
};

// Auto-initialisation et écouteur d'événements si le canvas est présent
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    if (canvas) {
        console.log("Canvas #renderCanvas détecté au chargement.");
    }
});
