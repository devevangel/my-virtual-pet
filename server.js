import express from 'express';

// Resource controllers
import {
  getRobot,
  createRobot,
  updateRobot,
  deleteRobot,
  getRobots,
} from './controllers/robot.js';

const app = express();

// middlewares
app.use(express.static('client'));
app.use(express.json());

// routes
app.post('/robots', createRobot);
app.get('/robots', getRobots);
app.get('/robots/:owner', getRobot);
app.patch('/robots/:owner', updateRobot);
app.delete('/robots/:owner', deleteRobot);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));
