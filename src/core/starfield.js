// Starfield creation

import * as THREE from "three";
import { STARFIELD_CONFIG } from '../config/constants.js';

export function createStarfield() {
  const starCount = STARFIELD_CONFIG.count;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  
  const starColorOptions = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xffffff),
    new THREE.Color(0xffffff),
    new THREE.Color(0xaaaaff),
    new THREE.Color(0xffaaaa),
    new THREE.Color(0xffffaa)
  ];
  
  for (let i = 0; i < starCount; i++) {
    const radius = STARFIELD_CONFIG.minRadius + Math.random() * (STARFIELD_CONFIG.maxRadius - STARFIELD_CONFIG.minRadius);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    starPositions[i * 3] = x;
    starPositions[i * 3 + 1] = y;
    starPositions[i * 3 + 2] = z;
    
    const starColor = starColorOptions[Math.floor(Math.random() * starColorOptions.length)];
    starColors[i * 3] = starColor.r;
    starColors[i * 3 + 1] = starColor.g;
    starColors[i * 3 + 2] = starColor.b;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    size: STARFIELD_CONFIG.size,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: STARFIELD_CONFIG.opacity
  });
  
  return new THREE.Points(starGeometry, starMaterial);
}

