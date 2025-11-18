// Main entry point for the solar system application

import { createScene, createCamera, createRenderer, setupResizeHandler } from './core/scene.js';
import { createAmbientLight, createSunLight } from './core/lighting.js';
import { createStarfield } from './core/starfield.js';
import { createAllPlanets, getPlanetData } from './planets/planets.js';
import { createDebrisBelt } from './planets/debris.js';
import { createAllOrbits } from './planets/orbits.js';
import { createRocketCursor } from './ui/cursor.js';
import { createPlanetTooltip } from './ui/tooltip.js';
import { createRevolutionButton, createSunLightButton, createStarfieldButton, createSnapshotButton } from './ui/buttons.js';
import { setupCameraControls } from './controls/cameraControls.js';
import { createAnimationLoop } from './animation/animation.js';
import * as THREE from "three";

// Initialize scene, camera, and renderer
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
setupResizeHandler(camera, renderer);

// Create lighting
const ambientLight = createAmbientLight();
const sunLight = createSunLight();
scene.add(ambientLight);
scene.add(sunLight);

// Create starfield
const starfield = createStarfield();
scene.add(starfield);

// Create planets
const { planets, rings } = createAllPlanets();
scene.add(planets.sun);
Object.values(planets).forEach(planet => {
  if (planet.mesh) scene.add(planet.mesh);
});
scene.add(rings.saturnRings);
scene.add(rings.saturnRings2);

// Create debris belt
const debrisArray = createDebrisBelt();
debrisArray.forEach(debris => scene.add(debris));

// Create orbit paths
const orbits = createAllOrbits();
Object.values(orbits).forEach(orbit => scene.add(orbit));

// Setup camera controls
const controls = setupCameraControls(camera, renderer);

// Create UI elements
const { rocketCursor, getMousePosition } = createRocketCursor();
const tooltip = createPlanetTooltip();

// Revolution state
const revolutionState = {
  paused: false,
  pauseTimeOffset: 0,
  lastPauseTime: 0
};

// Create UI buttons
createRevolutionButton(revolutionState);

// Prepare planet meshes for material switching
const planetMeshes = [
  { mesh: planets.mercury.mesh, material: planets.mercury.material, texture: planets.mercury.texture, geometry: planets.mercury.geometry },
  { mesh: planets.venus.mesh, material: planets.venus.material, texture: planets.venus.texture, geometry: planets.venus.geometry },
  { mesh: planets.earth.mesh, material: planets.earth.material, texture: planets.earth.texture, geometry: planets.earth.geometry },
  { mesh: planets.moon.mesh, material: planets.moon.material, texture: planets.moon.texture, geometry: planets.moon.geometry },
  { mesh: planets.mars.mesh, material: planets.mars.material, texture: planets.mars.texture, geometry: planets.mars.geometry },
  { mesh: planets.jupiter.mesh, material: planets.jupiter.material, texture: planets.jupiter.texture, geometry: planets.jupiter.geometry },
  { mesh: planets.saturn.mesh, material: planets.saturn.material, texture: planets.saturn.texture, geometry: planets.saturn.geometry },
  { mesh: planets.uranus.mesh, material: planets.uranus.material, texture: planets.uranus.texture, geometry: planets.uranus.geometry },
  { mesh: planets.neptune.mesh, material: planets.neptune.material, texture: planets.neptune.texture, geometry: planets.neptune.geometry },
  { mesh: planets.pluto.mesh, material: planets.pluto.material, texture: planets.pluto.texture, geometry: planets.pluto.geometry }
];

createSunLightButton(sunLight, ambientLight, planetMeshes, planets.earth.mesh, planets.moon.mesh, rings.saturnRings, rings.saturnRings2, debrisArray);
createStarfieldButton(starfield);
createSnapshotButton(renderer, scene, camera);

// Setup raycasting for planet hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Start animation loop
const animate = createAnimationLoop({
  scene,
  camera,
  renderer,
  controls,
  planets,
  saturnRings: rings.saturnRings,
  saturnRings2: rings.saturnRings2,
  debrisArray,
  revolutionState,
  raycaster,
  mouse,
  planetData: getPlanetData(),
  tooltip,
  getMousePosition
});

animate();

