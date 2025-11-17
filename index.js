import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000  // Increased far plane to see all planets
);
camera.position.set(0, 200, 800); // Moved further back and higher for better view
camera.lookAt(0, 0, 0);        // Look at the center (Sun)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures for all planets
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('materials/sunmat.jpg');
const mercuryTexture = textureLoader.load('materials/mercurymat.jpg');
const venusTexture = textureLoader.load('materials/venusmat.jpg');
const earthTexture = textureLoader.load('materials/earthmat.jpeg');
const marsTexture = textureLoader.load('materials/marsmat.jpeg');
const jupiterTexture = textureLoader.load('materials/jupitermat.jpg');
const saturnTexture = textureLoader.load('materials/saturnmat.jpg');
const uranusTexture = textureLoader.load('materials/uranusmat.jpeg');
const neptuneTexture = textureLoader.load('materials/neptunemat.jpg');
const plutoTexture = textureLoader.load('materials/plutomat.jpeg');

function Bodyrevolve(planet, wireframe, radius, speed) {
  const time = Date.now() * 0.001 * speed;
  planet.position.x = Math.cos(time) * radius;
  planet.position.z = Math.sin(time) * radius;
  if (wireframe) {
    wireframe.position.x = planet.position.x;
    wireframe.position.z = planet.position.z;
  }
}

function BodyRotate(planet, wireframe, speed) {
  planet.rotation.y += speed;
  if (wireframe) {
    wireframe.rotation.y += speed;
  }
}

function BodyCreate(size, color, wireframeColor, isWireframe) {
  const geom = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(geom, material);

  if (!isWireframe) return mesh;
  
  const wireframeMaterial = new THREE.MeshBasicMaterial({ color: wireframeColor, wireframe: true });
  const wireframeMesh = new THREE.Mesh(geom, wireframeMaterial);
  return { mesh, wireframeMesh };
}

function createOrbitPath(radius, color) {
  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ 
    color: color,
    opacity: 0.3,
    transparent: true
  });
  const orbitPath = new THREE.Line(geometry, material);
  return orbitPath;
}

// Sun with texture
const sunGeom = new THREE.SphereGeometry(100, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const sunWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const sunWireframe = new THREE.Mesh(sunGeom, sunWireframeMaterial);
sun.position.set(0, 0, 0);
sunWireframe.position.set(0, 0, 0);
scene.add(sun);
scene.add(sunWireframe);   

// Mercury with texture
const mercuryGeom = new THREE.SphereGeometry(10, 32, 32);
const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeom, mercuryMaterial);
const mercuryWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const mercuryWireframe = new THREE.Mesh(mercuryGeom, mercuryWireframeMaterial);
mercury.position.set(300, 0, 0);
mercuryWireframe.position.set(300, 0, 0);
scene.add(mercury);
scene.add(mercuryWireframe);

// Venus with texture
const venusGeom = new THREE.SphereGeometry(18, 32, 32);
const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeom, venusMaterial);
const venusWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: true });
const venusWireframe = new THREE.Mesh(venusGeom, venusWireframeMaterial);
venus.position.set(340, 0, 0);
venusWireframe.position.set(340, 0, 0);
scene.add(venus);
scene.add(venusWireframe);

//Earth with texture
const earthGeom = new THREE.SphereGeometry(20, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeom, earthMaterial);
const earthWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
const earthWireframe = new THREE.Mesh(earthGeom, earthWireframeMaterial);
earth.position.set(380, 0, 0);
earthWireframe.position.set(380, 0, 0);
scene.add(earth);
scene.add(earthWireframe);

// Moon orbiting Earth
const moonGeom = new THREE.SphereGeometry(6, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const moon = new THREE.Mesh(moonGeom, moonMaterial);
const moonWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
const moonWireframe = new THREE.Mesh(moonGeom, moonWireframeMaterial);
moon.position.set(380 + 35, 0, 0); // Initial position near Earth
moonWireframe.position.set(380 + 35, 0, 0);
scene.add(moon);
scene.add(moonWireframe);

// Mars with texture
const marsGeom = new THREE.SphereGeometry(15, 32, 32);
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeom, marsMaterial);
const marsWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500, wireframe: true });
const marsWireframe = new THREE.Mesh(marsGeom, marsWireframeMaterial);
mars.position.set(450, 0, 0);
marsWireframe.position.set(450, 0, 0);
scene.add(mars);
scene.add(marsWireframe);

// Jupiter with texture
const jupiterGeom = new THREE.SphereGeometry(50, 32, 32);
const jupiterMaterial = new THREE.MeshBasicMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeom, jupiterMaterial);
const jupiterWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xd2691e, wireframe: true });
const jupiterWireframe = new THREE.Mesh(jupiterGeom, jupiterWireframeMaterial);
jupiter.position.set(600, 0, 0);
jupiterWireframe.position.set(600, 0, 0);
scene.add(jupiter);
scene.add(jupiterWireframe);

// Saturn with texture
const saturnGeom = new THREE.SphereGeometry(45, 32, 32);
const saturnMaterial = new THREE.MeshBasicMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeom, saturnMaterial);
const saturnWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xfad5a5, wireframe: true });
const saturnWireframe = new THREE.Mesh(saturnGeom, saturnWireframeMaterial);
saturn.position.set(700, 0, 0);
saturnWireframe.position.set(700, 0, 0);
scene.add(saturn);
scene.add(saturnWireframe);

// Uranus with texture
const uranusGeom = new THREE.SphereGeometry(35, 32, 32);
const uranusMaterial = new THREE.MeshBasicMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeom, uranusMaterial);
const uranusWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x4fd0e7, wireframe: true });
const uranusWireframe = new THREE.Mesh(uranusGeom, uranusWireframeMaterial);
uranus.position.set(850, 0, 0);
uranusWireframe.position.set(850, 0, 0);
scene.add(uranus);
scene.add(uranusWireframe);

// Neptune with texture
const neptuneGeom = new THREE.SphereGeometry(30, 32, 32);
const neptuneMaterial = new THREE.MeshBasicMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeom, neptuneMaterial);
const neptuneWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x4166f5, wireframe: true });
const neptuneWireframe = new THREE.Mesh(neptuneGeom, neptuneWireframeMaterial);
neptune.position.set(950, 0, 0);
neptuneWireframe.position.set(950, 0, 0);
scene.add(neptune);
scene.add(neptuneWireframe);

// Pluto with texture
const plutoGeom = new THREE.SphereGeometry(8, 32, 32);
const plutoMaterial = new THREE.MeshBasicMaterial({ map: plutoTexture });
const pluto = new THREE.Mesh(plutoGeom, plutoMaterial);
const plutoWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x8b7355, wireframe: true });
const plutoWireframe = new THREE.Mesh(plutoGeom, plutoWireframeMaterial);
pluto.position.set(1000, 0, 0);
plutoWireframe.position.set(1000, 0, 0);
scene.add(pluto);
scene.add(plutoWireframe);

// Store all wireframes in an array for easy toggling
const allWireframes = [
  sunWireframe,
  mercuryWireframe,
  venusWireframe,
  earthWireframe,
  marsWireframe,
  jupiterWireframe,
  saturnWireframe,
  uranusWireframe,
  neptuneWireframe,
  plutoWireframe,
  moonWireframe
];

// Create toggle button for wireframes
let wireframesVisible = false;
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Toggle Wireframes: ON';
toggleButton.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;
toggleButton.addEventListener('click', () => {
  wireframesVisible = !wireframesVisible;
  allWireframes.forEach(wireframe => {
    wireframe.visible = wireframesVisible;
  });
  toggleButton.textContent = `Toggle Wireframes: ${wireframesVisible ? 'ON' : 'OFF'}`;
  toggleButton.style.backgroundColor = wireframesVisible ? '#4CAF50' : '#f44336';
});
document.body.appendChild(toggleButton);

// Create orbit paths for all planets
const mercuryOrbit = createOrbitPath(300, 0x00ff00);
scene.add(mercuryOrbit);

const venusOrbit = createOrbitPath(340, 0xffa500);
scene.add(venusOrbit);

const earthOrbit = createOrbitPath(380, 0x0000ff);
scene.add(earthOrbit);

const marsOrbit = createOrbitPath(450, 0xff4500);
scene.add(marsOrbit);

const jupiterOrbit = createOrbitPath(600, 0xd2691e);
scene.add(jupiterOrbit);

const saturnOrbit = createOrbitPath(700, 0xfad5a5);
scene.add(saturnOrbit);

const uranusOrbit = createOrbitPath(850, 0x4fd0e7);
scene.add(uranusOrbit);

const neptuneOrbit = createOrbitPath(950, 0x4166f5);
scene.add(neptuneOrbit);

const plutoOrbit = createOrbitPath(1000, 0x8b7355);
scene.add(plutoOrbit);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Pan configuration
controls.enablePan = true; // Enable panning (default is true)
controls.panSpeed = 1.0; // Pan speed multiplier
controls.screenSpacePanning = false; // Pan in world space (false) or screen space (true)
controls.keyPanSpeed = 7.0; // Speed of panning with arrow keys

function animate() {
  requestAnimationFrame(animate);

  // Rotate sun
  BodyRotate(sun, sunWireframe, 0.01);

  // Mercury - rotation and revolution
  BodyRotate(mercury, mercuryWireframe, 0.01);
  Bodyrevolve(mercury, mercuryWireframe, 300, 1.0);

  // Venus - rotation and revolution
  BodyRotate(venus, venusWireframe, 0.01);
  Bodyrevolve(venus, venusWireframe, 340, 0.9);

  // Earth - rotation and revolution
  BodyRotate(earth, earthWireframe, 0.01);
  Bodyrevolve(earth, earthWireframe, 380, 0.8);

  // Moon - orbit around Earth
  const moonOrbitTime = Date.now() * 0.001 * 2.0; // Moon orbits faster
  const moonOrbitRadius = 35;
  const moonAngle = moonOrbitTime;
  moon.position.x = earth.position.x + Math.cos(moonAngle) * moonOrbitRadius;
  moon.position.z = earth.position.z + Math.sin(moonAngle) * moonOrbitRadius;
  moonWireframe.position.x = moon.position.x;
  moonWireframe.position.z = moon.position.z;
  BodyRotate(moon, moonWireframe, 0.01);

  // Mars - rotation and revolution
  BodyRotate(mars, marsWireframe, 0.01);
  Bodyrevolve(mars, marsWireframe, 450, 0.6);

  // Jupiter - rotation and revolution
  BodyRotate(jupiter, jupiterWireframe, 0.01);
  Bodyrevolve(jupiter, jupiterWireframe, 600, 0.4);

  // Saturn - rotation and revolution
  BodyRotate(saturn, saturnWireframe, 0.01);
  Bodyrevolve(saturn, saturnWireframe, 700, 0.3);

  // Uranus - rotation and revolution
  BodyRotate(uranus, uranusWireframe, 0.01);
  Bodyrevolve(uranus, uranusWireframe, 850, 0.25);

  // Neptune - rotation and revolution
  BodyRotate(neptune, neptuneWireframe, 0.01);
  Bodyrevolve(neptune, neptuneWireframe, 950, 0.2);

  // Pluto - rotation and revolution
  BodyRotate(pluto, plutoWireframe, 0.01);
  Bodyrevolve(pluto, plutoWireframe, 1000, 0.15);

  controls.update();
  renderer.render(scene, camera);
}
animate();