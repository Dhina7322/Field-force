const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  router.get('/counts', async (req, res) => {
    try {
      if (!req.isConfigured) {
        return res.json({ employees: 142, clients: 28 });
      }

      const [empRes, clientRes] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true })
      ]);

      res.json({
        employees: empRes.count || 0,
        clients: clientRes.count || 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
