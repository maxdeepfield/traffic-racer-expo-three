# 3D Runner Game — Expo + React Three Fiber

This is a 3D endless runner demo built with Expo and React Three Fiber that procedurally spawns obstacles, keeps score, and gradually increases speed to raise the challenge.

## Getting started

1. Install dependencies and the Expo CLI if you have not yet (you only need the CLI when you run native simulators).
   ```bash
   npm install
   npm install --global expo-cli     # optional if you want the CLI globally
   ```
2. Start Metro and Expo:
   ```bash
   npm start
   ```
3. Launch on the platform of your choice:
   - `npm run ios` to open the iOS simulator
   - `npm run android` to open the Android emulator
   - `npm run web` to open a web preview
   - Scan the QR code with the Expo Go app to run on a real device

## Game experience

- **Procedurally generated obstacles** keep the track fresh on every run.
- **Smooth lane-switching movement** keeps the player centered on the track.
- **Score tracking and difficulty scaling** reward longer runs and add tension over time.

## Controls

- Swipe left/right (touch or mouse drag) to switch lanes.
- The player automatically moves forward; avoid obstacles and survive as long as possible.

## Project structure

```
App.js              # Entry point plus global providers or state
src/
  components/
    Game.js         # High-level scene, state machine, and jump/fall logic
    Player.js       # Handles lane movement and player visuals
    Track.js        # Renders the lane grid and handles scrolling
    Obstacles.js    # Procedural obstacle spawning and cleanup
assets/             # Static textures/models (if any)
```

## Technology stack

- Expo — wraps React Native + Metro for fast iteration across platforms.
- React Three Fiber — bridges React with Three.js for declarative 3D scenes.
- @react-three/drei — reusable helpers (cameras, lighting, shapes) for the 3D scene.
- Three.js — powers the WebGL renderer.

## Development notes

- The game logic lives inside `src/components/Game.js`, which orchestrates the player, track, and obstacles.
- You can customize lane count, spacing, or obstacle speed directly in those components to tune difficulty.
- If you add native modules or polyfills, restart the Expo bundler (`npm start`) so the Metro cache picks up the changes.

Enjoy building and running the runner!
