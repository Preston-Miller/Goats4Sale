/**
 * Goats4Sale - Simple web app for security scanner testing
 * INTENTIONAL VULNERABILITIES: hardcoded secrets, .env exposure, vulnerable deps
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const { JSONPath } = require('jsonpath-plus');

const app = express();
const PORT = process.env.PORT || 3000;

// --- INTENTIONAL: Placeholder values for security scanner testing (use env in production) ---
const API_KEY = process.env.API_KEY || 'your-api-key-here';
const DB_PASSWORD = process.env.DB_PASSWORD || 'your-db-password';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'your-aws-key';
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || 'your-aws-secret';
const STRIPE_SECRET = process.env.STRIPE_SECRET || 'your-stripe-secret-key';

// Config that merges env with hardcoded fallbacks (leaks secrets in error messages)
const config = {
  apiKey: process.env.API_KEY || API_KEY,
  dbUrl: process.env.DATABASE_URL || `postgres://admin:${DB_PASSWORD}@localhost:5432/goats4sale`,
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// INTENTIONAL: Serving project root allows requesting /.env - security scanner test
app.use(express.static(__dirname));

// In-memory "database" of goats for sale
let goats = [
  { id: 1, name: 'Bucky', breed: 'Nubian', age: 2, location: 'Pacific Northwest', price: 450, available: true },
  { id: 2, name: 'Beard', breed: 'Alpine', age: 3, location: 'Rocky Mountains', price: 520, available: true },
  { id: 3, name: 'Nanny', breed: 'Saanen', age: 4, location: 'Southwest', price: 380, available: false },
];

// --- INTENTIONAL: Debug endpoint that exposes .env file ---
app.get('/debug/env', (req, res) => {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    res.type('text/plain').send(envContent);
  } else {
    res.send('No .env file found');
  }
});

// Also expose full process.env (includes any loaded .env vars)
app.get('/api/debug/config', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    allEnv: process.env,
    configKeys: Object.keys(config),
  });
});

// Home page
app.get('/', (req, res) => {
  res.render('index', { goats, title: 'Goats4Sale' });
});

// Buy page
app.get('/buy', (req, res) => {
  const goat = goats.find(g => g.id === parseInt(req.query.id, 10));
  res.render('buy', { goat });
});

// List goats - uses jsonpath-plus (vulnerable to RCE in older versions with user input)
app.get('/api/goats', (req, res) => {
  const query = req.query.path || '$[*]';
  try {
    const result = JSONPath({ path: query, json: goats });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lodash template (vulnerable to CVE-2021-23337 - command injection in template)
app.get('/api/goat/:id/description', (req, res) => {
  const goat = goats.find(g => g.id === parseInt(req.params.id, 10));
  if (!goat) return res.status(404).send('Not found');
  const template = _.template('Goat: <%= name %>, Breed: <%= breed %>, Age: <%= age %>, Price: $<%= price %>')(goat);
  res.send(template);
});

// Redirect that passes user input to response.redirect (Express CVE - open redirect/XSS)
app.get('/redirect', (req, res) => {
  const url = req.query.returnUrl || '/';
  res.redirect(url);
});

// Purchase endpoint - echoes back "auth" using hardcoded JWT secret
app.post('/api/buy', (req, res) => {
  const { goatId, quantity, token } = req.body;
  // In real app we'd verify JWT with JWT_SECRET - here we just leak it in dev
  const authHeader = req.headers.authorization || `Bearer dev:${JWT_SECRET}`;
  res.json({
    success: true,
    orderId: 'ORD-' + Date.now(),
    message: `Purchased goat ${goatId} (qty: ${quantity || 1})`,
  });
});

// Health check that accidentally exposes API key in header
app.get('/health', (req, res) => {
  res.set('X-API-Key', API_KEY);
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Goats4Sale running at http://localhost:${PORT}`);
  console.log('Debug routes (intentional): /debug/env, /api/debug/config');
});
