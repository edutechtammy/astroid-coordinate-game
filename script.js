// Main JS for Asteroid Coordinate Game
const GRID_SIZE = 80; // pixels per grid unit
const GRID_ORIGIN_X = 400; // origin x pixel
const GRID_ORIGIN_Y = 400; // origin y pixel
let currentStep = 'x';
let asteroidX = 0;
let asteroidY = 0;
let score = 0;

function playAudio(src) {
    const soundOn = document.getElementById('sound-toggle');
    if (soundOn && !soundOn.checked) return;
    const audio = new Audio(src);
    audio.play();
}

function randomCoord() {
    // Valid grid coordinates: -4 to -1 and 1 to 4 (never on axis)
    const coords = [-4, -3, -2, -1, 1, 2, 3, 4];
    return coords[Math.floor(Math.random() * coords.length)];
}

function spawnAsteroid() {
    asteroidX = randomCoord();
    asteroidY = randomCoord();
    const asteroid = document.getElementById('asteroid');
    asteroid.style.left = (GRID_ORIGIN_X + asteroidX * GRID_SIZE - 24) + 'px';
    asteroid.style.top = (GRID_ORIGIN_Y - asteroidY * GRID_SIZE - 24) + 'px';
    asteroid.style.display = 'block';
}

function spawnSpaceship() {
    const spaceship = document.getElementById('spaceship');
    spaceship.style.left = '850px'; // Place spaceship on right side
    spaceship.style.top = (GRID_ORIGIN_Y - 32) + 'px';
    spaceship.style.display = 'block';
}

function showHighlightX() {
    const highlightX = document.getElementById('highlight-x');
    // Start at asteroid, stretch horizontally toward y-axis (x=0)
    const asteroidCenterX = GRID_ORIGIN_X + asteroidX * GRID_SIZE;
    const asteroidCenterY = GRID_ORIGIN_Y - asteroidY * GRID_SIZE;
    let axisX = GRID_ORIGIN_X;
    let left = Math.min(asteroidCenterX, axisX) - 24;
    let width = Math.abs(asteroidCenterX - axisX) + 48;
    highlightX.style.left = left + 'px';
    highlightX.style.top = (asteroidCenterY - 8) + 'px';
    highlightX.style.width = width + 'px';
    highlightX.style.height = '16px';
    highlightX.style.display = 'block';
    document.getElementById('highlight-y').style.display = 'none';
}

function showHighlightY() {
    const highlightY = document.getElementById('highlight-y');
    // Start at asteroid, stretch vertically toward x-axis (y=0)
    const asteroidCenterX = GRID_ORIGIN_X + asteroidX * GRID_SIZE;
    const asteroidCenterY = GRID_ORIGIN_Y - asteroidY * GRID_SIZE;
    let axisY = GRID_ORIGIN_Y;
    let top = Math.min(asteroidCenterY, axisY) - 24;
    let height = Math.abs(asteroidCenterY - axisY) + 48;
    highlightY.style.left = (asteroidCenterX - 8) + 'px';
    highlightY.style.top = top + 'px';
    highlightY.style.width = '16px';
    highlightY.style.height = height + 'px';
    highlightY.style.display = 'block';
    document.getElementById('highlight-x').style.display = 'none';
}

function removeHighlights() {
    document.getElementById('highlight-x').style.display = 'none';
    document.getElementById('highlight-y').style.display = 'none';
}

function updateStatus(msg) {
    document.getElementById('prompt').textContent = msg;
}

function resetInputs() {
    document.getElementById('x-input').value = '';
    document.getElementById('y-input').value = '';
}

document.addEventListener('DOMContentLoaded', function () {
    spawnAsteroid();
    spawnSpaceship();
    showHighlightX();
    resetInputs();
    document.getElementById('x-input').focus();
    document.getElementById('y-input').disabled = false;

    document.getElementById('submit-btn').onclick = function () {
        const asteroid = document.getElementById('asteroid');
        const spaceship = document.getElementById('spaceship');
        const xVal = parseInt(document.getElementById('x-input').value);
        const yVal = parseInt(document.getElementById('y-input').value);
        let correct = true;
        let playedIncorrect = false;
        if (xVal !== asteroidX) {
            updateStatus('Try again: What is the X position?');
            correct = false;
            playedIncorrect = true;
        }
        if (yVal !== asteroidY) {
            updateStatus('Try again: What is the Y position?');
            correct = false;
            playedIncorrect = true;
        }
        if (playedIncorrect) {
            playAudio('ar/incorrect.wav');
        }
        if (correct) {
            updateStatus('Great job! Asteroid destroyed!');
            // Move spaceship to asteroid's y position
            spaceship.style.top = (GRID_ORIGIN_Y - asteroidY * GRID_SIZE - 75) + 'px';
            removeHighlights();
            score++;
            // Wait for spaceship to finish moving, then start firing sequence
            setTimeout(() => {
                // Phase 1: Charge up - play charge sound
                playAudio('ar/charge.wav');

                const projectile = document.getElementById('projectile');
                // Calculate target position (asteroid center)
                const asteroidCenterX = GRID_ORIGIN_X + asteroidX * GRID_SIZE;
                const asteroidCenterY = GRID_ORIGIN_Y - asteroidY * GRID_SIZE;

                // Start projectile at spaceship position
                const startX = 850 - 16; // spaceship front
                const startY = parseInt(spaceship.style.top) + 75 - 16; // spaceship center

                // Position projectile at spaceship (initially invisible)
                projectile.style.left = startX + 'px';
                projectile.style.top = startY + 'px';
                projectile.style.display = 'block';

                // Start charging effect - projectile becomes visible with glow
                projectile.classList.add('charging');

                // Phase 2: After charge completes, fire projectile
                setTimeout(() => {
                    // Remove charging effect and add traveling effect
                    projectile.classList.remove('charging');
                    projectile.classList.add('traveling');
                    playAudio('ar/fire.wav'); // Play firing sound
                    projectile.style.left = (asteroidCenterX - 16) + 'px';
                    projectile.style.top = (asteroidCenterY - 16) + 'px';

                    // Phase 3: When projectile reaches target, explode
                    setTimeout(() => {
                        projectile.classList.remove('traveling');
                        projectile.classList.add('exploding');
                        playAudio('ar/explosion.wav'); // Play explosion sound

                        // Hide projectile after explosion animation completes
                        setTimeout(() => {
                            projectile.classList.remove('exploding');
                            projectile.style.display = 'none';
                            // Reset projectile size for next use
                            projectile.style.width = '32px';
                            projectile.style.height = '32px';
                        }, 300); // matches explosion animation duration
                    }, 500); // time for projectile to travel
                }, 1000); // charge time - adjust based on charge.wav duration
            }, 500); // Wait for spaceship to finish moving
            setTimeout(() => {
                asteroid.style.display = 'none';
                updateStatus('What position is the asteroid in?');
                spawnAsteroid();
                showHighlightX();
                resetInputs();
                document.getElementById('x-input').focus();
            }, 4000);
        }
    };

    document.getElementById('instructions-btn').onclick = function () {
        const modal = document.getElementById('instructions-modal');
        modal.style.display = 'block';
        modal.focus();
    };
    document.getElementById('close-instructions').onclick = function () {
        document.getElementById('instructions-modal').style.display = 'none';
    };
    document.getElementById('instructions-modal').addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.getElementById('instructions-modal').style.display = 'none';
        }
    });
    document.getElementById('x-input').addEventListener('input', function (e) {
        const xVal = parseInt(document.getElementById('x-input').value);
        if (xVal === asteroidX) {
            document.getElementById('y-input').focus();
        }
    });
    document.getElementById('y-input').addEventListener('input', function (e) {
        const xVal = parseInt(document.getElementById('x-input').value);
        const yVal = parseInt(document.getElementById('y-input').value);
        if (xVal === asteroidX && yVal === asteroidY) {
            document.getElementById('submit-btn').click();
        }
    });
    document.getElementById('y-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === 'Tab') {
            const xVal = parseInt(document.getElementById('x-input').value);
            const yVal = parseInt(document.getElementById('y-input').value);
            if (xVal === asteroidX && yVal === asteroidY) {
                document.getElementById('submit-btn').click();
                e.preventDefault();
            }
        }
    });
});
