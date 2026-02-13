const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3003;

const usersFilePath = path.join(__dirname, 'data', 'users.json');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = url.searchParams;

  const allowedParams = ['hello', 'users'];
  const unknownParams = Array.from(params.keys()).filter(key => !allowedParams.includes(key));

  if (unknownParams.length > 0) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }

  if (params.has('hello')) {
    const name = params.get('hello');
    if (name && name.trim() !== '') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Hello, ${name}`);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Enter a name');
    }
    return;
  }

  if (params.has('users')) {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading users.json:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(); // пустой ответ
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
    return;
  }

  if (params.size === 0) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
    return;
  }

  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});