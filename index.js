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

// Revolution control variables (must be declared before Bodyrevolve function)
let revolutionPaused = false;
let pauseTimeOffset = 0;
let lastPauseTime = 0;

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

function Bodyrevolve(planet, wireframe, semiMajorAxis, speed, eccentricity = 0.1) {
  // Calculate time with pause support
  let currentTime = Date.now();
  if (revolutionPaused) {
    currentTime = lastPauseTime;
  }
  const time = (currentTime - pauseTimeOffset) * 0.001 * speed;
  // Calculate semi-minor axis from eccentricity: b = a * sqrt(1 - e^2)
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
  // Elliptical orbit: x = a * cos(t), z = b * sin(t)
  planet.position.x = Math.cos(time) * semiMajorAxis;
  planet.position.z = Math.sin(time) * semiMinorAxis;
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

function createOrbitPath(semiMajorAxis, color, eccentricity = 0.1) {
  const points = [];
  const segments = 64;
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * semiMajorAxis,
      0,
      Math.sin(angle) * semiMinorAxis
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

// Saturn rings
const ringGeometry = new THREE.RingGeometry(50, 70, 64); // innerRadius, outerRadius, segments
const ringMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xd4a574,
  side: THREE.DoubleSide,
  opacity: 0.7,
  transparent: true
});
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRings.rotation.x = Math.PI / 2; // Rotate to be horizontal (perpendicular to Y axis)
saturnRings.position.set(700, 0, 0); // Same position as Saturn
scene.add(saturnRings);

// Add additional ring layer for more detail
const ringGeometry2 = new THREE.RingGeometry(48, 72, 64);
const ringMaterial2 = new THREE.MeshBasicMaterial({ 
  color: 0xc9a06b,
  side: THREE.DoubleSide,
  opacity: 0.5,
  transparent: true
});
const saturnRings2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
saturnRings2.rotation.x = Math.PI / 2;
saturnRings2.position.set(700, 0, 0);
scene.add(saturnRings2);

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

// Create asteroid belt debris between Mars (450) and Jupiter (600)
const debrisArray = [];
const debrisCount = 500; // Number of debris pieces
const debrisMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const minRadius = 470; // Slightly beyond Mars
const maxRadius = 580; // Slightly before Jupiter

for (let i = 0; i < debrisCount; i++) {
  // Random radius between Mars and Jupiter
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  // Random starting angle
  const startAngle = Math.random() * Math.PI * 2;
  // Random speed (slower than planets)
  const speed = 0.3 + Math.random() * 0.2; // Between 0.3 and 0.5
  // Random eccentricity (small)
  const eccentricity = Math.random() * 0.1; // Between 0 and 0.1
  
  // Create small cube
  const debrisSize = 0.5 + Math.random() * 1.5; // Between 0.5 and 2
  const debrisGeom = new THREE.BoxGeometry(debrisSize, debrisSize, debrisSize);
  const debris = new THREE.Mesh(debrisGeom, debrisMaterial);
  
  // Store debris properties
  debris.userData = {
    semiMajorAxis: radius,
    speed: speed,
    eccentricity: eccentricity,
    startAngle: startAngle
  };
  
  // Initial position
  const semiMinorAxis = radius * Math.sqrt(1 - eccentricity * eccentricity);
  debris.position.x = Math.cos(startAngle) * radius;
  debris.position.z = Math.sin(startAngle) * semiMinorAxis;
  debris.position.y = (Math.random() - 0.5) * 20; // Random height variation
  
  scene.add(debris);
  debrisArray.push(debris);
}

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
// Set all wireframes to invisible by default
allWireframes.forEach(wireframe => {
  wireframe.visible = false;
});

const toggleButton = document.createElement('button');
toggleButton.textContent = 'Toggle Wireframes: OFF';
toggleButton.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: #f44336;
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

// Create orbit paths for all planets (elliptical)
const mercuryOrbit = createOrbitPath(300, 0x00ff00, 0.21);
scene.add(mercuryOrbit);

const venusOrbit = createOrbitPath(340, 0xffa500, 0.01);
scene.add(venusOrbit);

const earthOrbit = createOrbitPath(380, 0x0000ff, 0.02);
scene.add(earthOrbit);

const marsOrbit = createOrbitPath(450, 0xff4500, 0.09);
scene.add(marsOrbit);

const jupiterOrbit = createOrbitPath(600, 0xd2691e, 0.05);
scene.add(jupiterOrbit);

const saturnOrbit = createOrbitPath(700, 0xfad5a5, 0.06);
scene.add(saturnOrbit);

const uranusOrbit = createOrbitPath(850, 0x4fd0e7, 0.05);
scene.add(uranusOrbit);

const neptuneOrbit = createOrbitPath(950, 0x4166f5, 0.01);
scene.add(neptuneOrbit);

const plutoOrbit = createOrbitPath(1000, 0x8b7355, 0.25);
scene.add(plutoOrbit);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Camera distance limits to keep solar system in view
controls.minDistance = 200; // Minimum zoom distance
controls.maxDistance = 2000; // Maximum zoom distance

// Pan configuration
controls.enablePan = true; // Enable panning (default is true)
controls.panSpeed = 1.0; // Pan speed multiplier
controls.screenSpacePanning = false; // Pan in world space (false) or screen space (true)
controls.keyPanSpeed = 7.0; // Speed of panning with arrow keys

// Limit panning to keep solar system in view
const maxPanDistance = 1200; // Maximum distance from center
controls.addEventListener('change', () => {
  const distance = camera.position.length();
  if (distance > maxPanDistance) {
    // Normalize and limit position
    camera.position.normalize().multiplyScalar(maxPanDistance);
    controls.target.set(0, 0, 0); // Keep target at center
  }
  
  // Ensure target stays near center (within reasonable bounds)
  const targetDistance = controls.target.length();
  if (targetDistance > 500) {
    controls.target.normalize().multiplyScalar(500);
  }
});

// Handle window resize to maintain aspect ratio
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create toggle button for revolution
const revolutionToggleButton = document.createElement('button');
revolutionToggleButton.textContent = 'Revolution: ON';
revolutionToggleButton.style.cssText = `
  position: fixed;
  top: 50px;
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
revolutionToggleButton.addEventListener('click', () => {
  revolutionPaused = !revolutionPaused;
  if (revolutionPaused) {
    lastPauseTime = Date.now();
  } else {
    // Calculate time offset when resuming
    pauseTimeOffset += Date.now() - lastPauseTime;
  }
  revolutionToggleButton.textContent = `Revolution: ${revolutionPaused ? 'OFF' : 'ON'}`;
  revolutionToggleButton.style.backgroundColor = revolutionPaused ? '#f44336' : '#4CAF50';
});
document.body.appendChild(revolutionToggleButton);

// Create snapshot button
const snapshotButton = document.createElement('button');
snapshotButton.textContent = 'Take Snapshot';
snapshotButton.style.cssText = `
  position: fixed;
  top: 90px;
  right: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;
snapshotButton.addEventListener('click', () => {
  // Ensure scene is rendered
  renderer.render(scene, camera);
  
  // Capture the canvas as an image
  const dataURL = renderer.domElement.toDataURL('image/png');
  
  // Create a download link
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  link.download = `solar-system-snapshot-${timestamp}.png`;
  link.href = dataURL;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
document.body.appendChild(snapshotButton);

function animate() {
  requestAnimationFrame(animate);

  // Rotate sun
  BodyRotate(sun, sunWireframe, 0.01);

  // Mercury - rotation and revolution (eccentricity: 0.21)
  BodyRotate(mercury, mercuryWireframe, 0.01);
  Bodyrevolve(mercury, mercuryWireframe, 300, 1.0, 0.21);

  // Venus - rotation and revolution (eccentricity: 0.01)
  BodyRotate(venus, venusWireframe, 0.01);
  Bodyrevolve(venus, venusWireframe, 340, 0.9, 0.01);

  // Earth - rotation and revolution (eccentricity: 0.02)
  BodyRotate(earth, earthWireframe, 0.01);
  Bodyrevolve(earth, earthWireframe, 380, 0.8, 0.02);

  // Moon - orbit around Earth (elliptical)
  let moonCurrentTime = Date.now();
  if (revolutionPaused) {
    moonCurrentTime = lastPauseTime;
  }
  const moonOrbitTime = (moonCurrentTime - pauseTimeOffset) * 0.001 * 2.0;
  const moonSemiMajor = 35;
  const moonEccentricity = 0.05;
  const moonSemiMinor = moonSemiMajor * Math.sqrt(1 - moonEccentricity * moonEccentricity);
  const moonAngle = moonOrbitTime;
  moon.position.x = earth.position.x + Math.cos(moonAngle) * moonSemiMajor;
  moon.position.z = earth.position.z + Math.sin(moonAngle) * moonSemiMinor;
  moonWireframe.position.x = moon.position.x;
  moonWireframe.position.z = moon.position.z;
  BodyRotate(moon, moonWireframe, 0.01);

  // Mars - rotation and revolution (eccentricity: 0.09)
  BodyRotate(mars, marsWireframe, 0.01);
  Bodyrevolve(mars, marsWireframe, 450, 0.6, 0.09);

  // Jupiter - rotation and revolution (eccentricity: 0.05)
  BodyRotate(jupiter, jupiterWireframe, 0.01);
  Bodyrevolve(jupiter, jupiterWireframe, 600, 0.4, 0.05);

  // Saturn - rotation and revolution (eccentricity: 0.06)
  BodyRotate(saturn, saturnWireframe, 0.01);
  Bodyrevolve(saturn, saturnWireframe, 700, 0.3, 0.06);
  // Rotate and move rings with Saturn
  saturnRings.rotation.z += 0.01;
  saturnRings2.rotation.z += 0.01;
  saturnRings.position.x = saturn.position.x;
  saturnRings.position.z = saturn.position.z;
  saturnRings2.position.x = saturn.position.x;
  saturnRings2.position.z = saturn.position.z;

  // Uranus - rotation and revolution (eccentricity: 0.05)
  BodyRotate(uranus, uranusWireframe, 0.01);
  Bodyrevolve(uranus, uranusWireframe, 850, 0.25, 0.05);

  // Neptune - rotation and revolution (eccentricity: 0.01)
  BodyRotate(neptune, neptuneWireframe, 0.01);
  Bodyrevolve(neptune, neptuneWireframe, 950, 0.2, 0.01);

  // Pluto - rotation and revolution (eccentricity: 0.25 - highly elliptical)
  BodyRotate(pluto, plutoWireframe, 0.01);
  Bodyrevolve(pluto, plutoWireframe, 1000, 0.15, 0.25);

  // Update debris/asteroid belt
  let debrisCurrentTime = Date.now();
  if (revolutionPaused) {
    debrisCurrentTime = lastPauseTime;
  }
  debrisArray.forEach(debris => {
    const time = (debrisCurrentTime - pauseTimeOffset) * 0.001 * debris.userData.speed;
    const angle = time + debris.userData.startAngle;
    const semiMajorAxis = debris.userData.semiMajorAxis;
    const eccentricity = debris.userData.eccentricity;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
    
    debris.position.x = Math.cos(angle) * semiMajorAxis;
    debris.position.z = Math.sin(angle) * semiMinorAxis;
    
    // Rotate debris slowly
    debris.rotation.x += 0.01;
    debris.rotation.y += 0.01;
  });

  // Enforce camera constraints to keep solar system in view
  const cameraDistance = camera.position.length();
  if (cameraDistance > maxPanDistance) {
    camera.position.normalize().multiplyScalar(maxPanDistance);
  }
  if (cameraDistance < controls.minDistance) {
    camera.position.normalize().multiplyScalar(controls.minDistance);
  }
  
  // Keep target near center
  const targetDistance = controls.target.length();
  if (targetDistance > 500) {
    controls.target.normalize().multiplyScalar(500);
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();