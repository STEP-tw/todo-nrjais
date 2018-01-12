let fillData = function (data) {
  let todoList = "";
  data.forEach(element => {
    todoList += `<p>${element.text}</p>`;
  });

  document.body.innerHTML = todoList + document.body.innerHTML;
}

let renderList = function () {
  let response = this.responseText;
  let todoList = JSON.parse(response);
  fillData(todoList);
}

let loadTodoList = function () {
  let url = window.location.href;
  let title = url.split('?').pop().split('=').pop();
  let req = new XMLHttpRequest();
  req.open('get', `/todolist/alltodo?title=${title}`);
  req.addEventListener('load', renderList);
  req.send();
}

window.onload = loadTodoList;