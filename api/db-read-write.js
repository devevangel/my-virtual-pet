import fs from 'fs/promises';

const FILE_PATH = './database/robots.json';

// Read from JSON DB
export async function readFromDB() {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write to JSON DB
export async function writeToDB(snapshot) {
  const dataStr = JSON.stringify(snapshot);
  await fs.writeFile(FILE_PATH, dataStr, 'utf-8');
}
