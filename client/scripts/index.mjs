import { createParticle, handleError } from './robot-utils.mjs';
import {
  feedMe,
  cleanCache,
  handleSleepAwakeState,
  updateOS,
  handleUserInput,
  powerRobot,
  getNewRobotSkin,
} from './robot-operating-system.mjs';
import { talkToBot } from './robot-text-processor.mjs';
import { handleCreateRobot, handleGetRobot } from './robot-network-calls.mjs';

// UI elements
const welcomeTextArea = document.querySelector('.welcome-text');
const welcomeView = document.querySelector('#welcome-section');
const robotView = document.querySelector('#main-section');
const actionTextCreate = document.querySelector('#create-robot');
const actionTextGet = document.querySelector('#get-robot');

// Forms
const createRobotForm = document.querySelector('#create-robot-form');
const getRobotForm = document.querySelector('#get-robot-form');

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
  const owner = localStorage.getItem('owner');
  if (owner) {
    getRobotServerState(owner);
  } else {
    showWelcomeView();
  }
}

/**
 * Handles showing the welcome view and all its related animations
 */
export function showWelcomeView() {
  removeRobotViewListeners();
  welcomeView.classList.remove('hide');
  robotView.classList.add('hide');
  resetFormFields();
  addWelcomeViewListeners();
  particleInterval = setInterval(
    createParticle,
    120,
    1600,
    screen,
    welcomeView,
  );
  writeWelcomeMsg();
}

// Handles changing the text of the robot sleep button
export function setSleepButtonText(text) {
  sleepButton.textContent = text;
}

/*
Saves the robot data returned from the server to the device's local
 storage and shows the robot view by updating the HTML elements.
 It clears the particle and writing timeouts and powers on the robot.
 */
function saveRobot(robot) {
  localStorage.setItem('owner', robot.owner);
  localStorage.setItem('robot', JSON.stringify(robot));
  resetFormFields();
  showRobotView();
  powerRobot();
}

// resets the various welcome view form field values
function resetFormFields() {
  roboNameInput.value = '';
  phoneInput.value = '';
  getOwnerRobotInput.value = '';
}

// Handles showing the main robot view and all it's related features and actions
function showRobotView() {
  clearInterval(particleInterval);
  clearTimeout(writingTimeout);
  removeWelcomeViewLiseners();
  addRobotViewListeners();
  welcomeView.classList.add('hide');
  robotView.classList.remove('hide');
}

// Removes event listeners from various elements in the welcome section of a web page.
function removeWelcomeViewLiseners() {
  actionTextCreate.removeEventListener('click', switchForm);
  actionTextGet.removeEventListener('click', switchForm);
  createRobotForm.removeEventListener('submit', createRobotAuth);
  getRobotForm.removeEventListener('submit', getRobotAuth);
}

// Removes event listeners from various elements in the main section of the web page.
function removeRobotViewListeners() {
  cleanCacheButton.removeEventListener('click', cleanCache);
  updateOSButton.removeEventListener('click', updateOS);
  chargeButton.removeEventListener('click', () => feedMe(0.5));
  sleepButton.removeEventListener('click', handleSleepAwakeState);
  enterButton.removeEventListener('click', talkToBot);
  document.removeEventListener('input', handleUserInput);
  document.removeEventListener('keyup', talkToBot);
}

// Adds event listeners to various elements in the welcome section of the web page.
function addWelcomeViewListeners() {
  actionTextCreate.addEventListener('click', switchForm);
  actionTextGet.addEventListener('click', switchForm);
  createRobotForm.addEventListener('submit', createRobotAuth);
  getRobotForm.addEventListener('submit', getRobotAuth);
}

// Adds event listeners to various elements in the main section of the web page.
function addRobotViewListeners() {
  robotView.classList.remove('hide');
  cleanCacheButton.addEventListener('click', cleanCache);
  updateOSButton.addEventListener('click', updateOS);
  chargeButton.addEventListener('click', () => feedMe(0.5));
  sleepButton.addEventListener('click', handleSleepAwakeState);
  enterButton.addEventListener('click', talkToBot);
  document.addEventListener('input', handleUserInput);
  document.addEventListener('keyup', talkToBot);
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

/*
 * Authenticates and creates a new robot on the server. If successful,
 * saves the returned robot locally and shows the robot view. Otherwise,
 * displays an authentication error message.
 */
async function createRobotAuth(e) {
  e.preventDefault();

  const formData = new FormData(createRobotForm);
  const name = formData.get('robot-name');
  const phone = formData.get('owner-line');

  if (!name || !phone) return handleError('Please fill out all fields', 2);

  const reqBody = {
    name,
    timeLived: new Date(),
    skinclass: getNewRobotSkin(),
    owner: phone,
  };
  const result = await handleCreateRobot(reqBody);
  console.log(result);

  const { robot = {} } = result || {};
  if (!robot.owner) {
    handleError(
      `Robot creation failed. Owner '${phone}' already exists.`,
      2,
    );
  } else {
    saveRobot(robot);
  }
}

/*
Asynchronously retrieves robot data from the server using
'handleGetRobot' function, and checks if the data contains an 'owner' property.
If it does, the robot data is saved locally and the robot view is displayed.
Otherwise, an alert is displayed with a message 'Authentication failed
*/
async function getRobotAuth(e) {
  e.preventDefault();

  const formData = new FormData(getRobotForm);
  const phone = formData.get('owner-line');

  if (!phone) {
    return handleError('Please enter a valid phone number', 2);
  }

  const result = await handleGetRobot(phone);
  const { robot } = result;

  if (!robot.owner) {
    handleError(`Error getting robot with owner '${phone}'`, 2);
  } else {
    saveRobot(robot);
  }
}

/*
 Retrieves current robot data from the server using 'handleGetRobot' function,
 saves it locally, and shows the robot view if the data contains an 'owner' property.
 Otherwise, it displays the welcome view.
 */
async function getRobotServerState(owner) {
  const result = await handleGetRobot(owner);
  const { robot } = result;

  if (!robot.owner) {
    handleError(`Failed to retrieve robot data for owner '${owner}'.`, 1);
  } else {
    saveRobot(robot);
  }
}
