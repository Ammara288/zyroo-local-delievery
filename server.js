const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: false });

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // ⭐ Yeh Zaroori Hai!

server.listen(PORT, HOST, () => {
  console.log(`✅ JSON Server running on http://${HOST}:${PORT}`);
});