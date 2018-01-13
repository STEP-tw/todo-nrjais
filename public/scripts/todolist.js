let fillData = function (data) {
  let todoList = "";
  data.forEach(element => {
    let title = element.title;
    let description = element.description;
    todoList += `<p id="${title}">
    <a href="/todolist/alltodo.html?title=${title}">
    ${title}
    </a>${description}
    <input type="button" onclick="editItem('${title}','${description}')"
        value="Edit">
    <input type="button" onclick="deleteItem('${title}')"
        value="Delete"></p>`;
  });
  document.getElementById('list').innerHTML = todoList;
}

let refresh = () => {
  window.location.reload();
};

let editItem = function(title,description){
  let listItem = document.getElementById(title);

  let editingHTML = `
  Title : <input type="text" value="${title}" id='${title}'>
  Description : <input type="text" value="${description}"  id='${title}-des'>
  <input type="button" onclick="saveEditedItem('${title}')"
        value="Save">
  `

  let div = document.createElement('div');
  div.innerHTML = editingHTML;
  listItem.replaceWith(div);
}

let saveEditedItem = function(oldTitle){
  let title = document.getElementById(oldTitle).value;
  let description = document.getElementById(oldTitle+'-des').value;
  let req = new XMLHttpRequest();
  req.open('put', `/todolist`);
  req.addEventListener('load', refresh);
  req.send(`title=${oldTitle}&newTitle=${title}&description=${description}`);
}

let deleteItem = function (title) {
  let req = new XMLHttpRequest();
  req.open('delete', `/todolist`);
  req.addEventListener('load', refresh);
  req.send(`title=${title}`);
}

let renderList = function () {
  let response = this.responseText;
  let todoList = JSON.parse(response);
  fillData(todoList);
}

let loadTodoList = function () {
  let req = new XMLHttpRequest();
  req.open('get', '/todolist');
  req.addEventListener('load', renderList);
  req.send();
}

window.onload = loadTodoList;