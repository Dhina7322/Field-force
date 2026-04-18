const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees (
            fullName
          )
        `);
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
