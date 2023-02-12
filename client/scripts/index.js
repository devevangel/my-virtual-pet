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
  ];

  updateOS();

  // global constants
  const maxCache = 25;

  // global variables
  let currentUserInput = "";

  // robo
  let roboChargePercent =
    JSON.parse(localStorage.getItem("roboChargePercent")) || 100;
  let roboCache = JSON.parse(localStorage.getItem("roboCache")) || [];
  let roboName = localStorage.getItem("roboName") || "nill";
  let roboState = localStorage.getItem("roboState") || "😃😃😃";
  let roboVersion = JSON.parse(localStorage.getItem("roboVersion")) || 1;

  // states
  let isGame = false;

  const manual = [
    "To see manual: ['manual' or 'how to']",
    "To give me a name: ['name=<name>']",
    "Get current time: ['time']",
    "Get current date: ['date']",
    "Check cache: ['cache' or 'ls']",
    "Clean cache: ['cls or clean button']",
    "Check OS version: ['version']",
    "Play a game: ['game']",
    "Sleep: ['sleep' or sleep button]",
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

  // set robo initial stats
  setInitRoboStats();

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

  // switch
  function talkToBot(e) {
    if (e.keyCode === 13) {
      if (roboChargePercent <= 1) {
        roboOutput.textContent = "Insufficent power out please recharge me";
        return;
      }

      if (roboCache.length >= 14) {
        roboOutput.textContent =
          "Cache memory at maximum usage please clear cache";
        return;
      }

      // clear previous robot output
      roboOutput.textContent = "";
      listOrder.innerHTML = "";

      // convert user into to lowercase and remove all white space
      let parsedUserInput = parseUserInput(currentUserInput);
      userInput.value = "";

      calcCache(parsedUserInput);

      switch (parsedUserInput) {
        case "hi":
          roboSendResponse("Hello! How can I help you today?", "text");
          takeCharge(0.5);
          break;
        case "hello":
          roboSendResponse(
            `Hi! Is there anything you would like to ask or talk about? I'm here to assist you.`,
            "text"
          );
          takeCharge(0.5);
          break;
        case "hey":
          roboSendResponse("Hello! How can I assist you today?", "text");
          takeCharge(0.5);
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
          takeCharge(0.5);
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
          takeCharge(0.5);
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
          takeCharge(0.5);
          break;
        case "whoareyou?":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          takeCharge(0.5);
          break;
        case "whoareyou":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          takeCharge(0.5);
          break;
        case "whatareyou?":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          takeCharge(0.5);
          break;
        case "whatareyou":
          roboSendResponse(
            `Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword 'manual' to learn more about me.`,
            "text"
          );
          takeCharge(0.5);
          break;
        case "manual":
          for (let action of manual) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Usage Manual",
            node: listOrder,
          });
          takeCharge(0.4);
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
          takeCharge(0.4);
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
          takeCharge(0.4);
          break;
        case "cache":
          for (let cacheItem of roboCache) {
            const li = document.createElement("li");
            li.textContent = cacheItem;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Commands History",
            node: listOrder,
          });
          takeCharge(0.4);
          break;
        case "ls":
          for (let cacheItem of roboCache) {
            const li = document.createElement("li");
            li.textContent = cacheItem;
            listOrder.append(li);
          }
          roboSendResponse(null, "node", {
            title: "Commands History",
            node: listOrder,
          });
          takeCharge(0.4);
          break;
        case "time":
          const timestamp = new Date(Date.now());
          roboSendResponse(
            `The time is ${timestamp.toLocaleTimeString()}.`,
            "text"
          );
          takeCharge(0.2);
          break;
        case "date":
          const date = new Date(Date.now());
          roboSendResponse(`Today is ${date.toDateString()}.`, "text");
          takeCharge(0.2);
          break;

        case "name=":
          const rawName = parsedUserInput.split("=")[1];
          let parsedName = rawName.replaceAll('"', "").replaceAll("'", "");
          if (parsedName.length > 0) {
            setRoboName(parsedName);
          }
          roboSendResponse("Name updated successfully.", "text");
          takeCharge(0.2);
          break;

        case "clearcache":
          takeCharge(0.5);
          cleanCache();
          break;

        case "clear":
          takeCharge(0.5);
          cleanCache();
          break;
        case "sleep":
          sleep();
          break;
        case "game":
          setGameState();
          break;
        case "version":
          getRoboVersion();
          break;
        case "about":
          getRoboVersion();
          break;
        default:
          roboSendResponse(
            "I'm sorry I don't quite understand want you meant there, trying entering key word 'how to' to learn about me.",
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

  // 😡😴😃🌝🎮
  function setRoboStatus(emoji) {
    statusDisplay.textContent = emoji;
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
    roboCache.push(userInput);
    const newCache = roboCache.length;
    cacheDisplay.textContent = `${newCache}/${maxCache}`;
  }

  function sleep() {
    alert("Feature in progress");
  }

  function getRoboVersion() {
    roboSendResponse(`version: ${roboVersion}.0.0`, "text");
  }

  function upgradeRoboVersion() {
    roboVersion = roboVersion + 1;
  }

  function setGameState() {
    alert("Feature in progress");
  }

  function cleanCache() {
    if (roboChargePercent < 20) {
      roboSendResponse("Insufficient battery power, please charge me.", "text");
    } else {
      roboCache = [];
      roboCacheCount = 0;
      cacheDisplay.textContent = `${roboCacheCount}/${maxCache}`;
      roboOutput.textContent = "";
      userInput.value = "";
    }
  }

  function updateOSManual() {
    if (roboChargePercent < 15) {
      roboSendResponse(
        "Power running low, can't handle an OS update right now! Please charge me!!!!",
        "text"
      );
      return;
    }
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
    roboChargePercent = roboChargePercent - (num / 5) * 100;
    roboPowerDisplay.textContent = `${roboChargePercent} %`;
  }

  function setRoboName(name) {
    localStorage.setItem("roboName", name);
    roboNameDisplay.textContent = name;
  }

  function feedMe(num) {
    if (roboChargePercent === 100) {
      roboSendResponse("Battery sufficiently charged", "text");
    } else {
      roboOutput.textContent = "";
      roboChargePercent = roboChargePercent + (num / 5) * 100;
      roboPowerDisplay.textContent = `${roboChargePercent}%`;
    }
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
}
