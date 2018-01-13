const TodoList = require('./todoList');

class Todo {
  constructor(username, id = 0) {
    this._username = username;
    this._todoLists = {};
    this._id = id;
  }

  getTodoList(id) {
    return this._todoLists;
  }

  createTodoList(title, description) {
    let id = this._id++;
    let todoList = new TodoList(title, description, id)
    this._todoLists[id] = todoList;
    return todoList;
  }

  updateTodoList(id, title, description) {
    let todoList = this._todoLists[id];
    return todoList.changeTitleAndDes(title, description);
  }

  getAllTodoLists() {
    return Object.values(this._todoLists).map(list => ({
      id: list.id,
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

  deleteTodoList(id) {
    return delete this._todoLists[id];
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
    let lists = Object.keys(this._todoLists);
    let todoLists = lists.reduce((todoLists,listId)=>{
      let todoList = this._todoLists[listId];
      todoList.__proto__ = new TodoList().__proto__;
      todoList.addJSONItemList();
      todoLists[listId] = todoList;
      return todoLists;
    },{});
    this._todoLists = todoLists;
  }
}

module.exports = Todo;