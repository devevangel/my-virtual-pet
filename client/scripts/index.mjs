import { createParticle } from "./utils.mjs";
import { feedMe, cleanCache, sleep, updateOS } from "./robo.mjs";
import { talkToBot } from "./robo-text-engine.mjs";

// UI elements
const welcomeTextArea = document.querySelector(".welcome-text");
const welcomeSection = document.querySelector("#welcome-section");
const createRobotForm = document.querySelector("#create-robot-form");
const getRobotForm = document.querySelector("#get-robot-form");
const actionTextCreate = document.querySelector("#create-robot");
const actionTextGet = document.querySelector("#get-robot");
const createRobotButton = document.querySelector("#create-robot-button");
const getRobotButton = document.querySelector("#get-robot-button");

// UI buttons
const cleanCacheButton = document.querySelector("#clean-cache");
const updateOSButton = document.querySelector("#update-os");
const chargeButton = document.querySelector("#feed-me");
const sleepButton = document.querySelector("#sleep");

// gets screen height and width
const screen = {
  x: window.innerWidth - 12,
  y: window.innerHeight - 10,
};

// State variables
const welcomeText =
  "Hello! and  welcome to Robo Dojo, <br/> Let's help you get a virtual robot pet today!";
let typingDelay = 120;
let charIndex = 0;
let switchState = "create";
let isTag;

window.addEventListener("load", startApp);

function startApp() {
  // Event listeners
  actionTextCreate.addEventListener("click", switchForm);
  actionTextGet.addEventListener("click", switchForm);
  getRobotButton.addEventListener("click", getRobot);
  createRobotButton.addEventListener("click", createRobot);
  cleanCacheButton.addEventListener("click", cleanCache);
  updateOSButton.addEventListener("click", updateOS);
  chargeButton.addEventListener("click", () => feedMe(0.5));
  sleepButton.addEventListener("click", sleep);
  document.addEventListener("input", handleUserInput);
  document.addEventListener("keyup", talkToBot);

  write();

  // Create a new particle every n milliseconds
  // setInterval(createParticle, 80, 1500, screen, welcomeSection);
}

// Handles hiding and showing of create and get pet form
function switchForm() {
  if (switchState === "create") {
    createRobotForm.classList.add("hide");
    getRobotForm.classList.remove("hide");
    switchState = "get";
  } else if (switchState === "get") {
    createRobotForm.classList.remove("hide");
    getRobotForm.classList.add("hide");
    switchState = "create";
  }
}

// Writes greeting message
function write() {
  let text = welcomeText.slice(0, ++charIndex);
  welcomeTextArea.innerHTML = text;

  if (text.length === welcomeText.length) return;
  const char = text.slice(-1);
  if (char === "<") isTag = true;
  if (char === ">") isTag = false;
  if (isTag) return write();

  setTimeout(write, typingDelay);
}

// Handle changing the text of the sleep button
export function setSleepButtonText(text) {
  sleepButton.textContent = text;
}

function createRobot() {
  console.log("Create new robot");
}

function getRobot(e) {
  console.log("Get robot....");
}
