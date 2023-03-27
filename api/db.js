import { writeToDB, readFromDB } from "./db-read-write.js";
import { nanoid } from "nanoid";

class RobotDataBaseAPI {
  // Takes database copy
  constructor(database) {
    this.database = database;
  }

  // Creates a new robot in the database
  /**
   *
   * @param { name, timeLived, skinclass, owner} - Takes in new robot object
   * @returns {}  Newly created robot object
   */
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
      cachePercent: 100,
      cacheList: [],
    };
    this.database[owner] = newRobot;
    writeToDB(this.database);
    return newRobot;
  }

  // Finds a robot in the database by its owner
  /**
   *
   * @param {*} query Query object to be executed
   * @returns Robot object matching query
   */
  findOne(query) {
    const result = this.database[query.owner];
    return result ?? {};
  }

  // Updates a robot stats by its owner in the database
  /**
   *
   * @param {*} query Query object to be executed
   * @param {*} data New data value to update existing robot document with
   * @returns Returns updated robot document
   */
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
  /**
   *
   * @param {*} length Total length of required robots
   * @returns Returns a total of 'lenght' robots specified
   */
  find(length = 5) {
    const keys = Object.keys(this.database).slice(0, length);
    const result = [];
    for (const key of keys) {
      result.push(this.database[key]);
    }
    return result;
  }

  // Remove a robot from the database by its owner
  /**
   *
   * @param {*} query Query object to be executed
   * @returns Returns delete robot from dbs
   */
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
