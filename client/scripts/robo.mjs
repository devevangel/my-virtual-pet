import { getRandomIntInclusive } from "./utils.mjs";
import { roboState, roboUI, hodDisplay, userData } from "./variables.mjs";
import { sleepButton } from "./index.mjs";

let batteryInterval = setInterval(takeCharge, 9000, 0.5);
let timeLivedInterval = setInterval(setTimeLived, 1000, roboState.timeLived);

export function sleep() {
  if (roboState.isDead) return;

  if (roboState.isSleeping) {
    roboState.isSleeping = false;
    setBatteryInterval();
    updateRoboMood(roboState.cachePercent, roboState.chargePercent);
    sleepButton.textContent = "Sleep 😴";
    roboUI.body.setAttribute("id", "robo-full");
    roboUI.shadow.setAttribute("id", "idle-shadow");
    roboSendResponse("Hello!🖐, good to see you again");
    return;
  }

  roboState.isSleeping = true;
  clearBatteryInterval();
  setRoboMood("😴");
  sleepButton.textContent = "Awaken ☀️";
  roboUI.body.setAttribute("id", "robo-sleep");
  roboUI.shadow.setAttribute("id", "sleep-shadow");
  roboSendResponse("Sleeping😴....");
}

export function roboSendResponse(
  message = null,
  type = "text",
  nodeObj = null
) {
  hodDisplay.roboDisplay.textContent = "";

  if (type === "text" && message) {
    hodDisplay.roboDisplay.textContent = message;
  } else if (type === "node" && nodeObj) {
    const titleParaElem = document.createElement("p");
    titleParaElem.textContent = nodeObj.title;
    titleParaElem.style = "text-align: center; text-decoration: underline";
    hodDisplay.roboDisplay.append(titleParaElem, nodeObj.node);
  }
}

export function getRoboVersion() {
  roboSendResponse(`version: ${roboState.version}.0.0`, "text");
}

export function upgradeRoboVersion() {
  roboState.version = roboState.version + 1;
}

export function cleanCache() {
  if (roboState.isSleeping || roboState.isDead) return;
  roboState.cacheList = [];
  let sudoCachePercent =
    (roboState.maxCache - roboState.cacheList.length) / roboState.maxCache;
  roboState.cachePercent = sudoCachePercent * 100;
  hodDisplay.cacheDisplay.textContent = `${0}%`;
  hodDisplay.roboDisplay.textContent = "Cache cleared";
  userData.userInput.value = "";
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  clearError();
}

export function updateOSManual() {
  takeCharge(0.5);
  if (roboState.isSleeping || roboState.isDead) return;
  upgradeRoboVersion();
  updateOS();
}

export function updateOS() {
  roboUI.body.removeAttribute("class");
  const selectRoboColorIndex = getRandomIntInclusive(
    0,
    roboState.skins.length - 1
  );
  roboState.skinclass = roboState.skins[selectRoboColorIndex];
  roboUI.body.classList.add(roboState.skinclass);
}

export function showError(msg) {
  roboState.isError = true;
  hodDisplay.errorDisplay.textContent = msg;
  hodDisplay.errorDisplay.classList.remove("hide");
}

export function clearError() {
  roboState.isError = false;
  hodDisplay.errorDisplay.textContent = "";
  hodDisplay.errorDisplay.classList.add("hide");
}

export function calcCache(userInput = null) {
  if (roboState.chargePercent <= 0 || roboState.isDead) return;

  if (userInput) {
    roboState.cacheList.push(userInput);
  }
  let roboDisplayCachePercent =
    (roboState.cacheList.length / roboState.maxCache) * 100;
  let sudoCachePercent =
    (roboState.maxCache - roboState.cacheList.length) / roboState.maxCache;

  roboState.cachePercent = sudoCachePercent * 100;
  hodDisplay.cacheDisplay.textContent = `${roboDisplayCachePercent}%`;

  if (roboState.cachePercent <= 30) {
    showError("Cache almost full, please clean cache");
  }
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

export function takeCharge(num) {
  if (roboState.chargePercent === 0 || roboState.isDead) return;
  roboState.chargePercent = roboState.chargePercent - (num / 5) * 100;
  hodDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  if (roboState.chargePercent <= 30) {
    showError("Battery running low, please charge");
  }
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

export function setRoboName(name) {
  roboState.name = name;
  hodDisplay.nameDisplay.textContent = name;
}

export function feedMe(num) {
  if (roboState.isSleeping || roboState.isDead) return;
  if (roboState.chargePercent >= 100) {
    roboSendResponse("Battery sufficiently charged", "text");
    return;
  }
  roboState.chargePercent = roboState.chargePercent + (num / 5) * 100;
  hodDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  clearError();
}

export function setTimeLived(startTime) {
  const now = new Date();
  const timeDiff = now.getTime() - startTime.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours >= 1) {
    hodDisplay.timeLivedDisplay.textContent = `${hours} ${
      hours > 1 ? "hrs" : "hr"
    }`;
  } else if (minutes >= 1) {
    hodDisplay.timeLivedDisplay.textContent = `${minutes} ${
      minutes > 1 ? "mins" : "min"
    }`;
  } else {
    hodDisplay.timeLivedDisplay.textContent = `${seconds} sec`;
  }
}

export function setInitRoboStats() {
  hodDisplay.nameDisplay.textContent = roboState.name;
  hodDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  hodDisplay.cacheDisplay.textContent = `${roboState.cachePercent}%`;
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

// 😡😴😃🌝☠️🎮
export function setRoboMood(emoji) {
  hodDisplay.moodDisplay.textContent = emoji;
}

export function updateRoboMood(cacheVal, chargeVal) {
  let totalHappyVal = (cacheVal + chargeVal) / 2;

  if (totalHappyVal >= 80) {
    setRoboMood("😃");
  } else if (totalHappyVal >= 70) {
    setRoboMood("🌝");
  } else if (totalHappyVal >= 60) {
    setRoboMood("😥");
  } else if (totalHappyVal >= 51) {
    setRoboMood("😡");
  } else if (roboState.chargePercent <= 0 || roboState) {
    roboSendResponse(
      `${
        roboState.name !== "" ? roboState.name : "Virtual Pet"
      } Died☠️, refresh to get a new pet.`
    );
    setRoboMood("☠️☠️☠️☠️");
    roboState.isDead = true;
    hodDisplay.errorDisplay.classList.add("hide");
    roboUI.body.classList.remove(roboState.skinclass);
    roboUI.cpuText.classList.remove("cpu-text");
    for (let eye of roboUI.eyes) {
      eye.classList.remove("robo-eyes");
      eye.classList.add("robo-eyes-die");
    }
    for (let part of roboUI.bodyParts) {
      part.classList.remove("robo-color");
      part.classList.add("robo-color-die");
    }
    roboUI.cpuText.classList.add("cpu-text-die");
    roboUI.shadow.classList.add("shadow-gone");
    roboUI.body.classList.add("robo-full-die");
    clearBatteryInterval();
    clearTimeLivedInterval();
  }
}

export function clearBatteryInterval() {
  clearInterval(batteryInterval);
}

export function clearTimeLivedInterval() {
  clearInterval(timeLivedInterval);
}

export function setBatteryInterval() {
  setInterval(takeCharge, 9000, 0.5);
}

export function setTimeLivedInterval() {
  setInterval(setTimeLived, 1000, roboState.timeLived);
}
