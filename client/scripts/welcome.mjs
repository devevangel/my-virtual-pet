import { createParticle } from "./utils.mjs";

window.addEventListener("load", welcome);

function welcome() {
  // gets screen height and width
  const screen = {
    x: window.innerWidth,
    y: window.innerHeight,
  };
  const welcomeTextArea = document.querySelector(".welcome-text");
  const welcomeSection = document.querySelector("#welcome-section");
  const createRobotForm = document.querySelector("#create-robot-form");
  const getRobotForm = document.querySelector("#get-robot-form");
  const actionTextCreate = document.querySelector("#create-robot");
  const actionTextGet = document.querySelector("#get-robot");
  const text = "Hello! and  welcome to Roblox Inc.";
  let typingDelay = 120;
  let charIndex = 0;
  let switchState = "create";

  // event listener
  actionTextCreate.addEventListener("click", switchForm);
  actionTextGet.addEventListener("click", switchForm);

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

  function write() {
    if (charIndex < text.length) {
      welcomeTextArea.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(write, typingDelay);
    }
  }

  // Write welcome greeting
  write();

  // Create a new particle every n milliseconds
  setInterval(createParticle, 80, 1200, screen, welcomeSection);
}
