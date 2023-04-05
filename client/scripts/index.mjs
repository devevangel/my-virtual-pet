import { createParticle } from './utils.mjs';
import {
  feedMe,
  cleanCache,
  handleSleepAwakeState,
  updateOS,
  handleUserInput,
  powerRobot,
  getNewRobotSkin,
} from './robot-os.mjs';
import { talkToBot } from './robot-text-engine.mjs';
import { handleCreateRobot, handleGetRobot } from './api.mjs';

// UI elements
const welcomeTextArea = document.querySelector('.welcome-text');
const welcomeSection = document.querySelector('#welcome-section');
const mainSection = document.querySelector('#main-section');
const createRobotForm = document.querySelector('#create-robot-form');
const getRobotForm = document.querySelector('#get-robot-form');
const actionTextCreate = document.querySelector('#create-robot');
const actionTextGet = document.querySelector('#get-robot');
const createRobotButton = document.querySelector('#create-robot-button');
const getRobotButton = document.querySelector('#get-robot-button');
// UI robot control buttons
const cleanCacheButton = document.querySelector('#clean-cache');
const updateOSButton = document.querySelector('#update-os');
const chargeButton = document.querySelector('#feed-me');
const sleepButton = document.querySelector('#sleep');
const enterButton = document.querySelector('#enter-button');
// UI text inputs
const roboNameInput = document.querySelector('#robot-name');
const phoneInput = document.querySelector('#owner-line');
const getOwnerRobotInput = document.querySelector('#get-owner-line');


// App state variables
const typingDelay = 120;
let charIndex = 0;
let switchState = 'create';
let isTag;
let particleInterval, writingTimeout;
const screen = {
  x: window.innerWidth - 12,
  y: window.innerHeight - 10,
};
const welcomeText =
  "Hello! and  welcome to Robo Dojo, <br/> Let's help you get a virtual robot today!";

window.addEventListener('load', startApp);

// App entry point
function startApp() {
  // Welcome section form Event Listeners
  actionTextCreate.addEventListener('click', switchForm);
  actionTextGet.addEventListener('click', switchForm);
  getRobotButton.addEventListener('click', getRobotAuth);
  createRobotButton.addEventListener('click', createRobotAuth);
  mainSection.classList.remove('hide');

  // Robot Event Listeners
  cleanCacheButton.addEventListener('click', cleanCache);
  updateOSButton.addEventListener('click', updateOS);
  chargeButton.addEventListener('click', () => feedMe(0.5));
  sleepButton.addEventListener('click', handleSleepAwakeState);
  enterButton.addEventListener('click', talkToBot);
  document.addEventListener('input', handleUserInput);
  document.addEventListener('keyup', talkToBot);


  // Check to see if there's a current owner avaliable and gets the robot else shows welcome section
  const owner = localStorage.getItem('owner');
  if (owner) {
    clearInterval(particleInterval);
    clearTimeout(writingTimeout);
    getCurrentRobotServerData(owner);
  } else {
    showWelcomeView();
  }
}

// Handles showing the welcome view and all its related animations
export function showWelcomeView() {
  welcomeSection.classList.remove('hide');
  particleInterval = setInterval(
    createParticle,
    120,
    1600,
    screen,
    welcomeSection,
  );
  writeWelcomeMsg();
}


// Handles hiding and showing of create and get robot form
function switchForm() {
  if (switchState === 'create') {
    createRobotForm.classList.add('hide');
    getRobotForm.classList.remove('hide');
    switchState = 'get';
  } else if (switchState === 'get') {
    createRobotForm.classList.remove('hide');
    getRobotForm.classList.add('hide');
    switchState = 'create';
  }
}

// Animates typing effect for welcome message.
function writeWelcomeMsg() {
  const text = welcomeText.slice(0, ++charIndex);
  welcomeTextArea.innerHTML = text;

  if (text.length === welcomeText.length) return;
  const char = text.slice(-1);
  if (char === '<') isTag = true;
  if (char === '>') isTag = false;
  if (isTag) return writeWelcomeMsg();

  writingTimeout = setTimeout(writeWelcomeMsg, typingDelay);
}

/**
 * Authenticates and creates a new robot on the server. If successful,
 * saves the returned robot locally and shows the robot view. Otherwise,
 * displays an authentication error message.
 */
async function createRobotAuth() {
  const name = roboNameInput.value;
  const phone = phoneInput.value;
  if (!name || !phone) return alert('Please fill out all fields');

  const reqBody = {
    name,
    timeLived: new Date(),
    skinclass: getNewRobotSkin(),
    owner: phone,
  };
  const result = await handleCreateRobot(reqBody);

  const { robot } = result;
  if (!robot.owner) {
    alert('Authentication failed');
  } else {
    saveRobot(robot);
  }
}

/** Asynchronously retrieves robot data from the server using
'handleGetRobot' function, and checks if the data contains an 'owner' property.
If it does, the robot data is saved locally and the robot view is displayed.
Otherwise, an alert is displayed with a message 'Authentication failed
*/
async function getRobotAuth() {
  const phone = getOwnerRobotInput.value;
  if (!phone) {
    return alert('Please enter a valid phone number');
  }

  const result = await handleGetRobot(phone);
  const { robot } = result;

  if (!robot.owner) {
    alert('Authentication failed');
  } else {
    saveRobot(robot);
  }
}

/**
 Retrieves current robot data from the server using 'handleGetRobot' function,
 saves it locally, and shows the robot view if the data contains an 'owner' property.
 Otherwise, it displays the welcome view.
 */
async function getCurrentRobotServerData(owner) {
  const result = await handleGetRobot(owner);
  const { robot } = result;

  if (!robot.owner) {
    localStorage.removeItem('owner');
    localStorage.removeItem('robot');
    showWelcomeView();
  } else {
    saveRobot(robot);
  }
}

/**
  Saves the robot data returned from the server to the device's local
 storage and shows the robot view by updating the HTML elements.
 It clears the particle and writing timeouts and powers on the robot.
 */
function saveRobot(robot) {
  localStorage.setItem('owner', robot.owner);
  localStorage.setItem('robot', JSON.stringify(robot));
  welcomeSection.classList.add('hide');
  mainSection.classList.remove('hide');
  clearInterval(particleInterval);
  clearTimeout(writingTimeout);
  powerRobot();
}

// Handles changing the text of the robot sleep button
export function setSleepButtonText(text) {
  sleepButton.textContent = text;
}
