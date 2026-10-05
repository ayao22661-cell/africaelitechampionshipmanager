// Bundle Babylon minimal pour AECM : uniquement ce que match3d.js utilise.
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Vector3, Quaternion, Matrix } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateDisc } from '@babylonjs/core/Meshes/Builders/discBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup';
import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/core/Animations/animatable';
import '@babylonjs/loaders/glTF/2.0';
const B = { Engine, Scene, FreeCamera, HemisphericLight, DirectionalLight, Vector3, Quaternion, Matrix,
  Color3, Color4, TransformNode, Mesh, CreateGround, CreateSphere, CreateDisc, CreateBox,
  StandardMaterial, PBRMaterial, Texture, DynamicTexture, AnimationGroup, MeshoptCompression, LoadAssetContainerAsync };
(typeof window !== 'undefined' ? window : globalThis).BABYLON_AECM = B;
export default B;
