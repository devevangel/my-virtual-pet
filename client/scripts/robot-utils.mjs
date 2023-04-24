import { resetRobotMemory } from './robot-global-store.mjs';
import { showWelcomeView } from './index.mjs';

// Gets a handle on the error modal section and close error modal button
const errorModal = document.querySelector('#error-modal');
const errorMsgText = document.querySelector('#error-msg');

/**
 * Generates a random number between a given minimum and maximum value,
 * with the maximum value inclusive.
 * @param {number} min
 * @param {number} max
 * @returns {number} Returns the randome generated value
 */
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Returns a random floating point value between a given minimum and maximum value.
function randomFloatInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Global error handling function. Takes a message string and code number,
 * which is tested using a switch case to run the appropriate error handling function(s) that correspond to the passed code value and alert the message string.
 * @param {string} msg - The error message to be displayed.
 * @param {number} code - The error code t6o determine how to handle the error, Default code is 1.
 * @returns {void} - This function does not return anything.
 */
export function handleError(msg, code = 1) {
  errorModal.classList.remove('hide');
  errorMsgText.textContent = `${msg}`;

  const closeModalBtn = document.querySelector('#close-modal-btn');
  closeModalBtn.addEventListener('click', () => closeModal(code));
}

function closeModal(code) {
  switch (code) {
    case 1:
      showWelcomeView();
      resetRobotMemory();
      errorModal.classList.add('hide');
      break;
    case 2:
      errorModal.classList.add('hide');
      break;
    default:
      errorModal.classList.add('hide');
      break;
  }
}


/**
 * Creates a moving particle using the HTML div tag and the CSS class 'particle'.
 * After the particle has been created it goes ahead to recalculate the new position, rotation and speed of the particle.
 * Finally, the particle is destroyed when it's lifetime is reached
 * @param {number} lifeTime - The lifespan of the particle in milliseconds.
 * @param {{x: number, y: number}} screen - An object containing the screen dimensions.
 * @param {HTMLElement} containerElem - The HTML element that will contain the particles.
 * @returns {void} - This function does not return anything.
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

    requestAnimationFrame(update);
  }

  // Set life span for particles
  setTimeout(() => {
    containerElem.removeChild(particle);
  }, lifeTime);

  // Start updating the particle's position
  requestAnimationFrame(update);
}
