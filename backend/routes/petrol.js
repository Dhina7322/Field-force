const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('petrol_logs')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('petrol_logs')
        .insert([req.body])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
