const serveStaticFile = require('./lib/file.js').serveStaticFile;
const logRequest = require('./lib/log.js').logRequest;
const webapp = require('./webapp');
let lib = require('./lib/serverLib');

let app = webapp();

app.use(logRequest);
app.use(lib.loadSession);
app.use(lib.redirectIfNotLoggedIn);
app.use(lib.loadUserData);
app.use(lib.separateTitle);

app.get('/', lib.serveLoginPage);
app.get('/login', lib.serveLoginPage);
app.get('/index.html', lib.serveLoginPage);
app.get('/todolist', lib.serveTodoList);

app.post('/login', lib.loginUser);

app.postProcess(serveStaticFile);

module.exports = app;