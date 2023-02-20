window.addEventListener("load", initScript);

function initScript() {
  const roboSkins = [
    "robo-violet",
    "robo-green",
    "robo-brown",
    "robo-orange",
    "robo-magenta",
    "robo-indigo",
    "robo-red",
    "robo-blue",
    "robo-jet",
    "robo-light-orange",
  ];

  // global constants
  const maxCache = 10;

  // global variables
  let currentUserInput = "";

  // robo
  let roboChargePercent = 100;
  let roboCachePercent = 0;
  let roboCache = [];
  let roboName = "";
  let roboState = "😃";
  let roboVersion = 1;
  let roboSkinclass = "";

  // states
  let roboGuessVal = 0;
  let isGameInit = false;
  let isGameStarted = false;
  let isSleeping = false;
  let isDead = false;
  let isError = false;

  const manual = [
    "To see manual: ['manual' or 'how to']",
    "To give me a name: ['name=<name>']",
    "Get current time: ['time']",
    "Get current date: ['date']",
    "Check cache history: ['history']",
    "Clean cache: ['cls']",
    "Check OS version: ['version']",
    "Play a game: ['game']",
    "Sleep: ['sleep']",
  ];

  const gameIntructions = [
    "I picked a number from the values below:",
    "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    "To win try guessing my number",
    "Input your guess and I'll tell you my number",
    "To quit game enter keyword: 'end'",
    "For help enter keyword 'help'",
    "Enter your guess to start",
    "Goodluck!",
  ];

  const gameHelp = [
    "To quit game enter keyword: 'end'",
    "To play on enter a guess value",
  ];

  // robo body
  const roboBody = document.querySelector("#robo-full");
  const roboShadow = document.querySelector("#idle-shadow");
  const bodyParts = document.querySelectorAll(".robo-color");
  const roboCPUText = document.querySelector(".cpu-text");
  const roboEyes = document.querySelectorAll(".robo-eyes");

  // HOD
  const title = document.createElement("div");
  const userInput = document.querySelector("#user-input");
  const roboNameDisplay = document.querySelector("#name");
  const roboErrorDisplay = document.querySelector(".info-display");
  const roboOutput = document.querySelector("#robo-output-main");
  const roboPowerDisplay = document.querySelector("#power-display");
  const roboTimeLivedDisplay = document.querySelector("#time-display");
  const statusDisplay = document.querySelector("#status-display");
  const cacheDisplay = document.querySelector("#cache-display");
  const listOrder = document.createElement("ul");

  // ui buttons
  const cleanCacheButton = document.querySelector("#clean-cache");
  const updateOSButton = document.querySelector("#update-os");
  const chargeButton = document.querySelector("#feed-me");
  const sleepButton = document.querySelector("#sleep");

  // event handlers
  userInput.addEventListener("input", handleUserInput);
  document.addEventListener("keyup", talkToBot);
  cleanCacheButton.addEventListener("click", cleanCache);
  updateOSButton.addEventListener("click", updateOSManual);
  chargeButton.addEventListener("click", () => feedMe(0.5));
  sleepButton.addEventListener("click", sleep);

  updateOS();
  setInitRoboStats();
  calcCache();

  // intervals
  let batteryInterval = setInterval(takeCharge, 9000, 0.5);
  const timeStarted = new Date();
  let timeLivedInterval = setInterval(setTimeLived, 1000, timeStarted);

  // switch
  function talkToBot(e) {
    if (e.keyCode === 13) {
      if (isSleeping || isDead) return;

      // clear last user input
      roboOutput.textContent = "";
      listOrder.innerHTML = "";

      //parse user input to requried text format
      let parsedUserInput = parseUserInput(currentUserInput);
      userInput.value = "";

      if (parsedUserInput.includes("name=")) {
        const rawName = parsedUserInput.split("=")[1];
        let parsedName = rawName.replaceAll('"', "").replaceAll("'", "");
        if (parsedName.length > 0) {
          setRoboName(parsedName);
        }
        roboSendResponse("Name updated successfully.", "text");
        return;
      }

      if (isGameInit) {
        handleGameInit(parsedUserInput);
        return;
      }

      if (isGameStarted) {
        if (parsedUserInput === "end") {
          handleGameInit(parsedUserInput);

          return;
        } else if (parsedUserInput === "help") {
          for (let helpText of gameHelp) {
            const li = document.createElement("li");
            li.textContent = helpText;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Game Help",
            node: listOrder,
          });
          return;
        }
        return playGame(parsedUserInput);
      }

      calcCache(parsedUserInput);

      switch (parsedUserInput) {
        case "hi":
          roboSendResponse("Hello! How can I help you today?", "text");
          break;
        case "hello":
          roboSendResponse(
            `Hi! Is there anything you would like to ask or talk about? I'm here to assist you.`,
            "text"
          );
          break;
        case "hey":
          roboSendResponse("Hello! How can I assist you today?", "text");
          break;
        case "name":
          if (roboName !== "") {
            roboSendResponse(`My name is ${roboName}`, "text");
          } else {
            roboSendResponse(
              `I don't have a name at the moment but I would love one. Check my how to manual to give me a name.`,
              "text"
            );
          }
          break;
        case "whatisyourname?":
          if (roboName !== "") {
            roboSendResponse(`My name is ${roboName}`, "text");
          } else {
            roboSendResponse(
              `I don't have a name at the moment but I would love one. Check my how to manual to give me a name.`,
              "text"
            );
          }
          break;
        case "whatisyourname":
          if (roboName !== "") {
            roboSendResponse(`My name is ${roboName}`, "text");
          } else {
            roboSendResponse(
              `I don't have a name at the moment but I would love one. Check my how to manual to give me a name.`,
              "text"
            );
          }
          break;
        case "whoareyou?":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          break;
        case "whoareyou":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          break;
        case "whatareyou?":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          break;
        case "whatareyou":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          break;
        case "howto":
          for (let action of manual) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Usage Manual",
            node: listOrder,
          });
          break;
        case "help":
          for (let action of manual) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Usage Manual",
            node: listOrder,
          });
          break;
        case "history":
          for (let cacheItem of roboCache) {
            const li = document.createElement("li");
            li.textContent = cacheItem;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Commands History",
            node: listOrder,
          });
          break;
        case "time":
          const timestamp = new Date(Date.now());
          roboSendResponse(
            `The time is ${timestamp.toLocaleTimeString()}.`,
            "text"
          );
          break;
        case "date":
          const date = new Date(Date.now());
          roboSendResponse(`Today is ${date.toDateString()}.`, "text");
          break;
        case "cls":
          cleanCache();
          break;
        case "sleep":
          sleep();
          break;
        case "game":
          handleGameInit(parsedUserInput);
          break;
        case "version":
          getRoboVersion();
          break;
        case "about":
          getRoboVersion();
          break;
        default:
          roboSendResponse(
            "I'm sorry I don't quite understand want you meant there, trying entering key word 'help' to learn about me.",
            "text"
          );
          updateRoboMood(roboCachePercent, roboChargePercent);
      }
    }
  }

  // functions
  function handleUserInput(e) {
    if (isSleeping || isDead) {
      e.target.value = "";
      return;
    }
    currentUserInput = e.target.value;
  }

  function setTimeLived(startTime) {
    const now = new Date();
    const timeDiff = now.getTime() - startTime.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours >= 1) {
      roboTimeLivedDisplay.textContent = `${hours} ${hours > 1 ? "hrs" : "hr"}`;
    } else if (minutes >= 1) {
      roboTimeLivedDisplay.textContent = `${minutes} ${
        minutes > 1 ? "mins" : "min"
      }`;
    } else {
      roboTimeLivedDisplay.textContent = `${seconds} sec`;
    }
  }

  function setInitRoboStats() {
    roboNameDisplay.textContent = roboName;
    roboPowerDisplay.textContent = `${roboChargePercent}%`;
    cacheDisplay.textContent = `${roboCachePercent}%`;
    statusDisplay.textContent = roboState;
  }

  // 😡😴😃🌝☠️🎮
  function setRoboStatus(emoji) {
    statusDisplay.textContent = emoji;
  }

  function updateRoboMood(cacheVal, chargeVal) {
    let totalHappyVal = (cacheVal + chargeVal) / 2;

    if (totalHappyVal >= 80) {
      setRoboStatus("😃");
    } else if (totalHappyVal >= 70) {
      setRoboStatus("🌝");
    } else if (totalHappyVal >= 60) {
      setRoboStatus("😥");
    } else if (totalHappyVal >= 51) {
      setRoboStatus("😡");
    } else if (roboChargePercent <= 0 || roboCachePercent <= 0) {
      roboSendResponse(
        `${
          roboName !== "" ? roboName : "Virtual Pet"
        } Died☠️, refresh to get a new pet.`
      );
      setRoboStatus("☠️☠️☠️☠️");
      isDead = true;
      roboErrorDisplay.classList.add("hide");
      roboBody.classList.remove(roboSkinclass);
      roboCPUText.classList.remove("cpu-text");
      for (let eye of roboEyes) {
        eye.classList.remove("robo-eyes");
        eye.classList.add("robo-eyes-die");
      }
      for (let part of bodyParts) {
        part.classList.remove("robo-color");
        part.classList.add("robo-color-die");
      }
      roboCPUText.classList.add("cpu-text-die");
      roboShadow.classList.add("shadow-gone");
      roboBody.classList.add("robo-full-die");

      clearInterval(batteryInterval);
      clearInterval(timeLivedInterval);
    }
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function parseUserInput(rawUserInput) {
    return rawUserInput.toLowerCase().replaceAll(/\s/g, "");
  }

  function sleep() {
    if (isDead) return;

    if (isSleeping) {
      isSleeping = false;
      batteryInterval = setInterval(takeCharge, 9000, 0.5);
      updateRoboMood(roboCachePercent, roboChargePercent);
      sleepButton.textContent = "Sleep 😴";
      roboBody.setAttribute("id", "robo-full");
      roboShadow.setAttribute("id", "idle-shadow");
      roboSendResponse("Hello!🖐, good to see you again");
      return;
    }

    isSleeping = true;
    clearInterval(batteryInterval);
    setRoboStatus("😴");
    sleepButton.textContent = "Awaken ☀️";
    roboBody.setAttribute("id", "robo-sleep");
    roboShadow.setAttribute("id", "sleep-shadow");
    roboSendResponse("Sleeping😴....");
  }

  function roboSendResponse(message = null, type = "text", nodeObj = null) {
    if (type === "text" && message) {
      roboOutput.textContent = message;
    } else if (type === "node" && nodeObj) {
      title.textContent = nodeObj.title;
      title.style = "text-align: center; text-decoration: underline";
      roboOutput.append(title, nodeObj.node);
    }
  }

  function getRoboVersion() {
    roboSendResponse(`version: ${roboVersion}.0.0`, "text");
  }

  function upgradeRoboVersion() {
    roboVersion = roboVersion + 1;
  }

  function playGame(userInput) {
    let userInputNum = parseInt(userInput);

    if (isNaN(userInputNum)) {
      roboSendResponse(
        `Invalid input, please ensure to enter a number. Try again`,
        "text"
      );
    }

    if (userInputNum !== roboGuessVal) {
      roboSendResponse(
        `Oops! ${userInputNum} isn't correct. Guess again!`,
        "text"
      );
      return;
    }

    roboGuessVal = getRandomIntInclusive(1, 10);
    roboSendResponse(
      `Hurray! ${userInputNum} is correct. Guess my new number or end game`,
      "text"
    );
  }

  function showGameRules() {
    roboGuessVal = getRandomIntInclusive(1, 10);
    for (let instruction of gameIntructions) {
      const li = document.createElement("li");
      li.textContent = instruction;
      listOrder.append(li);
    }
    roboSendResponse(listOrder, "node", {
      title: "Game rules",
      node: listOrder,
    });

    clearInterval(batteryInterval);
    setRoboStatus("🎮");
    // setTimeout(roboSendResponse, 4000, "Try guessing my number");
  }

  function handleGameInit(userInput) {
    switch (userInput) {
      case "game":
        roboSendResponse("Would you like to play a game. Y/N", "text");
        isGameInit = true;
        isGameStarted = false;
        break;
      case "yes":
        roboSendResponse("Awesome!! let's begin.");
        isGameInit = false;
        isGameStarted = true;
        setTimeout(showGameRules, 1500);
        break;
      case "y":
        roboSendResponse("Awesome!! let's begin");
        isGameInit = false;
        isGameStarted = true;
        setTimeout(showGameRules, 1500);
        break;
      case "no":
        roboSendResponse("Alright we could play some other time");
        isGameInit = false;
        isGameStarted = false;
        break;
      case "n":
        roboSendResponse("Alright we could play some other time");
        isGameInit = false;
        isGameStarted = false;
        break;
      case "end":
        roboSendResponse("Game ended");
        isGameInit = false;
        isGameStarted = false;
        roboGuessVal = 0;
        batteryInterval = setInterval(takeCharge, 9000, 0.5);
        updateRoboMood(roboCachePercent, roboChargePercent);
        break;
      default:
        roboSendResponse(
          `Sorry seems like you didn't enter a valid input  answer`,
          "text"
        );
        isGameInit = false;
        isGameStarted = false;
        break;
    }
  }

  function cleanCache() {
    if (isSleeping || isDead) return;
    roboCache = [];
    let sudoCachePercent = (maxCache - roboCache.length) / maxCache;
    roboCachePercent = sudoCachePercent * 100;
    cacheDisplay.textContent = `${0}%`;
    roboOutput.textContent = "Cache cleared";
    userInput.value = "";
    updateRoboMood(roboCachePercent, roboChargePercent);
    clearError();
  }

  function updateOSManual() {
    takeCharge(0.5);
    if (isSleeping || isDead) return;
    upgradeRoboVersion();
    updateOS();
  }

  function updateOS() {
    roboBody.removeAttribute("class");
    const selectRoboColorIndex = getRandomIntInclusive(0, roboSkins.length - 1);
    roboSkinclass = roboSkins[selectRoboColorIndex];
    roboBody.classList.add(roboSkinclass);
  }

  function showError(msg) {
    isError = true;
    roboErrorDisplay.textContent = msg;
    roboErrorDisplay.classList.remove("hide");
  }

  function clearError() {
    isError = false;
    roboErrorDisplay.textContent = "";
    roboErrorDisplay.classList.add("hide");
  }

  function calcCache(userInput = null) {
    if (roboChargePercent <= 0 || isDead) return;

    if (userInput) {
      roboCache.push(userInput);
    }
    let roboDisplayCachePercent = (roboCache.length / maxCache) * 100;
    let sudoCachePercent = (maxCache - roboCache.length) / maxCache;
    roboCachePercent = sudoCachePercent * 100;
    cacheDisplay.textContent = `${roboDisplayCachePercent}%`;
    if (roboCachePercent <= 30) {
      showError("Cache almost full, please clean cache");
    }
    updateRoboMood(roboCachePercent, roboChargePercent);
  }

  function takeCharge(num) {
    if (roboChargePercent === 0 || isDead) return;
    roboChargePercent = roboChargePercent - (num / 5) * 100;
    roboPowerDisplay.textContent = `${roboChargePercent}%`;
    if (roboChargePercent <= 30) {
      showError("Battery running low, please charge");
    }
    updateRoboMood(roboCachePercent, roboChargePercent);
  }

  function setRoboName(name) {
    roboName = name;
    roboNameDisplay.textContent = name;
  }

  function feedMe(num) {
    if (isSleeping || isDead) return;
    if (roboChargePercent >= 100) {
      roboSendResponse("Battery sufficiently charged", "text");
      return;
    }
    roboChargePercent = roboChargePercent + (num / 5) * 100;
    roboPowerDisplay.textContent = `${roboChargePercent}%`;
    updateRoboMood(roboCachePercent, roboChargePercent);
    clearError();
  }
}
