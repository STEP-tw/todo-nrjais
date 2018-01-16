class TODOItem{
  constructor(text, id, done = false){
    this._text = text;
    this._id = id;
    this._done = done;
  }

  isDone(){
    return this._done;
  }

  get text(){
    return this._text;
  }
  get id() {
    return this._id;
  }
  
  set text(newText){
    this._text = newText;
  }

  markDone(){
    this._done = true;
    return true;
  }

  markUndone(){
    this._done = false;
    return true;
  }
}

module.exports = TODOItem;