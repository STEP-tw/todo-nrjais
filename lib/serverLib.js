const getFileData = require('./file').getFileData;
const fs = require('fs');
const Todo = require('./todo');
let dataPath = './data/data.json';
let todoData = {};

let users = [{
  "username": "nrjais",
  "password": "nrjais",
  "name": "Neeraj Jaiswal",
  "sessionId": 1515823676967
}, {
  "username": "arvind",
  "password": "arvind",
  "name": "Arvind Singh",
  "sessionId": 1515762799449
}]

let loadAllDataFromFile = function () {
  let fileData = getFileData(dataPath) || '{}';
  todoData = JSON.parse(fileData);
  let userNames = Object.keys(todoData);
  userNames.forEach(userName => {
    let todo = todoData[userName];
    todo.__proto__ = new Todo().__proto__;
    todo.addJSONTodoLists();
  });
}

const loadSession = function (req, res) {
  let sessionId = req.cookies.sessionId;
  if (sessionId) {
    let user = users.find((user) => user.sessionId == sessionId);
    req.user = user;
    if (user)
      if (todoData[user.username])
        req.userData = todoData[user.username]
      else
        req.userData = todoData[user.username] = new Todo(user.username);
  }
}

const getUser = function (userName, password) {
  return users.find(user => user.username == userName && user.password == password);
}

const loginUser = function (req, res) {
  let sessionId = new Date().getTime();
  let userName = req.body.username;
  let password = req.body.password;
  let user = getUser(userName, password);
  if (user) {
    user.sessionId = sessionId;
    res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
    res.redirect('/todolists.html');
    return;
  }
  res.setHeader('Set-Cookie', `message=Login Failed; Max-Age=5`);
  res.redirect('/');
}

const logoutUser = function (req, res) {
  delete req.user.sessionId;
  res.setHeader('Set-Cookie', `sessionId=0; Expires=${new Date(1).toUTCString()}`);
  res.redirect('/');
}

const redirectIfNotLoggedIn = function (req, res) {
  let urls = ['/logout', '/todolist', '/todolist.html', '/todolist/alltodo.html', '/todolist/alltodo'];
  if (!req.user && req.urlIsOneOf(urls))
    res.redirect('/')
  else if (!req.user && req.url.includes('todolist'))
    res.redirect('/')
}

const serveLoginPage = function (req, res) {
  let page = getFileData('public/index.html');
  page = page.replace('MESSAGE', req.cookies.message || '');
  res.write(page);
  res.end();
}

const serveTodoList = function (req, res) {
  let todoLists = req.userData.getAllTodoLists();
  let dataToServe = JSON.stringify(todoLists, ["title", "description", "id"]);
  res.write(dataToServe);
  res.end();
}

const separateTitle = function (req, res) {
  let urls = req.url.split('?');
  if (urls.length > 1) {
    req.todoId = urls.pop().split('=').pop();
    req.url = urls.pop();
  }
}

const serveTodo = function (req, res) {
  let todoList = req.userData.getAllTodoItems(req.todoId);
  let dataToServe = JSON.stringify(todoList);
  res.write(dataToServe);
  res.end();
}

const createTodoList = function (req, res) {
  req.userData.createTodoList(req.body.title, req.body.description);
  res.redirect('todolists.html');
}

const addTodo = function (req, res) {
  req.userData.addTodoItem(req.body.id, req.body.text);
  sendSuccess(res);
}

const sendSuccess = (res) => {
  res.write('success');
  res.end();
}
//Complete this
const updateTodoItem = function (req, res) {
  if (req.body.done == 'true')
    req.userData.markItemDone(req.body.listId, req.body.itemId);
  else
    req.userData.markItemUndone(req.body.listId, req.body.itemId);
  sendSuccess(res);
}

const deleteTodoItem = function (req, res) {
  let todoList = req.userData.deleteTodoItem(req.body.listId, req.body.itemId);
  sendSuccess(res);
}

const deleteTodoList = function (req, res) {
  req.userData.deleteTodoList(req.body.id);
  res.end();
}

const saveAllData = function () {
  let data = JSON.stringify(todoData, null, 2);
  fs.writeFile(dataPath, data, (err) => err && console.log(err));
}

const editTodoList = function (req, res) {
  let title = req.body.newTitle;
  let description = req.body.description;
  req.userData.updateTodoList(req.body.id, title, description);
  res.end();
}

module.exports = {
  loginUser,
  logoutUser,
  loadSession,
  redirectIfNotLoggedIn,
  serveLoginPage,
  serveTodoList,
  separateTitle,
  serveTodo,
  createTodoList,
  addTodo,
  updateTodoItem,
  deleteTodoItem,
  deleteTodoList,
  saveAllData,
  loadAllDataFromFile,
  editTodoList
}