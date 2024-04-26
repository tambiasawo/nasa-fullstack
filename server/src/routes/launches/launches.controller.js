const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchWithID,
} = require("../../models/launches.model");
const { getPagination } = require("../../utils/query");

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const allLaunches = await getAllLaunches(skip, limit);
  const launches = res.status(200).json(allLaunches);
  return launches;
};

const httpAddNewLaunches = async (req, res) => {
  const launch = req.body;
  //because of express.json() in app.js, our body will be in json format
  //console.log("request body", req.body);
  if (
    !launch.launchDate ||
    !launch.rocket ||
    !launch.mission ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required launch details" });
  }
  launch.launchDate = new Date(launch.launchDate); // we are doing this b/c express doesnt let us pass around date as a date object

  if (isNaN(launch.launchDate)) {
    return res.status(404).json({ error: "Invalid Date Entered" });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const { id } = req.params;

  const existLaunch = await existsLaunchWithID(id);
  if (!existLaunch) {
    return res.status(404).json({ error: "Launch not found" });
  }

  const aborted = await abortLaunchById(id);

  if (!aborted) {
    return res.status(400).json({ error: "Launch not abordted" });
  }
  return res.status(200).json({ ok: true });
};
module.exports = { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunch };
