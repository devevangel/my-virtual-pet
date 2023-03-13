import { roboState, userData } from "./globals.mjs";

// Parses user input to remove unwanted characters and spacing
export function parseUserInput(rawUserInput) {
  return rawUserInput.toLowerCase().replaceAll(/\s/g, "");
}

// User input handler
export function handleUserInput(e) {
  if (roboState.isSleeping || roboState.isDead || roboState.isTyping) {
    e.target.value = "";
    return;
  }
  userData.currentUserInput = e.target.value;
}
