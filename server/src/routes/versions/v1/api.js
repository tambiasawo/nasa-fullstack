const express = require("express");

const planetsRouter = require("../../planets/planets.router");
const launchesRouter = require("../../launches/launches.router");

const api = express.Router();

api.use("/planets", planetsRouter); //middleware to catch all planets requests
api.use("/launches", launchesRouter);

module.exports = api;
