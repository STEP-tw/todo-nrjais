const serveStaticFile = require('./lib/file.js').serveStaticFile;
const logRequest = require('./lib/log.js').logRequest;
const webapp = require('./webapp');
let lib = require('./lib/serverLib');

let app = webapp();

app.use(logRequest);
app.use(lib.loadSession);
app.use(lib.separateTitle);
app.use(lib.redirectIfNotLoggedIn);

app.get('/', lib.serveLoginPage);
app.get('/login', lib.serveLoginPage);
app.get('/index.html', lib.serveLoginPage);
app.get('/todolist', lib.serveTodoList);
app.post('/todolist', lib.createTodoList);
app.get('/todolist/alltodo', lib.serveTodo);
app.post('/todolist/alltodo', lib.addTodo);

app.post('/login', lib.loginUser);
app.get('/logout', lib.logoutUser);

app.postProcess(serveStaticFile);

module.exports = app;