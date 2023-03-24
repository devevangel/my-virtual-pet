import {
  roboSendResponse,
  updateRoboMood,
  setRoboMood,
  clearBatteryInterval,
  setBatteryInterval,
  writeResponse,
} from "./robo.mjs";
import { directionList, roboState } from "./globals.mjs";
import { getRandomIntInclusive } from "./utils.mjs";

export function handleGameInit(userInput) {
  switch (userInput) {
    case "game":
      roboSendResponse("Would you like to play a game. Y/N");
      roboState.isGameInit = true;
      roboState.isGameStarted = false;
      break;
    case "yes":
      roboSendResponse("Awesome!! let's begin.");
      roboState.isGameInit = false;
      roboState.isGameStarted = true;
      setTimeout(showGameRules, 1500);
      break;
    case "y":
      roboSendResponse("Awesome!! let's begin");
      roboState.isGameInit = false;
      roboState.isGameStarted = true;
      setTimeout(showGameRules, 1500);
      break;
    case "no":
      roboSendResponse("Alright we could play some other time");
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      break;
    case "n":
      roboSendResponse("Alright we could play some other time");
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      break;
    case "end":
      roboSendResponse("Game ended");
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      roboState.guessVal = 0;
      setBatteryInterval();
      updateRoboMood(roboState.cachePercent, roboState.chargePercent);
      break;
    default:
      roboSendResponse(
        `Sorry seems like you didn't enter a valid input  answer`,
        "text"
      );
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      break;
  }
}

export function showGameRules() {
  roboState.guessVal = getRandomIntInclusive(1, 10);
  // for (let instruction of directionList.gameIntructions) {
  //   const li = document.createElement("li");
  //   li.textContent = instruction;
  //   hudDisplay.listOrderDisplay.append(li);
  // }
  // roboSendResponse(null, "node", {
  //   title: "Game rules",
  //   node: hudDisplay.listOrderDisplay,
  // });

  writeResponse(directionList.gameIntructions, 60);

  clearBatteryInterval();
  setRoboMood("🎮");
}

export function playGame(userInput) {
  let userInputNum = parseInt(userInput);

  if (isNaN(userInputNum)) {
    roboSendResponse(
      `Invalid input, please ensure to enter a number. Try again`
    );
  }

  if (userInputNum !== roboState.guessVal) {
    roboSendResponse(`Oops! ${userInputNum} isn't correct. Guess again!`);
    return;
  }

  roboState.guessVal = getRandomIntInclusive(1, 10);
  roboSendResponse(
    `Hurray! ${userInputNum} is correct. Guess my new number or end game`,
    "text"
  );
}
