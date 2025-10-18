const { dbPool } = require("../config/db");

// ✅ Get all experiments for a specific offering
const getExperiments = async (req, res) => {
  try {
    const { offering_id } = req.params;

    if (!offering_id) {
      return res.status(400).json({ message: "Offering ID is required" });
    }

    const [rows] = await dbPool.query(
      `SELECT id, experiment_no AS experimentNo, name, 
              DATE_FORMAT(planning_date, '%Y-%m-%d') AS planningDate,
              DATE_FORMAT(execution_date, '%Y-%m-%d') AS executionDate
       FROM lab_plan_execution 
       WHERE offering_id = ? 
       ORDER BY id`,
      [offering_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching experiments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a new experiment
const addExperiment = async (req, res) => {
  try {
    const { offering_id, experiment_no, name, planning_date, execution_date } = req.body;

    if (!offering_id || !experiment_no || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await dbPool.query(
      `INSERT INTO lab_plan_execution (offering_id, experiment_no, name, planning_date, execution_date)
       VALUES (?, ?, ?, ?, ?)`,
      [offering_id, experiment_no, name, planning_date, execution_date]
    );

    res.status(201).json({
      id: result.insertId,
      offering_id,
      experiment_no,
      name,
      planning_date,
      execution_date,
    });
  } catch (err) {
    console.error("Error adding experiment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update an experiment
const updateExperiment = async (req, res) => {
  try {
    const { id } = req.params;
    const { experiment_no, name, planning_date, execution_date } = req.body;

    const [result] = await dbPool.query(
      `UPDATE lab_plan_execution
       SET experiment_no = ?, name = ?, planning_date = ?, execution_date = ?
       WHERE id = ?`,
      [experiment_no, name, planning_date, execution_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    res.json({ message: "Experiment updated successfully" });
  } catch (err) {
    console.error("Error updating experiment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete an experiment
const deleteExperiment = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await dbPool.query(
      `DELETE FROM lab_plan_execution WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    res.json({ message: "Experiment deleted successfully" });
  } catch (err) {
    console.error("Error deleting experiment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getExperiments,
  addExperiment,
  updateExperiment,
  deleteExperiment,
};
