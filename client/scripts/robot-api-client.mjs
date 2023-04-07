import { handleError } from './robot-utils.mjs';

const URL = 'http://localhost:8080/robots';

/**
 * Sends a POST request to create a new robot using the specified request body.
 * @async
 * @param {Object} requestBody - The request body to send with the POST request.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response from the server.
 * @throws {Error} If an error occurs while sending the POST request or parsing the JSON response its paased to the error handler.
 */
export async function handleCreateRobot(requestBody) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return await response.json();
  } catch (error) {
    handleError('An error occured creating your robot, please try again.', 1);
  }
}

/**
 * Sends a GET request to retrieve a robot owned by the specified owner.
 * @async
 * @param {string} owner - The owner phone line of the robot to retrieve.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response from the server.
 * @throws {Error} If an error occurs while sending the GET request or parsing the JSON response its paased to the error handler.
 */
export async function handleGetRobot(owner) {
  try {
    const response = await fetch(`${URL}/${owner}`);
    return await response.json();
  } catch (error) {
    handleError(`Could not get robot with owner line '${owner}'.`, 1);
  }
}

/**
 * Sends a PATCH request to update the data of a robot owned by the specified owner.
 * @async
 * @param {string} owner - The owner phone line of the robot to update.
 * @param {Object} robotData - The data to update the robot with.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response from the server.
 * @throws {Error} If an error occurs while sending the PATCH request or parsing the JSON response its paased to the error handler.
 */
export async function handleUpdateRobot(owner, robotData) {
  try {
    const response = await fetch(`${URL}/${owner}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(robotData),
    });

    return await response.json();
  } catch (error) {
    handleError(`Could not make to a robot with owner line '${owner}'`, 1);
  }
}

/**
 * Sends a DELETE request to delete the robot owned by the specified owner.
 * @async
 * @param {string} owner - The owner phone line of the robot to delete.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response from the server.
 * @throws {Error} If an error occurs while sending the DELETE request or parsing the JSON response its paased to the error handler.
 */
export async function handleDeleteRobot(owner) {
  try {
    const response = await fetch(`${URL}/${owner}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    handleError(`Could clear robot data with owner line '${owner}'`, 1);
  }
}
