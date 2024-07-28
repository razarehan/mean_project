const http = require('http');
require('dotenv').config();     // do comment while deploying
const app = require('./app1');
// const debug = require('debug')("node-angular");
const port = process.env.PORT || 3000;

app.set('port', port);
const server = http.createServer(app);

server.listen(port);