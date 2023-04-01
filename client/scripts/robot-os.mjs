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
let isTag;
let typingTimeout;
let batteryInterval;
let timeLivedInterval;

// UI elements
const roboBtnsContainer = document.querySelector('.buttons-container');
const loadingSpinner = document.querySelector('.loading-spinner');

/**
* A function that takes in raw user input and returns it in lowercase with all whitespace removed.
* @param {string} rawUserInput - The raw user input to be parsed.
* @returns {string} - The parsed user input in lowercase with all whitespace removed.
*/
export function parseUserInput(rawUserInput) {
  return rawUserInput.toLowerCase().replace(/\s/g, '');
}

/**
* A function that handles user input by either
* clearing the input field or setting the user's input in the application state.
* @param {Object} e - The event object that triggered the function call.
*/
export function handleUserInput(e) {
  if (roboState.isSleeping || roboState.isDead || roboState.isTyping) {
    e.target.value = '';
  } else {
    userData.currentUserInput = e.target.value;
  }
}

/**
* A function that handles the state of the robot's sleep mode by either
* waking it up or putting it to sleep based on its current state.
* disables fucntion if the robot is dead, the game is started, or the robot is typing.
*/
export function handleSleepAwakeState() {
  if (roboState.isDead || roboState.isGameStarted || roboState.isTyping) return;
  resetWriter();
  resetRoboDisplayOutput();

  // Wake robot if asleep
  if (roboState.isSleeping) {
    awaken();
  } else {
    // Put robot to sleep if awake
    sleep();
  }
}

/**
* A function that resets the state of the robot's typing.
*/
export function resetWriter() {
  // Reset the robot's typing state
  textOut = '';
  typingDelay = 50;
  charIndex = 0;
  roboState.isTyping = false;
  // Clear any typing timeouts
  clearTimeout(typingTimeout);
}

/**
* A function that handles direct robot text/html output.
* @param {string|null} message - The message to be displayed. Default is null.
* @param {string} type - The type of the message. Default is 'text'.
* @param {Object|null} nodeObj - The node object to be displayed. Default is null.
*/
export function roboSendResponse(
  message = null,
  type = 'text',
  nodeObj = null) {
  // Reset the display output and writer state
  resetRoboDisplayOutput();
  resetWriter();
  // Display the response based on the type
  if (type === 'text' && message) {
  // Display a text message
    hudDisplay.roboDisplay.textContent = message;
  } else if (type === 'node' && nodeObj) {
  // Display a node object
    const titleParaElem = document.createElement('p');
    titleParaElem.textContent = nodeObj.title;
    titleParaElem.style = 'text-align: center; text-decoration: underline';
    hudDisplay.roboDisplay.append(titleParaElem, nodeObj.node);
  }
}

/**
* A function that writes a response on the robot display with a typing animation.
* @param {string} msg - The message to be displayed.
* @param {number} delay - The delay between each character in milliseconds.
*/
export function writeResponse(msg, delay) {
  // Reset the display output and writer state
  resetRoboDisplayOutput();
  resetWriter();

  // Set the message and delay between each character typed out
  textOut = msg;
  typingDelay = delay;

  // Set the robot's typing state to true and start the typing sequence
  roboState.isTyping = true;
  typeWriter();
}

/**
* Clears the cache of the robot, resetting the cache list value and percentage display.
* Also clears the user input and any errors present. Updates the robot's mood and displays a
* message to inform the user that the cache has been cleared. This function does nothing
* if the robot is sleeping, dead, in a game, or typing.
* @returns {void} this funtion does not return anything.
*/
export function cleanCache() {
  // Checks if the robot is not in a valid state to clean the cache
  if (
    roboState.isSleeping ||
  roboState.isDead ||
  roboState.isGameStarted ||
  roboState.isTyping
  ) {
    return;
  }

  // Reset the cache list value and percentage display
  roboState.cacheList = [];
  roboState.cachePercent = 100;
  hudDisplay.cacheDisplay.textContent = `${0}%`;

  // Reset the user input and clear any errors
  userData.userInput.value = '';
  clearError();

  // Update the robot's mood and inform the user that the cache has been cleared
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  hudDisplay.roboDisplay.textContent = 'Cache cleared';
}

/**
* Updates the robot's operating system and skin.
* If the robot is sleeping, dead, in game mode, or currently typing a message,
* the function returns without performing any action.
* The function updates the robot's skin by setting the class attribute of the
* HTML body element to the CSS class name returned by the getNewRobotSkin function.
* The function then upgrades the robot's operating system by calling the upgradeRoboVersion function.
* Finally, the function depletes the robot's  battery charge
* by calling the takeCharge function with a parameter of -0.5.
* @returns {void} This function does not return anything.
*/
export function updateOS() {
  if (
    roboState.isSleeping ||
    roboState.isDead ||
    roboState.isGameStarted ||
    roboState.isTyping
  ) {
    return;
  }
  roboUI.body.removeAttribute('class');
  roboUI.body.classList.add(getNewRobotSkin());
  upgradeRoboVersion();
  takeCharge(0.5);
}

/**
* Gets the current version of the robot and sends a response to the user containing the version number.
* The version number is in the format of "version: x.0.0".
* @returns {void} this function does not return anything
*/
export function getRoboVersion() {
  roboSendResponse(`version: ${roboState.version}.0.0`, 'text');
}

/**
* Returns a randomly selected robot skin from the available robotSkins array.
* @return {string} - A string representing the name of a robot skin.
*/
export function getNewRobotSkin() {
  return robotSkins[getRandomIntInclusive(0, robotSkins.length - 1)];
}

/**
* Shows an error message to the user.
* @param {string} msg - The error message to display.
* @returns {void} this function does not return anything
*/
export function showError(msg) {
  roboState.isError = true;
  hudDisplay.errorDisplay.textContent = msg;
  hudDisplay.errorDisplay.classList.remove('hide');
}

/**
* Calculates the robot's cache percentage and updates the display.
* If the robot is dead, the cache percentage is 0 and no updates are made.
* If the robot's cache percentage is below or equal to 30, an error message is shown.
* If the robot's cache percentage is below or equal to 0, the robot dies and an error message is shown.
* @param {string} [userInput=null] - Optional user input to add to the cache.
* @returns {void} This function does not return anything.
*/
export function calcCache(userInput = null) {
  if (
    roboState.chargePercent <= 0 ||
    roboState.isDead ||
    roboState.cachePercent <= 0
  ) {
    return;
  }

  // Add user input to cache(memory)
  if (userInput) {
    roboState.cacheList.push(userInput);
  }

  // Calculate and display new cache value
  const cacheDisplay = (roboState.cacheList.length / roboState.maxCache) * 100;
  const actualCache =
    (roboState.maxCache - roboState.cacheList.length) / roboState.maxCache;
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


/**
* Sets the robot name and updates the display and mood of the robot.
* @param {string} [name=roboState.name] - The new name for the robot. Defaults to the current robot name.
* @returns {void} This function does not return anything
*/
export function setRoboName(name = roboState.name) {
  roboState.name = name;
  hudDisplay.nameDisplay.textContent = name;
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

/**
* Increases the charge level of the robot by a given amount.
* @param {number} num - The amount by which the robot will be charged.
* @returns {void} - Returns nothing.
* @description This function is responsible for increasing the charge level of the robot by the given amount.
* It prevents charging based on certain conditions such as if the robot is sleeping, dead, game started or typing.
* It also prevents overcharging (feeding) beyond 100% charge level. The UI is updated with the new charge % and
* the robot's mood is updated accordingly. Finally, any error message is cleared.
*/
export function feedMe(num) {
  // Prevent charging based on certain conditions
  if (
    roboState.isSleeping ||
    roboState.isDead ||
    roboState.isGameStarted ||
    roboState.isTyping
  ) {
    return;
  }

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


/**
* Powers on the robot by loading the robot memory, setting initial robot stats,
* and booting the robot after a delay of 4 seconds.
*/
export function powerRobot() {
  loadRobotMemory();
  setInitRoboStats();
  setTimeout(bootRobot, 4000);
}

/**
* Updates the robot's mood emoji displayed on the UI.
* @param {string} emoji - The emoji representing the robot's mood.
* Possible values: "😄" (Happy), "🙂" (Smile), "😡" (Angry), "😴" (Sleep), "☠️" (Dead) "🎮" (game).
*/
export function setRoboMood(emoji) {
  hudDisplay.moodDisplay.textContent = emoji;
}


/**
* Calculates the robot's mood based on the cache and charge percentage and updates the robot's UI mood emoji.
* If the robot's charge percentage is less than or equal to 0,
* the robot is considered dead and the die() function is called.
* also updates the current robot state on the server
* @param {number} cacheVal - The current cache percentage of the robot.
* @param {number} chargeVal - The current charge percentage of the robot.
* @returns {void} returns nothing
*/
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
    setRoboMood('☠️');
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


/**
* This function clears the battery interval that was set by calling setBatteryInterval() function.
* Once the interval is cleared, the robot will stop discharging its battery over time.
*/
export function clearBatteryInterval() {
  clearInterval(batteryInterval);
}

/**
 * Sets an interval to discharge the robot's battery over time by calling the `takeCharge()` function every 12 seconds with a decrement of 0.5.
 */
export function setBatteryInterval() {
  batteryInterval = setInterval(takeCharge, 12000, 0.5);
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

// Boots up and loads robo OS
function bootRobot() {
  // Reomve loading spinner
  loadingSpinner.remove();
  roboBtnsContainer.classList.remove('hide');

  // Call init functions
  setBatteryInterval();
  setTimeLivedInterval();
  writeResponse(
    'Hello!, owner great to see you. If you stuck and need' +
    "some help just enter the keyword 'HOW TO' to access my many features 😊",
    60,
  );
}

// Set initial robot state and UI values
function setInitRoboStats() {
  // Set the UI elements of the robot
  roboUI.body.classList.add(roboState.skinclass);
  hudDisplay.nameDisplay.textContent = roboState.name;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  hudDisplay.cacheDisplay.textContent = `${roboState.cachePercent}%`;
  calcCache();
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

// Handles calculating and displaying of the how long the robot has lived
function setTimeLived(currTimeLived) {
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

// Handles robot battery life degeneration
function takeCharge(num) {
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

// Clears the robot time lived interval
function clearTimeLivedInterval() {
  clearInterval(timeLivedInterval);
}

// Sets the robot time lived interval responsible for calculating and displaying how long the robot has lived for
function setTimeLivedInterval() {
  timeLivedInterval = setInterval(setTimeLived, 1000, roboState.timeLived);
}

// Clears error message
function clearError() {
  roboState.isError = false;
  hudDisplay.errorDisplay.textContent = '';
  hudDisplay.errorDisplay.classList.add('hide');
}

// Clears robot output text/html
function resetRoboDisplayOutput() {
  hudDisplay.roboDisplay.innerHTML = null;
  hudDisplay.roboDisplay.textContent = null;
}

// Handles robot type writing process
function typeWriter() {
  const text = textOut.slice(0, ++charIndex);
  hudDisplay.roboDisplay.innerHTML = text;
  if (text === textOut) {
    return resetWriter();
  }
  const char = text.slice(-1);
  isTag = char === '<';
  // if (char === '<') isTag = true;
  // if (char === '>') isTag = false;
  if (isTag) {
    typeWriter();
  } else {
    typingTimeout = setTimeout(typeWriter, typingDelay);
  }
}


// Function enables robot to sleep
function sleep() {
  roboState.isSleeping = true;
  clearBatteryInterval();
  setRoboMood('😴');
  setSleepButtonText('Awaken ☀️');
  roboUI.body.setAttribute('id', 'robo-sleep');
  roboUI.shadow.setAttribute('id', 'sleep-shadow');
  roboSendResponse('Sleeping😴....');
}

// Function awakens robot from sleep
function awaken() {
  roboState.isSleeping = false;
  setBatteryInterval();
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  setSleepButtonText('Sleep 😴');
  roboUI.body.setAttribute('id', 'robo-full');
  roboUI.shadow.setAttribute('id', 'idle-shadow');
  writeResponse('Hello!🖐, good to see you again', 60);
}

// Upgrades current robot version
export function upgradeRoboVersion() {
  roboState.version = roboState.version + 1;
}
