const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const version1API = require("./routes/versions/v1/api");

const app = express();

app.use(morgan("combined"));
app.use(cors({ origin: "http://localhost:3000/v1" })); //look at the cors npm docs for more information
app.use(express.json()); // middleware to enable our code to use express
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", version1API);
//any api endpoints that doesnt match any of the ones above will be handled by this one
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});
module.exports = app;
