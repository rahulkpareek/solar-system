// Orbit path creation

import { createOrbitPath } from '../utils/orbitUtils.js';
import { PLANET_DATA, ORBIT_COLORS } from '../config/constants.js';

export function createAllOrbits() {
  return {
    mercury: createOrbitPath(PLANET_DATA.mercury.semiMajorAxis, ORBIT_COLORS.mercury, PLANET_DATA.mercury.eccentricity),
    venus: createOrbitPath(PLANET_DATA.venus.semiMajorAxis, ORBIT_COLORS.venus, PLANET_DATA.venus.eccentricity),
    earth: createOrbitPath(PLANET_DATA.earth.semiMajorAxis, ORBIT_COLORS.earth, PLANET_DATA.earth.eccentricity),
    mars: createOrbitPath(PLANET_DATA.mars.semiMajorAxis, ORBIT_COLORS.mars, PLANET_DATA.mars.eccentricity),
    jupiter: createOrbitPath(PLANET_DATA.jupiter.semiMajorAxis, ORBIT_COLORS.jupiter, PLANET_DATA.jupiter.eccentricity),
    saturn: createOrbitPath(PLANET_DATA.saturn.semiMajorAxis, ORBIT_COLORS.saturn, PLANET_DATA.saturn.eccentricity),
    uranus: createOrbitPath(PLANET_DATA.uranus.semiMajorAxis, ORBIT_COLORS.uranus, PLANET_DATA.uranus.eccentricity),
    neptune: createOrbitPath(PLANET_DATA.neptune.semiMajorAxis, ORBIT_COLORS.neptune, PLANET_DATA.neptune.eccentricity),
    pluto: createOrbitPath(PLANET_DATA.pluto.semiMajorAxis, ORBIT_COLORS.pluto, PLANET_DATA.pluto.eccentricity)
  };
}

