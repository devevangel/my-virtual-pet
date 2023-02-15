window.addEventListener("load", initScript);

function initScript() {
  const robotBody = document.querySelector(".robo-full");
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

  updateOS();

  // global constants
  const maxCache = 10;

  // global variables
  let currentUserInput = "";

  // robo
  let roboChargePercent = 100;
  let roboCache = [];
  let roboName = "nill";
  let roboState = "😃";
  let roboVersion = 1;

  // states
  let roboGuessVal = 0;
  let isGameInit = false;
  let isGameStarted = false;
  let isSleeping = false;

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
    "Goodluck!",
  ];

  const gameHelp = [
    "To quit game enter keyword: 'end'",
    "To play on enter a guess value",
  ];

  // HOD
  const title = document.createElement("div");
  const userInput = document.querySelector("#user-input");
  const roboNameDisplay = document.querySelector("#name");
  const roboOutput = document.querySelector("#robo-output-main");
  const roboPowerDisplay = document.querySelector("#power-display");
  const statusDisplay = document.querySelector("#status-display");
  const cacheDisplay = document.querySelector("#cache-display");
  const listOrder = document.createElement("ul");

  // actual 9000
  let batteryInterval = setInterval(takeCharge, 9000, 0.5);

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

  setInitRoboStats();

  // switch
  function talkToBot(e) {
    if (e.keyCode === 13) {
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
      }
    }
  }

  // functions
  function handleUserInput(e) {
    currentUserInput = e.target.value;
  }

  function setInitRoboStats() {
    roboNameDisplay.textContent = roboName;
    roboPowerDisplay.textContent = `${roboChargePercent} %`;
    cacheDisplay.textContent = `${roboCache.length}/${maxCache}`;
    statusDisplay.textContent = roboState;
  }

  // 😡😴😃🌝☠️🎮
  function setRoboStatus(emoji) {
    statusDisplay.textContent = emoji;
  }

  function updateRoboMood(cacheVal, chargeVal) {
    if (chargeVal >= 80) {
      setRoboStatus("😃");
    } else if (chargeVal >= 50) {
      setRoboStatus("🌝");
    } else if (chargeVal >= 30) {
      setRoboStatus("😥");
    } else if (chargeVal >= 1) {
      setRoboStatus("😡");
    } else if (chargeVal === 0) {
      setRoboStatus("☠️☠️☠️☠️");
    }
  }

  function clamp01(val) {
    return (maxCache - val) * 100;
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function parseUserInput(rawUserInput) {
    return rawUserInput.toLowerCase().replaceAll(/\s/g, "");
  }

  function calcCache(userInput) {
    if (roboCache.length >= maxCache) return;
    roboCache.push(userInput);
    const newCache = roboCache.length;
    cacheDisplay.textContent = `${newCache}/${maxCache}`;
    updateRoboMood(newCache, roboChargePercent);
  }

  function sleep() {
    alert("Feature in progress");
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
    setTimeout(roboSendResponse, 4000, "Try guessing my number");
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
    roboCache = [];
    roboCacheCount = 0;
    cacheDisplay.textContent = `${roboCacheCount}/${maxCache}`;
    roboOutput.textContent = "";
    userInput.value = "";
    updateRoboMood(roboCache.length, roboChargePercent);
  }

  function updateOSManual() {
    upgradeRoboVersion();
    takeCharge(0.5);
    updateOS();
  }

  function updateOS() {
    robotBody.removeAttribute("class");
    const selectRoboColorIndex = getRandomIntInclusive(0, roboSkins.length - 1);
    robotBody.classList.add(roboSkins[selectRoboColorIndex]);
  }

  function takeCharge(num) {
    if (roboChargePercent === 0) return;
    roboChargePercent = roboChargePercent - (num / 5) * 100;
    roboPowerDisplay.textContent = `${roboChargePercent} %`;
    updateRoboMood(roboCache.length, roboChargePercent);
  }

  function setRoboName(name) {
    roboNameDisplay.textContent = name;
  }

  function feedMe(num) {
    if (roboChargePercent >= 100) {
      roboSendResponse("Battery sufficiently charged", "text");
      return;
    }
    roboChargePercent = roboChargePercent + (num / 5) * 100;
    roboPowerDisplay.textContent = `${roboChargePercent}%`;
    updateRoboMood(roboCache.length, roboChargePercent);
  }
}
