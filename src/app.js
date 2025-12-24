const express = require("express");
const cors = require("cors");

const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/teams", registrationRoutes);

module.exports = app;
