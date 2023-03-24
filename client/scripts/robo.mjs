import { getRobotSkin } from "./utils.mjs";
import { roboState, roboUI, hudDisplay, userData } from "./globals.mjs";
import { setSleepButtonText } from "./main.mjs";

let textOut = "";
let typingDelay = 50;
let charIndex = 0;
let isTag = null;
let typingTimeout = null;

let batteryInterval;
let timeLivedInterval;

export function sleep() {
  if (roboState.isDead || roboState.isGameStarted) return;
  resetWriter();
  resetRoboDisplayOutput();

  if (roboState.isSleeping) {
    roboState.isSleeping = false;
    setBatteryInterval();
    updateRoboMood(roboState.cachePercent, roboState.chargePercent);
    setSleepButtonText("Sleep 😴");
    roboUI.body.setAttribute("id", "robo-full");
    roboUI.shadow.setAttribute("id", "idle-shadow");
    writeResponse("Hello!🖐, good to see you again", 60);
    return;
  }

  roboState.isSleeping = true;
  clearBatteryInterval();
  setRoboMood("😴");
  setSleepButtonText("Awaken ☀️");
  roboUI.body.setAttribute("id", "robo-sleep");
  roboUI.shadow.setAttribute("id", "sleep-shadow");
  roboSendResponse("Sleeping😴....");
}

export function resetWriter() {
  textOut = "";
  typingDelay = 50;
  charIndex = 0;
  roboState.isTyping = false;
  typingTimeout = null;
  clearTimeout(typingTimeout);
}

export function resetRoboDisplayOutput() {
  hudDisplay.roboDisplay.innerHTML = null;
  hudDisplay.roboDisplay.textContent = null;
}

export function roboSendResponse(
  message = null,
  type = "text",
  nodeObj = null
) {
  resetRoboDisplayOutput();
  resetWriter();
  if (type === "text" && message) {
    hudDisplay.roboDisplay.textContent = message;
  } else if (type === "node" && nodeObj) {
    const titleParaElem = document.createElement("p");
    titleParaElem.textContent = nodeObj.title;
    titleParaElem.style = "text-align: center; text-decoration: underline";
    hudDisplay.roboDisplay.append(titleParaElem, nodeObj.node);
  }
}

export function writeResponse(msg, delay) {
  resetRoboDisplayOutput();
  resetWriter();
  textOut = msg;
  typingDelay = delay;
  typeWriter();
}

export function typeWriter() {
  roboState.isTyping = true;
  let text = textOut.slice(0, ++charIndex);
  hudDisplay.roboDisplay.innerHTML = text;
  if (text === textOut) {
    return resetWriter();
  }
  const char = text.slice(-1);
  if (char === "<") isTag = true;
  if (char === ">") isTag = false;
  if (isTag) return typeWriter();
  typingTimeout = setTimeout(typeWriter, typingDelay);
}

export function getRoboVersion() {
  roboSendResponse(`version: ${roboState.version}.0.0`, "text");
}

export function upgradeRoboVersion() {
  roboState.version = roboState.version + 1;
}

export function cleanCache() {
  if (roboState.isSleeping || roboState.isDead || roboState.isGameStarted)
    return;
  roboState.cacheList = [];
  let sudoCachePercent =
    (roboState.maxCache - roboState.cacheList.length) / roboState.maxCache;
  roboState.cachePercent = sudoCachePercent * 100;
  hudDisplay.cacheDisplay.textContent = `${0}%`;
  hudDisplay.roboDisplay.textContent = "Cache cleared";
  userData.userInput.value = "";
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
  clearError();
}

export function updateOSManual() {
  if (roboState.isGameStarted) return;
  takeCharge(0.5);
  if (roboState.isSleeping || roboState.isDead) return;
  upgradeRoboVersion();
  updateOS();
}

export function updateOS() {
  roboUI.body.removeAttribute("class");
  roboUI.body.classList.add(getRobotSkin());
}

export function showError(msg) {
  roboState.isError = true;
  hudDisplay.errorDisplay.textContent = msg;
  hudDisplay.errorDisplay.classList.remove("hide");
}

export function clearError() {
  roboState.isError = false;
  hudDisplay.errorDisplay.textContent = "";
  hudDisplay.errorDisplay.classList.add("hide");
}

export function calcCache(userInput = null) {
  if (
    roboState.chargePercent <= 0 ||
    roboState.isDead ||
    roboState.cachePercent <= 0
  )
    return;

  if (userInput) {
    roboState.cacheList.push(userInput);
  }
  let roboDisplayCachePercent =
    (roboState.cacheList.length / roboState.maxCache) * 100;
  let sudoCachePercent =
    (roboState.maxCache - roboState.cacheList.length) / roboState.maxCache;

  roboState.cachePercent = sudoCachePercent * 100;
  hudDisplay.cacheDisplay.textContent = `${roboDisplayCachePercent}%`;

  if (roboState.cachePercent <= 30) {
    showError("Cache almost full, please clean cache");
  } else if (roboState.cachePercent <= 0) {
    return showError("Cache almost full, please clean cache");
  }
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

export function takeCharge(num) {
  if (roboState.chargePercent === 0 || roboState.isDead) return;
  roboState.chargePercent = roboState.chargePercent - (num / 5) * 100;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  if (roboState.chargePercent <= 30) {
    showError("Battery running low, please charge");
  }
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

export function setRoboName(name = localStorage.getItem("roboName")) {
  roboState.name = name;
  hudDisplay.nameDisplay.textContent = name;
}

export function feedMe(num) {
  if (roboState.isSleeping || roboState.isDead || roboState.isGameStarted)
    return;
  if (roboState.chargePercent >= 100) {
    roboSendResponse("Battery sufficiently charged", "text");
    return;
  }
  roboState.chargePercent = roboState.chargePercent + (num / 5) * 100;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
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
    hudDisplay.timeLivedDisplay.textContent = `${hours} ${
      hours > 1 ? "hrs" : "hr"
    }`;
  } else if (minutes >= 1) {
    hudDisplay.timeLivedDisplay.textContent = `${minutes} ${
      minutes > 1 ? "mins" : "min"
    }`;
  } else {
    hudDisplay.timeLivedDisplay.textContent = `${seconds} sec`;
  }
}

export function bootRobot() {
  console.log(roboState);
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

export function setInitRoboStats() {
  roboUI.body.classList.add(roboState.skinclass);
  hudDisplay.nameDisplay.textContent = roboState.name;
  hudDisplay.powerDisplay.textContent = `${roboState.chargePercent}%`;
  hudDisplay.cacheDisplay.textContent = `${roboState.cachePercent}%`;
  updateRoboMood(roboState.cachePercent, roboState.chargePercent);
}

// 😡😴😃🌝☠️🎮
export function setRoboMood(emoji) {
  hudDisplay.moodDisplay.textContent = emoji;
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
  } else if (roboState.chargePercent <= 0) {
    roboSendResponse(
      `${
        roboState.name !== "" ? roboState.name : "Virtual Pet"
      } Died☠️, refresh to get a new pet.`
    );
    setRoboMood("☠️☠️☠️☠️");
    roboState.isDead = true;
    hudDisplay.errorDisplay.classList.add("hide");
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
  batteryInterval = setInterval(takeCharge, 9000, 0.5);
}

export function setTimeLivedInterval() {
  timeLivedInterval = setInterval(setTimeLived, 1000, roboState.timeLived);
}
