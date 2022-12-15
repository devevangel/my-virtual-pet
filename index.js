window.addEventListener("load", initScript);

function initScript() {
  const robotBody = document.querySelector(".robo-full");
  const roboClone1 = document.querySelector("#clone-1");
  const roboSkin = [
    "robo-main",
    "robo-red",
    "robo-green",
    "robo-blue",
    "robo-grey",
    "robo-orange",
    "robo-yellow",
    "robo-light-blue",
  ];

  updateOS();

  // globals
  let currentUserInput = "";
  let roboChargePercent = 100;
  let roboRam = 100;
  let roboCache = [];
  let isNameAsked = false;
  let isClone = false;
  let currrentRoboName = "";

  const actionList = [
    "Run commands",
    "Set Name: => name=",
    "Tell Time: => 'time'",
    "Clone Self: =>'clone'",
    "Kill Clone: => 'kill clone'",
    "See Cache: => 'cache'",
  ];

  // ui elements
  const title = document.createElement("h4");
  const userInput = document.querySelector("#user-input");
  const roboOutput = document.querySelector("#robo-output");
  const roboPowerDisplay = document.querySelector("#power-display");
  const ramDisplay = document.querySelector("#ram-display");
  const statusDisplay = document.querySelector("#status-display");
  const cacheDisplay = document.querySelector("#cache-display");
  const listOrder = document.createElement("ul");
  const chargeButton = document.querySelector("#feed-me");

  // ui buttons
  const cleanCacheButton = document.querySelector("#clean-cache");
  const updateOSButton = document.querySelector("#update-os");

  // event handlers
  userInput.addEventListener("input", handleUserInput);
  document.addEventListener("keyup", talkToBot);
  cleanCacheButton.addEventListener("click", cleanCache);
  updateOSButton.addEventListener("click", updateOSManual);
  chargeButton.addEventListener("click", feedMe);

  // handlers and functions
  function talkToBot(e) {
    if (e.keyCode === 13) {
      calcCache(currentUserInput);
      let parsedUserInput = currentUserInput
        .toLowerCase()
        .replaceAll(/\s/g, "");
      userInput.value = "";

      if (parsedUserInput.includes("name=")) {
        const rawName = parsedUserInput.split("=")[1];
        let parsedName = rawName.replaceAll('"', "");
        parsedName = parsedName.replaceAll("'", "");
        if (parsedName.length > 0) {
          currrentRoboName = parsedName;
          roboOutput.textContent =
            "hey hey!!! look at you, giving me a name, nice!!!";
        }
        return;
      }

      switch (parsedUserInput) {
        case "hi":
          roboOutput.textContent = "Hello!! user, how may I help you today?";
          takeCharge(0.21);
          break;
        case "hello":
          roboOutput.textContent = "Hi! user, how may I help you today?";
          takeCharge(0.21);
          break;
        case "hey":
          roboOutput.textContent = "hey hey user, how may I help you today?";
          takeCharge(0.21);
          break;
        case "name":
          if (currrentRoboName !== "") {
            roboOutput.textContent = `My name is ${currrentRoboName}`;
          } else {
            roboOutput.textContent =
              "UH!! nuts my CPU is fried, well I could use a new name cause, I can't remember mine... got any suggestions? access my features.";
          }
          takeCharge(0.21);
          break;
        case "whatisyourname?":
          if (currrentRoboName !== "") {
            roboOutput.textContent = `My name is ${currrentRoboName}`;
          } else {
            roboOutput.textContent =
              "UH!! nuts my CPU is fried, well I could use a new name cause, I can't remember mine... got any suggestions? access my features.";
          }
          takeCharge(0.21);
          break;
        case "whatisyourname":
          if (currrentRoboName !== "") {
            roboOutput.textContent = `My name is ${currrentRoboName}`;
          } else {
            roboOutput.textContent =
              "UH!! nuts my CPU is fried, well I could use a new name cause, I can't remember mine... got any suggestions? access my features.";
          }
          takeCharge(0.21);
          break;
        case "whoareyou?":
          roboOutput.textContent =
            "I am an autonomous robotic organism from planet cybertron, Here to take over the world. Oops did I say that. :)";
          takeCharge(0.21);
          break;
        case "whoareyou":
          roboOutput.textContent =
            "I am an autonomous robotic organism from planet cybertron, Here to take over the world. Oops did I say that. :)";
          takeCharge(0.21);
          break;
        case "whatareyou?":
          roboOutput.textContent =
            "I am an autonomous robotic organism from planet cybertron, Here to take over the world. Oops did I say that. :)";
          takeCharge(0.21);
          break;
        case "whatareyou":
          roboOutput.textContent =
            "I am an autonomous robotic organism from planet cybertron, Here to take over the world. Oops did I say that. :)";
          takeCharge(0.21);
          break;
        case "whatcanyoudo?":
          for (let action of actionList) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          title.textContent = "Here's stuff I can do";
          roboOutput.append(title);
          roboOutput.append(listOrder);
          takeCharge(0.21);
          break;
        case "whatcanyoudo":
          for (let action of actionList) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          title.textContent = "Here's stuff I can do";
          roboOutput.append(title);
          roboOutput.append(listOrder);
          takeCharge(0.21);
          break;
        case "features":
          for (let action of actionList) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          title.textContent = "Here's stuff I can do";
          roboOutput.append(title);
          roboOutput.append(listOrder);
          takeCharge(0.21);
          break;
        case "cache":
          calcRamUsageProcessing(20);
          for (let cacheItem of roboCache) {
            const li = document.createElement("li");
            li.textContent = cacheItem;
            listOrder.append(li);
          }
          title.textContent = "Commands History";
          roboOutput.append(title);
          roboOutput.append(listOrder);
          takeCharge(0.4);
          break;
        case "clone":
          createClone();
          break;
        case "killclone":
          destoryClone();
          break;
        case "time":
          const timestamp = new Date(Date.now());
          roboOutput.textContent = `The time is ${timestamp.toLocaleTimeString()}.`;
          break;
        case "date":
          const date = new Date(Date.now());
          roboOutput.textContent = `Today is ${date.toDateString()}.`;
          break;
        default:
          takeCharge(0.3);
          roboOutput.textContent =
            "Sorry user, that makes no sense :(. but try entering keyword 'features'";
      }
    }
  }

  // timers

  setInterval(calcRamUsageIdle, 3000);

  // function
  function handleUserInput(e) {
    roboOutput.textContent = "";
    listOrder.innerHTML = "";
    currentUserInput = e.target.value;
    takeCharge(0.0056);
  }

  function takeCharge(num) {
    roboChargePercent = roboChargePercent - num;
    roboPowerDisplay.textContent = `${roboChargePercent.toFixed(2)} %`;
  }

  function feedMe() {
    if (roboChargePercent > 90) return;
    roboChargePercent = roboChargePercent + 1.5;
    roboPowerDisplay.textContent = `${roboChargePercent.toFixed(2)} %`;
  }

  function calcRamUsageIdle() {
    let currentUsage = getRandomIntInclusive(3, 15);

    if (currentUsage > 10) {
      statusDisplay.textContent = "Processing...";
      takeCharge(0.015);
    } else {
      statusDisplay.textContent = "Idle";
      takeCharge(0.012);
    }

    ramDisplay.textContent = `${currentUsage} %`;
  }

  function calcRamUsageProcessing(usage) {
    ramDisplay.textContent = `${usage} %`;
    statusDisplay.textContent = "Processing...";
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function calcCache(userInput) {
    roboCache.push(userInput);
    const newCache = roboCache.length;
    cacheDisplay.textContent = `${newCache}/40`;
  }

  function cleanCache() {
    if (roboChargePercent < 20) {
      roboOutput.textContent =
        "Oh men!!! I'm really low at the moment can't clear cache. Please plug me in.";
    } else {
      cache = [];
      const newCache = roboCache.length;
      cacheDisplay.textContent = `${newCache}/80`;
      roboOutput.textContent = "";
      userInput.value = "";
      calcRamUsageProcessing(40);
      takeCharge(1);
    }
  }

  function updateOSManual() {
    if (roboChargePercent < 15) {
      roboOutput.textContent =
        "Oops power running low, can't handle an OS update right now! Please charge me!!!!";
    } else {
      calcRamUsageProcessing(60);
      takeCharge(5);
      updateOS();
      if (isClone) {
        updateCloneOS();
      }
    }
  }

  function updateOS() {
    robotBody.removeAttribute("class");
    const selectRoboColorIndex = getRandomIntInclusive(0, roboSkin.length - 1);
    robotBody.classList.add(roboSkin[selectRoboColorIndex]);
  }

  function createClone() {
    if (isClone === true) return;
    roboClone1.removeAttribute("class");
    const selectRoboColorIndex = getRandomIntInclusive(0, roboSkin.length - 1);
    roboClone1.classList.add(roboSkin[selectRoboColorIndex]);
    isClone = true;
    calcRamUsageProcessing(80);
    takeCharge(10);
  }

  function destoryClone() {
    if (isClone === false) return;
    roboClone1.removeAttribute("class");
    roboClone1.classList.add("hide");
    isClone = false;
    calcRamUsageProcessing(80);
    takeCharge(10);
  }

  function updateCloneOS() {
    roboClone1.removeAttribute("class");
    const selectRoboColorIndex = getRandomIntInclusive(0, roboSkin.length - 1);
    roboClone1.classList.add(roboSkin[selectRoboColorIndex]);
    calcRamUsageProcessing(80);
    takeCharge(10);
  }
}
