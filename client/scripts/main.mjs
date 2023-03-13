// buttons
const cleanCacheButton = document.querySelector("#clean-cache");
const updateOSButton = document.querySelector("#update-os");
const chargeButton = document.querySelector("#feed-me");
const sleepButton = document.querySelector("#sleep");

// user input handler
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
import { setBatteryInterval, setTimeLivedInterval } from "./robo.mjs";

export function setSleepButtonText(text) {
  sleepButton.textContent = text;
}

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
  setBatteryInterval();
  setTimeLivedInterval();

  writeResponse(
    `Hello!, I am a simple Virtual Pet interface created by evangel Inc 👨‍💻,
    here to provide assistance. Enter keyword 'how to' to learn more about
    me. cheers`,
    60
  );
}

window.addEventListener("load", initScript);
