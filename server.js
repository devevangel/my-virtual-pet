import express from "express";

const app = express();

app.use(express.static("client"));
app.use(express.json());

// routes

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`listening on port ${port}`));
