const getFileData = require('./file').getFileData;
const fs = require('fs');
const TODOList = require('./todoList');
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
    let userData = todoData[userName];
    userData.todoLists = userData.todoLists.map(todoList => {
      let todoL = new TODOList(todoList._title, todoList._description, todoList._id);
      todoL.addJSONItemList(todoList._todoItems);
      return todoL;
    });
  });
}

const loadSession = function (req, res) {
  let sessionId = req.cookies.sessionId;
  if (sessionId) {
    let user = users.find((user) => user.sessionId == sessionId);
    req.user = user;
    if(user)
      req.userData = todoData[user.username] || createNewTodoData(user);
  }
}

const createNewTodoData = function(user){
  let userData = {
    username: user.username,
    todoLists: []
  }
  todoData[user.username] = userData;
  return userData;
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
  let todoList = req.userData.todoLists;
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
  let todoList = getTodoListByTitle(req.userData.todoLists, req.todoTitle);
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
  req.userData.todoLists.push(newList);
  res.redirect('todolists.html');
}

const addTodo = function (req, res) {
  let todoList = getTodoListByTitle(req.userData.todoLists, req.body.title);
  todoList.addItem(req.body.text);
  sendSuccess(res);
}

const sendSuccess = (res) => {
  res.write('success');
  res.end();
}

const updateTodoItem = function (req, res) {
  let todoList = getTodoListByTitle(req.userData.todoLists, req.body.title);
  if (req.body.done == 'true')
    todoList.markItemDone(req.body.id);
  else
    todoList.markItemUndone(req.body.id);
  sendSuccess(res);
}

const deleteTodoItem = function (req, res) {
  let todoList = getTodoListByTitle(req.userData.todoLists, req.body.title);
  todoList.removeItem(req.body.id);
  sendSuccess(res);
}

const deleteTodoList = function (req, res) {
  let todoLists = req.userData.todoLists;
  let todoListIndex = todoLists.findIndex(todoL => todoL.title == req.body.title);
  if (todoListIndex >= 0) {
    todoLists.splice(todoListIndex, 1);
    sendSuccess(res);
    return;
  }
  res.end();
}

const saveAllData = function () {
  let data = JSON.stringify(todoData, null, 2);
  fs.writeFile(dataPath, data, (err) => err && console.log(err));
}

const editTodoList = function (req, res) {
  let todoLists = req.userData.todoLists;
  let todoList = todoLists.find(todoL => todoL.title == req.body.title);
  if (todoList) {
    let title = req.body.newTitle;
    let description = req.body.description;
    todoList.changeTitleAndDes(title, description);
    sendSuccess(res);
    return;
  }
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