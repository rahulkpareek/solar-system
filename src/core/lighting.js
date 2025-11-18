// Lighting setup

import * as THREE from "three";
import { LIGHTING_CONFIG } from '../config/constants.js';

export function createAmbientLight() {
  return new THREE.AmbientLight(
    LIGHTING_CONFIG.ambient.color,
    LIGHTING_CONFIG.ambient.intensity
  );
}

export function createSunLight() {
  const light = new THREE.PointLight(
    LIGHTING_CONFIG.sun.color,
    LIGHTING_CONFIG.sun.intensity,
    LIGHTING_CONFIG.sun.distance,
    LIGHTING_CONFIG.sun.decay
  );
  light.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = LIGHTING_CONFIG.sun.shadow.mapSize.width;
  light.shadow.mapSize.height = LIGHTING_CONFIG.sun.shadow.mapSize.height;
  light.shadow.camera.near = LIGHTING_CONFIG.sun.shadow.camera.near;
  light.shadow.camera.far = LIGHTING_CONFIG.sun.shadow.camera.far;
  return light;
}

