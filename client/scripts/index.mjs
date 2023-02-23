// buttons
export const cleanCacheButton = document.querySelector("#clean-cache");
export const updateOSButton = document.querySelector("#update-os");
export const chargeButton = document.querySelector("#feed-me");
export const sleepButton = document.querySelector("#sleep");

// user
import { handleUserInput } from "./user.mjs";

// robo
import {
  sleep,
  cleanCache,
  updateOSManual,
  updateOS,
  calcCache,
  feedMe,
  setInitRoboStats,
} from "./robo.mjs";

// robo speech text output engine
import { talkToBot } from "./robo-text-engine.mjs";

window.addEventListener("load", initScript);

function initScript() {
  // event handlers
  document.addEventListener("input", handleUserInput);
  document.addEventListener("keyup", talkToBot);
  cleanCacheButton.addEventListener("click", cleanCache);
  updateOSButton.addEventListener("click", updateOSManual);
  chargeButton.addEventListener("click", () => feedMe(0.5));
  sleepButton.addEventListener("click", sleep);

  updateOS();
  setInitRoboStats();
  calcCache();
}
