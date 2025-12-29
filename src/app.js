const express = require("express");
const cors = require("cors");

const registrationRoutes = require("./routes/registrationRoutes");
const teamRoutes = require("./routes/teamRoutes");
const fakeTeamRoutes = require("./routes/fakeTeamRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/teams", registrationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/faketeams", fakeTeamRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/qrsystem",scanRoutes);
app.use("/api", require("./routes/adminRoutes"));
module.exports = app;
