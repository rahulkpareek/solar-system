// Texture loading

import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export const textures = {
  sun: textureLoader.load('materials/sunmat.jpg'),
  mercury: textureLoader.load('materials/mercurymat.jpg'),
  venus: textureLoader.load('materials/venusmat.jpg'),
  earth: textureLoader.load('materials/earthmat.jpeg'),
  mars: textureLoader.load('materials/marsmat.jpeg'),
  jupiter: textureLoader.load('materials/jupitermat.jpg'),
  saturn: textureLoader.load('materials/saturnmat.jpg'),
  uranus: textureLoader.load('materials/uranusmat.jpeg'),
  neptune: textureLoader.load('materials/neptunemat.jpg'),
  pluto: textureLoader.load('materials/plutomat.jpeg'),
  moon: textureLoader.load('materials/moonmat.jpg')
};

