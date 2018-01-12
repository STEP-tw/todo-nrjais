const serveStaticFile = require('./lib/file.js').serveStaticFile;
const logRequest = require('./lib/log.js').logRequest;
const webapp = require('./webapp');
let lib = require('./lib/serverLib');

let app = webapp();

app.use(logRequest);
// app.use(lib.loadSession);
app.use(lib.redirectIfNotLoggedIn);

app.get('/', (req, res) => {
  res.write('working');
  res.end();
});
app.postProcess(serveStaticFile);

module.exports = app;