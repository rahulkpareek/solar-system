import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(50, 0, 120); // Far away and centered
camera.lookAt(50, 0, 0);        // Look at midpoint between Sun and Mercury

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function Bodyrevolve(planet, radius, speed) {
  const time = Date.now() * 0.001 * speed;
  planet.position.x = Math.cos(time) * radius;
  planet.position.z = Math.sin(time) * radius;
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

//Earth
const earthObj = BodyCreate(20, 0x0000ff, 0x0000ff, true);
const earth = earthObj.mesh;
const earthWireframe = earthObj.wireframeMesh;
earth.position.set(380, 0, 0);
earthWireframe.position.set(380, 0, 0);
scene.add(earth);
scene.add(earthWireframe);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);

  //rotate sun
  sun.rotation.y += 0.01;
  sunWireframe.rotation.y += 0.01;

  //mercury rotation update
    mercury.rotation.y += 0.01;
    mercuryWireframe.rotation.y += 0.01;

  //mercury orbit update
  const time = Date.now() * 0.001;
    const mercuryOrbitRadius = 300;
    mercury.position.x = Math.cos(time) * mercuryOrbitRadius;
    mercury.position.z = Math.sin(time) * mercuryOrbitRadius;
    mercuryWireframe.position.x = mercury.position.x;
    mercuryWireframe.position.z = mercury.position.z; 
    
    //earth rotation update
    earth.rotation.y += 0.01;
    earthWireframe.rotation.y += 0.01;

  //earth orbit update
   const time2 = Date.now() * 0.001;
    const earthOrbitRadius = 380;
    earth.position.x = Math.cos(time2) * earthOrbitRadius;
    earth.position.z = Math.sin(time2) * earthOrbitRadius;
    earthWireframe.position.x = earth.position.x;
    earthWireframe.position.z = earth.position.z;     

  controls.update();
  renderer.render(scene, camera);
}
animate();