const getFileData = require('./file').getFileData;
const TODOList = require('./todoList');

let users = JSON.parse(getFileData('./data/data.json')) || [];

const loadSession = function (req, res) {
  let sessionId = req.cookies.sessionId;
  if (sessionId) {
    req.user = users.find((user) => user.sessionId == sessionId);
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
  let urls = ['/todolist.html', '/todolist'];
  if (!req.user && req.urlIsOneOf(urls))
    res.redirect('/')
}

const serveLoginPage = function (req, res) {
  let page = getFileData('public/index.html');
  page = page.replace('MESSAGE', req.cookies.message || '');
  res.write(page);
  res.end();
}

const serveTodoList = function (req, res) {
  let todoList = req.user.todoLists;
  let dataToServe = JSON.stringify(todoList, ["title", "description", "id"]);
  res.write(dataToServe);
  res.end();
}

const separateTitle = function (req, res) {
  let urls = req.url.split('?');
  if (urls.length > 1) {
    req.todoTitle = urls.pop().split('=').pop();
    req.url = urls.pop();
  }
}

const getTodoListByTitle = function (list, title) {
  let todoList = list.find(todoL => todoL.title == title);
  return todoList.todoItems;
}

const serveTodo = function (req, res) {
  // let todoList = getTodoListByTitle(req.user.todoLists, req.todoTitle);
  // let dataToServe = JSON.stringify(todoList, ["text", "done"]);
  // res.write(dataToServe);
  res.end();
}

const createTodoList = function(req,res){
  let newList = new TODOList(req.body.title, req.body.description);
  req.user.todoLists.push(newList);
  res.redirect('todolists.html');
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
  createTodoList
}