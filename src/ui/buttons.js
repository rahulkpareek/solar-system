// UI button creation and management

import { switchPlanetMaterials } from '../utils/materialUtils.js';
import { LIGHTING_CONFIG } from '../config/constants.js';

export function createRevolutionButton(revolutionState) {
  const button = document.createElement('button');
  button.textContent = 'Revolution: ON';
  button.style.cssText = `
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
  
  button.addEventListener('click', () => {
    revolutionState.paused = !revolutionState.paused;
    if (revolutionState.paused) {
      revolutionState.lastPauseTime = Date.now();
    } else {
      revolutionState.pauseTimeOffset += Date.now() - revolutionState.lastPauseTime;
    }
    button.textContent = `Revolution: ${revolutionState.paused ? 'OFF' : 'ON'}`;
    button.style.backgroundColor = revolutionState.paused ? '#f44336' : '#4CAF50';
  });
  
  document.body.appendChild(button);
  return button;
}

export function createSunLightButton(sunLight, ambientLight, planetMeshes, earth, moon, saturnRings, saturnRings2, debrisArray) {
  let sunLightEnabled = true;
  const button = document.createElement('button');
  button.textContent = 'Sun Light: ON';
  button.style.cssText = `
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
  
  button.addEventListener('click', () => {
    sunLightEnabled = !sunLightEnabled;
    if (sunLightEnabled) {
      sunLight.intensity = LIGHTING_CONFIG.sun.intensity;
      ambientLight.intensity = LIGHTING_CONFIG.ambient.intensity;
      switchPlanetMaterials(planetMeshes, true, earth, moon, saturnRings, saturnRings2, debrisArray);
      button.textContent = 'Sun Light: ON';
      button.style.backgroundColor = '#4CAF50';
    } else {
      sunLight.intensity = 0;
      ambientLight.intensity = 0.4;
      switchPlanetMaterials(planetMeshes, false, earth, moon, saturnRings, saturnRings2, debrisArray);
      button.textContent = 'Sun Light: OFF';
      button.style.backgroundColor = '#f44336';
    }
  });
  
  document.body.appendChild(button);
  return button;
}

export function createStarfieldButton(starfield) {
  let starfieldVisible = true;
  const button = document.createElement('button');
  button.textContent = 'Starfield: ON';
  button.style.cssText = `
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
  
  button.addEventListener('click', () => {
    starfieldVisible = !starfieldVisible;
    starfield.visible = starfieldVisible;
    button.textContent = `Starfield: ${starfieldVisible ? 'ON' : 'OFF'}`;
    button.style.backgroundColor = starfieldVisible ? '#4CAF50' : '#f44336';
  });
  
  document.body.appendChild(button);
  return button;
}

export function createSnapshotButton(renderer, scene, camera) {
  const button = document.createElement('button');
  button.textContent = 'Take Snapshot';
  button.style.cssText = `
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
  
  button.addEventListener('click', () => {
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `solar-system-snapshot-${timestamp}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  document.body.appendChild(button);
  return button;
}

