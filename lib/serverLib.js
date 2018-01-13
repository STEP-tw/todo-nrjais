const getFileData = require('./file').getFileData;
const fs = require('fs');
const TODOList = require('./todoList');
let dataPath = './data/data.json';
let users = [];

let loadAllDataFromFile = function(){
  let data = JSON.parse(getFileData(dataPath)) || [];
  users = data.map(userData=>{
    userData.todoLists=userData.todoLists.map(todoList=>{
      let todoL = new TODOList(todoList._title, todoList._description, todoList._id);
      todoL.addJSONItemList(todoList._todoItems);
      return todoL;
    });
    return userData;
  });
}

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
  return list.find(todoL => todoL.title == title);
}

const serveTodo = function (req, res) {
  let todoList = getTodoListByTitle(req.user.todoLists, req.todoTitle);
  todoList = todoList.getAllTODOItems();
  todoList = todoList.map(todoItem => ({
    text: todoItem.text,
    done: todoItem.isDone(),
    id: todoItem.id
  }));
  let dataToServe = JSON.stringify(todoList);
  res.write(dataToServe);
  res.end();
}

const createTodoList = function (req, res) {
  let newList = new TODOList(req.body.title, req.body.description);
  req.user.todoLists.push(newList);
  res.redirect('todolists.html');
}

const addTodo = function (req, res) {
  let todoList = getTodoListByTitle(req.user.todoLists, req.body.title);
  todoList.addItem(req.body.text);
  sendSuccess(res);
}

const sendSuccess = (res) => {
  res.write('success');
  res.end();
}

const updateTodoItem = function (req, res) {
  let todoList = getTodoListByTitle(req.user.todoLists, req.body.title);
  if (req.body.done == 'true')
    todoList.markItemDone(req.body.id);
  else
    todoList.markItemUndone(req.body.id);
  sendSuccess(res);
}

const deleteTodoItem = function (req, res) {
  let todoList = getTodoListByTitle(req.user.todoLists, req.body.title);
  todoList.removeItem(req.body.id);
  sendSuccess(res);
}

const deleteTodoList = function (req, res) {
  let todoLists = req.user.todoLists;
  let todoListIndex = todoLists.findIndex(todoL => todoL.title == req.body.title);
  if (todoListIndex >= 0) {
    todoLists.splice(todoListIndex, 1);
    sendSuccess(res);
    res.end();
  }
  res.end();
}

const saveAllData = function () {
  let data = JSON.stringify(users, null, 2);
  fs.writeFile(dataPath, data, (err) => err && console.log(err));
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
  loadAllDataFromFile
}