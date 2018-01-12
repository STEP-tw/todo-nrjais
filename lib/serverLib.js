const fs = require('fs');

const loadSession = function (req, res) {
  let sessionId = req.cookies.sessionId;
  if (sessionId) {
    req.user = users.find((user) => user.sessionId == sessionId);
  }
}

const getUser = function (userName) {
  return users.find(user => user.user == userName);
}

const loginUser = function (req, res) {
  let sessionId = new Date().getTime();
  let userName = req.body.username;
  let user = getUser(userName);
  if (user) {
    user.sessionId = sessionId;
    res.setHeader('Set-Cookie', [`sessionId=${sessionId}`,'heloo=hello']);
    res.redirect('/guestbook.html');
    return;
  }
  res.redirect('/login.html');
}

const logoutUser = function (req, res) {
  delete req.user.sessionId;
  res.setHeader('Set-Cookie', `sessionId=0; Expires=${new Date(1).toUTCString()}`);
  res.redirect('/index.html');
}

const redirectIfNotLoggedIn = function (req, res) {
  let urls = [];
  if (!req.user && req.urlIsOneOf(urls))
    res.redirect('/login')
}

module.exports = {
  loginUser,
  logoutUser,
  loadSession,
  redirectIfNotLoggedIn
}