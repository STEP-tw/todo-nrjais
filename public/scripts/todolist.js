let fillData = function(data){
  let todoList = "";
  data.forEach(element => {
    todoList += `<p><a href="/todolist/item.html?title=${element.title}">${element.title}</a>   ${element.description}</p>`;
  });

  document.body.innerHTML = todoList + document.body.innerHTML;
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