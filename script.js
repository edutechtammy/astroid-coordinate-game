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
            playAudio('ar/35529.mp3');
            // Move spaceship to asteroid's y position
            spaceship.style.top = (GRID_ORIGIN_Y - asteroidY * GRID_SIZE - 75) + 'px';
            removeHighlights();
            score++;
            // Wait for spaceship to finish moving, then fire projectile
            setTimeout(() => {
                const projectile = document.getElementById('projectile');
                // Start at spaceship tip (left side)
                const startX = 850 - 32; // spaceship left - projectile radius
                const startY = parseInt(spaceship.style.top) + 75 - 16 - 5; // nudged up by 5px
                projectile.style.left = startX + 'px';
                projectile.style.top = startY + 'px';
                projectile.style.display = 'block';
                projectile.classList.add('grow');
                // Grow for 0.7s, then move to asteroid
                setTimeout(() => {
                    projectile.classList.remove('grow');
                    // Move to asteroid center very fast
                    const asteroidWidth = 48; // asteroid graphic width
                    const asteroidHeight = 48; // asteroid graphic height
                    const endX = GRID_ORIGIN_X + asteroidX * GRID_SIZE - asteroidWidth / 2;
                    const endY = GRID_ORIGIN_Y - asteroidY * GRID_SIZE - asteroidHeight / 2;
                    projectile.style.transition = 'left 0.7s linear, top 0.7s linear, width 0.5s, height 0.5s, box-shadow 0.5s, background 0.5s';
                    projectile.style.left = endX + 'px';
                    projectile.style.top = endY + 'px';
                    // After travel, grow again for explosion
                    setTimeout(() => {
                        projectile.classList.add('grow');
                        // Add explosion effect
                        setTimeout(() => {
                            projectile.classList.remove('grow');
                            projectile.classList.add('explode');
                            // Remove projectile after explosion animation
                            setTimeout(() => {
                                projectile.style.display = 'none';
                                projectile.classList.remove('explode');
                                projectile.style.transition = 'left 1.2s linear, top 1.2s linear, width 0.5s, height 0.5s, box-shadow 0.5s, background 0.5s';
                            }, 700); // explosion animation duration
                        }, 300); // time to reach asteroid and start explosion
                    }, 300);
                }, 2500);
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
