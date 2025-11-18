// Scene, camera, and renderer setup

import * as THREE from "three";
import { CAMERA_CONFIG, RENDERER_CONFIG } from '../config/constants.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  camera.position.set(
    CAMERA_CONFIG.initialPosition.x,
    CAMERA_CONFIG.initialPosition.y,
    CAMERA_CONFIG.initialPosition.z
  );
  camera.lookAt(0, 0, 0);
  return camera;
}

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = RENDERER_CONFIG.shadowMap.enabled;
  renderer.shadowMap.type = THREE[RENDERER_CONFIG.shadowMap.type];
  document.body.appendChild(renderer.domElement);
  return renderer;
}

export function setupResizeHandler(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

