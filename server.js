// Tiny web server for this app. No installs needed: run "npm start".
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

http.createServer((req, res) => {
  const file = req.url === '/' ? 'index.html' : req.url.split('?')[0].slice(1);
  const fullPath = path.join(__dirname, path.basename(file));
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Page not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(fullPath)] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Task Manager is running at http://localhost:${PORT}`));
