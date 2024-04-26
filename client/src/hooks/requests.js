const URL = `http://localhost:4000/v1`;

async function httpGetPlanets() {
  const response = await fetch(`${URL}/planets`);
  const fetchedPlanets = await response.json();

  return fetchedPlanets;
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${URL}/launches`);
  const launches = await response.json();
  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch(`${URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    console.log("aborting");
    return await fetch(`${URL}/launches/${id}`, { method: "DELETE" });
  } catch (error) {
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
