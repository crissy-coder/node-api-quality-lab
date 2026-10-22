
const express = require("express");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Node API Quality Lab",
    version: "1.0.0",
  });
});

app.use("/api/tasks", taskRoutes);

module.exports = app;
