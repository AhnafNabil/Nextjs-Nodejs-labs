// simple-node-server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Server is Running ....' });
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the Node.js server!' });
});

app.listen(port, () => {
  console.log(`Node.js server running at http://localhost:${port}`);
});
