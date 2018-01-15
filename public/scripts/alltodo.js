let fillData = function (data) {
  let todoList = "";
  data.forEach(element => {
    let done = element.done;
    let id = element.id;
    todoList += `<p><b>${element.text}<b>
    <input type="button" onclick="${done ? 'markUndone' : 'markDone'}('${id}')"
    value=${done ? 'undone' : 'done'}>
        <input type="button" onclick="deleteItem('${id}')"
        value="delete"><p>`;
  });
  document.getElementById('list').innerHTML = todoList;
}

let markDone = function (id) {
  let listId = getListId();
  let data = `listId=${listId}&itemId=${id}&done=true`;
  sendRequest('put', `/todolist/alltodo`, refresh, data);
}

let deleteItem = function (id) {
  let listId = getListId();
  let data = `listId=${listId}&itemId=${id}`;
  sendRequest('delete', `/todolist/alltodo`, refresh, data);
}

let markUndone = function (id) {
  let listId = getListId();
  let postData = `listId=${listId}&itemId=${id}&done=false`;
  sendRequest('put', `/todolist/alltodo`, refresh, postData);
}

let renderList = function () {
  let response = this.responseText;
  let todoList = JSON.parse(response);
  fillData(todoList);
}

let getListId = function () {
  let url = window.location.href;
  return url.split('?').pop().split('=').pop();
}

let loadTodoList = function () {
  let listId = getListId();
  sendRequest('GET', `/todolist/alltodo?listId=${listId}`, renderList);
}

let refresh = () => {
  window.location.reload();
};

let postTodo = function () {
  let text = document.getElementById('text').value;
  let listId = getListId();
  let postData = `id=${listId}&text=${text}`;
  sendRequest('post', `/todolist/alltodo`, refresh, postData)
}

let sendRequest = function (method, url, onLoad, data) {
  let req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load', onLoad);
  req.send(data);
}

window.onload = loadTodoList;