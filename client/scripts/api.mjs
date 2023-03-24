const URL = "http://localhost:8080/robots/";

export async function handleCreatePet(requestBody) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
