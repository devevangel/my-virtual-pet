// Sudo generates random int within given range
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Returns a random float value between the given minimum and maximum values.
function randomFloatInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Creates a moving particle using the div tag.
* @param {number} lifeTime - The lifespan of the particle in milliseconds.
* @param {{x: number, y: number}} screen - An object containing the screen dimensions.
* @param {HTMLElement} containerElem - The HTML element that will contain the particle.
*/
export function createParticle(lifeTime, screen, containerElem) {
  // Create a new div element for the particle
  const particle = document.createElement('div');
  particle.className = 'particle';

  // Set particle postision within screen x and y value
  particle.style.left = `${randomFloatInRange(0, screen.x)}px`;
  particle.style.top = `${randomFloatInRange(0, screen.y)}px`;

  // Add the particle to the page
  containerElem.appendChild(particle);

  // Set particle speed and direction/angle
  const speed = randomFloatInRange(1, 10);
  const angle = randomFloatInRange(0, 360);

  // Update the particle's position every frame
  function update() {
    // Get the current position of the particle
    const x = parseFloat(particle.style.left);
    const y = parseFloat(particle.style.top);

    // Calculate the new position of the particle based on its speed and direction
    const newX = x + speed * Math.cos(angle);
    const newY = y + speed * Math.sin(angle);

    // If the particle has gone off the screen wrap it to opposite side
    if (newX < 0) {
      particle.style.left = `${screen.x}px`;
    } else if (newX > screen.x) {
      particle.style.left = '0px';
    } else {
      particle.style.left = `${newX}px`;
    }

    if (newY < 0) {
      particle.style.top = `${screen.y}px`;
    } else if (newY > screen.y) {
      particle.style.top = '0px';
    } else {
      particle.style.top = `${newY}px`;
    }

    // Call this function again on the next frame
    requestAnimationFrame(update);
  }

  // Set life span for particles
  setTimeout(() => {
    containerElem.removeChild(particle);
  }, lifeTime);

  // Start updating the particle's position
  requestAnimationFrame(update);
}
