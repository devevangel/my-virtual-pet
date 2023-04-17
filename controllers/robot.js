import { RobotAPI } from '../database/database-manager.js';

/**
* Retrieves a single robot from the database based on the provided owner parameter.
* @function
* @async
* @param {object} req - The request object containing the owner parameter.
* @param {object} res - The response object to send the result.
*@returns {object} The robot object that matches the owner parameter.
*/
export function getRobot(req, res) {
  const { owner } = req.params;

  const robot = RobotAPI.findOne({ owner });

  res.status(200).json({
    status: 'success',
    robot,
  });
}

/**
* Creates a new robot in the database using the information provided in the request body.
* @function
* @async
* @param {object} req - The request object containing the robot information.
* @param {object} res - The response object to send the result.
* @returns {object} The newly created robot object.
*/
export function createRobot(req, res) {
  const { name, timeLived, skinclass, owner } = req.body;

  const robot = RobotAPI.create({ name, timeLived, skinclass, owner });

  res.status(201).json({
    status: 'success',
    robot,
  });
}

/**
* Updates a single robot in the database based on the provided owner parameter and request body data.
* @function
* @async
* @param {object} req - The request object containing the owner parameter and data to update the robot with.
* @param {object} res - The response object to send the result.
* @returns {object} The updated robot object.
*/
export function updateRobot(req, res) {
  const { owner } = req.params;

  const robot = RobotAPI.updateOne({ owner }, req.body);

  res.status(200).json({
    status: 'success',
    robot,
  });
}

/**
* Retrieves a list of robots from the database with a length based on the provided request body parameter.
* @function
* @async
* @param {object} req - The request object containing the length parameter.
* @param {object} res - The response object to send the result.
* @returns {array} An array of robot objects with a length based on the length parameter.
*/
export function getRobots(req, res) {
  const { length } = req.body;

  const robots = RobotAPI.find(length);

  res.status(200).json({
    status: 'success',
    robots,
  });
}

/**
* Deletes a single robot from the database based on the provided owner parameter.
* @function
* @async
* @param {object} req - The request object containing the owner parameter.
* @param {object} res - The response object to send the result.
* @returns {object} The deleted robot object.
*/
export function deleteRobot(req, res) {
  const { owner } = req.params;

  const robot = RobotAPI.deleteOne({ owner });

  res.status(200).json({
    status: 'success',
    robot,
  });
}
