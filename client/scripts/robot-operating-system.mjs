import { handleDeleteRobot, handleUpdateRobot } from './robot-network-drivers.mjs';
import {
  roboState,
  robotStats,
  roboUI,
  hudDisplay,
  userData,
  robotSkins,
  loadRobotMemory,
  robotBtnsUI,
} from './robot-global-store.mjs';
import { setSleepButtonText } from './index.mjs';
import { getRandomIntInclusive, handleError } from './robot-utils.mjs';

// Local robot state values
let textOut = '';
let typingDelay = 50;
let charIndex = 0;
let isTag;
let typingTimeout;
let batteryInterval;
let timeLivedInterval;

/**
 * A function that takes in raw user input and returns it in lowercase with all whitespace removed.
 * This is used to parse user input to obtain a suitable input format for robot to process.
 * @param {string} rawUserInput - The raw user input to be parsed.
 * @returns {string} - The parsed user input in lowercase with all whitespace removed.
 */
export function parseUserInput(rawUserInput) {
  return rawUserInput.toLowerCase().replace(/\s/g, '');
}

/**
 * A function that handles the user keyboard input. It also prevents the user from making inputs when the robots process is still running.
 * @param {Object} e - The event object that triggered the function call.
 * @returns {void} - This function does not return anything.
 */
export function handleUserInput(e) {
  if (
    roboState.isSleeping ||
    roboState.isDead ||
    roboState.isTyping ||
    e.target.value === ''
  ) {
    e.target.value = '';
  } else {
    userData.currentUserInput = e.target.value;
  }
}

/**
 * A function that handles the sleep and awake state of the robot.
 * It also prevents the robot from switching states based on setting states of the robot
 * disables fucntion if the robot is dead, the game is started, or the robot is typing.
 * @returns {void} - This function does not return anything.
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
 * A function that resets the robot's typing process and clears the typing timeout.
 * Resetting the typing process allows for new data to typed out.
 * @returns {void} - This function does not return anything.
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
 * A function that handles direct text/html output of the robot.
 * Instead of typing out the data to be displayed the robot outputs the data at once.
 * @param {string|null} message - The message to be displayed. Default is null.
 * @param {string} type - The type of the message. Default is 'text'.
 * @param {Object|null} nodeObj - The HTML node object to be displayed. Default is null.
 * @returns {void} - This function does not return anything.
 */
export function roboSendResponse(
  message = null,
  type = 'text',
  nodeObj = null,
) {
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
 * A function that initializes the typing process of the robot.
 * It takes the message to be typed out 'msg' and how fast the message should be typed out 'delay',
 * clears the previous robot typing process if there be any and then,
 * initializes the robot typing process with the message to be typed out and the delay.
 * @param {string} msg - The message to be displayed.
 * @param {number} delay - The delay between each character in milliseconds.
 * @returns {void} - This function does not return anything.
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
 * Also clears the user input and any cache errors present. Updates the robot's mood by calling the updateRobotMood function
 * and displays amessage to inform the user that the cache has been cleared.
 * This function does nothing if the robot is sleeping, dead, in game mode, or is typing.
 * @returns {void} - This funtion does not return anything.
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
  robotStats.cacheList = [];
  robotStats.cachePercent = 100;
  hudDisplay.cacheDisplay.textContent = `${0}%`;

  // Reset the user input and clear any errors
  userData.userInput.value = '';
  clearError();

  // Update the robot's mood and inform the user that the cache has been cleared
  updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
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
 * @returns {void} - This function does not return anything.
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
  const newRobotSkin = getNewRobotSkin();
  roboUI.body.removeAttribute('class');
  robotStats.skinclass = newRobotSkin;
  roboUI.body.classList.add(newRobotSkin);
  upgradeRoboVersion();
  takeCharge(0.5);
}

/**
 * Gets the current version of the robot and sends a response to the user containing the version number.
 * The version number is in the format of "version: x.0.0".
 * @returns {void} - This function does not return anything
 */
export function getRoboVersion() {
  roboSendResponse(`version: ${robotStats.version}.0.0`, 'text');
}

/**
 * Returns a randomly selected robot skin from the available robotSkins array classes.
 * @return {string} - A string representing the name of a robot skin.
 */
export function getNewRobotSkin() {
  return robotSkins[getRandomIntInclusive(0, robotSkins.length - 1)];
}

/**
 * A function that displays an error message.
 * This enables the robot display any errors or warnings to the user.
 * @param {string} msg - The error message to display.
 * @returns {void} - This function does not return anything
 */
export function showError(msg) {
  roboState.isError = true;
  hudDisplay.errorDisplay.textContent = msg;
  hudDisplay.errorDisplay.classList.remove('hide');
}

/**
 * Calculates the robot's cache percentage and updates the robot cache display.
 * If the robot is dead, the cahce percent is calculated and no updates are made.
 * If the robot's cache percentage is below or equal to 30, an error message is shown.
 * If the robot's cache percentage is below or equal to 0, the robot becomes incapabale of recalculating it's cache value hence,
 * loosing it's ablility to also process user input and respond accordingly until the cache is cleared.
 * @param {string} [userInput] - User input to add to the cache.
 * @returns {void} - This function does not return anything.
 */
export function calcCache(userInput) {
  if (
    roboState.chargePercent <= 0 ||
    roboState.isDead ||
    robotStats.cachePercent <= 0
  ) {
    return;
  }

  // Add user input to cache(memory)
  if (userInput) {
    robotStats.cacheList.push(userInput);
  }

  // Calculate and display new cache value
  const cacheDisplay = (robotStats.cacheList.length / roboState.maxCache) * 100;
  const actualCache =
    (roboState.maxCache - robotStats.cacheList.length) / roboState.maxCache;
  robotStats.cachePercent = actualCache * 100;
  hudDisplay.cacheDisplay.textContent = `${cacheDisplay}%`;

  // Show error message based on cache value
  if (robotStats.cachePercent <= 30) {
    showError('Cache almost full, please clean cache');
  } else if (robotStats.cachePercent <= 0) {
    return showError('Cache almost full, please clean cache');
  }

  // Updates the robot mood and clear previous user input
  updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
}

/**
 * Sets the robot name and updates the robot name display as well as mood of the robot.
 * @param {string} [name=robotStats.name] - The new name for the robot. Defaults to the current robot name.
 * @returns {void} - This function does not return anything
 */
export function setRoboName(name) {
  robotStats.name = name;
  hudDisplay.nameDisplay.textContent = name;
  updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
}

/**
 * This function is responsible for increasing the charge level of the robot by the given amount.
 * It prevents charging based on certain conditions such as if the robot is sleeping, dead, in game mode or is typing.
 * It also prevents overcharging (feeding) beyond 100% charge level. The UI is updated with the new charge % and
 * the robot's mood is updated accordingly. Finally, any error message or warning due to low power is cleared.
 * @param {number} num - The amount by which the robot will be charged.
 * @returns {void} - This function does not return anything
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
  if (robotStats.chargePercent >= 100) {
    if (roboState.isTyping) return;
    roboSendResponse('Battery sufficiently charged', 'text');
    return;
  }

  // Updates UI with new charge %
  robotStats.chargePercent = robotStats.chargePercent + (num / 5) * 100;
  hudDisplay.powerDisplay.textContent = `${robotStats.chargePercent}%`;
  updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
  clearError();
}

/**
 * A function that powers on the robot.
 * Loads the robot memory and sets initial stats,
 * then calls the boot function.
 * @returns - This function does not return anything.
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
 * @returns - This function does not return anything.
 */
export function setRoboMood(emoji) {
  hudDisplay.moodDisplay.textContent = emoji;
}

// Stopped

/**
 * Calculates the robot's mood based on the cache and charge percentage and updates the robot's UI mood emoji.
 * If the robot's charge percentage is less than or equal to 0,
 * the robot is considered dead and the die() function is called.
 * Once all robot mood updates are completed successfully a network request is made by invoking the saveRobotState()
 * to save the new state of the robot on the server and on the localstoage.
 * @param {number} cacheVal - The current cache percentage of the robot.
 * @param {number} chargeVal - The current charge percentage of the robot.
 * @returns {void} - This function does not return anything.
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
  } else if (robotStats.chargePercent <= 0) {
    setRoboMood('☠️');
    die();
    return;
  }

  // Saves current state of robot
  const newRobotState = {
    name: robotStats.name,
    skinclass: robotStats.skinclass,
    version: robotStats.version,
    chargePercent: robotStats.chargePercent,
    cachePercent: robotStats.cachePercent,
    cacheList: robotStats.cacheList,
  };
  saveRobotState(newRobotState);
}

/**
* Handles the auto-saving of robot data both locally and on the server using the
* 'handleUpdateRobot' function gotten from the robots network driver file.
* This function receives a robot state object as an argument, retrieves the owner's ID from the local storage, and
* calls the 'handleUpdateRobot' function to update the robot's state on the server.
* In the case where there's an issue, unexpected result or error
* the robot runtime intervals are cleared and the global error handler function is invoked.
* @returns {void} - This function does not return anything.
*/
async function saveRobotState(robotObj) {
  const owner = localStorage.getItem('owner');

  const { robot } = await handleUpdateRobot(owner, robotObj);

  if (robot.owner) {
    localStorage.setItem('robot', JSON.stringify(robotObj));
  } else {
    clearTimeLivedInterval();
    clearBatteryInterval();
    handleError('Oops your robot was not found', 1);
  }
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

// This function handles the death of the robot by:
// 1. Removing all necessary robot parts in order to replace them with the appropriate dead robot part.
// 2. Invoking the deathAction() function, which updates the server with information about the death and clears all necessary data.
function die() {
  // Updates robot state to dead and removes the robot alive skin color
  roboState.isDead = true;
  hudDisplay.errorDisplay.classList.add('hide');
  roboUI.body.classList.remove(robotStats.skinclass);
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

  handleDeathActions();
}

// This function performs the following tasks:
// 1. Displays to the user the reasons for the robot's death.
// 2. Clears all intervals that were previously set up to run during the robot's runtime.
// 3. Invokes the handleDeleteRobot() function from the robot network driver file to delete
// all existing data about the robot permanently from the server.
// 4. Removes the dead robot's data from the local storage.
async function handleDeathActions() {
  // Clears all necessary robot intervals
  clearBatteryInterval();
  clearTimeLivedInterval();

  // Inform user of robot death
  roboSendResponse(
    `${robotStats.name} has died as a result of insufficient charging. To obtain a new pet, kindly refresh the page.`,
    'text',
  );

  const owner = localStorage.getItem('owner');
  await handleDeleteRobot(owner);
  localStorage.clear();
}

// Boots up and loads robo OS
function bootRobot() {
  // Reomve loading spinner
  robotBtnsUI.roboBtnsContainer.classList.remove('hide');
  robotBtnsUI.loadingSpinner.classList.add('hide');

  // Call init functions
  setBatteryInterval();
  setTimeLivedInterval();
  writeResponse(
    "Greetings owner, system is online. Assistance is available. Input keyword 'HELP' to access my features.",
    60,
  );
}

// This function performs the following tasks:
// 1. Setup the robot body color
// 2. Setup the robot head-up-display data.
// 3. Calculates the and sets the current robot cache capacity state
// by calling the calcCache() function.
function setInitRoboStats() {
  // Set the UI elements of the robot
  roboUI.body.classList.add(robotStats.skinclass);
  hudDisplay.nameDisplay.textContent = robotStats.name;
  hudDisplay.powerDisplay.textContent = `${robotStats.chargePercent}%`;
  hudDisplay.cacheDisplay.textContent = `${robotStats.cachePercent}%`;
  calcCache();
}

// This function performs the following tasks:
// 1. Calculates the amount of time that has passed since the robot's currTimeLived timestamp
// in seconds, minutes, hours, days, months, and years.
// 2. Updates the timelives UI value of the robot with the newly calculated value.
// This function is placed within a setInterval that runs every 1 second to provide frequent UI updates of the robot's time lived.
function setTimeLived(currTimeLived) {
  const now = new Date();
  const timeDiff = now.getTime() - new Date(currTimeLived).getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Formats time display
  if (years >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${years} ${years > 1 ? 'years' : 'year'
      }`;
  } else if (months >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${months} ${months > 1 ? 'months' : 'month'
      }`;
  } else if (days >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${days} ${days > 1 ? 'days' : 'day'
      }`;
  } else if (hours >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${hours} ${hours > 1 ? 'hours' : 'hour'
      }`;
  } else if (minutes >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'
      }`;
  } else {
    hudDisplay.timeLivedDisplay.textContent = `${seconds} second${seconds > 1 ? 's' : ''
      }`;
  }
}

// This function performs the following tasks:
// 1. Prevents the robot from discharging if the robot is dead or its chargePercent value is 0.
// 2. Calculates the new charge percentage after deducting the value passed into the function from the current charge value.
// 3. Updates the robot's charge percentage UI with the new value.
// 4. Displays a warning error if the charge percentage is less than or equal to 30.
// 5. Finally, invokes the updateRoboMood() function to update the robot's mood accordingly.
function takeCharge(num) {
  if (robotStats.chargePercent === 0 || roboState.isDead) return;
  robotStats.chargePercent = robotStats.chargePercent - (num / 5) * 100;
  hudDisplay.powerDisplay.textContent = `${robotStats.chargePercent}%`;

  // Show error if battery is runnin below 30%
  if (robotStats.chargePercent <= 30) {
    showError('Energy levels critically low. Immediate charging required.');
  }

  // Update the robot mood
  updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
}

// This function clears the robot's time lived interval, which stops calling the function that
// recalculates how long the robot has lived and updates the UI.
function clearTimeLivedInterval() {
  clearInterval(timeLivedInterval);
}

// This function sets the robot's time lived interval, which is calls the function responsible for
// calculating and displaying how long the robot has lived for.
function setTimeLivedInterval() {
  timeLivedInterval = setInterval(setTimeLived, 1000, robotStats.timeLived);
}

// This function clears any error message displayed by the robot by:
// 1. Setting the isError property of the roboState object to false.
// 2. Clearing the text content of the errorDisplay HTML element on the UI.
// 3. Adding the 'hide' class to the errorDisplay HTML element to hide it from view.
function clearError() {
  roboState.isError = false;
  hudDisplay.errorDisplay.textContent = '';
  hudDisplay.errorDisplay.classList.add('hide');
}

// This function clears the text/HTML output displayed in the robot display area of the UI by:
// 1. Setting the innerHTML property of the roboDisplay HTML element in the HUD to null.
// 2. Setting the textContent property of the roboDisplay HTML element in the HUD to null.
function resetRoboDisplayOutput() {
  hudDisplay.roboDisplay.innerHTML = null;
  hudDisplay.roboDisplay.textContent = null;
}

// This function types out text/HTML formatted string in the textOut variable letter by letter in the robot output UI area by:
// 1. Creating a substring of textOut variable which contians the whole data to be typed out.
// 2. Setting the innerHTML of the roboDisplay element in the HUD to the new substring.
// 3. Checking if the end of the text has been reached and calling resetWriter() if it has.
// 4. Checking if the current character is part of an HTML tag and setting a flag accordingly.
// 5. Calling itself recursively if the current character is part of an HTML tag or setting a
// timeout to call itself after typingDelay milliseconds if it is not.
function typeWriter() {
  const text = textOut.slice(0, ++charIndex);
  hudDisplay.roboDisplay.innerHTML = text;
  if (text === textOut) {
    return resetWriter();
  }
  const char = text.slice(-1);
  if (char === '<') isTag = true;
  if (char === '>') isTag = false;
  if (isTag) {
    typeWriter();
  } else {
    typingTimeout = setTimeout(typeWriter, typingDelay);
  }
}

// This function puts the robot to sleep by:
// 1. Setting the isSleeping flag in the roboState object to true.
// 2. Clearing the battery interval to stop charging/discharging.
// 3. Updating the robot mood to indicate that it's sleeping.
// 4. Setting the text of the sleep button to 'Awaken ☀️'.
// 5. Setting the CSS animation class for a sleeping robot'.
// 6. Setting the CSS animation classs for a sleeping robot shadow.
// 7. Displays the text 'Sleeping😴....' to the user.
function sleep() {
  roboState.isSleeping = true;
  clearBatteryInterval();
  setRoboMood('😴');
  setSleepButtonText('Awaken ☀️');
  roboUI.body.setAttribute('id', 'robo-sleep');
  roboUI.shadow.setAttribute('id', 'sleep-shadow');
  roboSendResponse('Sleeping😴....');
}

// This function wakes up the robot from sleep by:
// 1. Setting the isSleeping state of the robot to false.
// 2. Setting the battery interval to start updating the battery charge UI again.
// 3. Updating the robot mood.
// 4. Updating the sleep button text to indicate the robot is now able to sleep again.
// 5. Setting the appropriate CSS classe animations to the robot body and shadow its shadow.
// 6. Displayinga welcome back message to the user.
function awaken() {
  roboState.isSleeping = false;
  setBatteryInterval();
  updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
  setSleepButtonText('Sleep 😴');
  roboUI.body.setAttribute('id', 'robo-full');
  roboUI.shadow.setAttribute('id', 'idle-shadow');
  writeResponse(
    'Welcome back!👋<br />Processing user recognition.<br /> Greetings...',
    60,
  );
}

// Upgrades current robot version by adding 1 to the current robot version
export function upgradeRoboVersion() {
  robotStats.version = robotStats.version + 1;
}
