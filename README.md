## Known Issues
- While gameplay is fully functional, some minor improvements could still be added.
- Additional accessibility enhancements could be implemented.
- Please report any bugs or suggestions via GitHub Issues.

# Asteroid Coordinate Game

An interactive HTML5 game for practicing Cartesian coordinates. Students identify the position of an asteroid on a grid, enter the coordinates, and watch a spaceship fire at the asteroid when correct.

## Features
- Random asteroid placement on a Cartesian grid
- Visual cues to help identify coordinates
- **Three-phase firing animation:** charge buildup, projectile travel, and explosion burst
- **Audio-visual synchronization:** separate audio files for each animation phase (charge, fire, explosion)
- Audio feedback for correct and incorrect answers
- Accessibility: keyboard navigation, ARIA labels, alt text, instructions modal
- Option to toggle sound on/off
- **Automatic progression:** If both X and Y answers are correct, the game will move forward without needing to press Submit

## How to Play
1. An asteroid appears at a random grid position.
2. Enter the X and Y coordinates in the input boxes.
3. If both answers are correct, the game will automatically progress and fire at the asteroid. Otherwise, press Submit to check your answer.
4. If correct, the spaceship fires at the asteroid and destroys it. If incorrect, try again.
5. Toggle sound using the checkbox if desired.
6. Click Instructions for keyboard and gameplay help.

## Accessibility
- All controls are keyboard accessible
- Screen reader support via ARIA labels and roles
- High-contrast visuals and focus indicators
- Instructions modal for gameplay and keyboard help

## Project Structure
- `index.html` — Main game markup
- `style.css` — Game styles and animations
- `script.js` — Game logic and interactivity
- `assets/` — Images and graphics (asteroid, spaceship, grid)
- `ar/` — Audio files:
  - `charge.wav` — Energy buildup sound for projectile charging
  - `fire.wav` — Projectile travel sound
  - `explosion.wav` — Asteroid destruction sound
  - `incorrect.wav` — Wrong answer feedback

## Customization
- Replace asteroid and spaceship images in `assets/` for different themes
- Add or change audio files in `ar/`
- Adjust grid size and coordinate ranges in `script.js`

## License
This project is provided for educational use. Please credit the original author if you share or modify.
