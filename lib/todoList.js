const TODOItem = require('./todoItem');

class TODOList {
  constructor(title, description) {
    this._title = title;
    this._description = description;
    this._todoItems = [];
  }

  set title(newTitle) {
    this._title = newTitle;
  }

  set description(newDescription) {
    this._description = newDescription;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  changeTitleAndDes(newTitle, newDescription) {
    this.title = newTitle;
    this.description = newDescription;
  }

  addItem(text) {
    let todoItem = new TODOItem(text);
    this._todoItems.push(todoItem);
    return todoItem;
  }

  addJSONItemList() {
    let todoItemsWithProto = this._todoItems.map(todoItem => {
      todoItem.__proto__ = new TODOItem().__proto__;
      return todoItem;
    });
    this._todoItems = todoItemsWithProto;
  }

  markItemDone(id) {
    let todoItem = this._todoItems[id];
    if (todoItem) {
      return todoItem.markDone();
    }
    return false;
  }

  markItemUndone(id) {
    let todoItem = this._todoItems[id];
    if (todoItem) {
      return todoItem.markUndone();
    }
    return false;
  }

  getAllTodoItems() {
    return this._todoItems.map((todoItem, index)=> ({
      text: todoItem.text,
      done: todoItem.isDone(),
      id: index
    }));
  }

  removeItem(index) {
    return this._todoItems.splice(index,1);
  }
}

module.exports = TODOList;