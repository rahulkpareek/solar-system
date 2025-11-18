// Animation loop and planet movement

import * as THREE from "three";
import { calculateRevolution, rotatePlanet } from '../utils/orbitUtils.js';
import { PLANET_DATA, ROTATION_SPEED } from '../config/constants.js';
import { enforceCameraConstraints } from '../controls/cameraControls.js';

export function createAnimationLoop({
  scene,
  camera,
  renderer,
  controls,
  planets,
  saturnRings,
  saturnRings2,
  debrisArray,
  revolutionState,
  raycaster,
  mouse,
  planetData,
  tooltip,
  getMousePosition
}) {
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate sun
    rotatePlanet(planets.sun, ROTATION_SPEED);
    
    // Mercury
    rotatePlanet(planets.mercury.mesh, ROTATION_SPEED);
    calculateRevolution(planets.mercury.mesh, PLANET_DATA.mercury.semiMajorAxis, PLANET_DATA.mercury.speed, PLANET_DATA.mercury.eccentricity, revolutionState);
    
    // Venus
    rotatePlanet(planets.venus.mesh, ROTATION_SPEED);
    calculateRevolution(planets.venus.mesh, PLANET_DATA.venus.semiMajorAxis, PLANET_DATA.venus.speed, PLANET_DATA.venus.eccentricity, revolutionState);
    
    // Earth
    rotatePlanet(planets.earth.mesh, ROTATION_SPEED);
    calculateRevolution(planets.earth.mesh, PLANET_DATA.earth.semiMajorAxis, PLANET_DATA.earth.speed, PLANET_DATA.earth.eccentricity, revolutionState);
    
    // Moon
    let moonCurrentTime = Date.now();
    if (revolutionState.paused) {
      moonCurrentTime = revolutionState.lastPauseTime;
    }
    const moonOrbitTime = (moonCurrentTime - revolutionState.pauseTimeOffset) * 0.001 * PLANET_DATA.moon.speed;
    const moonSemiMinor = PLANET_DATA.moon.semiMajorAxis * Math.sqrt(1 - PLANET_DATA.moon.eccentricity * PLANET_DATA.moon.eccentricity);
    const moonAngle = moonOrbitTime;
    planets.moon.mesh.position.x = planets.earth.mesh.position.x + Math.cos(moonAngle) * PLANET_DATA.moon.semiMajorAxis;
    planets.moon.mesh.position.z = planets.earth.mesh.position.z + Math.sin(moonAngle) * moonSemiMinor;
    rotatePlanet(planets.moon.mesh, ROTATION_SPEED);
    
    // Mars
    rotatePlanet(planets.mars.mesh, ROTATION_SPEED);
    calculateRevolution(planets.mars.mesh, PLANET_DATA.mars.semiMajorAxis, PLANET_DATA.mars.speed, PLANET_DATA.mars.eccentricity, revolutionState);
    
    // Jupiter
    rotatePlanet(planets.jupiter.mesh, ROTATION_SPEED);
    calculateRevolution(planets.jupiter.mesh, PLANET_DATA.jupiter.semiMajorAxis, PLANET_DATA.jupiter.speed, PLANET_DATA.jupiter.eccentricity, revolutionState);
    
    // Saturn
    rotatePlanet(planets.saturn.mesh, ROTATION_SPEED);
    calculateRevolution(planets.saturn.mesh, PLANET_DATA.saturn.semiMajorAxis, PLANET_DATA.saturn.speed, PLANET_DATA.saturn.eccentricity, revolutionState);
    saturnRings.rotation.z += ROTATION_SPEED;
    saturnRings2.rotation.z += ROTATION_SPEED;
    saturnRings.position.x = planets.saturn.mesh.position.x;
    saturnRings.position.z = planets.saturn.mesh.position.z;
    saturnRings2.position.x = planets.saturn.mesh.position.x;
    saturnRings2.position.z = planets.saturn.mesh.position.z;
    
    // Uranus
    rotatePlanet(planets.uranus.mesh, ROTATION_SPEED);
    calculateRevolution(planets.uranus.mesh, PLANET_DATA.uranus.semiMajorAxis, PLANET_DATA.uranus.speed, PLANET_DATA.uranus.eccentricity, revolutionState);
    
    // Neptune
    rotatePlanet(planets.neptune.mesh, ROTATION_SPEED);
    calculateRevolution(planets.neptune.mesh, PLANET_DATA.neptune.semiMajorAxis, PLANET_DATA.neptune.speed, PLANET_DATA.neptune.eccentricity, revolutionState);
    
    // Pluto
    rotatePlanet(planets.pluto.mesh, ROTATION_SPEED);
    calculateRevolution(planets.pluto.mesh, PLANET_DATA.pluto.semiMajorAxis, PLANET_DATA.pluto.speed, PLANET_DATA.pluto.eccentricity, revolutionState);
    
    // Update debris
    let debrisCurrentTime = Date.now();
    if (revolutionState.paused) {
      debrisCurrentTime = revolutionState.lastPauseTime;
    }
    debrisArray.forEach(debris => {
      const time = (debrisCurrentTime - revolutionState.pauseTimeOffset) * 0.001 * debris.userData.speed;
      const angle = time + debris.userData.startAngle;
      const semiMajorAxis = debris.userData.semiMajorAxis;
      const eccentricity = debris.userData.eccentricity;
      const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
      
      debris.position.x = Math.cos(angle) * semiMajorAxis;
      debris.position.z = Math.sin(angle) * semiMinorAxis;
      
      debris.rotation.x += ROTATION_SPEED;
      debris.rotation.y += ROTATION_SPEED;
    });
    
    // Enforce camera constraints
    enforceCameraConstraints(camera, controls);
    
    controls.update();
    
    // Raycast for planet hover detection
    raycaster.setFromCamera(mouse, camera);
    const planetMeshes = [
      planets.sun,
      planets.mercury.mesh,
      planets.venus.mesh,
      planets.earth.mesh,
      planets.moon.mesh,
      planets.mars.mesh,
      planets.jupiter.mesh,
      planets.saturn.mesh,
      planets.uranus.mesh,
      planets.neptune.mesh,
      planets.pluto.mesh
    ];
    
    const intersects = raycaster.intersectObjects(planetMeshes);
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const data = planetData.get(intersectedObject);
      
      if (data) {
        const mousePos = getMousePosition();
        tooltip.show({ ...data, mesh: intersectedObject }, mousePos.x, mousePos.y);
      }
    } else {
      tooltip.hide();
    }
    
    renderer.render(scene, camera);
  }
  
  return animate;
}

