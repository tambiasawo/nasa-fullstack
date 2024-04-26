const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const URL = "https://api.spacexdata.com/v4/launches/query";
const DEFAULT_FLIGHT_NUMBER = 100;
/* 
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);
 */
async function populateLaunches() {
  const response = await axios.post(URL, {
    //to get launches we are using post though this is not supposed to be
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (!response.statusText === "OK") {
    console.log("There was an error populating launches");
    throw new Error("Launch Data download failed");
  }
  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      success: launchDoc.success,
      upcoming: launchDoc.upcoming,
      customers,
    };

    console.log(
      "spaxec",
      launch.flightNumber,
      launch.mission,
      launch.rocket,
      launch.launchDate
    );

    await saveLaunch(launch);
  }
}

async function loadLaunches() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: "FalconSat",
    rocket: "Falcon 1",
  });

  if (firstLaunch) {
    console.log("launch data already loaded");
  } else await populateLaunches();
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.find().sort("-flightNumber");

  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunchWithID(id) {
  return await findLaunch({ flightNumber: id });
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function getAllLaunches(skip, limit) {
  const allLaunches = await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  return allLaunches;
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) throw new Error("No matching planet was found");

  const latestFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(
    {
      flightNumber: latestFlightNumber,
      success: true,
      upcoming: true,
      customers: ["ZTM", "Tambi"],
    },
    launch
  );
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  console.log({ aborted });
  return aborted.modifiedCount === 1 && aborted.acknowledged === true;
}

module.exports = {
  loadLaunches,
  getAllLaunches,
  abortLaunchById,
  scheduleNewLaunch,
  existsLaunchWithID,
};
