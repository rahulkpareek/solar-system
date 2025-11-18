// Material switching utilities

import * as THREE from "three";

/**
 * Switch planet materials based on lighting state
 */
export function switchPlanetMaterials(planetMeshes, useLighting, earth, moon, saturnRings, saturnRings2, debrisArray) {
  
  planetMeshes.forEach(({ mesh, texture }) => {
    if (useLighting) {
      const newMaterial = new THREE.MeshStandardMaterial({ map: texture });
      mesh.material = newMaterial;
      if (mesh === earth || mesh === moon) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    } else {
      const newMaterial = new THREE.MeshBasicMaterial({ map: texture });
      mesh.material = newMaterial;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  });
  
  // Handle Saturn rings
  if (useLighting) {
    saturnRings.material = new THREE.MeshStandardMaterial({ 
      color: 0xd4a574,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    });
    saturnRings2.material = new THREE.MeshStandardMaterial({ 
      color: 0xc9a06b,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
  } else {
    saturnRings.material = new THREE.MeshBasicMaterial({ 
      color: 0xd4a574,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    });
    saturnRings2.material = new THREE.MeshBasicMaterial({ 
      color: 0xc9a06b,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
  }
  
  // Handle debris
  debrisArray.forEach(debris => {
    if (useLighting) {
      debris.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    } else {
      debris.material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    }
  });
}

