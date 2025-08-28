const deptModel = require('../models/deptModel');

const createDept = async (req, res) => {
  try {
    const { departmentName, departmentCode, adminId } = req.body;

    console.log('Received data:', { departmentName, departmentCode, adminId });

    if (!departmentName || !departmentCode || !adminId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await deptModel.createDepartment(departmentName, departmentCode, adminId);
    res.status(201).json({
      message: 'Department created successfully',
      deptId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



// PUT /admin/dept/update/:id
const update = (req, res) => {
  const { id } = req.params;
  const { departmentName, departmentCode } = req.body;

  if (!departmentName || !departmentCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  deptModel.updateDepartment(id, departmentName, departmentCode, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Department updated' });
  });
};

// DELETE /admin/dept/delete/:id
const remove = (req, res) => {
  const { id } = req.params;

  deptModel.deleteDepartment(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Department deleted' });
  });
};

module.exports = {
  createDept,
  update,
  remove,
};
