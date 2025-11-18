import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background for stars
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
document.body.appendChild(renderer.domElement);

// Create rocket cursor element
const rocketCursor = document.createElement('div');
rocketCursor.className = 'rocket-cursor';
document.body.appendChild(rocketCursor);

// Create planet info tooltip
const planetInfo = document.createElement('div');
planetInfo.className = 'planet-info';
document.body.appendChild(planetInfo);

// Store planet information
const planetData = new Map();
function addPlanetData(mesh, name, distanceFromSun) {
  planetData.set(mesh, { name, distanceFromSun });
}

// Raycaster for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Mouse move handler
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  
  // Check if hovering over a button
  const target = event.target;
  if (target.tagName === 'BUTTON') {
    rocketCursor.style.display = 'none';
  } else {
    rocketCursor.style.display = 'block';
    // Update rocket cursor position
    rocketCursor.style.left = mouseX + 'px';
    rocketCursor.style.top = mouseY + 'px';
  }
  
  // Update mouse for raycaster
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Add ambient light for overall scene illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Soft ambient light
scene.add(ambientLight);
const defaultAmbientIntensity = 0.4;
const lightOffAmbientIntensity = 1.5; // Higher ambient when sun light is off

// Add point light at sun position to light the planets
// Using infinite distance (0) so light reaches all planets, with high intensity
const sunLight = new THREE.PointLight(0xffffff, 5, 0, 0); // color, intensity, distance (0=infinite), decay (0=no decay)
sunLight.position.set(0, 0, 0); // At sun's position
sunLight.castShadow = true; // Enable shadow casting
sunLight.shadow.mapSize.width = 2048; // Higher resolution shadows
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 3000; // Cover entire solar system
scene.add(sunLight);

// Create starfield background
function createStarfield() {
  const starCount = 10000; // Number of stars
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  
  // Random star colors (white to slightly blue/white)
  const starColorOptions = [
    new THREE.Color(0xffffff), // White
    new THREE.Color(0xffffff),
    new THREE.Color(0xffffff),
    new THREE.Color(0xaaaaff), // Slight blue
    new THREE.Color(0xffaaaa), // Slight red
    new THREE.Color(0xffffaa)  // Slight yellow
  ];
  
  for (let i = 0; i < starCount; i++) {
    // Position stars in a large sphere around the solar system
    const radius = 2000 + Math.random() * 1000; // Stars between 2000 and 3000 units away
    const theta = Math.random() * Math.PI * 2; // Random angle around Y axis
    const phi = Math.acos(2 * Math.random() - 1); // Random angle from top
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    starPositions[i * 3] = x;
    starPositions[i * 3 + 1] = y;
    starPositions[i * 3 + 2] = z;
    
    // Random star color
    const starColor = starColorOptions[Math.floor(Math.random() * starColorOptions.length)];
    starColors[i * 3] = starColor.r;
    starColors[i * 3 + 1] = starColor.g;
    starColors[i * 3 + 2] = starColor.b;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  
  // Create star material
  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: false, // Stars don't get smaller with distance
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  return stars;
}

const starfield = createStarfield();
scene.add(starfield);

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
const moonTexture = textureLoader.load('materials/moonmat.jpg');

function Bodyrevolve(planet, semiMajorAxis, speed, eccentricity = 0.1) {
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
}

function BodyRotate(planet, speed) {
  planet.rotation.y += speed;
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

// Sun with texture - using emissive material so it glows and emits light
// Sun does NOT cast or receive shadows (it's the light source)
const sunGeom = new THREE.SphereGeometry(100, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
  map: sunTexture,
  emissive: 0xffffaa, // Yellow glow
  emissiveIntensity: 0.5
});
const sun = new THREE.Mesh(sunGeom, sunMaterial);
sun.castShadow = false;
sun.receiveShadow = false;
sun.position.set(0, 0, 0);
scene.add(sun);
addPlanetData(sun, 'Sun', 0);   

// Mercury with texture
const mercuryGeom = new THREE.SphereGeometry(10, 32, 32);
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeom, mercuryMaterial);
mercury.castShadow = false;
mercury.receiveShadow = false;
mercury.position.set(300, 0, 0);
scene.add(mercury);
addPlanetData(mercury, 'Mercury', 57.9); // Distance in million km

// Venus with texture
const venusGeom = new THREE.SphereGeometry(18, 32, 32);
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeom, venusMaterial);
venus.castShadow = false;
venus.receiveShadow = false;
venus.position.set(340, 0, 0);
scene.add(venus);
addPlanetData(venus, 'Venus', 108.2);

//Earth with texture
const earthGeom = new THREE.SphereGeometry(20, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeom, earthMaterial);
earth.castShadow = true; // Cast shadows
earth.receiveShadow = true; // Receive shadows
earth.position.set(380, 0, 0);
scene.add(earth);
addPlanetData(earth, 'Earth', 149.6);

// Moon orbiting Earth
const moonGeom = new THREE.SphereGeometry(6, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeom, moonMaterial);
moon.castShadow = true; // Cast shadows
moon.receiveShadow = true; // Receive shadows
moon.position.set(380 + 35, 0, 0); // Initial position near Earth
scene.add(moon);
addPlanetData(moon, 'Moon', 149.6); // Same as Earth (orbits Earth)

// Mars with texture
const marsGeom = new THREE.SphereGeometry(15, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeom, marsMaterial);
mars.castShadow = false;
mars.receiveShadow = false;
mars.position.set(450, 0, 0);
scene.add(mars);
addPlanetData(mars, 'Mars', 227.9);

// Jupiter with texture
const jupiterGeom = new THREE.SphereGeometry(50, 32, 32);
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeom, jupiterMaterial);
jupiter.castShadow = false;
jupiter.receiveShadow = false;
jupiter.position.set(600, 0, 0);
scene.add(jupiter);
addPlanetData(jupiter, 'Jupiter', 778.5);

// Saturn with texture
const saturnGeom = new THREE.SphereGeometry(45, 32, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeom, saturnMaterial);
saturn.castShadow = false;
saturn.receiveShadow = false;
saturn.position.set(700, 0, 0);
scene.add(saturn);
addPlanetData(saturn, 'Saturn', 1432.0);

// Saturn rings
const ringGeometry = new THREE.RingGeometry(50, 70, 64); // innerRadius, outerRadius, segments
const ringMaterial = new THREE.MeshStandardMaterial({ 
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
const ringMaterial2 = new THREE.MeshStandardMaterial({ 
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
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeom, uranusMaterial);
uranus.castShadow = false;
uranus.receiveShadow = false;
uranus.position.set(850, 0, 0);
scene.add(uranus);
addPlanetData(uranus, 'Uranus', 2867.0);

// Neptune with texture
const neptuneGeom = new THREE.SphereGeometry(30, 32, 32);
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeom, neptuneMaterial);
neptune.castShadow = false;
neptune.receiveShadow = false;
neptune.position.set(950, 0, 0);
scene.add(neptune);
addPlanetData(neptune, 'Neptune', 4515.0);

// Pluto with texture
const plutoGeom = new THREE.SphereGeometry(8, 32, 32);
const plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });
const pluto = new THREE.Mesh(plutoGeom, plutoMaterial);
pluto.castShadow = false;
pluto.receiveShadow = false;
pluto.position.set(1000, 0, 0);
scene.add(pluto);
addPlanetData(pluto, 'Pluto', 5906.4);

// Create asteroid belt debris between Mars (450) and Jupiter (600)
const debrisArray = [];
const debrisCount = 500; // Number of debris pieces
const debrisMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
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
  debris.castShadow = false;
  debris.receiveShadow = false;
  
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


// Store all planet meshes and their materials for light toggle
const planetMeshes = [
  { mesh: mercury, material: mercuryMaterial, texture: mercuryTexture, geometry: mercuryGeom },
  { mesh: venus, material: venusMaterial, texture: venusTexture, geometry: venusGeom },
  { mesh: earth, material: earthMaterial, texture: earthTexture, geometry: earthGeom },
  { mesh: moon, material: moonMaterial, texture: moonTexture, geometry: moonGeom },
  { mesh: mars, material: marsMaterial, texture: marsTexture, geometry: marsGeom },
  { mesh: jupiter, material: jupiterMaterial, texture: jupiterTexture, geometry: jupiterGeom },
  { mesh: saturn, material: saturnMaterial, texture: saturnTexture, geometry: saturnGeom },
  { mesh: uranus, material: uranusMaterial, texture: uranusTexture, geometry: uranusGeom },
  { mesh: neptune, material: neptuneMaterial, texture: neptuneTexture, geometry: neptuneGeom },
  { mesh: pluto, material: plutoMaterial, texture: plutoTexture, geometry: plutoGeom }
];

// Function to switch materials based on light state
function switchPlanetMaterials(useLighting) {
  planetMeshes.forEach(({ mesh, material, texture, geometry }) => {
    if (useLighting) {
      // Switch to MeshStandardMaterial (with lighting)
      const newMaterial = new THREE.MeshStandardMaterial({ map: texture });
      mesh.material = newMaterial;
      // Restore shadow settings for Earth and Moon
      if (mesh === earth || mesh === moon) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    } else {
      // Switch to MeshBasicMaterial (flat, no lighting)
      const newMaterial = new THREE.MeshBasicMaterial({ map: texture });
      mesh.material = newMaterial;
      // Disable shadows when using basic material
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  });
  
  // Handle Saturn rings
  if (useLighting) {
    saturnRings.material = new THREE.MeshStandardMaterial({ 
      color: 0xd4a574,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    });
    saturnRings2.material = new THREE.MeshStandardMaterial({ 
      color: 0xc9a06b,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
  } else {
    saturnRings.material = new THREE.MeshBasicMaterial({ 
      color: 0xd4a574,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    });
    saturnRings2.material = new THREE.MeshBasicMaterial({ 
      color: 0xc9a06b,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
  }
  
  // Handle debris
  debrisArray.forEach(debris => {
    if (useLighting) {
      debris.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    } else {
      debris.material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    }
  });
}

// Create toggle button for sun light
let sunLightEnabled = true; // Light is on by default
const sunLightToggleButton = document.createElement('button');
sunLightToggleButton.textContent = 'Sun Light: ON';
sunLightToggleButton.style.cssText = `
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
sunLightToggleButton.addEventListener('click', () => {
  sunLightEnabled = !sunLightEnabled;
  if (sunLightEnabled) {
    // Turn light on
    sunLight.intensity = 5;
    ambientLight.intensity = defaultAmbientIntensity;
    switchPlanetMaterials(true); // Use MeshStandardMaterial
    sunLightToggleButton.textContent = 'Sun Light: ON';
    sunLightToggleButton.style.backgroundColor = '#4CAF50';
  } else {
    // Turn light off
    sunLight.intensity = 0;
    ambientLight.intensity = 0.4; // Keep ambient light normal
    switchPlanetMaterials(false); // Use MeshBasicMaterial
    sunLightToggleButton.textContent = 'Sun Light: OFF';
    sunLightToggleButton.style.backgroundColor = '#f44336';
  }
});
document.body.appendChild(sunLightToggleButton);

// Create toggle button for starfield
let starfieldVisible = true; // Starfield is visible by default
const starfieldToggleButton = document.createElement('button');
starfieldToggleButton.textContent = 'Starfield: ON';
starfieldToggleButton.style.cssText = `
  position: fixed;
  top: 90px;
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
starfieldToggleButton.addEventListener('click', () => {
  starfieldVisible = !starfieldVisible;
  starfield.visible = starfieldVisible;
  starfieldToggleButton.textContent = `Starfield: ${starfieldVisible ? 'ON' : 'OFF'}`;
  starfieldToggleButton.style.backgroundColor = starfieldVisible ? '#4CAF50' : '#f44336';
});
document.body.appendChild(starfieldToggleButton);

// Create snapshot button (moved to last position)
const snapshotButton = document.createElement('button');
snapshotButton.textContent = 'Take Snapshot';
snapshotButton.style.cssText = `
  position: fixed;
  top: 130px;
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
  BodyRotate(sun, 0.01);

  // Mercury - rotation and revolution (eccentricity: 0.21)
  BodyRotate(mercury, 0.01);
  Bodyrevolve(mercury, 300, 1.0, 0.21);

  // Venus - rotation and revolution (eccentricity: 0.01)
  BodyRotate(venus, 0.01);
  Bodyrevolve(venus, 340, 0.9, 0.01);

  // Earth - rotation and revolution (eccentricity: 0.02)
  BodyRotate(earth, 0.01);
  Bodyrevolve(earth, 380, 0.8, 0.02);

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
  BodyRotate(moon, 0.01);

  // Mars - rotation and revolution (eccentricity: 0.09)
  BodyRotate(mars, 0.01);
  Bodyrevolve(mars, 450, 0.6, 0.09);

  // Jupiter - rotation and revolution (eccentricity: 0.05)
  BodyRotate(jupiter, 0.01);
  Bodyrevolve(jupiter, 600, 0.4, 0.05);

  // Saturn - rotation and revolution (eccentricity: 0.06)
  BodyRotate(saturn, 0.01);
  Bodyrevolve(saturn, 700, 0.3, 0.06);
  // Rotate and move rings with Saturn
  saturnRings.rotation.z += 0.01;
  saturnRings2.rotation.z += 0.01;
  saturnRings.position.x = saturn.position.x;
  saturnRings.position.z = saturn.position.z;
  saturnRings2.position.x = saturn.position.x;
  saturnRings2.position.z = saturn.position.z;

  // Uranus - rotation and revolution (eccentricity: 0.05)
  BodyRotate(uranus, 0.01);
  Bodyrevolve(uranus, 850, 0.25, 0.05);

  // Neptune - rotation and revolution (eccentricity: 0.01)
  BodyRotate(neptune, 0.01);
  Bodyrevolve(neptune, 950, 0.2, 0.01);

  // Pluto - rotation and revolution (eccentricity: 0.25 - highly elliptical)
  BodyRotate(pluto, 0.01);
  Bodyrevolve(pluto, 1000, 0.15, 0.25);

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
  
  // Raycast for planet hover detection
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([
    sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto
  ]);
  
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    const data = planetData.get(intersectedObject);
    
    if (data) {
      // Calculate current distance from sun (accounting for orbit)
      const currentDistance = intersectedObject.position.length();
      // Scale to approximate real distance (our scale: 1 unit ≈ 1.5 million km)
      const realDistance = currentDistance * 1.5;
      
      planetInfo.innerHTML = `
        <h3>${data.name}</h3>
        <p>Distance from Sun: ${realDistance.toFixed(1)} million km</p>
        <p>Average Distance: ${data.distanceFromSun} million km</p>
      `;
      planetInfo.classList.add('show');
      planetInfo.style.left = (mouseX + 15) + 'px';
      planetInfo.style.top = (mouseY + 15) + 'px';
    }
  } else {
    planetInfo.classList.remove('show');
  }
  
  renderer.render(scene, camera);
}
animate();