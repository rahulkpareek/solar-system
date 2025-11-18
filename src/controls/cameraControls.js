// Camera controls setup

import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { CAMERA_CONTROLS_CONFIG } from '../config/constants.js';

export function setupCameraControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = CAMERA_CONTROLS_CONFIG.damping;
  controls.dampingFactor = CAMERA_CONTROLS_CONFIG.dampingFactor;
  controls.minDistance = CAMERA_CONTROLS_CONFIG.minDistance;
  controls.maxDistance = CAMERA_CONTROLS_CONFIG.maxDistance;
  controls.enablePan = true;
  controls.panSpeed = CAMERA_CONTROLS_CONFIG.panSpeed;
  controls.screenSpacePanning = false;
  controls.keyPanSpeed = CAMERA_CONTROLS_CONFIG.keyPanSpeed;
  
  controls.addEventListener('change', () => {
    const distance = camera.position.length();
    if (distance > CAMERA_CONTROLS_CONFIG.maxPanDistance) {
      camera.position.normalize().multiplyScalar(CAMERA_CONTROLS_CONFIG.maxPanDistance);
      controls.target.set(0, 0, 0);
    }
    
    const targetDistance = controls.target.length();
    if (targetDistance > 500) {
      controls.target.normalize().multiplyScalar(500);
    }
  });
  
  return controls;
}

export function enforceCameraConstraints(camera, controls) {
  const cameraDistance = camera.position.length();
  if (cameraDistance > CAMERA_CONTROLS_CONFIG.maxPanDistance) {
    camera.position.normalize().multiplyScalar(CAMERA_CONTROLS_CONFIG.maxPanDistance);
  }
  if (cameraDistance < CAMERA_CONTROLS_CONFIG.minDistance) {
    camera.position.normalize().multiplyScalar(CAMERA_CONTROLS_CONFIG.minDistance);
  }
  
  const targetDistance = controls.target.length();
  if (targetDistance > 500) {
    controls.target.normalize().multiplyScalar(500);
  }
}

