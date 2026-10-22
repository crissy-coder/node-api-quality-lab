
const express = require("express");

const router = express.Router();

let tasks = [];
let nextId = 1;

// Get all tasks
router.get("/", (req, res) => {
  res.json(tasks);
});

// Get a task by ID
router.get("/:id", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// Create a task
router.post("/", (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    completed: false,
  };

  tasks.push(task);

  res.status(201).json(task);
});

// Update a task
router.put("/:id", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.title = req.body.title ?? task.title;
  task.completed = req.body.completed ?? task.completed;

  res.json(task);
});

// Delete a task
router.delete("/:id", (req, res) => {
  const index = tasks.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

module.exports = router;
