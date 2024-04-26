const { parse } = require("csv-parse");
const fs = require("fs");
const planets = require("./planets.mongo");

const habitablePlanets = [];
function isHabitable(planet) {
  return (
    (planet["koi_disposition"] = "CONFIRMED") &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

const savePlanet = async (planet) => {
  try {
    if (planet["kepler_name"] === "" ? "Missing Name" : planet["kepler_name"])
      await planets.updateOne(
        { keplerName: planet.kepler_name },
        { keplerName: planet.kepler_name },
        { upsert: true }
      );
  } catch (error) {
    console.error("Could not save planet", error);
  }
};

const loadPlanets = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("data.csv")
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async function (data) {
        if (isHabitable(data)) {
          await savePlanet(data);
        }
      })
      .on("error", function (err) {
        console.log("err", err);
        reject(err);
      })
      .on("end", async function () {
        const countPlanetsFound = await getAllPlanets();
        console.log(`${countPlanetsFound.length} habitable planets found`);
        resolve();
      });
  });
};

async function getAllPlanets() {
  return await planets.find({}, { __v: 0, _id: 0 });
}

module.exports = { planets: habitablePlanets, loadPlanets, getAllPlanets };
