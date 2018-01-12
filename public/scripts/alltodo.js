let fillData = function (data) {
  let todoList = "";
  data.forEach(element => {
    todoList += `<p>${element.text}</p>`;
  });

  document.getElementById('list').innerHTML = todoList;
}

let renderList = function () {
  let response = this.responseText;
  let todoList = JSON.parse(response);
  fillData(todoList);
}

let getTitle = function () {
  let url = window.location.href;
  return url.split('?').pop().split('=').pop();
}

let loadTodoList = function () {
  let title = getTitle();
  let req = new XMLHttpRequest();
  req.open('get', `/todolist/alltodo?title=${title}`);
  req.addEventListener('load', renderList);
  req.send();
}

let postTodo = function () {
  let text = document.getElementById('text').value;
  let title = getTitle();
  let req = new XMLHttpRequest();
  req.open('post', `/todolist/alltodo`);
  req.addEventListener('load', () => {
    window.location.reload();
  });
  req.send(`title=${title}&text=${text}`);
}

window.onload = loadTodoList;