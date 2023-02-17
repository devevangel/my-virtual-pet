const express = require("express");
const {
  getPetStats,
  setPetStats,
  createPet,
} = require("./controllers/pet-controller.js");

const app = express();

app.use(express.static("client"));
app.use(express.json());

// routes
app.get("/pet/:petId", getPetStats);
app.patch("/pet/:petId", setPetStats);
app.post("/pet", createPet);

const port = process.env.PORT || 8080;

app.listen(port);
