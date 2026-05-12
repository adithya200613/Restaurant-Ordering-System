// ============================================================
//  server.js — Express Application Entry Point
// ============================================================
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const initDB     = require('./db/init');

const menuRoutes  = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());                          // Allow all cross-origin requests
app.use(express.json());                  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Serve the frontend (HTML/CSS/JS) as static files
app.use(express.static(path.join(__dirname)));

// ── API Routes ───────────────────────────────────────────────
app.use('/api', menuRoutes);              // /api/categories, /api/menu, /api/top-rated
app.use('/api/orders', orderRoutes);      // /api/orders

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🍽️  FlavourDB API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      categories:    'GET  /api/categories',
      menu:          'GET  /api/menu?search=&category_id=&veg=1&sort=rating_desc',
      menuItem:      'GET  /api/menu/:id',
      topRated:      'GET  /api/top-rated',
      placeOrder:    'POST /api/orders',
      listOrders:    'GET  /api/orders',
      getOrder:      'GET  /api/orders/:id',
      updateStatus:  'PATCH /api/orders/:id/status',
      revenueReport: 'GET  /api/orders/report/revenue',
    }
  });
});

// ── Serve index.html for any non-API route ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── 404 handler for unknown API routes ──────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────────────
initDB();   // Create tables + seed data on first run

app.listen(PORT, () => {
  console.log('');
  console.log('🍽️  ================================');
  console.log('   FlavourDB Restaurant API');
  console.log('🍽️  ================================');
  console.log(`🚀  Server running at: http://localhost:${PORT}`);
  console.log(`📋  API Docs:          http://localhost:${PORT}/api/health`);
  console.log(`🌐  Frontend:          http://localhost:${PORT}`);
  console.log('');
});
