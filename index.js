window.addEventListener("load", initScript);

function initScript() {
  // globals
  let currentUserInput = "";
  let roboChargePercent = 100;
  let isNameAsked = false;
  let cache = [];
  const actionList = [
    "Arithmetics: enter '1+'",
    "Tell Time: enter 'time'",
    "Copy Self: enter 'copy'",
    "Self Destruct: enter 'kill'",
    "See Cache: enter 'cache'",
  ];

  // ui elements
  const userInput = document.querySelector("#user-input");
  const roboOutput = document.querySelector("#robo-output");
  const roboNameInput = document.querySelector("#name-input");
  const roboPowerDisplay = document.querySelector("#power-display");
  const ramDisplay = document.querySelector("#ram-display");
  const statusDisplay = document.querySelector("#status-display");
  const cacheDisplay = document.querySelector("#cache-display");
  const listOrder = document.createElement("ul");

  // ui buttons
  const cleanCacheButton = document.querySelector("#clean-cache");

  // event handlers
  userInput.addEventListener("input", handleUserInput);
  document.addEventListener("keyup", talkToBot);
  cleanCacheButton.addEventListener("click", cleanCache);

  // handlers and functions
  function talkToBot(e) {
    if (e.keyCode === 13) {
      calcCache(currentUserInput);
      switch (currentUserInput.toLowerCase().replaceAll(/\s/g, "")) {
        case "hi":
          roboOutput.textContent = "Hello!! user, how may I help you today?";
          takeCharge(0.21);
          break;
        case "hello":
          roboOutput.textContent = "Hello!! user, how may I help you today?";
          takeCharge(0.21);
          break;
        case "hey":
          roboOutput.textContent = "Hello!! user, how may I help you today?";
          takeCharge(0.21);
          break;
        case "whatisyourname?":
          roboOutput.textContent =
            "I am an autonomous robotic organism from planet cybertron, blah blah blah. I guess prime will laugh at that but. Well you can give a suitable name.";
          isNameAsked = true;
          takeCharge(0.21);
          break;
        case "whatisyourname":
          roboOutput.textContent =
            "I am an autonomous robotic organism from planet cybertron, blah blah blah. I guess prime will laugh at that. Well you can give a suitable name.";
          isNameAsked = true;
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
          roboOutput.append(listOrder);
          takeCharge(0.21);
          break;
        case "whatcanyoudo":
          for (let action of actionList) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          roboOutput.append(listOrder);
          takeCharge(0.21);
          break;
        case "features":
          for (let action of actionList) {
            const li = document.createElement("li");
            li.textContent = action;
            listOrder.append(li);
          }
          roboOutput.append(listOrder);
          takeCharge(0.21);
          break;
        case "cache":
          for (let cacheItem of cache) {
            const li = document.createElement("li");
            li.textContent = cacheItem;
            listOrder.append(li);
          }
          roboOutput.append(listOrder);
          takeCharge(0.4);
          break;
        default:
          takeCharge(0.3);
          roboOutput.textContent =
            "Sorry user, that makes no sense :(. but try entering keyword 'features'";
      }

      if (isNameAsked) {
        takeCharge(4.5);
        roboNameInput.classList.remove("hide");
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
  }

  function takeCharge(num) {
    roboChargePercent = roboChargePercent - num;
    roboPowerDisplay.textContent = `${roboChargePercent.toFixed(2)} %`;
  }

  function calcRamUsageIdle() {
    let currentUsage = getRandomIntInclusive(3, 15);

    if (currentUsage > 10) {
      statusDisplay.textContent = "Processing...";
    } else {
      statusDisplay.textContent = "Idle";
    }

    ramDisplay.textContent = `${currentUsage} %`;
    takeCharge(0.002);
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
    cache.push(userInput);
    const newCache = cache.length;
    cacheDisplay.textContent = `${newCache}/80`;
  }

  function cleanCache() {
    cache = [];
    const newCache = cache.length;
    cacheDisplay.textContent = `${newCache}/80`;
    roboOutput.textContent = "";
    userInput.value = "";
    calcRamUsageProcessing(40);
    takeCharge(0.45);
  }
}
