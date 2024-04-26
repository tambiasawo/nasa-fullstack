require("dotenv").config();

const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.once("open", () => {
  console.log("Mongoose Connection started");
});

mongoose.connection.on("error", (err) => {
  console.log("An error coccured", err);
});

async function mongoConnect() {
  await mongoose.connect(MONGODB_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = { mongoConnect, mongoDisconnect };
