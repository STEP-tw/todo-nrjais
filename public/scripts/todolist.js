let fillData = function(data){
  let todoList = "";
  data.forEach(element => {
    let title = element.title;
    todoList += `<p>
    <a href="/todolist/alltodo.html?title=${title}">
    ${title}
    </a>     ${element.description}
    <input type="button" onclick="deleteItem('${title}')"
        value="delete"></p>`;
  });
  document.getElementById('list').innerHTML = todoList;
}

let refresh = () => {
  window.location.reload();
};

let deleteItem = function (title) {
  let req = new XMLHttpRequest();
  req.open('delete', `/todolist`);
  req.addEventListener('load', refresh);
  req.send(`title=${title}`);
}

let renderList = function(){
  let response = this.responseText;
  let todoList = JSON.parse(response);
  fillData(todoList);
}

let loadTodoList = function(){
  let req = new XMLHttpRequest();
  req.open('get','/todolist');
  req.addEventListener('load',renderList);
  req.send();
}

window.onload = loadTodoList;