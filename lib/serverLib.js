const getFileData = require('./file').getFileData;
const TODOList = require('./todoList');

let users = JSON.parse(getFileData('./data/users.json')) || [];
let data = JSON.parse(getFileData('./data/data.json')) || [];

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
    res.setHeader('Set-Cookie',`sessionId=${sessionId}`);
    res.redirect('/todolists.html');
    return;
  }
  res.setHeader('Set-Cookie',`message=Login Failed; Max-Age=5`);
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

const serveLoginPage = function(req,res){
  let page = getFileData('public/index.html');
  page = page.replace('MESSAGE', req.cookies.message || '');
  res.write(page);
  res.end();
}

const serveTodoList = function(req,res){
  let todoList = req.userData.todoLists;
  let dataToServe = JSON.stringify(todoList, ["title", "description", "id"]);
  res.write(dataToServe);
  res.end();
}

const loadUserData = function(req,res){
  if(req.user){
    req.userData = data.find(userData=>userData.username == req.user.username);
  }
}

const separateTitle = function(req,res){
  let urls = req.url.split('?');
  if(urls.length > 1){
    req.todoTitle = urls.pop().split('=').pop();
    console.log(req.todoTitle);
    req.url = '/todolist/alltodo.html'
  }
}

module.exports = {
  loginUser,
  logoutUser,
  loadSession,
  redirectIfNotLoggedIn,
  serveLoginPage,
  serveTodoList,
  loadUserData,
  separateTitle
}