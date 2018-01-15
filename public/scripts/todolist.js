let fillData = function (data) {
  let todoList = "";
  data.forEach(element => {
    let title = element.title;
    let id = element.id;
    let description = element.description;
    todoList += `<p id="${id}">
    <a href="/todolist/alltodo.html?id=${id}">
    ${title}
    </a>${description}
    <input type="button" onclick="editItem('${id}','${title}','${description}')"
        value="Edit">
    <input type="button" onclick="deleteItem('${id}')"
        value="Delete"></p>`;
  });
  document.getElementById('list').innerHTML = todoList;
}

let refresh = () => {
  window.location.reload();
};

let editItem = function(id,title,description){
  let listItem = document.getElementById(id);

  let editingHTML = `
  Title : <input type="text" value="${title}" id='${id}'>
  Description : <input type="text" value="${description}"  id='${id}-des'>
  <input type="button" onclick="saveEditedItem('${id}')"
        value="Save">
  `

  let div = document.createElement('div');
  div.innerHTML = editingHTML;
  listItem.replaceWith(div);
}

let saveEditedItem = function(id){
  let title = document.getElementById(id).value;
  let description = document.getElementById(id+'-des').value;
  let postData = `id=${id}&newTitle=${title}&description=${description}`;
  sendRequest('put', `/todolist`, refresh, postData);
}

let deleteItem = function (id) {
  sendRequest('delete', `/todolist`, refresh, `id=${id}`)
}

let renderList = function () {
  let response = this.responseText;
  let todoList = JSON.parse(response);
  fillData(todoList);
}

let loadTodoList = function () {
  sendRequest('get', '/todolist', renderList)
}

let sendRequest = function (method, url, onLoad, data){
  let req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load', onLoad);
  req.send(data);
}

window.onload = loadTodoList;