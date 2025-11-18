# Solar System Simulation

A 3D solar system simulation built with Three.js featuring all planets orbiting the Sun with realistic physics and visualizations.

## Features

- **Complete Solar System**: Sun and all 9 planets (including Pluto) with realistic textures
- **Elliptical Orbits**: All planets follow elliptical orbital paths with realistic eccentricities
- **Moon System**: Earth's moon orbiting around Earth
- **Saturn's Rings**: Beautiful ring system around Saturn
- **Asteroid Belt**: 500+ debris pieces between Mars and Jupiter
- **Orbit Paths**: Visual orbit rings showing each planet's elliptical path
- **Interactive Controls**: 
  - Pan, zoom, and rotate camera
  - Camera constraints to keep solar system in view
- **Control Buttons**:
  - Wireframe toggle (off by default)
  - Revolution pause/play
  - Snapshot capture
- **Smooth Animations**: Realistic rotation and revolution speeds

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
- **Scroll Wheel**: Zoom in/out (limited to keep view in bounds)
- **Arrow Keys**: Pan camera

### On-Screen Buttons
- **Toggle Wireframes**: Show/hide planet wireframes (top-right, off by default)
- **Revolution: ON/OFF**: Pause/resume all planet revolutions (top-right)
- **Take Snapshot**: Capture and download current view as PNG image (top-right)

### Camera Constraints
- Zoom range: 200-2000 units
- Pan limit: 1200 units from center
- Automatically keeps solar system in view

## Solar System Components

### Planets (in order from Sun)
- **Sun** - Center of the solar system
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
- **Asteroid Belt**: 500+ small debris cubes between Mars and Jupiter
- **Orbit Paths**: Visual elliptical rings for each planet
- **Saturn's Rings**: Multi-layered ring system

## Technical Details

### Orbit Physics
- All planets follow elliptical orbits with realistic eccentricities
- Each planet has unique revolution speed (outer planets move slower)
- Planets rotate on their axes while orbiting
- Moon orbits Earth in an elliptical path

### Files
- `index.html` - Main HTML file
- `index.js` - Three.js application code
- `materials/` - Planet texture files (PNG/JPEG)
  - Each planet has its own texture material
  - Textures loaded from the materials folder

### Technologies
- **Three.js** - 3D graphics library
- **OrbitControls** - Camera control system
- **ES6 Modules** - Modern JavaScript

