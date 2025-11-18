// Planet creation and management

import * as THREE from "three";
import { PLANET_DATA } from '../config/constants.js';
import { textures } from './textures.js';

const planetData = new Map();

export function addPlanetData(mesh, name, distanceFromSun) {
  planetData.set(mesh, { name, distanceFromSun });
}

export function getPlanetData() {
  return planetData;
}

export function createSun() {
  const data = PLANET_DATA.sun;
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshBasicMaterial({ 
    map: textures.sun,
    emissive: 0xffffaa,
    emissiveIntensity: 0.5
  });
  const sun = new THREE.Mesh(geometry, material);
  sun.castShadow = false;
  sun.receiveShadow = false;
  sun.position.set(data.position.x, data.position.y, data.position.z);
  addPlanetData(sun, data.name, data.distance);
  return sun;
}

export function createPlanet(key, data) {
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: textures[key] });
  const planet = new THREE.Mesh(geometry, material);
  
  // Earth and Moon cast/receive shadows
  if (key === 'earth' || key === 'moon') {
    planet.castShadow = true;
    planet.receiveShadow = true;
  } else {
    planet.castShadow = false;
    planet.receiveShadow = false;
  }
  
  planet.position.set(data.semiMajorAxis, 0, 0);
  addPlanetData(planet, data.name, data.distance);
  
  return {
    mesh: planet,
    geometry,
    material,
    texture: textures[key]
  };
}

export function createSaturnRings(saturnPosition) {
  const ringGeometry = new THREE.RingGeometry(50, 70, 64);
  const ringMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd4a574,
    side: THREE.DoubleSide,
    opacity: 0.7,
    transparent: true
  });
  const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
  saturnRings.rotation.x = Math.PI / 2;
  saturnRings.position.set(saturnPosition.x, saturnPosition.y, saturnPosition.z);
  
  const ringGeometry2 = new THREE.RingGeometry(48, 72, 64);
  const ringMaterial2 = new THREE.MeshStandardMaterial({ 
    color: 0xc9a06b,
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true
  });
  const saturnRings2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
  saturnRings2.rotation.x = Math.PI / 2;
  saturnRings2.position.set(saturnPosition.x, saturnPosition.y, saturnPosition.z);
  
  return { saturnRings, saturnRings2 };
}

export function createAllPlanets() {
  const sun = createSun();
  
  const planets = {
    sun,
    mercury: createPlanet('mercury', PLANET_DATA.mercury),
    venus: createPlanet('venus', PLANET_DATA.venus),
    earth: createPlanet('earth', PLANET_DATA.earth),
    moon: createPlanet('moon', PLANET_DATA.moon),
    mars: createPlanet('mars', PLANET_DATA.mars),
    jupiter: createPlanet('jupiter', PLANET_DATA.jupiter),
    saturn: createPlanet('saturn', PLANET_DATA.saturn),
    uranus: createPlanet('uranus', PLANET_DATA.uranus),
    neptune: createPlanet('neptune', PLANET_DATA.neptune),
    pluto: createPlanet('pluto', PLANET_DATA.pluto)
  };
  
  // Set moon initial position relative to Earth
  planets.moon.mesh.position.set(
    PLANET_DATA.earth.semiMajorAxis + PLANET_DATA.moon.semiMajorAxis,
    0,
    0
  );
  
  // Create Saturn rings
  const rings = createSaturnRings({
    x: PLANET_DATA.saturn.semiMajorAxis,
    y: 0,
    z: 0
  });
  
  return { planets, rings };
}

