// Global variable state for robot
let roboState = {
  maxCache: 10,
  guessVal: 0,
  isGameInit: false,
  isGameStarted: false,
  isSleeping: false,
  isError: false,
  isTyping: false,
  isDead: false,
  id: '',
  name: '',
  owner: '',
  timeLived: new Date(),
  skinclass: '',
  version: '',
  chargePercent: 100,
  cachePercent: 100,
  cacheList: [],
};

export function loadRobotMemory() {
  const robotInStorage = JSON.parse(localStorage.getItem('robot'));

  roboState = {
    ...roboState,
    ...robotInStorage,
  };
}

export function saveRobotState(robotObj) {
  localStorage.setItem('robot', JSON.stringify(robotObj));
}

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
    "To see manual: ['help' or 'how to']",
    "To give me a name: ['name=<name>']",
    "Get current time: ['time']",
    "Get current date: ['date']",
    "Check cache history: ['history']",
    "Clean cache: ['cls']",
    "Check OS version: ['version']",
    "Play a game: ['game']",
    "Sleep: ['sleep']",
  ],
  gameIntructions: `<ul>
    <li>I picked a number from the values below:</li>
    <li>[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</li>
    <li>To win try guessing my number</li>
    <li>To quit game enter keyword: 'end'</li>
    <li>For help enter keyword 'help'</li>
    <li>Enter you guess in the input 👆 box to start </li>
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

export { roboState, robotSkins, directionList, roboUI, hudDisplay, userData };
