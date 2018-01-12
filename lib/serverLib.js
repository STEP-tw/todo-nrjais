const getFileData = require('./file').getFileData;

let users = JSON.parse(getFileData('./data/users.json')) || [];

const loadSession = function (req, res) {
  let sessionId = req.cookies.sessionId;
  if (sessionId) {
    req.user = users.find((user) => user.sessionId == sessionId);
  }
}

const getUser = function (userName, password) {
  return users.find(user => user.username == userName && user.password === password);
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

module.exports = {
  loginUser,
  logoutUser,
  loadSession,
  redirectIfNotLoggedIn,
  serveLoginPage
}