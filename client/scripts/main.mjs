// UI buttons
const cleanCacheButton = document.querySelector("#clean-cache");
const updateOSButton = document.querySelector("#update-os");
const chargeButton = document.querySelector("#feed-me");
const sleepButton = document.querySelector("#sleep");

// User input handler
import { handleUserInput } from "./user.mjs";

// Robot functions
import {
  sleep,
  cleanCache,
  updateOSManual,
  feedMe,
  bootRobot,
} from "./robo.mjs";

// Robot user input processor
import { talkToBot } from "./robo-text-engine.mjs";

export function setSleepButtonText(text) {
  sleepButton.textContent = text;
}

// Runs on page load
function initScript() {
  // event handlers
  document.addEventListener("input", handleUserInput);
  document.addEventListener("keyup", talkToBot);
  cleanCacheButton.addEventListener("click", cleanCache);
  updateOSButton.addEventListener("click", updateOSManual);
  chargeButton.addEventListener("click", () => feedMe(0.5));
  sleepButton.addEventListener("click", sleep);

  bootRobot();
}

window.addEventListener("load", initScript);
