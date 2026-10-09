const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbPath = path.join(__dirname, 'db.json');
  let db;
  try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    return res.status(500).json({ error: 'Cannot read database', details: err.message });
  }

  const url = req.url.split('?')[0];
  const resource = url.replace('/api/', '').replace('/', '').split('/')[0];

  if (!db[resource]) {
    return res.status(404).json({ error: 'Resource not found', available: Object.keys(db) });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db[resource]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};