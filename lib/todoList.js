const TODOItem = require('./todoItem');

class TODOList {
  constructor(title, description, id=0) {
    this._title = title;
    this._description = description;
    this._todoItems = [];
    this._id = id;
  }

  set title(newTitle){
    this._title = newTitle;
  }

  set description(newDescription){
    this._description = newDescription;
  }

  get title(){
    return this._title;
  }

  get description(){
    return this._description;
  }
  
  addItem(text) {
    let id = this._id++;
    let todo = new TODOItem(text, id);
    this._todoItems.push(todo);
    return todo;
  }

  addJSONItemList(list) {
    list.forEach(item => {
      let todo = new TODOItem(item._text, item._id, item._done);
      this._todoItems.push(todo);
    });
  }

  markItemDone(id) {
    let todo = this._todoItems.find(todoItem => {
      return todoItem.id == +id;
    });
    if (todo) {
      return todo.markDone();
    }
    return false;
  }

  markItemUndone(id) {
    let todo = this._todoItems.find(todoItem => {
      return todoItem.id == +id;
    });
    if (todo) {
      return todo.markUndone();
    }
    return false;
  }

  getAllTODOItems() {
    return this._todoItems;
  }

  removeItem(id) {
    let todoIndex = this._todoItems.findIndex(todoItem => {
      return todoItem.id == +id;
    });
    if (todoIndex >= 0) {
      this._todoItems.splice(todoIndex, 1);
      return true;
    }
    return false;
  }
}

module.exports = TODOList;