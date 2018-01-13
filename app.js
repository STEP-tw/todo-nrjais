const serveStaticFile = require('./lib/file.js').serveStaticFile;
const logRequest = require('./lib/log.js').logRequest;
const webapp = require('./webapp');
let lib = require('./lib/serverLib');

lib.loadAllDataFromFile();
let app = webapp();

app.use(logRequest);
app.use(lib.loadSession);
app.use(lib.separateTitle);
app.use(lib.redirectIfNotLoggedIn);

app.get('/', lib.serveLoginPage);
app.get('/login', lib.serveLoginPage);
app.get('/index.html', lib.serveLoginPage);
app.get('/logout', lib.logoutUser);
app.post('/login', lib.loginUser);

app.get('/todolist', lib.serveTodoList);
app.post('/todolist', lib.createTodoList);
app.put('/todolist', lib.editTodoList);
app.delete('/todolist', lib.deleteTodoList);

app.get('/todolist/alltodo', lib.serveTodo);
app.put('/todolist/alltodo',lib.updateTodoItem);
app.post('/todolist/alltodo', lib.addTodo);
app.delete('/todolist/alltodo',lib.deleteTodoItem);

app.postProcess(lib.saveAllData);
app.postProcess(serveStaticFile);

module.exports = app;