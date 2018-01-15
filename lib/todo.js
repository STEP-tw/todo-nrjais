const TodoList = require('./todoList');

class Todo {
  constructor(username) {
    this._username = username;
    this._todoLists = [];
  }

  getTodoList(index) {
    return this._todoLists[index];
  }

  createTodoList(title, description) {
    let todoList = new TodoList(title, description)
    this._todoLists.push(todoList);
    return todoList;
  }

  updateTodoList(id, title, description) {
    let todoList = this._todoLists[id];
    return todoList.changeTitleAndDes(title, description);
  }

  getAllTodoLists() {
    return this._todoLists.map((list, index)=> ({
      id: index,
      title: list.title,
      description: list.description
    }));
  }

  markItemDone(listId, itemId){
    return this._todoLists[listId].markItemDone(itemId);
  }

  markItemUndone(listId, itemId){
    return this._todoLists[listId].markItemUndone(itemId);
  }

  deleteTodoList(index) {
    return delete this._todoLists.splice(index,1);
  }

  getAllTodoItems(listId) {
    if (this._todoLists[listId])
      return this._todoLists[listId].getAllTodoItems();
  }

  addTodoItem(listId, text) {
    return this._todoLists[listId].addItem(text);
  }

  addJSONItemList(listId, list){
    this._todoLists[listId].addJSONItemList(list);
  }

  deleteTodoItem(listId, itemId) {
    return this._todoLists[listId].removeItem(itemId);
  }

  addJSONTodoLists(){
    let todoLists = this._todoLists.reduce((todoLists,todoList)=>{
      todoList.__proto__ = new TodoList().__proto__;
      todoList.addJSONItemList();
      todoLists.push(todoList);
      return todoLists;
    },[]);
    this._todoLists = todoLists;
  }
}

module.exports = Todo;