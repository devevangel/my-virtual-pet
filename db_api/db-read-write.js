import fs from 'fs/promises';

const FILE_PATH = './database/robots.json';

/**
* Reads data as an object from a JSON file located in the specified file path asynchronously.
* @async
* @returns {Promise<Object>} - A Promise that resolves with the parsed data object from the file.
*/
export async function readFromDB() {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

/**
* Writes a snapshot of data to a JSON file in the specified file path asynchronously.
* @async
* @param {Object} snapshot - The data to be written to the file.
* @returns {Promise<void>} - A Promise that resolves when the data has been successfully written to the file.
*/
export async function writeToDB(snapshot) {
  const dataStr = JSON.stringify(snapshot);
  await fs.writeFile(FILE_PATH, dataStr, 'utf-8');
}
