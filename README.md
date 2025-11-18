# Solar System Simulation

A 3D interactive solar system simulation built with Three.js featuring all planets, realistic lighting, and dynamic shadows.

## Features

- **Complete Solar System**: Sun and all 9 planets (including Pluto) with realistic textures
- **Lighting System**: Dynamic sun lighting with shadows (Earth and Moon cast/receive shadows)
- **Starfield Background**: 10,000 stars creating a realistic space environment
- **Elliptical Orbits**: All planets follow elliptical orbital paths with realistic eccentricities
- **Moon System**: Earth's moon orbiting around Earth
- **Saturn's Rings**: Beautiful ring system around Saturn
- **Asteroid Belt**: 500+ debris pieces between Mars and Jupiter
- **Orbit Paths**: Visual orbit rings showing each planet's elliptical path
- **Interactive Camera**: Pan, zoom, and rotate with automatic constraints

## How to Run

1. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Controls

### Mouse & Keyboard
- **Left Mouse Button + Drag**: Rotate camera around target
- **Middle Mouse Button + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Arrow Keys**: Pan camera

### On-Screen Buttons
- **Revolution: ON/OFF**: Pause/resume all planet revolutions
- **Sun Light: ON/OFF**: Toggle sun lighting (affects planet materials and shadows)
- **Starfield: ON/OFF**: Show/hide starfield background
- **Take Snapshot**: Capture and download current view as PNG image

## Solar System Components

### Planets (in order from Sun)
- **Sun** - Center of the solar system with emissive glow
- **Mercury** - Closest planet (eccentricity: 0.21)
- **Venus** - Hottest planet (eccentricity: 0.01)
- **Earth** - Our home planet (eccentricity: 0.02)
  - **Moon** - Earth's natural satellite
- **Mars** - The red planet (eccentricity: 0.09)
- **Jupiter** - Largest planet (eccentricity: 0.05)
- **Saturn** - Planet with rings (eccentricity: 0.06)
- **Uranus** - Ice giant (eccentricity: 0.05)
- **Neptune** - Farthest gas giant (eccentricity: 0.01)
- **Pluto** - Dwarf planet (eccentricity: 0.25 - highly elliptical)

### Other Features
- **Asteroid Belt**: 500+ small debris pieces between Mars and Jupiter
- **Orbit Paths**: Visual elliptical rings for each planet
- **Saturn's Rings**: Multi-layered ring system

