import { createParticle, getRobotSkin } from "./utils.mjs";
import { handleCreatePet } from "./api.mjs";
import { roboState } from "./globals.mjs";

window.addEventListener("load", welcome);

function welcome() {
  // gets screen height and width
  const screen = {
    x: window.innerWidth - 12,
    y: window.innerHeight - 10,
  };

  // UI elements
  const welcomeTextArea = document.querySelector(".welcome-text");
  const welcomeSection = document.querySelector("#welcome-section");
  const createRobotForm = document.querySelector("#create-robot-form");
  const getRobotForm = document.querySelector("#get-robot-form");
  const actionTextCreate = document.querySelector("#create-robot");
  const actionTextGet = document.querySelector("#get-robot");
  const createRobotButton = document.querySelector("#create-robot-button");
  const getRobotButton = document.querySelector("#get-robot-button");

  // Local state
  const welcomeText =
    "Hello! and  welcome to Robo Dojo Inc, <br/> Let's help you get a virtual robot pet today!";
  let typingDelay = 120;
  let charIndex = 0;
  let switchState = "create";
  let isTag;

  // event listeners
  actionTextCreate.addEventListener("click", switchForm);
  actionTextGet.addEventListener("click", switchForm);
  getRobotButton.addEventListener("click", getRobot);
  createRobotButton.addEventListener("click", createRobot);

  write();

  // Create a new particle every n milliseconds
  setInterval(createParticle, 80, 1500, screen, welcomeSection);

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

  // writes greeting message to the DOM
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
}

async function createRobot() {
  const robotName = document.querySelector("#robot-name");
  const ownerPhone = document.querySelector("#owner-line");

  if (robotName.value === "" || ownerPhone.value === "")
    return alert("Please fill or form fields");

  const reqBody = {
    name: robotName.value,
    owner: ownerPhone.value,
    timeLived: new Date(),
    skinclass: getRobotSkin(),
  };

  let { robot } = await handleCreatePet(reqBody);
  if (robot) {
    for (let key in robot) {
      if (roboState.hasOwnProperty(key) && roboState[key] !== robot[key]) {
        roboState[key] = robot[key];
      }
    }
    window.location.href = "robot.html";
  }
}

function getRobot(e) {
  console.log("Get robot....");
  e.preventDefault();
}
