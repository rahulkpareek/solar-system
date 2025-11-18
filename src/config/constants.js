// Configuration and constants for the solar system

export const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 3000,
  initialPosition: { x: 0, y: 200, z: 800 }
};

export const RENDERER_CONFIG = {
  shadowMap: {
    enabled: true,
    type: 'PCFSoftShadowMap'
  }
};

export const LIGHTING_CONFIG = {
  ambient: {
    color: 0x404040,
    intensity: 0.4
  },
  sun: {
    color: 0xffffff,
    intensity: 5,
    distance: 0, // infinite
    decay: 0,
    shadow: {
      mapSize: { width: 2048, height: 2048 },
      camera: { near: 0.1, far: 3000 }
    }
  }
};

export const STARFIELD_CONFIG = {
  count: 10000,
  minRadius: 2000,
  maxRadius: 3000,
  size: 2,
  opacity: 0.8
};

export const PLANET_DATA = {
  sun: { name: 'Sun', distance: 0, size: 100, position: { x: 0, y: 0, z: 0 } },
  mercury: { name: 'Mercury', distance: 57.9, size: 10, semiMajorAxis: 300, speed: 1.0, eccentricity: 0.21 },
  venus: { name: 'Venus', distance: 108.2, size: 18, semiMajorAxis: 340, speed: 0.9, eccentricity: 0.01 },
  earth: { name: 'Earth', distance: 149.6, size: 20, semiMajorAxis: 380, speed: 0.8, eccentricity: 0.02 },
  moon: { name: 'Moon', distance: 149.6, size: 6, semiMajorAxis: 35, speed: 2.0, eccentricity: 0.05 },
  mars: { name: 'Mars', distance: 227.9, size: 15, semiMajorAxis: 450, speed: 0.6, eccentricity: 0.09 },
  jupiter: { name: 'Jupiter', distance: 778.5, size: 50, semiMajorAxis: 600, speed: 0.4, eccentricity: 0.05 },
  saturn: { name: 'Saturn', distance: 1432.0, size: 45, semiMajorAxis: 700, speed: 0.3, eccentricity: 0.06 },
  uranus: { name: 'Uranus', distance: 2867.0, size: 35, semiMajorAxis: 850, speed: 0.25, eccentricity: 0.05 },
  neptune: { name: 'Neptune', distance: 4515.0, size: 30, semiMajorAxis: 950, speed: 0.2, eccentricity: 0.01 },
  pluto: { name: 'Pluto', distance: 5906.4, size: 8, semiMajorAxis: 1000, speed: 0.15, eccentricity: 0.25 }
};

export const ORBIT_COLORS = {
  mercury: 0x00ff00,
  venus: 0xffa500,
  earth: 0x0000ff,
  mars: 0xff4500,
  jupiter: 0xd2691e,
  saturn: 0xfad5a5,
  uranus: 0x4fd0e7,
  neptune: 0x4166f5,
  pluto: 0x8b7355
};

export const DEBRIS_CONFIG = {
  count: 500,
  minRadius: 470,
  maxRadius: 580,
  minSize: 0.5,
  maxSize: 2,
  minSpeed: 0.3,
  maxSpeed: 0.5,
  maxEccentricity: 0.1
};

export const CAMERA_CONTROLS_CONFIG = {
  minDistance: 200,
  maxDistance: 2000,
  maxPanDistance: 1200,
  damping: true,
  dampingFactor: 0.05,
  panSpeed: 1.0,
  keyPanSpeed: 7.0
};

export const ROTATION_SPEED = 0.01;
export const DISTANCE_SCALE = 1.5; // 1 unit ≈ 1.5 million km

