import { createParticle } from "./utils.mjs";
import { roboState } from "./globals.mjs";

window.addEventListener("load", welcome);

function welcome() {
  // gets screen height and width
  const screen = {
    x: window.innerWidth,
    y: window.innerHeight,
  };

  // UI elements
  const welcomeTextArea = document.querySelector(".welcome-text");
  const welcomeSection = document.querySelector("#welcome-section");
  const createRobotForm = document.querySelector("#create-robot-form");
  const getRobotForm = document.querySelector("#get-robot-form");
  const actionTextCreate = document.querySelector("#create-robot");
  const actionTextGet = document.querySelector("#get-robot");

  // Local state
  const welcomeText =
    "Hello! and  welcome to Roblox Inc. <p>Let's help you get a virtual robot today!</p>";
  let typingDelay = 120;
  let charIndex = 0;
  let switchState = "create";
  let isTag;

  // event listeners
  actionTextCreate.addEventListener("click", switchForm);
  actionTextGet.addEventListener("click", switchForm);
  getRobotForm.addEventListener("submit", getRobot);
  createRobotForm.addEventListener("submit", createRobot);

  write();

  // Create a new particle every n milliseconds
  setInterval(createParticle, 50, 1500, screen, welcomeSection);

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

function createRobot(e) {
  e.preventDefault();
  console.log("create robot...");
  window.location.href = "robot.html";
  roboState.name = "Javis";
}

function getRobot(e) {
  console.log("Get robot....");
  e.preventDefault();
}
