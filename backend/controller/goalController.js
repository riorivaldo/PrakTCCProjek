import Goal from "../models/Goal.js";

export const getGoalsByUser = async (req, res) => {
  try {
    const goals = await Goal.findAll({ where: { user_id: req.params.userId } });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create(req.body);
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    await Goal.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Goal updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    await Goal.destroy({ where: { id: req.params.id } });
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
