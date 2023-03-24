import { writeToDB, readFromDB } from "./db-read-write.js";
import { nanoid } from "nanoid";

class RobotDataBaseAPI {
  // Takes database copy
  constructor(database) {
    this.database = database;
  }

  // Creates a new robot in the database
  create(robotObj) {
    const { name, skinclass, timeLived, owner } = robotObj;

    if (owner in this.database) {
      return {};
    }

    const newRobot = {
      id: nanoid(5),
      name,
      owner,
      timeLived,
      skinclass,
      version: "1.0.0",
      chargePercent: 100,
      cachePercent: 0,
      cacheList: [],
    };
    this.database[owner] = newRobot;
    writeToDB(this.database);
    return newRobot;
  }

  // Finds a robot in the database by its owner
  findOne(query) {
    const result = this.database[query.owner];
    return result ?? {};
  }

  // Updates a robot stats by its owner in the database
  updateOne(query, data) {
    let robot = this.database[query.owner];

    robot = {
      ...robot,
      ...data,
    };

    this.database[query.owner] = robot;
    writeToDB(this.database);
    return robot;
  }

  // Returns n number of robots from the database
  find(length = 5) {
    const keys = Object.keys(this.database).slice(0, length);
    const result = [];
    for (const key of keys) {
      result.push(this.database[key]);
    }
    return result;
  }

  // Remove a robot from the database by its owner
  deleteOne(query) {
    const snapshot = this.database;

    if (query.owner in snapshot) {
      const robot = snapshot[query.owner];
      delete snapshot[query.owner];
      this.database = snapshot;
      writeToDB(snapshot);
      return robot;
    }

    return {};
  }
}

// Instantiate and export robot DB API object
export const Robot = new RobotDataBaseAPI(await readFromDB());
