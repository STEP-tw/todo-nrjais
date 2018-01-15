class TODOItem{
  constructor(text){
    this._text = text;
    this._done = false;
  }

  isDone(){
    return this._done;
  }

  get text(){
    return this._text;
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