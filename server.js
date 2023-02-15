import express from "express";
import {
  getPetStats,
  setPetStats,
  createPet,
} from "./controllers/pet-controller.js";

const app = express();

app.use(express.static("client"));
app.use(express.json());

// routes
app.get("/pet/:petId", getPetStats);
app.patch("/pet/:petId", setPetStats);
app.post("/pet", createPet);

app.listen(8080);