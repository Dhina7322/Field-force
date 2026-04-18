const express = require('express');
const router = express.Router();

const sampleEmployees = [
  { id: 'EMP001', fullName: 'John Smith', group_name: 'Sales', doj: '2023-01-15', status: 'Active' },
  { id: 'EMP002', fullName: 'Sarah Johnson', group_name: 'Field Team', doj: '2023-03-22', status: 'Active' },
  { id: 'EMP003', fullName: 'Michael Brown', group_name: 'Admin', doj: '2022-11-03', status: 'Active' },
];

module.exports = (supabase) => {
  // Get all employees
  router.get('/', async (req, res) => {
    try {
      if (!req.isConfigured) {
        return res.json(sampleEmployees);
      }

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add employee
  router.post('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([req.body])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Create employee
  router.post('/', async (req, res) => {
    try {
      if (!req.isConfigured) {
        return res.status(201).json({ ...req.body, status: 'Active', mocked: true });
      }

      const { data, error } = await supabase
        .from('employees')
        .insert([req.body])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update employee status
  router.patch('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      if (!req.isConfigured) {
        return res.json({ id: req.params.id, status, mocked: true });
      }

      const { data, error } = await supabase
        .from('employees')
        .update({ status })
        .eq('id', req.params.id)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
