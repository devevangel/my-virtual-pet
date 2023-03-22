import { writeToDB, readFromDB } from "./loader.js";
import { nanoid } from "nanoid";

class RobotDataBaseAPI {
  // Takes database copy
  constructor(database) {
    this.database = database;
  }

  // Creates a new robot in the database
  create(robotObj) {
    const snapshot = this.database;
    const { name, skinclass, timeLived, owner } = robotObj;

    if (owner in snapshot) {
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
    snapshot[owner] = newRobot;
    this.database = snapshot;
    this.save(snapshot);
    return newRobot;
  }

  // Finds a robot in the database by its owner
  findOne(query) {
    const result = this.database[query.owner];
    if (result) {
      return result;
    }
    return {};
  }

  // Updates a robot stats by its owner in the database
  updateOne(query, data) {
    const snapshot = this.database;
    let robot = snapshot[query.owner];

    robot = {
      ...robot,
      ...data,
    };

    snapshot[query.owner] = robot;
    this.database = snapshot;
    this.save(snapshot);
    return robot;
  }

  // Returns n number of robots from the database
  find(length = 5) {
    const snapshot = this.database;
    const keys = Object.keys(snapshot).slice(0, length);
    const result = [];
    for (const key of keys) {
      result.push(snapshot[key]);
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
      this.save(snapshot);
      return robot;
    }

    return {};
  }

  // Write to persist data to storage
  save(snapshot) {
    writeToDB(snapshot);
  }
}

// Instantiate and export robot DB API object
export const Robot = new RobotDataBaseAPI(await readFromDB());
