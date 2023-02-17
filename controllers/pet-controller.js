const fs = require("fs/promises");
const uuid = require("uuid-random");

// let roboDB = JSON.parse(await fs.readFile("data/robos.json", "utf-8"));

export function createPet(req, res) {
  const newBotId = uuid;

  const newBot = {
    id: newBotId,
    name: req.body.name,
    battery: req.body.charge,
    cache: req.body.cache,
    memory: req.body.memory,
    skin: req.body.skin,
    version: req.body.version,
    output: req.body.output,
    state: req.body.state,
    time: Date(),
  };

  roboDB = { ...roboDB, newBotId: newBot };

  res.status(200).json({
    bot: { ...newBot },
    flag: "SUCCESS",
  });
}

export function getPetStats(req, res) {
  res.status(200).json({
    petData: roboDB,
    flag: "SUCCESS",
  });
}

export async function setPetStats(req, res) {
  const { petId } = req.query;

  roboDB[petId] = {
    ...roboDB[petId],
    ...req.body,
  };

  // await fs.writeFile("data/robos.json", JSON.stringify(roboDB));

  res.status(200).json({
    flag: "SUCCESS",
  });
}
