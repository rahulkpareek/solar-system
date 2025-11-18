// Planet info tooltip

import { DISTANCE_SCALE } from '../config/constants.js';

export function createPlanetTooltip() {
  const planetInfo = document.createElement('div');
  planetInfo.className = 'planet-info';
  document.body.appendChild(planetInfo);
  
  return {
    show: (data, mouseX, mouseY) => {
      const currentDistance = data.mesh.position.length();
      const realDistance = currentDistance * DISTANCE_SCALE;
      
      planetInfo.innerHTML = `
        <h3>${data.name}</h3>
        <p>Distance from Sun: ${realDistance.toFixed(1)} million km</p>
        <p>Average Distance: ${data.distanceFromSun} million km</p>
      `;
      planetInfo.classList.add('show');
      planetInfo.style.left = (mouseX + 15) + 'px';
      planetInfo.style.top = (mouseY + 15) + 'px';
    },
    hide: () => {
      planetInfo.classList.remove('show');
    }
  };
}

