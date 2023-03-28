import {
  roboState,
  roboUI,
  hudDisplay,
  userData,
  robotSkins,
  loadRobotMemory,
  saveRobotState,
} from './globals.mjs';
import { setSleepButtonText } from './index.mjs';
import { getRandomIntInclusive } from './utils.mjs';

// Local robot state values
let textOut = '';
let typingDelay = 50;
let charIndex = 0;
let isTag = null;
let typingTimeout = null;
let batteryInterval;
let timeLivedInterval;

// UI elements
const roboBtnsContainer = document.querySelector('.buttons-container');
const loadingSpinner = document.querySelector('.loading-spinner');

// Parses user input to remove unwanted characters and spacing
export function parseUserInput(rawUserInput) {
  return rawUserInput.toLowerCase().replaceAll(/\s/g, '');
}

// User input handler
export function handleUserInput(e) {
  if (roboState.isSleeping || roboState.isDead || roboState.isTyping) {
    e.target.value = '';
    return;
  }
  userData.currentUserInput = e.target.value;
}

// Handles robot sleep function
export function sleep() {
  if (roboState.isDead || roboState.isGameStarted || roboState.isTyping) return;
  resetWriter();
  resetRoboDisplayOutput();

  // Wake robot if asleep
  if (roboState.isSleeping) {
    roboState.isSleeping = false;
    setBatteryInterval();
    updateRoboMood(roboState.cachePercent, roboState.chargePercent);
    setSleepButtonText('Sleep 😴');
    roboUI.body.setAttribute('id', 'robo-full');
    roboUI.shadow.setAttribute('id', 'idle-shadow');
    writeResponse('Hello!🖐, good to see you again', 60);
    return;
  }

  // Put robot to sleep if awake
  roboState.isSleeping = true;
  clearBatteryInterval();
  setRoboMood('😴');
  setSleepButtonText('Awaken ☀️');
  roboUI.body.setAttribute('id', 'robo-sleep');
  roboUI.shadow.setAttribute('id', 'sleep-shadow');
  roboSendResponse('Sleeping😴....');
}

// Resets robot type writing state
export function resetWriter() {
  textOut = '';
  typingDelay = 50;
  charIndex = 0;
  roboState.isTyping = false;
  typingTimeout = null;
  clearTimeout(typingTimeout);
}

// Clears robot output text/html
export function resetRoboDisplayOutput() {
  hudDisplay.roboDisplay.innerHTML = null;
  hudDisplay.roboDisplay.textContent = null;
}

// Handles direct robot text/html output
export function roboSendResponse(
  message = null,
  type = 'text',
  nodeObj = null,
) {
  resetRoboDisplayOutput();
  resetWriter();
  if (type === 'text' && message) {
    hudDisplay.roboDisplay.textContent = message;
  } else if (type === 'node' && nodeObj) {
    const titleParaElem = document.createElement('p');
    titleParaElem.textContent = nodeObj.title;
    titleParaElem.style = 'text-align: center; text-decoration: underline';
    hudDisplay.roboDisplay.append(titleParaElem, nodeObj.node);
  }
}

// Calls type writing function and passes the necessary values
export function writeResponse(msg, delay) {
  resetRoboDisplayOutput();
  resetWriter();
  textOut = msg;
  typingDelay = delay;
  roboState.isTyping = true;
  typeWriter();
}

// Handles robot type writing process
export function typeWriter() {
  const text = textOut.slice(0, ++charIndex);
  hudDisplay.roboDisplay.innerHTML = text;
  if (text === textOut) {
    return resetWriter();
  }
  const char = text.slice(-1);
  if (char === '<') isTag = true;
  if (char === '>') isTag = false;
  if (isTag) return typeWriter();
  typingTimeout = setTimeout(typeWriter, typingDelay);
}

// Cleans robot cache(memory)
export function cleanCache() {
  if (roboState.isSleeping || roboState.isDead || roboState.isGameStarted || roboState.isTyping) { return; }

  // Reset cache list value
  roboState.cacheList = [];
  roboState.cachePercent = 100;
  hudDisplay.cacheDisplay.textContent = `${0}%`;

  // Reset user input and inform the user
  userData.userInput.value = '';
  clearError();
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  hudDisplay.roboDisplay.textContent = 'Cache cleared';
}

// Handles updating robot OS and version
export function updateOS() {
  if (roboState.isSleeping || roboState.isDead || roboState.isGameStarted || roboState.isTyping) { return; }
  roboUI.body.removeAttribute('class');
  roboUI.body.classList.add(getNewRobotSkin());
  upgradeRoboVersion();
  takeCharge(0.5);
}

// Gets current robot version
export function getRoboVersion() {
  roboSendResponse(`version: ${roboState.version}.0.0`, 'text');
}

// Upates robot OS version
export function upgradeRoboVersion() {
  roboState.version = roboState.version + 1;
}

// Get a new skin class for robot
export function getNewRobotSkin() {
  return robotSkins[getRandomIntInclusive(0, robotSkins.length - 1)];
}

// Shows error message
export function showError(msg) {
  roboState.isError = true;
  hudDisplay.errorDisplay.textContent = msg;
  hudDisplay.errorDisplay.classList.remove('hide');
}

// Clears error message
export function clearError() {
  roboState.isError = false;
  hudDisplay.errorDisplay.textContent = '';
  hudDisplay.errorDisplay.classList.add('hide');
}

// Handles calculating and displaying of robot cache
export function calcCache(userInput = null) {
  if (
    roboState.chargePercent <= 0 ||
    roboState.isDead || roboState.cachePercent <= 0
  ) { return; }

  // Add user input to cache(memory)
  if (userInput) {
    roboState.cacheList.push(userInput);
  }

  // Calculate and display new cache value
  const cacheDisplay = (roboState.cacheList.length / roboState.maxCache) * 100;
  const actualCache = (roboState.maxCache - roboState.cacheList.length) / roboState.maxCache;
  roboState.cachePercent = actualCache * 100;
  hudDisplay.cacheDisplay.textContent = `${cacheDisplay}%`;

  // Show error message based on cache value
  if (roboState.cachePercent <= 30) {
    showError('Cache almost full, please clean cache');
  } else if (roboState.cachePercent <= 0) {
    return showError('Cache almost full, please clean cache');
  }

  // Updates the robot mood
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

// Handles robot battery life degeneration
export function takeCharge(num) {
  if (roboState.chargePercent === 0 || roboState.isDead) return;
  roboState.chargePercent = roboState.chargePercent - (num / 5) * 100;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;

  // Show error if battery is runnin below 30%
  if (roboState.chargePercent <= 30) {
    showError('Battery running low, please charge');
  }

  // Update the robot mood
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

// Handles setting and updating robot name
export function setRoboName(name = localStorage.getItem('roboName')) {
  roboState.name = name;
  hudDisplay.nameDisplay.textContent = name;
}

// Handles feeding(charging) the robot
export function feedMe(num) {
  // Prevent charging based on certain conditions
  if (roboState.isSleeping || roboState.isDead || roboState.isGameStarted || roboState.isTyping) { return; }

  // Prevents over charging(feeding)
  if (roboState.chargePercent >= 100) {
    if (roboState.isTyping) return;
    roboSendResponse('Battery sufficiently charged', 'text');
    return;
  }

  // Updates UI with new charge %
  roboState.chargePercent = roboState.chargePercent + (num / 5) * 100;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  clearError();
}

// Handles calculating and displaying of the how long the robot has lived
export function setTimeLived(currTimeLived) {
  const now = new Date();
  const timeDiff = now.getTime() - new Date(currTimeLived).getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);


  // Formats time display
  if (hours >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${hours} ${
      hours > 1 ? 'hrs' : 'hr'
    }`;
  } else if (minutes >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${minutes} ${
      minutes > 1 ? 'mins' : 'min'
    }`;
  } else {
    hudDisplay.timeLivedDisplay.textContent = `${seconds} sec`;
  }
}

// Handles turning robot power on
export function powerRobot() {
  loadRobotMemory();
  setInitRoboStats();
  setTimeout(bootRobot, 4000);
}

// Boots up and loads robo OS
function bootRobot() {
  // Reomve loading spinner
  loadingSpinner.remove();
  roboBtnsContainer.classList.remove('hide');

  // Call init functions
  setBatteryInterval();
  setTimeLivedInterval();
  writeResponse(
    'Hello!, owner great to see you. If you stuck and need some help just enter the keyword \'HOW TO\' to access my many features 😊',
    60,
  );
}

// Set initial robot state and UI values
export function setInitRoboStats() {
  // Set the UI elements of the robot
  roboUI.body.classList.add(roboState.skinclass);
  hudDisplay.nameDisplay.textContent = roboState.name;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  hudDisplay.cacheDisplay.textContent = `${roboState.cachePercent}%`;
  calcCache();
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

// Updates the robot UI mood emoji (Happy, Smile, Angry, Sleep, Dead, Sleep)
export function setRoboMood(emoji) {
  hudDisplay.moodDisplay.textContent = emoji;
}

// Handles calcualting and updating the current mood of the robot
export function updateRoboMood(cacheVal, chargeVal) {
  const totalHappyVal = (cacheVal + chargeVal) / 2;

  if (totalHappyVal >= 80) {
    setRoboMood('😃');
  } else if (totalHappyVal >= 70) {
    setRoboMood('🌝');
  } else if (totalHappyVal >= 60) {
    setRoboMood('😥');
  } else if (totalHappyVal >= 51) {
    setRoboMood('😡');
  } else if (roboState.chargePercent <= 0) {
    setRoboMood('☠️☠️☠️☠️');
    die();
  }

  // Saves current state of robot
  const newRobotState = {
    name: roboState.name,
    skinclass: roboState.skinclass,
    version: roboState.version,
    chargePercent: roboState.chargePercent,
    cachePercent: roboState.cachePercent,
    cacheList: roboState.cacheList,
  };
  saveRobotState(newRobotState);
}

// Handles robot death
function die() {
  // Updates robot state to dead and removes the robot alive skin color
  roboState.isDead = true;
  hudDisplay.errorDisplay.classList.add('hide');
  roboUI.body.classList.remove(roboState.skinclass);
  roboUI.cpuText.classList.remove('cpu-text');

  // Removes the alive robot eye class
  for (const eye of roboUI.eyes) {
    eye.classList.remove('robo-eyes');
    eye.classList.add('robo-eyes-die');
  }

  // Adds the dead robot eye class
  for (const part of roboUI.bodyParts) {
    part.classList.remove('robo-color');
    part.classList.add('robo-color-die');
  }

  // Removes robot cpu core UI
  roboUI.cpuText.classList.add('cpu-text-die');
  roboUI.shadow.classList.add('shadow-gone');
  roboUI.body.classList.add('robo-full-die');

  // Clears all necessary robot intervals
  clearBatteryInterval();
  clearTimeLivedInterval();

  // Inform user of robot death
  roboSendResponse(
    `${roboState.name} Died☠️, because you neglected to charge it`,
  );
}

// Robot intervals handler funtions
export function clearBatteryInterval() {
  clearInterval(batteryInterval);
}

export function clearTimeLivedInterval() {
  clearInterval(timeLivedInterval);
}

export function setBatteryInterval() {
  batteryInterval = setInterval(takeCharge, 12000, 0.5);
}

export function setTimeLivedInterval() {
  timeLivedInterval = setInterval(setTimeLived, 1000, roboState.timeLived);
}
