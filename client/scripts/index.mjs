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
  writeResponse,
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
  writeResponse(
    `Hello!, I am a simple Virtual Pet interface created by evangel Inc 👨‍💻,
  here to provide assistance. Enter keyword 'how to' to learn more about
  me. cheers`,
    100
  );
}
