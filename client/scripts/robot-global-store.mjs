// Global variable state for robot
const roboState = {
  maxCache: 10,
  guessVal: 0,
  isGameInit: false,
  isGameStarted: false,
  isSleeping: false,
  isError: false,
  isTyping: false,
  isDead: false,
};

// Robot global stats
let robotStats = {};

// Robot list colors
const robotSkins = [
  'robo-violet',
  'robo-green',
  'robo-brown',
  'robo-orange',
  'robo-magenta',
  'robo-indigo',
  'robo-red',
  'robo-blue',
  'robo-jet',
  'robo-light-orange',
];

// Robot list object state
const directionList = {
  manual: [
    "To see manual: ['help']",
    "To set name: ['name=<name>']",
    "To get current time: ['time']",
    "To get current date: ['date']",
    "To check logs: ['logs']",
    "To clean cache: ['clear']",
    "Check OS version: ['version']",
    "To play a game: ['game']",
    "To sleep: ['sleep']",
  ],
  gameIntructions: `<ul>
    <li>I have picked a number from 1 to 10</li>
    <li>Try to guess my number to win the game.</li>
    <li>If you want to quit the game, type 'end'</li>
    <li>If you need any help, type 'help'.</li>
    <li>Enter your guess in the input box and click submit or hit enter to start the game </li>
    </ul>Goodluck!`,

  gameHelp: [
    "To quit game enter keyword: 'end'",
    'To play on enter a guess value',
  ],
};

// Robot svg components
const roboUI = {
  body: document.querySelector('#robo-full'),
  shadow: document.querySelector('#idle-shadow'),
  bodyParts: document.querySelectorAll('.robo-color'),
  cpuText: document.querySelector('.cpu-text'),
  eyes: document.querySelectorAll('.robo-eyes'),
};

// Robot Heads Up Display (HUD)
const hudDisplay = {
  nameDisplay: document.querySelector('#name'),
  errorDisplay: document.querySelector('.info-display'),
  roboDisplay: document.querySelector('#robo-output-main'),
  powerDisplay: document.querySelector('#power-display'),
  timeLivedDisplay: document.querySelector('#time-display'),
  moodDisplay: document.querySelector('#status-display'),
  cacheDisplay: document.querySelector('#cache-display'),
  listOrderDisplay: document.createElement('ul'),
};

// User input data state
const userData = {
  userInput: document.querySelector('#user-input'),
  currentUserInput: '',
};

// contains reference to the loading UI widget and robot control btns
const robotBtnsUI = {
  roboBtnsContainer: document.querySelector('.buttons-container'),
  loadingSpinner: document.querySelector('.loading-spinner'),
};

/**
* Loads the robot's memory from the browser's local storage. If the data is a valid JSON string under the key 'robot',
* the parsed object is assigned to the global variable 'robotStats'.
* This function is local to the 'robot-registers.mjs' file as it directly mutates one of the registers objects.
* Hence it is placed in the 'robot-registers.mjs' file and accessed wherever its needed'.
*/
export function loadRobotMemory() {
  const robotInStorage = JSON.parse(localStorage.getItem('robot'));
  robotStats = robotInStorage;
}

/**
 * Resets the robot memory by clearing the `robotStats` object and setting `currentUserInput`
 * and `userInput.value` to empty strings. In the case an unexpected behaviour or error this function is called.
 * This function is local to the 'robot-registers.mjs' file as it directly mutates one of the registers objects.
 * Hence it is placed in the 'robot-registers.mjs' file and accessed wherever its needed'.
 */
export function resetRobotMemory() {
  robotStats = {};
  userData.currentUserInput = '';
  userData.userInput.value = '';
  localStorage.clear();
  robotBtnsUI.loadingSpinner.classList.remove('hide');
  robotBtnsUI.roboBtnsContainer.classList.add('hide');
  hudDisplay.nameDisplay.textContent = '';
  hudDisplay.powerDisplay.textContent = '';
  hudDisplay.roboDisplay.textContent = '';
  hudDisplay.timeLivedDisplay.textContent = '';
}


export {
  roboState,
  robotStats,
  robotSkins,
  directionList,
  roboUI,
  hudDisplay,
  userData,
  robotBtnsUI,
};
