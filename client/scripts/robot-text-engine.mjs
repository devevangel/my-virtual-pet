import { hudDisplay, roboState, directionList, userData } from './globals.mjs';
import {
  parseUserInput,
  roboSendResponse,
  calcCache,
  cleanCache,
  updateRoboMood,
  setRoboName,
  sleep,
  getRoboVersion,
  writeResponse,
  resetWriter,
  showError,
} from './robot-os.mjs';

import { handleGameInit, playGame } from './game-engine.mjs';

// Robot user I/O processor

const date = new Date(Date.now());
const timeStamp = new Date(Date.now());

export function talkToBot(e) {
  if (e.keyCode === 13) {
    if (roboState.isSleeping || roboState.isDead) return;

    // Check if cache is full
    if (roboState.cachePercent <= 0) {
      return showError('Cache full, please clean cache immediately');
    }

    // Clear last user input
    hudDisplay.roboDisplay.textContent = '';
    hudDisplay.listOrderDisplay.innerHTML = '';
    resetWriter();

    // Parse user input
    const parsedUserInput = parseUserInput(userData.currentUserInput);
    userData.userInput.value = '';

    // Search for specific user input keywords
    if (parsedUserInput.includes('name=')) {
      const rawName = parsedUserInput.split('=')[1];
      const parsedName = rawName.replaceAll('"', '').replaceAll("'", '');
      if (parsedName.length > 0) {
        setRoboName(parsedName);
      }
      roboSendResponse('Name updated successfully.', 'text');
      return;
    }

    // Check various robot states
    if (roboState.isGameInit) {
      handleGameInit(parsedUserInput);
      return;
    }

    if (roboState.isGameStarted) {
      if (parsedUserInput === 'end') {
        handleGameInit(parsedUserInput);
        return;
      } else if (parsedUserInput === 'help') {
        for (const helpText of directionList.gameHelp) {
          const li = document.createElement('li');
          li.textContent = helpText;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'Game Help',
          node: hudDisplay.listOrderDisplay,
        });
        return;
      }
      return playGame(parsedUserInput);
    }

    // Recalculate cache value
    calcCache(parsedUserInput);

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
        if (roboState.name !== '') {
          writeResponse(`My name is ${roboState.name}`, 50);
        } else {
          writeResponse(
            "I don't have a name at the moment but I would love one. Check my how to manual to give me a name.",
            50,
          );
        }
        break;
      case 'whatisyourname?':
        if (roboState.name !== '') {
          writeResponse(`My name is ${roboState.name}`, 50);
        } else {
          writeResponse(
            "I don't have a name at the moment but I would love one. Check my how to manual to give me a name.",
            50,
          );
        }
        break;
      case 'whatisyourname':
        if (roboState.name !== '') {
          writeResponse(`My name is ${roboState.name}`, 50);
        } else {
          writeResponse(
            "I don't have a name at the moment but I would love one. Check my how to manual to give me a name.",
            50,
          );
        }
        break;
      case 'whoareyou?':
        roboSendResponse(
          'Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword \'manual\' to learn more about me.',
          'text',
        );
        break;
      case 'whoareyou':
        roboSendResponse(
          'Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword \'manual\' to learn more about me.',
          'text',
        );
        break;
      case 'whatareyou?':
        roboSendResponse(
          'Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword \'manual\' to learn more about me.',
          'text',
        );
        break;
      case 'whatareyou':
        roboSendResponse(
          'Hello!, I am a simple Virtual Pet interface created by evangelInc 👨‍💻, here to provide assistance. Enter keyword \'manual\' to learn more about me.',
          'text',
        );
        break;
      case 'howto':
        for (const action of directionList.manual) {
          const li = document.createElement('li');
          li.textContent = action;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'Usage Manual',
          node: hudDisplay.listOrderDisplay,
        });
        break;
      case 'help':
        for (const action of directionList.manual) {
          const li = document.createElement('li');
          li.textContent = action;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'Usage Manual',
          node: hudDisplay.listOrderDisplay,
        });
        break;
      case 'history':
        for (const cacheItem of roboState.cacheList) {
          const li = document.createElement('li');
          li.textContent = cacheItem;
          hudDisplay.listOrderDisplay.append(li);
        }
        roboSendResponse(null, 'node', {
          title: 'Commands History',
          node: hudDisplay.listOrderDisplay,
        });
        break;
      case 'time':
        roboSendResponse(
          `The time is ${timeStamp.toLocaleTimeString()}.`,
          'text',
        );
        break;
      case 'date':
        roboSendResponse(`Today is ${date.toDateString()}.`, 'text');
        break;
      case 'cls':
        cleanCache();
        break;
      case 'sleep':
        sleep();
        break;
      case 'game':
        handleGameInit(parsedUserInput);
        break;
      case 'version':
        getRoboVersion();
        break;
      default:
        writeResponse(
          "I'm sorry I don't quite understand want you meant there, trying entering key word 'help' to learn about me.",
          50,
        );
        updateRoboMood(roboState.cachePercent, roboState.chargePercent);
    }
  }
}
