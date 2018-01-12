let chai = require('chai');
let assert = chai.assert;
let TodoList = require('../lib/todoList');

let todoList = '';
describe('TODOList', () => {
  beforeEach(() => {
    todoList = new TodoList('title', 'a test');
  });

  it('should have return title and description by getters', () => {
    assert.equal(todoList.title, 'title');
    assert.equal(todoList.description, 'a test');
  });

  it('should have update title and description by getters', () => {
    todoList.title = 'new';
    todoList.description = 'new d';
    assert.equal(todoList.title, 'new');
    assert.equal(todoList.description, 'new d');
  });

  it('should add a new item to list', () => {
    let todo = todoList.addItem('test item');
    assert.equal(todo.text, 'test item');
  });

  it('should mark a item done', () => {
    let todo = todoList.addItem('test item');
    let result = todoList.markItemDone(todo.id);
    assert.isOk(result);
  });

  it('should not mark a item done if it is not present', () => {
    let result = todoList.markItemDone(5);
    assert.isNotOk(result);
  });
});
