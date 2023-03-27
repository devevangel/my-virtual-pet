import { createParticle } from './utils.mjs';
import {
  feedMe,
  cleanCache,
  sleep,
  updateOS,
  handleUserInput,
  powerRobot,
  getNewRobotSkin,
} from './robo.mjs';
import { talkToBot } from './robo-text-engine.mjs';
import { handleCreateRobot } from './api.mjs';

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

// UI text inputs
const roboNameInput = document.querySelector('#robot-name');
const phoneInput = document.querySelector('#owner-line');

// UI buttons
const cleanCacheButton = document.querySelector('#clean-cache');
const updateOSButton = document.querySelector('#update-os');
const chargeButton = document.querySelector('#feed-me');
const sleepButton = document.querySelector('#sleep');

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
  "Hello! and  welcome to Robo Dojo, <br/> Let's help you get a virtual robot pet today!";

window.addEventListener('load', startApp);

// App entry point
function startApp() {
  // Event listeners
  actionTextCreate.addEventListener('click', switchForm);
  actionTextGet.addEventListener('click', switchForm);
  getRobotButton.addEventListener('click', getRobot);
  createRobotButton.addEventListener('click', createRobot);
  cleanCacheButton.addEventListener('click', cleanCache);
  updateOSButton.addEventListener('click', updateOS);
  chargeButton.addEventListener('click', () => feedMe(0.5));
  sleepButton.addEventListener('click', sleep);
  document.addEventListener('input', handleUserInput);
  document.addEventListener('keyup', talkToBot);

  const owner = localStorage.getItem('owner');

  if (owner) {
    clearInterval(particleInterval);
    clearTimeout(writingTimeout);
    mainSection.classList.remove('hide');
    powerRobot();
  } else {
    welcomeSection.classList.remove('hide');
    particleInterval = setInterval(
      createParticle,
      120,
      1600,
      screen,
      welcomeSection,
    );
    write();
  }
}

// Handles hiding and showing of create and get pet form
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

// Writes greeting message
function write() {
  const text = welcomeText.slice(0, ++charIndex);
  welcomeTextArea.innerHTML = text;

  if (text.length === welcomeText.length) return;
  const char = text.slice(-1);
  if (char === '<') isTag = true;
  if (char === '>') isTag = false;
  if (isTag) return write();

  writingTimeout = setTimeout(write, typingDelay);
}

// Handle changing the text of the sleep button
export function setSleepButtonText(text) {
  sleepButton.textContent = text;
}

async function createRobot() {
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
  if (robot) {
    localStorage.setItem('owner', robot.owner);
    localStorage.setItem('robot', JSON.stringify(robot));
    welcomeSection.classList.add('hide');
    mainSection.classList.remove('hide');
    clearInterval(particleInterval);
    clearTimeout(writingTimeout);
    powerRobot();
  }
}

function getRobot() {
  console.log('Get robot....');
}
