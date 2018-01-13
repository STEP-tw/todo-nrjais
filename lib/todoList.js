const TODOItem = require('./todoItem');

class TODOList {
  constructor(title, description, listId, id = 0) {
    this._title = title;
    this._description = description;
    this._todoItems = {};
    this._listId = listId;
    this._id = id;
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

  get id() {
    return this._listId;
  }

  changeTitleAndDes(newTitle, newDescription) {
    this.title = newTitle;
    this.description = newDescription;
  }

  addItem(text) {
    let id = this._id++;
    let todoItem = new TODOItem(text, id);
    this._todoItems[id] = todoItem;
    return todoItem;
  }

  addJSONItemList() {
    let items = Object.keys(this._todoItems);
    let todoItemsWithProto = items.reduce((todoItems,itemId) => {
      let todoItem = this._todoItems[itemId];
      todoItem.__proto__ = new TODOItem().__proto__;
      todoItems[itemId] = todoItem;
      return todoItems;
    },{});
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
    let todoItems = Object.values(this._todoItems)

    return todoItems.map(todoItem => ({
      text: todoItem.text,
      done: todoItem.isDone(),
      id: todoItem.id
    }));
  }

  removeItem(id) {
    return delete this._todoItems[id];
  }
}

module.exports = TODOList;