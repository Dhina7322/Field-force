const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Supabase Init
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder'));

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

app.use(cors());
app.use(express.json());

// Inject configuration state into request for routes to use
app.use((req, res, next) => {
  req.isConfigured = isConfigured;
  next();
});

// Routes
const dashboardRoutes = require('./routes/dashboard')(supabase);
const employeeRoutes = require('./routes/employees')(supabase);
const clientRoutes = require('./routes/clients')(supabase);
const attendanceRoutes = require('./routes/attendance')(supabase);
const petrolRoutes = require('./routes/petrol')(supabase);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/petrol', petrolRoutes);

// Generic handler for other modules (Machines, Areas, Assignments, Ledger, Advances)
app.post('/api/:module', async (req, res) => {
  const { module } = req.params;
  try {
    if (!req.isConfigured) {
      return res.status(201).json({ ...req.body, mocked: true });
    }

    const { data, error } = await supabase
      .from(module)
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', supabaseConnected: !!supabaseUrl });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
