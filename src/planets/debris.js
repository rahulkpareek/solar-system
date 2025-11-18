// Asteroid belt debris creation

import * as THREE from "three";
import { DEBRIS_CONFIG } from '../config/constants.js';

export function createDebrisBelt() {
  const debrisArray = [];
  const debrisMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  
  for (let i = 0; i < DEBRIS_CONFIG.count; i++) {
    const radius = DEBRIS_CONFIG.minRadius + Math.random() * (DEBRIS_CONFIG.maxRadius - DEBRIS_CONFIG.minRadius);
    const startAngle = Math.random() * Math.PI * 2;
    const speed = DEBRIS_CONFIG.minSpeed + Math.random() * (DEBRIS_CONFIG.maxSpeed - DEBRIS_CONFIG.minSpeed);
    const eccentricity = Math.random() * DEBRIS_CONFIG.maxEccentricity;
    
    const debrisSize = DEBRIS_CONFIG.minSize + Math.random() * (DEBRIS_CONFIG.maxSize - DEBRIS_CONFIG.minSize);
    const debrisGeom = new THREE.BoxGeometry(debrisSize, debrisSize, debrisSize);
    const debris = new THREE.Mesh(debrisGeom, debrisMaterial);
    debris.castShadow = false;
    debris.receiveShadow = false;
    
    debris.userData = {
      semiMajorAxis: radius,
      speed: speed,
      eccentricity: eccentricity,
      startAngle: startAngle
    };
    
    const semiMinorAxis = radius * Math.sqrt(1 - eccentricity * eccentricity);
    debris.position.x = Math.cos(startAngle) * radius;
    debris.position.z = Math.sin(startAngle) * semiMinorAxis;
    debris.position.y = (Math.random() - 0.5) * 20;
    
    debrisArray.push(debris);
  }
  
  return debrisArray;
}

