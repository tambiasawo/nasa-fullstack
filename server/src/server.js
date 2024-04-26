require("dotenv").config();

const app = require("./app");
const { mongoConnect } = require("./utils/mongo");
const http = require("http");
const { loadPlanets } = require("./models/planets.model");
const { loadLaunches } = require("./models/launches.model");

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanets();
  await loadLaunches();
  server.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
};

startServer();
