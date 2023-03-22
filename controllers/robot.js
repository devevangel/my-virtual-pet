import { Robot } from "../api/db.js";

export function getRobot(req, res) {
  const { owner } = req.params;

  const robot = Robot.findOne({ owner });

  res.status(200).json({
    status: "success",
    robot,
  });
}

export function createRobot(req, res) {
  const { name, timeLived, skinclass, owner } = req.body;

  const robot = Robot.create({ name, timeLived, skinclass, owner });

  res.status(201).json({
    status: "success",
    robot,
  });
}

export function updateRobot(req, res) {
  const { owner } = req.params;

  const robot = Robot.updateOne({ owner }, req.body);

  res.status(200).json({
    status: "success",
    robot,
  });
}

export function getRobots(req, res) {
  const { length } = req.body;

  const robots = Robot.find(length);

  res.status(200).json({
    status: "success",
    robots,
  });
}

export function deleteRobot(req, res) {
  const { owner } = req.params;

  const robot = Robot.deleteOne({ owner });

  res.status(200).json({
    status: "success",
    robot,
  });
}
