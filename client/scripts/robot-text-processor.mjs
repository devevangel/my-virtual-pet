import {
  hudDisplay,
  roboState,
  directionList,
  userData,
  robotStats,
} from './robot-registers.mjs';
import {
  parseUserInput,
  roboSendResponse,
  calcCache,
  cleanCache,
  updateRoboMood,
  setRoboName,
  getRoboVersion,
  writeResponse,
  resetWriter,
  showError,
  handleSleepAwakeState,
} from './robot-os.mjs';

import { handleGameInit, playGame } from './robot-game-processor.mjs';

const date = new Date(Date.now());
const timeStamp = new Date(Date.now());

/**
 * talkToBot function is responsible for parsing the user's input, and calling the appropriate function based on the parsed user input.
 * The function handles different cases of user input, including updating the robot's name,
 * playing a game, and responding to questions about its name, and its identity.
 * The function receives an event e as a parameter,
 * which is the keydown event that is triggered when the user presses a key on the keyboard.
 * If the keycode of the key pressed is 13 (enter), the function is executed.
 * @param {Event} e - the keydown event that is triggered when the user presses a key on the keyboard
 * @returns {void} This function does not return anything.
 */
export function talkToBot(e) {
  if (
    roboState.isSleeping ||
    roboState.isDead ||
    roboState.isTyping ||
    userData.userInput.value === ''
  ) {
    return;
  }
  if (e.keyCode === 13 || e.target.name === 'enter-button') {
    // Check if cache is full
    if (robotStats.cachePercent <= 0) {
      return showError('Cache capacity exceeded. Clear cache promptly');
    }

    // Clear previous robot display
    hudDisplay.roboDisplay.textContent = '';
    hudDisplay.listOrderDisplay.innerHTML = '';
    resetWriter();

    // Parse user input
    const parsedUserInput = parseUserInput(userData.currentUserInput);
    userData.userInput.value = '';

    // Handles changing robot name
    if (parsedUserInput.includes('name=')) {
      const rawName = parsedUserInput.split('=')[1];
      const parsedName = rawName.replaceAll('"', '').replaceAll("'", '');
      if (parsedName.length > 0) {
        setRoboName(parsedName);
      }
      roboSendResponse('Name updated successfully.', 'text');
      return;
    }

    // Check if robot is in game start state
    if (roboState.isGameInit) {
      handleGameInit(parsedUserInput);
      return;
    }

    // Check if robot is in a current game session
    if (roboState.isGameStarted) {
      if (parsedUserInput === 'end') {
        handleGameInit(parsedUserInput);
        return;
      } else if (parsedUserInput === 'help') {
        // Show game help directions
        for (const helpText of directionList.gameHelp) {
          const li = document.createElement('li');
          li.textContent = helpText;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'Game Support',
          node: hudDisplay.listOrderDisplay,
        });
        return;
      }
      return playGame(parsedUserInput);
    }

    // Calculates cache
    if (parseUserInput.length > 0) {
      calcCache(parsedUserInput);
    }

    switch (parsedUserInput) {
      case 'hi':
        writeResponse('Hello! How can I help you today?', 50);
        break;
      case 'hello':
        writeResponse(
          "Hi! Is there anything you would like to ask or talk about? I'm here to assist you.",
          50,
        );
        break;
      case 'hey':
        writeResponse('Hello! How can I assist you today?', 50);
        break;
      case 'name':
        writeResponse(
          `Confirming identity.<br /> My designated nomenclature is <u> ${robotStats.name}</u>.`,
          50,
        );
        break;
      case 'whatisyourname':
        writeResponse(
          `Confirming identity.<br /> My designated nomenclature is <u> ${robotStats.name}</u>.`,
          50,
        );
        break;
      case 'whoareyou':
        roboSendResponse(
          "I'm a semi-autonomous virtual robotic interface here to keep you company,<br /> developed by Evangel CEO Robo Dojo Inc.",
          'text',
        );
        break;
      case 'whatareyou':
        roboSendResponse(
          "I'm a semi-autonomous virtual robotic interface here to keep you company,<br/> developed by Evangel CEO Robo Dojo Inc.",
          'text',
        );
        break;
      case 'help':
        for (const action of directionList.manual) {
          const li = document.createElement('li');
          li.textContent = action;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'Operating Instructions',
          node: hudDisplay.listOrderDisplay,
        });
        break;
      case 'logs':
        for (const cacheItem of robotStats.cacheList) {
          const li = document.createElement('li');
          li.textContent = cacheItem;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'System Logs',
          node: hudDisplay.listOrderDisplay,
        });
        break;
      case 'time':
        roboSendResponse(
          `Current time is ${timeStamp.toLocaleTimeString()}, as per my records.`,
          'text',
        );
        break;
      case 'date':
        roboSendResponse(
          `According to my calculations,<br /> today is ${date.toDateString()}.`,
          'text',
        );
        break;
      case 'clear':
        cleanCache();
        break;
      case 'sleep':
        handleSleepAwakeState();
        break;
      case 'game':
        handleGameInit(parsedUserInput);
        break;
      case 'version':
        getRoboVersion();
        break;
      default:
        writeResponse(
          "Apologies, unable to comprehend your statement. Enter keyword 'help' for information about me.",
          50,
        );
        updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
    }
  }
}
