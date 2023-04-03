import {
  roboSendResponse,
  updateRoboMood,
  setRoboMood,
  clearBatteryInterval,
  setBatteryInterval,
  writeResponse,
} from './robot-os.mjs';
import { directionList, roboState, robotStats } from './globals.mjs';
import { getRandomIntInclusive } from './utils.mjs';

/**
* Handles the initialization of a game based on the user input.
* @param {string} userInput - The user's input, either "game", "yes", "y", "no", "n", or "end".
* @returns {void}
*/
export function handleGameInit(userInput) {
  switch (userInput) {
    case 'game':
      // Asks the user if they want to play a game.
      writeResponse('Would you like to play a game. Y/N', 60);
      roboState.isGameInit = true;
      roboState.isGameStarted = false;
      break;
    case 'yes':
      // Initiates the game and shows the rules.
      roboSendResponse("Awesome!! let's begin.");
      roboState.isGameInit = false;
      roboState.isGameStarted = true;
      setTimeout(showGameRules, 1500);
      break;
    case 'y':
      // Initiates the game and shows the rules.
      roboSendResponse("Awesome!! let's begin");
      roboState.isGameInit = false;
      roboState.isGameStarted = true;
      setTimeout(showGameRules, 1500);
      break;
    case 'no':
      // Ends the game initialization and informs the user that they could play some other time.
      roboSendResponse('Alright we could play some other time.');
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      break;
    case 'n':
      // Ends the game initialization and informs the user that they could play some other time.
      roboSendResponse('Alright we could play some other time.');
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      break;
    case 'end':
      // Ends the game and resets roboState.
      roboSendResponse('Game ended');
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      roboState.guessVal = 0;
      setBatteryInterval();
      updateRoboMood(robotStats.cachePercent, robotStats.chargePercent);
      break;
    default:
      // Informs the user that they didn't enter a valid input and resets roboState.
      roboSendResponse("Sorry seems like you didn't enter a valid input answer", 'text');
      roboState.isGameInit = false;
      roboState.isGameStarted = false;
      break;
  }
}

/**
Handles showing game rules when the game is initiated. It generates the initial robot guess value using the getRandomIntInclusive function, writes or outputs the game directions for the user, removes the robot battery interval to prevent the robot from discharging while playing, and sets the robot mood state to gaming mood.
@return {void}
*/
function showGameRules() {
  roboState.guessVal = getRandomIntInclusive(1, 10); // generates initial robot guess value
  writeResponse(directionList.gameIntructions, 60); // writes or outputs the game directions for the user
  clearBatteryInterval(); // removes the robot battery interval to prevent the robot from discharging while playing
  setRoboMood('🎮'); // sets the robot mood state to gaming mood
}

/**
* Handles the user input for the game and checks if it's a valid number or not.
* If the user input is a valid number, checks if it matches the robot's guess.
* If the guess is correct, generates a new random guess and asks the user to guess again or end the game.
* If the guess is incorrect, asks the user to guess again.
* @param {string} userInput - The user input for the game
* @returns {undefined} - This function does not return anything
*/
export function playGame(userInput) {
  const userInputNum = parseInt(userInput);

  // Checks if user input in not a number
  if (isNaN(userInputNum)) {
    roboSendResponse(
      'Invalid input, please ensure to enter a number. Try again',
    );
  }

  // Checks if user didn't guess right
  if (userInputNum !== roboState.guessVal) {
    roboSendResponse(`Oops! ${userInputNum} isn't correct. Guess again!`);
    return;
  }

  // Generates a new random guess when user gets guess right
  roboState.guessVal = getRandomIntInclusive(1, 10);
  roboSendResponse(
    `Hurray! ${userInputNum} is correct. Guess my new number or end game`,
    'text',
  );
}
