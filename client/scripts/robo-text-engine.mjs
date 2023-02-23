import { hodDisplay, roboState, directionList } from "./variables.mjs";
import { parseUserInput } from "./user.mjs";
import { userData } from "./variables.mjs";
import {
  roboSendResponse,
  calcCache,
  cleanCache,
  updateRoboMood,
  setRoboName,
  sleep,
  getRoboVersion,
} from "./robo.mjs";
import { handleGameInit, playGame } from "./game.mjs";

export function talkToBot(e) {
  if (e.keyCode === 13) {
    if (roboState.isSleeping || roboState.isDead) return;

    // clear last user input
    hodDisplay.roboDisplay.textContent = "";
    hodDisplay.listOrderDisplay.innerHTML = "";

    //parse user input to requried text format
    let parsedUserInput = parseUserInput(userData.currentUserInput);
    userData.userInput.value = "";

    if (parsedUserInput.includes("name=")) {
      const rawName = parsedUserInput.split("=")[1];
      let parsedName = rawName.replaceAll('"', "").replaceAll("'", "");
      if (parsedName.length > 0) {
        setRoboName(parsedName);
      }
      roboSendResponse("Name updated successfully.", "text");
      return;
    }

    if (roboState.isGameInit) {
      handleGameInit(parsedUserInput);
      return;
    }

    if (roboState.isGameStarted) {
      if (parsedUserInput === "end") {
        handleGameInit(parsedUserInput);
        return;
      } else if (parsedUserInput === "help") {
        for (let helpText of directionList.gameHelp) {
          const li = document.createElement("li");
          li.textContent = helpText;
          hodDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, "node", {
          title: "Game Help",
          node: hodDisplay.listOrderDisplay,
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
        if (roboState.name !== "") {
          roboSendResponse(`My name is ${roboState.name}`, "text");
        } else {
          roboSendResponse(
            `I don't have a name at the moment but I would love one. Check my how to manual to give me a name.`,
            "text"
          );
        }
        break;
      case "whatisyourname?":
        if (roboState.name !== "") {
          roboSendResponse(`My name is ${roboState.name}`, "text");
        } else {
          roboSendResponse(
            `I don't have a name at the moment but I would love one. Check my how to manual to give me a name.`,
            "text"
          );
        }
        break;
      case "whatisyourname":
        if (roboState.name !== "") {
          roboSendResponse(`My name is ${roboState.name}`, "text");
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
        for (let action of directionList.manual) {
          const li = document.createElement("li");
          li.textContent = action;
          hodDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, "node", {
          title: "Usage Manual",
          node: hodDisplay.listOrderDisplay,
        });
        break;
      case "help":
        for (let action of directionList.manual) {
          const li = document.createElement("li");
          li.textContent = action;
          hodDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, "node", {
          title: "Usage Manual",
          node: hodDisplay.listOrderDisplay,
        });
        break;
      case "history":
        for (let cacheItem of roboState.cacheList) {
          const li = document.createElement("li");
          li.textContent = cacheItem;
          hodDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, "node", {
          title: "Commands History",
          node: hodDisplay.listOrderDisplay,
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
        updateRoboMood(roboState.cachePercent, roboState.chargePercent);
    }
  }
}
