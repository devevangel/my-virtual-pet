const URL = 'http://localhost:8080/robots/';

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
    console.log(error);
  }
}

export async function handleGetRobot(owner) {
  try {
    const response = await fetch(`${URL}/${owner}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

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
    console.log(error);
  }
}

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
    console.log(error);
  }
}
