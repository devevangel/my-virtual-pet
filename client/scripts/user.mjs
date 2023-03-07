import { roboState, userData } from "./variables.mjs";

export function parseUserInput(rawUserInput) {
  return rawUserInput.toLowerCase().replaceAll(/\s/g, "");
}

export function handleUserInput(e) {
  if (roboState.isSleeping || roboState.isDead || roboState.isTyping) {
    e.target.value = "";
    return;
  }
  userData.currentUserInput = e.target.value;
}
