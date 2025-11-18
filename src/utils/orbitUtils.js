// Utility functions for orbital mechanics

import * as THREE from "three";

/**
 * Calculate planet revolution with pause support
 */
export function calculateRevolution(planet, semiMajorAxis, speed, eccentricity, revolutionState) {
  let currentTime = Date.now();
  if (revolutionState.paused) {
    currentTime = revolutionState.lastPauseTime;
  }
  
  const time = (currentTime - revolutionState.pauseTimeOffset) * 0.001 * speed;
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
  
  planet.position.x = Math.cos(time) * semiMajorAxis;
  planet.position.z = Math.sin(time) * semiMinorAxis;
}

/**
 * Rotate a planet on its axis
 */
export function rotatePlanet(planet, speed) {
  planet.rotation.y += speed;
}

/**
 * Create an elliptical orbit path
 */
export function createOrbitPath(semiMajorAxis, color, eccentricity = 0.1) {
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
  
  return new THREE.Line(geometry, material);
}

