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

// Sun
const obj = BodyCreate(100, 0xffff00, 0x00ff00, true);
const sun = obj.mesh;
const sunWireframe = obj.wireframeMesh;
obj.mesh.position.set(0, 0, 0);
obj.wireframeMesh.position.set(0, 0, 0);
scene.add(obj.mesh);
scene.add(obj.wireframeMesh);   

// Mercury
const mercuryObj = BodyCreate(10, 0x00ff00, 0x00ff00, true);
const mercury = mercuryObj.mesh;
const mercuryWireframe = mercuryObj.wireframeMesh;
mercury.position.set(300, 0, 0);
mercuryWireframe.position.set(300, 0, 0);
scene.add(mercury);
scene.add(mercuryWireframe);

// Venus
const venusObj = BodyCreate(18, 0xffa500, 0xffa500, true);
const venus = venusObj.mesh;
const venusWireframe = venusObj.wireframeMesh;
venus.position.set(340, 0, 0);
venusWireframe.position.set(340, 0, 0);
scene.add(venus);
scene.add(venusWireframe);

//Earth
const earthObj = BodyCreate(20, 0x0000ff, 0x0000ff, true);
const earth = earthObj.mesh;
const earthWireframe = earthObj.wireframeMesh;
earth.position.set(380, 0, 0);
earthWireframe.position.set(380, 0, 0);
scene.add(earth);
scene.add(earthWireframe);

// Mars
const marsObj = BodyCreate(15, 0xff4500, 0xff4500, true);
const mars = marsObj.mesh;
const marsWireframe = marsObj.wireframeMesh;
mars.position.set(450, 0, 0);
marsWireframe.position.set(450, 0, 0);
scene.add(mars);
scene.add(marsWireframe);

// Jupiter
const jupiterObj = BodyCreate(50, 0xd2691e, 0xd2691e, true);
const jupiter = jupiterObj.mesh;
const jupiterWireframe = jupiterObj.wireframeMesh;
jupiter.position.set(600, 0, 0);
jupiterWireframe.position.set(600, 0, 0);
scene.add(jupiter);
scene.add(jupiterWireframe);

// Saturn
const saturnObj = BodyCreate(45, 0xfad5a5, 0xfad5a5, true);
const saturn = saturnObj.mesh;
const saturnWireframe = saturnObj.wireframeMesh;
saturn.position.set(700, 0, 0);
saturnWireframe.position.set(700, 0, 0);
scene.add(saturn);
scene.add(saturnWireframe);

// Uranus
const uranusObj = BodyCreate(35, 0x4fd0e7, 0x4fd0e7, true);
const uranus = uranusObj.mesh;
const uranusWireframe = uranusObj.wireframeMesh;
uranus.position.set(850, 0, 0);
uranusWireframe.position.set(850, 0, 0);
scene.add(uranus);
scene.add(uranusWireframe);

// Neptune
const neptuneObj = BodyCreate(30, 0x4166f5, 0x4166f5, true);
const neptune = neptuneObj.mesh;
const neptuneWireframe = neptuneObj.wireframeMesh;
neptune.position.set(950, 0, 0);
neptuneWireframe.position.set(950, 0, 0);
scene.add(neptune);
scene.add(neptuneWireframe);

// Pluto
const plutoObj = BodyCreate(8, 0x8b7355, 0x8b7355, true);
const pluto = plutoObj.mesh;
const plutoWireframe = plutoObj.wireframeMesh;
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
  plutoWireframe
];

// Create toggle button for wireframes
let wireframesVisible = true;
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