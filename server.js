const http = require('http');

let PORT = 9999;

let app = require('./app');

const server = http.createServer(app);
server.listen(PORT);
console.log('Listening on port ' + PORT);
