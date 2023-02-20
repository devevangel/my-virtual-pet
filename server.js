import express from "express";

const app = express();

app.use(express.static("client"));
app.use(express.json());

function handleGeneralGetPet(req, res) {
  res.status(200).json({
    msg: "Hello I will serve you soon.",
  });
}

// routes
app.get("/pet/:petId", handleGeneralGetPet);

const port = process.env.PORT || 8080;

app.listen(port);
