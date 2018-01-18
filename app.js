const ServeStaticFile = require('./lib/file.js');
const logRequest = require('./lib/log.js').logRequest;
const webapp = require('./webapp');
let lib = require('./lib/serverLib');

let staticFileServer = new ServeStaticFile('public').getRequestHandler();

lib.loadAllDataFromFile();
let app = webapp();

app.use(logRequest);
app.use(lib.loadSession);
app.use(lib.redirectIfNotLoggedIn);

app.get('/', lib.serveLoginPage);
app.get('/login', lib.serveLoginPage);
app.get('/index.html', lib.serveLoginPage);
app.get('/logout', lib.logoutUser);
app.post('/login', lib.loginUser);

app.get('/todolists',(req,res)=>req.url = '/todolists.html');

app.get('/todolist', lib.serveTodoList);
app.post('/todolist', lib.createTodoList);

app.get('/todolist/$listId', (req,res)=>req.url = '/todolist/alltodo.html');
app.get('/data/todolist/$listId', lib.serveTodoItems);
app.put('/todolist/$listId', lib.editTodoList);

app.post('/todolist/$listId', lib.addTodoItem);
app.delete('/todolist/$listId', lib.deleteTodoList);

app.put('/todolist/$listId/todo/$itemId', lib.updateTodoItem);
app.delete('/todolist/$listId/todo/$itemId', lib.deleteTodoItem);

app.postProcess(lib.saveAllData);
app.postProcess(staticFileServer);

module.exports = app;