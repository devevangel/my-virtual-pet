import { writeToDB, readFromDB } from "./db-read-write.js";
import { nanoid } from "nanoid";

/**
 * The RobotDataBaseAPI class provides an API for interacting with the robot database.
 * The database is stored as an object with owner phone number as keys and robot objects as values.
 * @class RobotDataBaseAPI
 * @constructor
 * @param {Object} database - The database object to use for storing robots.
 */
class RobotDataBaseAPI {
  constructor(database) {
    this.database = database;
  }

  /**
  Creates a new robot in the database.
  * @async
  * @param {Object} robotObj - The robot data to create.
  * @param {string} robotObj.name - The name of the robot.
  * @param {string} robotObj.skinclass - The class of the robot's outer shell.
  * @param {number} robotObj.timeLived - The amount of time the robot has been active.
  * @param {string} robotObj.owner - The owner of the robot.
  * @returns {Object} - The newly created robot object.
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
      version: 16,
      chargePercent: 100,
      cachePercent: 100,
      cacheList: [],
    };
    this.database[owner] = newRobot;
    writeToDB(this.database);
    return newRobot;
  }

  /**
  * Finds a robot in the database that matches the given query.
  * @param {Object} query - The query to use for finding the robot.
  * @param {string} query.owner - The owner of the robot to find.
  * @returns {Object} - The robot object that matches the query, or an empty object if not found.
  */
  findOne(query) {
    const result = this.database[query.owner];
    return result ?? {};
  }

  /**
  * Updates a robot in the database that matches the given query with the given data.
  * @async
  * @param {Object} query - The query to use for finding the robot to update.
  * @param {string} query.owner - The owner of the robot to update.
  * @param {Object} data - The data to update the robot with.
  * @returns {Object} - The updated robot object.
  */
  updateOne(query, data) {
    let robot = this.database[query.owner];

    if(!robot) return {};

    robot = {
      ...robot,
      name: data.name,
      skinclass: data.skinclass,
      version: data.version,
      chargePercent: data.chargePercent,
      cachePercent: data.cachePercent,
      cacheList: data.cacheList,
    };

    this.database[query.owner] = robot;
    writeToDB(this.database);
    return robot;
  }

  /**
  * Finds a list of robots from the database.
  * @param {number} [length=5] - The number of robots to return.
  * @returns {Array.<Object>} - An array of robot objects.
  */
  find(length = 5) {
    const keys = Object.keys(this.database).slice(0, length);
    const result = [];
    for (const key of keys) {
      result.push(this.database[key]);
    }
    return result;
  }

  /**
  * Deletes a robot from the database and returns the deleted robot.
  * @param {object} query - The query object used to identify the robot to delete.
  * @param {string} query.owner - The owner of the robot to delete.
  * @returns {object} The deleted robot, or an empty object if the robot was not found in the database.
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
export const RobotAPI = new RobotDataBaseAPI(await readFromDB());
